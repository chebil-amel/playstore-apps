import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import * as d3 from 'd3';

const MostRatedAppsChart = () => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const csvUrl = 'https://github.com/chebil-amel/playstore-apps/blob/ec7d3d68f7eca2f3d5dadc31be1e3feb3049ac4e/public/googleplaystore.csv?raw=true';

        const fetchData = async () => {
            const data = await d3.csv(csvUrl);
            data.forEach(d => {
                d.Reviews = +d.Reviews;
            });

            const filteredData = data.filter(d => !isNaN(d.Reviews));
            const sortedData = filteredData.sort((a, b) => b.Reviews - a.Reviews).slice(0, 10);

            const labels = sortedData.map(d => d.App);
            const reviews = sortedData.map(d => d.Reviews);
            const types = sortedData.map(d => d.Type);
            const colors = types.map(type => type === 'Free' ? 'blue' : 'orange');

            setChartData({
                labels: labels,
                datasets: [{
                    label: 'Number of Reviews',
                    data: reviews,
                    backgroundColor: colors,
                }]
            });
        };

        fetchData();
    }, []);

    return (
        <div>
            
            <h1>Top 10 Most Rated Apps by Type</h1>
            <Bar
                data={chartData}
                options={{
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