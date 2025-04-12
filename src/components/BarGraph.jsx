import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarGraph = ({ pets }) => {
  if (!pets || pets.length === 0) return <p className="text-white text-center">Loading chart...</p>;

  // Count how many pets are in each age group
  const ageCounts = pets.reduce((acc, pet) => {
    const age = pet.age || "Unknown";
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(ageCounts),
    datasets: [
      {
        label: "Number of Pets",
        data: Object.values(ageCounts),
        backgroundColor: "#fcd34d", // Tailwind Amber-300
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarGraph;
