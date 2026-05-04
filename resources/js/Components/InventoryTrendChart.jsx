import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export default function InventoryTrendChart({ trendData }) {
    const data = {
        labels: trendData.labels,
        datasets: [
            {
                label: "Stock Quantity",
                data: trendData.data,
                backgroundColor: "rgba(16, 185, 129, 0.6)", // Emerald Green
                borderColor: "#10b981",
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
            x: { grid: { display: false } },
        },
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-sm font-bold text-gray-900 mb-6">
                Stock Level per Category
            </h3>
            <div className="h-[250px]">
                <Bar options={options} data={data} />
            </div>
        </div>
    );
}
