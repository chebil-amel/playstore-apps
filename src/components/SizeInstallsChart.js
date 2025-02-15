import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import data from '../data.json';

const SizeInstallsChart = () => {
    const radarChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const radarChartInstanceRef = useRef(null);
    const lineChartInstanceRef = useRef(null);

    useEffect(() => {
        const radarCtx = radarChartRef.current.getContext('2d');
        const lineCtx = lineChartRef.current.getContext('2d');

        // Function to parse size and install counts
        const parseSize = (size) => {
            if (!size || size === 'Varies with device') return 0;
            const sizeInMB = parseFloat(size.replace(/[^0-9.]/g, ''));
            return size.includes('k') ? sizeInMB / 1024 : sizeInMB; // Convert KB to MB
        };

        const parseInstalls = (installs) => {
            if (installs.endsWith('+')) {
                installs = installs.slice(0, -1);
            }
            if (installs.includes(',')) {
                installs = installs.replace(/,/g, '');
            }
            return parseInt(installs, 10);
        };

        // Prepare data for the chart
        const apps = data.slice(0, 10); // Use top 10 apps for simplicity
        const labels = apps.map(app => app.App);
        const sizes = apps.map(app => parseSize(app.Size));
        const installs = apps.map(app => parseInstalls(app.Installs));

        // Destroy previous chart instances if they exist
        if (radarChartInstanceRef.current) {
            radarChartInstanceRef.current.destroy();
        }
        if (lineChartInstanceRef.current) {
            lineChartInstanceRef.current.destroy();
        }

        // Create the radar chart
        radarChartInstanceRef.current = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'App Size (MB)',
                        data: sizes,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        pointLabels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'App Size Distribution'
                    }
                }
            }
        });

        // Create the line chart
        lineChartInstanceRef.current = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Number of Installs',
                        data: installs,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: true,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Installs'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Number of Installs Over Apps'
                    }
                }
            }
        });

        // Cleanup function to destroy the chart instances on component unmount
        return () => {
            if (radarChartInstanceRef.current) {
                radarChartInstanceRef.current.destroy();
            }
            if (lineChartInstanceRef.current) {
                lineChartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', margin: '0 auto' }}>
            <h2>App Size and Number of Installs</h2>
            <div style={{ position: 'relative', height: '50vh', width: '80vw' }}>
                <canvas ref={radarChartRef}></canvas>
            </div>
            <div style={{ position: 'relative', height: '50vh', width: '80vw' }}>
                <canvas ref={lineChartRef}></canvas>
            </div>
        </div>
    );
};

export default SizeInstallsChart;