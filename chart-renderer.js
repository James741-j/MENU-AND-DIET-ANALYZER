// Chart Renderer - Visualize nutrition trends

class ChartRenderer {
    constructor() {
        this.charts = {};
        this.chartColors = CONFIG.UI.chartColors;
    }

    // Render calorie trends chart
    renderCalorieChart(trendData) {
        const ctx = document.getElementById('calories-chart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.calories) {
            this.charts.calories.destroy();
        }

        const labels = trendData.map(d => d.shortDate);
        const data = trendData.map(d => d.data.calories);

        this.charts.calories = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Calories',
                    data: data,
                    borderColor: this.chartColors.calories,
                    backgroundColor: this.hexToRGBA(this.chartColors.calories, 0.1),
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: this.chartColors.calories,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.calories,
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b8c1ec',
                            callback: function (value) {
                                return value + ' kcal';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#b8c1ec'
                        }
                    }
                }
            }
        });
    }

    // Render macronutrient pie chart
    renderMacrosChart(totalNutrition) {
        const ctx = document.getElementById('macros-chart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.macros) {
            this.charts.macros.destroy();
        }

        this.charts.macros = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Protein', 'Carbs', 'Fat'],
                datasets: [{
                    data: [
                        totalNutrition.protein || 0,
                        totalNutrition.carbs || 0,
                        totalNutrition.fat || 0
                    ],
                    backgroundColor: [
                        this.chartColors.protein,
                        this.chartColors.carbs,
                        this.chartColors.fat
                    ],
                    borderColor: '#1f2740',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b8c1ec',
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + 'g';
                            }
                        }
                    }
                }
            }
        });
    }

    // Render protein trends chart
    renderProteinChart(trendData) {
        const ctx = document.getElementById('protein-chart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.protein) {
            this.charts.protein.destroy();
        }

        const labels = trendData.map(d => d.shortDate);
        const data = trendData.map(d => d.data.protein);

        this.charts.protein = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Protein (g)',
                    data: data,
                    backgroundColor: this.hexToRGBA(this.chartColors.protein, 0.8),
                    borderColor: this.chartColors.protein,
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: this.chartColors.protein
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.chartColors.protein,
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b8c1ec',
                            callback: function (value) {
                                return value + 'g';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#b8c1ec'
                        }
                    }
                }
            }
        });
    }

    // Render all charts
    renderAllCharts(trendData, totalNutrition) {
        this.renderCalorieChart(trendData);
        this.renderMacrosChart(totalNutrition);
        this.renderProteinChart(trendData);
    }

    // Utility: Convert hex to RGBA
    hexToRGBA(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Destroy all charts
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Export instance
const chartRenderer = new ChartRenderer();

