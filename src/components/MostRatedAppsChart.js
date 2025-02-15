import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import appData from '../data.json';

// Function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const MostRatedAppsChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const data = appData;

        if (data && Array.isArray(data)) {
            data.forEach(d => {
                d.Reviews = +d.Reviews;
            });

            const filteredData = data.filter(d => !isNaN(d.Reviews));
            const uniqueData = Array.from(new Set(filteredData.map(a => a.App)))
                                    .map(app => {
                                        return filteredData.find(a => a.App === app)
                                    });
            const sortedData = uniqueData.sort((a, b) => b.Reviews - a.Reviews).slice(0, 10);

            const labels = sortedData.map(d => d.App);
            const reviews = sortedData.map(d => d.Reviews);
            const colors = sortedData.map(() => getRandomColor());

            setChartData({
                labels: labels,
                datasets: [{
                    label: 'Number of Reviews',
                    data: reviews,
                    backgroundColor: colors,
                }]
            });
        }
    }, []);

    if (!chartData) {
        return <p>Loading chart data...</p>;
    }

    return (
        <div className="chart-container" style={{ position: 'relative', height: '40vh', width: '80vw' }}>
            <Bar
                data={chartData}
                options={{
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Top 10 Most Rated Apps by Type'
                        }
                    }
                }}
            />
        </div>
    );
};

export default MostRatedAppsChart;