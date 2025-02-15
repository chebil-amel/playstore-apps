import React, { useState, useEffect } from "react";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/DoughnutChart";
import RadarChart from "./components/RadarChart";
import ScatterChart from "./components/ScatterChart";
import PolarAreaChart from "./components/PolarAreaChart";
import appData from "./data.json";
import Test from "./test.js";

// Helper function to convert size string to number (in MB)
const parseSize = (size) => {
  if (!size) return 0;
  const sizeInMB = parseFloat(size.replace(/[^0-9.]/g, ""));
  return sizeInMB;
};

// Define a color palette
const colorPalette = [
  "rgba(75,192,192,0.6)",
  "rgba(153,102,255,0.6)",
  "rgba(255,159,64,0.6)",
  "rgba(255,99,132,0.6)",
  "rgba(54,162,235,0.6)",
  "rgba(255,206,86,0.6)",
  "rgba(75,192,192,0.6)",
  "rgba(153,102,255,0.6)",
  "rgba(255,159,64,0.6)",
  "rgba(255,99,132,0.6)"
];

const App = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedContentRating, setSelectedContentRating] = useState("All");

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
        { label: "Number of Reviews", data: reviews, backgroundColor: colorPalette },
        { label: "Ratings", data: ratings, backgroundColor: colorPalette },
        { label: "Installs", data: installs, backgroundColor: colorPalette }
      ]
    });
  }, [selectedCategory, selectedSize, selectedGenre, selectedContentRating]);

  return (
    <div className="p-6">
        <Test />
      <h1 className="text-2xl font-bold mb-4">App Data Visualization</h1>

      <div className="mb-4">
        <label className="text-lg font-semibold">Filter by Genre: </label>
        <select className="ml-2 p-2 border rounded" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="All">All Genres</option>
          {[...new Set(appData.map((app) => app.Genres ? app.Genres.split(";") : []).flat())].map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-lg font-semibold">Filter by Content Rating: </label>
        <select className="ml-2 p-2 border rounded" value={selectedContentRating} onChange={(e) => setSelectedContentRating(e.target.value)}>
          <option value="All">All Ratings</option>
          {[...new Set(appData.map((app) => app.ContentRating))].map((rating, index) => (
            <option key={index} value={rating}>{rating}</option>
          ))}
        </select>
      </div>

      {chartData ? (
        <div className="w-full lg:w-3/4 mx-auto">
          <h2 className="text-lg font-semibold">Reviews, Ratings, and Installs per App</h2>
          <div className="flex flex-wrap justify-around">
            <div className="w-full lg:w-1/2 p-4">
              <BarChart data={chartData} />
            </div>
            <div className="w-full lg:w-1/2 p-4">
              <PieChart data={chartData} />
            </div>
            <div className="w-full lg:w-1/2 p-4">
              <LineChart data={chartData} />
            </div>
            <div className="w-full lg:w-1/2 p-4">
              <DoughnutChart data={chartData} />
            </div>
            <div className="w-full lg:w-1/2 p-4">
              <RadarChart data={chartData} />
            </div>
            <div className="w-full lg:w-1/2 p-4">
              <ScatterChart data={chartData} />
            </div>
            <div className="w-full lg:w-1/2 p-4">
              <PolarAreaChart data={chartData} />
            </div>
          </div>
        </div>
      ) : (
        <p>Loading charts...</p>
      )}
    </div>
  );
};

export default App;