import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import data from '../data.json';

const InstallsChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Function to parse install counts
        const parseInstalls = (installs) => {
            if (installs.endsWith('+')) {
                installs = installs.slice(0, -1);
            }
            if (installs.includes(',')) {
                installs = installs.replace(/,/g, '');
            }
            return parseInt(installs, 10);
        };

        // Function to generate a random color
        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        // Aggregate installs by category
        const installsByCategory = data.reduce((acc, app) => {
            const category = app.Category;
            const installs = parseInstalls(app.Installs);
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += installs;
            return acc;
        }, {});

        // Prepare data for the chart
        const categories = Object.keys(installsByCategory);
        const installs = Object.values(installsByCategory);

        // Destroy previous chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Create the bar chart
        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Number of Installs',
                    data: installs,
                    backgroundColor: categories.map(() => getRandomColor()),
                    borderColor: categories.map(() => getRandomColor()),
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'logarithmic',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Installs'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                if (value === 1000 || value === 10000 || value === 100000 || value === 1000000 || value === 10000000 || value === 100000000) {
                                    return value.toLocaleString(); // Show only specific ticks
                                }
                                return null;
                            }
                        }
                    }
                }
            }
        });

        // Cleanup function to destroy the chart instance on component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="chart-container" style={{ position: 'relative', height: '40vh', width: '80vw' }}>
            <h2>Number of Installs by Category</h2>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default InstallsChart;