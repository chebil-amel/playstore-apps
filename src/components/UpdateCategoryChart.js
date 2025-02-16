import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import data from '../data.json';

const UpdateCategoryChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Aggregate updates by category using "Last Updated" field
        const updatesByCategory = data.reduce((acc, app) => {
            const category = app.Category;
            const lastUpdated = new Date(app["Last Updated"]);
            if (!acc[category]) {
                acc[category] = { count: 0, lastUpdated: lastUpdated };
            } else {
                acc[category].count += 1;
                if (lastUpdated > acc[category].lastUpdated) {
                    acc[category].lastUpdated = lastUpdated;
                }
            }
            return acc;
        }, {});

        // Prepare data for the chart
        const categories = Object.keys(updatesByCategory);
        const updates = categories.map(category => updatesByCategory[category].count);

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
                    label: 'Number of Updates',
                    data: updates,
                    backgroundColor: categories.map(() => '#'+Math.floor(Math.random()*16777215).toString(16)),
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Updates'
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
            <h2>Number of Updates by Category</h2>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default UpdateCategoryChart;