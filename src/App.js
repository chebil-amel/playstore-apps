import React, { useState, useEffect } from 'react';
import MostRatedAppsChart from './components/MostRatedAppsChart';
import InstallsChart from './components/InstallsChart';
import RatingContentChart from './components/RatingContentChart';
import SizeInstallsChart from './components/SizeInstallsChart';
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
  const [isMostRatedVisible, setIsMostRatedVisible] = useState(true);
  const [isInstallsVisible, setIsInstallsVisible] = useState(true);
  const [isRatingContentVisible, setIsRatingContentVisible] = useState(true);
  const [isSizeInstallsVisible, setIsSizeInstallsVisible] = useState(true);
  const [isUpdateCategoryVisible, setIsUpdateCategoryVisible] = useState(true);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Google PlayStore Data Visualization</h1>

      {/* Most Rated Apps Chart */}
      <div className="mb-4 flex items-center justify-center cursor-pointer" onClick={toggleMostRatedVisibility}>
        <FontAwesomeIcon icon={isMostRatedVisible ? faChevronUp : faChevronDown} className="mr-2" />
        <span>{isMostRatedVisible ? 'Most Rated Apps' : 'Show Most Rated Apps'}</span>
      </div>
      {isMostRatedVisible && (
        <div className="w-full lg:w-1/2 p-4 mx-auto">
          <MostRatedAppsChart chartData={chartData} />
        </div>
      )}

      {/* Installs Chart */}
      <div className="mb-4 flex items-center justify-center cursor-pointer" onClick={toggleInstallsVisibility}>
        <FontAwesomeIcon icon={isInstallsVisible ? faChevronUp : faChevronDown} className="mr-2" />
        <span>{isInstallsVisible ? 'Installs Chart' : 'Show Installs Chart'}</span>
      </div>
      {isInstallsVisible && (
        <div className="w-full lg:w-1/2 p-4 mx-auto">
          <InstallsChart />
        </div>
      )}

      {/* Rating and Content Rating Chart */}
      <div className="mb-4 flex items-center justify-center cursor-pointer" onClick={toggleRatingContentVisibility}>
        <FontAwesomeIcon icon={isRatingContentVisible ? faChevronUp : faChevronDown} className="mr-2" />
        <span>{isRatingContentVisible ? 'Rating and Content Rating Chart' : 'Show Rating and Content Rating Chart'}</span>
      </div>
      {isRatingContentVisible && (
        <div className="w-full lg:w-1/2 p-4 mx-auto">
          <RatingContentChart />
        </div>
      )}

      {/* Size and Installs Chart */}
      <div className="mb-4 flex items-center justify-center cursor-pointer" onClick={toggleSizeInstallsVisibility}>
        <FontAwesomeIcon icon={isSizeInstallsVisible ? faChevronUp : faChevronDown} className="mr-2" />
        <span>{isSizeInstallsVisible ? 'Size and Installs Chart' : 'Show Size and Installs Chart'}</span>
      </div>
      {isSizeInstallsVisible && (
        <div className="w-full lg:w-1/2 p-4 mx-auto">
          <SizeInstallsChart />
        </div>
      )}

      {/* Update and Category Chart */}
      <div className="mb-4 flex items-center justify-center cursor-pointer" onClick={toggleUpdateCategoryVisibility}>
        <FontAwesomeIcon icon={isUpdateCategoryVisible ? faChevronUp : faChevronDown} className="mr-2" />
        <span>{isUpdateCategoryVisible ? 'Update and Category Chart' : 'Show Update and Category Chart'}</span>
      </div>
      {isUpdateCategoryVisible && (
        <div className="w-full lg:w-1/2 p-4 mx-auto">
       
        </div>
      )}
    </div>
  );
};

export default App;