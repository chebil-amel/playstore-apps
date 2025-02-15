import React, { useState, useEffect } from 'react';
import MostRatedAppsChart from './components/MostRatedAppsChart';
import appData from './data.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Helper function to convert size string to number (in MB)
const parseSize = (size) => {
  if (!size) return 0;
  const sizeInMB = parseFloat(size.replace(/[^0-9.]/g, ''));
  return sizeInMB;
};

// Define a color palette
const colorPalette = [
  'rgba(75,192,192,0.6)',
  'rgba(153,102,255,0.6)',
  'rgba(255,159,64,0.6)',
  'rgba(255,99,132,0.6)',
  'rgba(54,162,235,0.6)',
  'rgba(255,206,86,0.6)',
];

const App = () => {
  const [chartData, setChartData] = useState(null);
  const [isChartVisible, setIsChartVisible] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    size: 'All',
    genre: 'All',
    contentRating: 'All',
  });

  useEffect(() => {
    if (!appData || !Array.isArray(appData)) {
      console.error('appData is undefined or not an array');
      return;
    }

    let filteredData = appData;

    // Apply filters
    if (filters.category !== 'All') {
      filteredData = filteredData.filter(app => app.Category === filters.category);
    }
    if (filters.genre !== 'All') {
      filteredData = filteredData.filter(app => app.Genres && app.Genres.includes(filters.genre));
    }
    if (filters.size !== 'All') {
      filteredData = filteredData.filter(app => {
        const appSize = parseSize(app.Size);
        if (filters.size === 'Small') return appSize <= 20;
        if (filters.size === 'Medium') return appSize > 20 && appSize <= 50;
        if (filters.size === 'Large') return appSize > 50;
        return true;
      });
    }
    if (filters.contentRating !== 'All') {
      filteredData = filteredData.filter(app => app.ContentRating === filters.contentRating);
    }

    const labels = filteredData.slice(0, 10).map(app => app.App || 'Unknown');
    const reviews = filteredData.slice(0, 10).map(app => parseInt(app.Reviews) || 0);
    const ratings = filteredData.slice(0, 10).map(app => parseFloat(app.Rating) || 0);
    const installs = filteredData.slice(0, 10).map(app => parseInt(app.Installs.replace(/[^0-9]/g, '')) || 0);

    setChartData({
      labels,
      datasets: [
        { label: 'Number of Reviews', data: reviews, backgroundColor: colorPalette },
        { label: 'Ratings', data: ratings, backgroundColor: colorPalette },
        { label: 'Installs', data: installs, backgroundColor: colorPalette },
      ],
    });
  }, [filters]);

  const toggleChartVisibility = () => {
    setIsChartVisible(!isChartVisible);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Google PlayStore Data Visualization</h1>
      <button onClick={toggleChartVisibility} className="mb-4 flex items-center">
        <FontAwesomeIcon icon={isChartVisible ? faChevronUp : faChevronDown} className="mr-2" />
        {isChartVisible ? '  Most Rated App' : ''}
      </button>
      {isChartVisible && (
        <div className="w-full lg:w-1/2 p-4">
          <MostRatedAppsChart chartData={chartData} />
        </div>
      )}
    </div>
  );
};

export default App