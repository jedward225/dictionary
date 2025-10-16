class FrequencyChart {
    constructor() {
        this.chart = null;
    }

    create(frequencyData) {
        const ctx = document.getElementById('frequency-chart').getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        const years = frequencyData.map(item => item.year);
        const counts = frequencyData.map(item => item.count);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: '使用频次',
                    data: counts,
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#60a5fa',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#60a5fa',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `使用频次: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '年份',
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '使用频次',
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'easeInOutQuart',
                        from: 1,
                        to: 0.4,
                        loop: false
                    }
                }
            }
        });
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// 扩展 BuzzwordDisplay 类以使用独立的图表功能
if (typeof window !== 'undefined') {
    window.createFrequencyChart = function(frequencyData) {
        if (!window.frequencyChartInstance) {
            window.frequencyChartInstance = new FrequencyChart();
        }
        window.frequencyChartInstance.create(frequencyData);
    };
}