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
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
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
        <div>
            <h2>Number of Installs by Category</h2>
            <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
    );
};

export default InstallsChart;