<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserNotification extends Notification
{
    use Queueable;

    // 1. I-declare ang variable dito
    public $password;

    /**
     * 2. Tanggapin ang password sa constructor
     */
    public function __construct($password)
    {
        $this->password = $password;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * 3. Gamitin ang $this->password sa email
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Welcome to InvTrack - Account Created')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Gawan ka na namin ng account sa InvTrack Inventory System.')
            ->line('Narito ang iyong login credentials:')
            ->line('**Email:** ' . $notifiable->email)
            ->line('**Temporary Password:** ' . $this->password)
            ->action('Login Now', url('/login'))
            ->line('Mangyaring palitan agad ang iyong password pagkatapos mag-login.');
    }
}
