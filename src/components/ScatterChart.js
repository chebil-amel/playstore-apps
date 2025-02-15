import React from "react";
import { Scatter } from "react-chartjs-2";

const ScatterChart = ({ data }) => (
  <div className="chart-container">
    <Scatter data={data} options={{ responsive: true, plugins: { legend: { display: true }, tooltip: { enabled: true } } }} />
  </div>
);

export default ScatterChart;