import React from "react";
import { PolarArea } from "react-chartjs-2";

const PolarAreaChart = ({ data }) => (
  <div className="chart-container">
    <PolarArea data={data} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { enabled: true } } }} />
  </div>
);

export default PolarAreaChart;