<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage; // Eto yung sabi mong existing
use Inertia\Inertia;
use Carbon\Carbon;

class BackupController extends Controller
{
    public function index()
    {
        $folder = config('app.name');
        $disk = 'local';

        $files = Storage::disk($disk)->allFiles($folder);

        $backups = collect($files)->map(function ($file) use ($disk) {
            return [
                'file_name' => basename($file),
                'file_size' => round(Storage::disk($disk)->size($file) / 1024 / 1024, 2) . ' MB',
                'last_modified' => Carbon::createFromTimestamp(Storage::disk($disk)->lastModified($file))->diffForHumans(),
                'download_url' => route('backups.download', ['name' => basename($file)]),
            ];
        })
            ->reverse()
            ->values() // <--- ETO ANG PINAKAMAHALAGA: I-re-reset nito ang keys sa 0, 1, 2...
            ->all();   // <--- I-convert sa plain PHP array

        return Inertia::render('Admin/Index', [
            'backups' => $backups
        ]);
    }

    public function create()
    {
        try {
            $artisanPath = base_path('artisan');
            $phpPath = 'C:\xampp\php\php.exe'; // Siguraduhin ang path na ito sa XAMPP mo

            // Brute force command para sa Windows
            $command = "{$phpPath} {$artisanPath} backup:run --only-db 2>&1";

            $output = [];
            $resultCode = null;
            exec($command, $output, $resultCode);

            if ($resultCode === 0) {
                return back()->with('success', 'Backup successfully generated!');
            }

            return back()->with('error', 'Backup failed: ' . implode(', ', $output));
        } catch (\Exception $e) {
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    public function download(string $name)
    {
        $disk = 'local';
        $folder = "InvTrack";

        // Ito ang saktong path na binabasa ng disk mo
        $path = $folder . '/' . $name;

        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->download($path);
        }

        return back()->with('error', 'File not found sa path: ' . $path);
    }
}
