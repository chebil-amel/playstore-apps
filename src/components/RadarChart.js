import React from "react";
import { Radar } from "react-chartjs-2";

const RadarChart = ({ data }) => (
  <div className="chart-container">
    <Radar data={data} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { enabled: true } } }} />
  </div>
);

export default RadarChart;