import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultStats = ({ data, myScore }) => {
  let { min, max, mean, median, lowerQuartile, upperQuartile } = data;

  min = min ? min : 'N/A';
  max = max ? max : 'N/A';
  mean = mean ? mean : 'N/A';
  median = median ? median : 'N/A';
  lowerQuartile = lowerQuartile ? lowerQuartile : 'N/A';
  upperQuartile = upperQuartile ? upperQuartile : 'N/A';
  myScore = myScore ? myScore : 'N/A';

  const chartData = {
    labels: ['Minimum', 'Maximum', 'Mean', 'Median', 'Q1', 'Q3', 'Your Score'],
    datasets: [
      {
        label: 'Statistics',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
        data: [min, max, mean, median, lowerQuartile, upperQuartile, myScore],
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-[#eff3f8] border border-gray-300 rounded-lg p-5 m-5 shadow-lg font-sans">
      <h2 className="text-2xl font-serif mb-5 text-blue-900 border-b-2 border-blue-900 pb-2">
        Result Statistics
      </h2>
      <div className="flex justify-between items-start flex-wrap">
        <Bar data={chartData} options={chartOptions} className="max-w-[60%] max-h-[400px]" />
        <div className="flex flex-col gap-2 max-w-[40%]">
          <StatCard label="Minimum Score " value={min} />
          <StatCard label="Maximum Score " value={max} />
          <StatCard label="Mean Score " value={mean} />
          <StatCard label="Median Score " value={median} />
          <StatCard label="Lower Quartile (Q1) " value={lowerQuartile} />
          <StatCard label="Upper Quartile (Q3) " value={upperQuartile} />
          <StatCard label="Your Score" value={myScore} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-gray-300 rounded-md p-3 flex justify-between items-center shadow-md">
    <span className="font-bold text-blue-900">{label}</span>
    <span className="text-lg text-gray-800">{value}</span>
  </div>
);

export default ResultStats;