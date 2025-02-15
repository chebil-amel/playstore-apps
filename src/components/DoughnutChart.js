import React from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ data }) => (
  <div className="chart-container">
    <Doughnut data={data} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { enabled: true } } }} />
  </div>
);

export default DoughnutChart;