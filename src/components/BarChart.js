import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data }) => (
  <div className="chart-container">
    <Bar data={data} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { enabled: true } } }} />
  </div>
);

export default BarChart;