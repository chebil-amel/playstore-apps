import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ data }) => (
  <div className="chart-container">
    <Pie data={data} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { enabled: true } } }} />
  </div>
);

export default PieChart;