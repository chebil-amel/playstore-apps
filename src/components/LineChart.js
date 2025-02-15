import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ data }) => (
  <div className="chart-container">
    <Line data={data} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { enabled: true } } }} />
  </div>
);

export default LineChart;