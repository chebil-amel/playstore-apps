import React, { useState, useEffect } from 'react';
import MostRatedAppsChart from './components/MostRatedAppsChart';
import InstallsChart from './components/InstallsChart';
import RatingContentChart from './components/RatingContentChart';
import SizeInstallsChart from './components/SizeInstallsChart';
import UpdateCategoryChart from './components/UpdateCategoryChart';
import appData from './data.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './App.css'; // Import CSS file for styling

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
  const [isMostRatedVisible, setIsMostRatedVisible] = useState(false);
  const [isInstallsVisible, setIsInstallsVisible] = useState(false);
  const [isRatingContentVisible, setIsRatingContentVisible] = useState(false);
  const [isSizeInstallsVisible, setIsSizeInstallsVisible] = useState(false);
  const [isUpdateCategoryVisible, setIsUpdateCategoryVisible] = useState(false);
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

  const toggleMostRatedVisibility = () => {
    setIsMostRatedVisible(!isMostRatedVisible);
  };

  const toggleInstallsVisibility = () => {
    setIsInstallsVisible(!isInstallsVisible);
  };

  const toggleRatingContentVisibility = () => {
    setIsRatingContentVisible(!isRatingContentVisible);
  };

  const toggleSizeInstallsVisibility = () => {
    setIsSizeInstallsVisible(!isSizeInstallsVisible);
  };

  const toggleUpdateCategoryVisibility = () => {
    setIsUpdateCategoryVisible(!isUpdateCategoryVisible);
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Google PlayStore Data Visualization</h1>

      <div className="charts-container">
        <div className="chart-section">
          <div className="chart-header" onClick={toggleMostRatedVisibility}>
            <FontAwesomeIcon icon={isMostRatedVisible ? faChevronUp : faChevronDown} className="toggle-icon" />
            <span>{isMostRatedVisible ? 'Most Rated Apps' : 'Show Most Rated Apps'}</span>
          </div>
          {isMostRatedVisible && (
            <div className="chart">
              <MostRatedAppsChart chartData={chartData} />
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="chart-header" onClick={toggleInstallsVisibility}>
            <FontAwesomeIcon icon={isInstallsVisible ? faChevronUp : faChevronDown} className="toggle-icon" />
            <span>{isInstallsVisible ? 'Installs Chart' : 'Show Installs Chart'}</span>
          </div>
          {isInstallsVisible && (
            <div className="chart">
              <InstallsChart />
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="chart-header" onClick={toggleRatingContentVisibility}>
            <FontAwesomeIcon icon={isRatingContentVisible ? faChevronUp : faChevronDown} className="toggle-icon" />
            <span>{isRatingContentVisible ? 'Rating and Content Rating Chart' : 'Show Rating and Content Rating Chart'}</span>
          </div>
          {isRatingContentVisible && (
            <div className="chart">
              <RatingContentChart />
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="chart-header" onClick={toggleSizeInstallsVisibility}>
            <FontAwesomeIcon icon={isSizeInstallsVisible ? faChevronUp : faChevronDown} className="toggle-icon" />
            <span>{isSizeInstallsVisible ? 'Size and Installs Chart' : 'Show Size and Installs Chart'}</span>
          </div>
          {isSizeInstallsVisible && (
            <div className="chart">
              <SizeInstallsChart />
            </div>
          )}
        </div>

        <div className="chart-section">
          <div className="chart-header" onClick={toggleUpdateCategoryVisibility}>
            <FontAwesomeIcon icon={isUpdateCategoryVisible ? faChevronUp : faChevronDown} className="toggle-icon" />
            <span>{isUpdateCategoryVisible ? 'Update and Category Chart' : 'Show Update and Category Chart'}</span>
          </div>
          {isUpdateCategoryVisible && (
            <div className="chart">
            <UpdateCategoryChart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;