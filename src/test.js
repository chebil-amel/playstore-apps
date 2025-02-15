import React, { useState, useEffect } from "react";
import { Bar, Pie, Line, Doughnut, Radar, Scatter, PolarArea } from "react-chartjs-2";
import "chart.js/auto";
import appData from "./data.json";

const parseSize = (size) => {
  if (!size) return 0;
  const sizeInMB = parseFloat(size.replace(/[^0-9.]/g, ""));
  return sizeInMB;
};

const Test= () => {
  const [chartData, setChartData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedContentRating, setSelectedContentRating] = useState("All");
  const [chartType, setChartType] = useState("Bar");

  useEffect(() => {
    if (!appData || !Array.isArray(appData)) {
      console.error("appData is undefined or not an array");
      return;
    }

    let filteredData = selectedCategory === "All" ? appData : appData.filter((app) => app.Category === selectedCategory);

    if (selectedGenre !== "All") {
      filteredData = filteredData.filter((app) => app.Genres && app.Genres.includes(selectedGenre));
    }

    if (selectedSize !== "All") {
      filteredData = filteredData.filter((app) => {
        const appSize = parseSize(app.Size);
        if (selectedSize === "Small") return appSize <= 20;
        if (selectedSize === "Medium") return appSize > 20 && appSize <= 50;
        if (selectedSize === "Large") return appSize > 50;
        return true;
      });
    }

    if (selectedContentRating !== "All") {
      filteredData = filteredData.filter((app) => app.ContentRating === selectedContentRating);
    }

    const labels = filteredData.slice(0, 10).map((app) => app.App || "Unknown");
    const reviews = filteredData.slice(0, 10).map((app) => parseInt(app.Reviews) || 0);
    const ratings = filteredData.slice(0, 10).map((app) => parseFloat(app.Rating) || 0);
    const installs = filteredData.slice(0, 10).map((app) => parseInt(app.Installs.replace(/[^0-9]/g, "")) || 0);

    setChartData({
      labels,
      datasets: [
        { label: "Number of Reviews", data: reviews, backgroundColor: "rgba(75,192,192,0.6)" },
        { label: "Ratings", data: ratings, backgroundColor: "rgba(153,102,255,0.6)" },
        { label: "Installs", data: installs, backgroundColor: "rgba(255,159,64,0.6)" }
      ]
    });
  }, [selectedCategory, selectedSize, selectedGenre, selectedContentRating]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select Visualization type  </h1>
      <div className="mb-4">
        <label className="text-lg font-semibold">Select Chart Type: </label>
        <select className="ml-2 p-2 border rounded" value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="Bar">Bar</option>
          <option value="Pie">Pie</option>
          <option value="Line">Line</option>
          <option value="Doughnut">Doughnut</option>
          <option value="Radar">Radar</option>
          <option value="Scatter">Scatter</option>
          <option value="PolarArea">Polar Area</option>
        </select>
      </div>
      {chartData ? (
        <div className="w-full lg:w-3/4 mx-auto">
          <h2 className="text-lg font-semibold">Reviews, Ratings, and Installs per App</h2>
          {chartType === "Bar" && <Bar data={chartData} />} 
          {chartType === "Pie" && <Pie data={chartData} />} 
          {chartType === "Line" && <Line data={chartData} />} 
          {chartType === "Doughnut" && <Doughnut data={chartData} />} 
          {chartType === "Radar" && <Radar data={chartData} />} 
          {chartType === "Scatter" && <Scatter data={chartData} />} 
          {chartType === "PolarArea" && <PolarArea data={chartData} />} 
        </div>
      ) : (
        <p>Loading charts...</p>
      )}
    </div>
  );
};

export default Test;
