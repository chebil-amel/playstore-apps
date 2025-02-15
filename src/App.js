import React, { useState, useEffect } from "react";
import { Bar, Pie, Line, Doughnut, Radar, Scatter, PolarArea } from "react-chartjs-2";
import "chart.js/auto";
import appData from "./data.json";
import Test from "./test.js";
// Helper function to convert size string to number (in MB)
const parseSize = (size) => {
  if (!size) return 0;
  const sizeInMB = parseFloat(size.replace(/[^0-9.]/g, ""));
  return sizeInMB;
};

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
        { label: "Number of Reviews", data: reviews, backgroundColor: "rgba(75,192,192,0.6)" },
        { label: "Ratings", data: ratings, backgroundColor: "rgba(153,102,255,0.6)" },
        { label: "Installs", data: installs, backgroundColor: "rgba(255,159,64,0.6)" }
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
         
        
          <Bar data={chartData} />
          <Pie data={chartData} />
          <Line data={chartData} />
          <Doughnut data={chartData} />
          <Radar data={chartData} />
          <Scatter data={chartData} />
          <PolarArea data={chartData} />
          
        </div>
      ) : (
        <p>Loading charts...</p>
      )}
    </div>
  );
};

export default App;
