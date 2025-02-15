import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import data from '../data.json';

const RatingContentChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Aggregate ratings and content ratings
        const ratings = data.reduce((acc, app) => {
            const rating = parseFloat(app.Rating);
            if (!isNaN(rating)) {
                acc.push(rating);
            }
            return acc;
        }, []);
        
        const contentRatings = data.reduce((acc, app) => {
            const contentRating = app.ContentRating;
            if (contentRating) {
                if (!acc[contentRating]) {
                    acc[contentRating] = 0;
                }
                acc[contentRating] += 1;
            }
            return acc;
        }, {});

        // Prepare data for the chart
        const ratingLabels = ['1', '2', '3', '4', '5'];
        const ratingData = ratingLabels.map(label => ratings.filter(r => Math.floor(r) === parseInt(label)).length);

        const contentRatingLabels = Object.keys(contentRatings);
        const contentRatingData = Object.values(contentRatings);

        // Destroy previous chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Function to generate a user-friendly color palette
        const colorPalette = [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#E7E9ED'
        ];

        // Create the stacked bar chart
        chartInstanceRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ratingLabels.concat(contentRatingLabels),
                datasets: [
                    {
                        label: 'App Ratings',
                        data: ratingData,
                        backgroundColor: colorPalette.slice(0, ratingLabels.length),
                    },
                    {
                        label: 'Content Ratings',
                        data: contentRatingData,
                        backgroundColor: colorPalette.slice(ratingLabels.length),
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'App Ratings and Content Ratings Distribution'
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
        <div className="chart-container" style={{ position: 'relative', height: '50vh', width: '80vw', margin: '0 auto' }}>
            <h2>App Ratings and Content Ratings Distribution</h2>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default RatingContentChart;