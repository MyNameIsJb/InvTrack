import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

// Register ChartJS modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export default function UserChart({ data }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // Itago ang legend para malinis
        },
        scales: {
            y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
            x: { grid: { display: false } },
        },
    };

    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "New Users",
                data: data,
                fill: true,
                borderColor: "#4f46e5", // Indigo color
                backgroundColor: "rgba(79, 70, 229, 0.1)", // Light blue tint sa ilalim ng line
                tension: 0.4, // Para maging "curvy" yung line
            },
        ],
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-sm font-bold text-gray-900 mb-6">
                User Growth Trend
            </h3>
            <div className="h-[250px]">
                <Line options={options} data={chartData} />
            </div>
        </div>
    );
}
