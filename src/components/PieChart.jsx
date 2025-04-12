import { Pie } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(ArcElement, Tooltip, Legend);

  const PieChart = ({ pets, options = {} }) => {
    if (!pets || pets.length === 0) return <p className="text-white text-center">Loading chart...</p>;
  
    const breedCounts = pets.reduce((acc, pet) => {
      const breed = pet.breeds?.primary || 'Unknown';
      acc[breed] = (acc[breed] || 0) + 1;
      return acc;
    }, {});
  
    const labels = Object.keys(breedCounts).slice(0, 6);
    const dataValues = labels.map((label) => breedCounts[label]);
  
    const data = {
      labels,
      datasets: [
        {
          label: 'Breed Distribution',
          data: dataValues,
          backgroundColor: [
            '#FFE29A', '#FFD580', '#FFC766', '#FFB84D',
            '#FFAA33', '#FF9C1A', '#FFCE85', '#FEE6B2'
          ],
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    };
  
    const defaultOptions = {
      plugins: {
        legend: {
          labels: {
            color: 'white', // Legend label color
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          bodyColor: 'white',
          titleColor: 'white',
          backgroundColor: '#1f2937',
        },
      },
    };
  
    return (
      <div className="w-full h-full p-4">
        <Pie data={data} options={{ ...defaultOptions, ...options }} />
      </div>
    );
  };
  


  export default PieChart;