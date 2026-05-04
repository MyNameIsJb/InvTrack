import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProductChart({ chartData }) {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                data: chartData.data,
                backgroundColor: [
                    "rgba(16, 185, 129, 0.8)", // Emerald (In Stock)
                    "rgba(245, 158, 11, 0.8)", // Amber (Low Stock)
                    "rgba(239, 68, 68, 0.8)", // Rose (Out of Stock)
                ],
                borderColor: ["#10b981", "#f59e0b", "#ef4444"],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
        },
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-sm font-bold text-gray-900 mb-6">
                Inventory Status
            </h3>
            <div className="h-[230px]">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
}
