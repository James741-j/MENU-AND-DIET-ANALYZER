// Data Manager - Handle LocalStorage and meal tracking

class DataManager {
    constructor() {
        this.storageKeys = CONFIG.STORAGE_KEYS;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKeys.meals)) {
            localStorage.setItem(this.storageKeys.meals, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.storageKeys.weeklyData)) {
            localStorage.setItem(this.storageKeys.weeklyData, JSON.stringify({}));
        }
        if (!localStorage.getItem(this.storageKeys.preferences)) {
            localStorage.setItem(this.storageKeys.preferences, JSON.stringify(CONFIG.DAILY_GOALS));
        }
    }

    // Save a meal
    saveMeal(mealData) {
        const meals = this.getAllMeals();
        const meal = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: mealData.items,
            nutrition: mealData.nutrition,
            insights: mealData.insights
        };
        meals.push(meal);
        localStorage.setItem(this.storageKeys.meals, JSON.stringify(meals));
        this.updateWeeklyData(meal);
        return meal;
    }

    // Get all meals
    getAllMeals() {
        const data = localStorage.getItem(this.storageKeys.meals);
        return data ? JSON.parse(data) : [];
    }

    // Get meals from last N days
    getRecentMeals(days = 7) {
        const meals = this.getAllMeals();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return meals.filter(meal => new Date(meal.date) >= cutoffDate);
    }

    // Update weekly aggregated data
    updateWeeklyData(meal) {
        const weeklyData = this.getWeeklyData();
        const dateKey = new Date(meal.date).toLocaleDateString();

        if (!weeklyData[dateKey]) {
            weeklyData[dateKey] = {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                mealCount: 0
            };
        }

        weeklyData[dateKey].calories += meal.nutrition.calories;
        weeklyData[dateKey].protein += meal.nutrition.protein;
        weeklyData[dateKey].carbs += meal.nutrition.carbs;
        weeklyData[dateKey].fat += meal.nutrition.fat;
        weeklyData[dateKey].fiber += meal.nutrition.fiber || 0;
        weeklyData[dateKey].mealCount += 1;

        localStorage.setItem(this.storageKeys.weeklyData, JSON.stringify(weeklyData));
    }

    // Get weekly data
    getWeeklyData() {
        const data = localStorage.getItem(this.storageKeys.weeklyData);
        return data ? JSON.parse(data) : {};
    }

    // Get weekly statistics
    getWeeklyStats() {
        const weeklyData = this.getWeeklyData();
        const days = Object.keys(weeklyData);

        if (days.length === 0) {
            return {
                totalMeals: 0,
                avgCalories: 0,
                avgProtein: 0,
                avgCarbs: 0,
                avgFat: 0,
                bestDay: null
            };
        }

        let totalMeals = 0;
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let bestDay = { date: null, score: 0 };

        days.forEach(day => {
            const data = weeklyData[day];
            totalMeals += data.mealCount;
            totalCalories += data.calories;
            totalProtein += data.protein;
            totalCarbs += data.carbs;
            totalFat += data.fat;

            // Simple health score: prioritize protein, penalize excess calories
            const score = data.protein - Math.abs(data.calories - CONFIG.DAILY_GOALS.calories) / 100;
            if (score > bestDay.score) {
                bestDay = { date: day, score };
            }
        });

        const numDays = days.length;

        return {
            totalMeals,
            avgCalories: Math.round(totalCalories / numDays),
            avgProtein: Math.round(totalProtein / numDays),
            avgCarbs: Math.round(totalCarbs / numDays),
            avgFat: Math.round(totalFat / numDays),
            bestDay: bestDay.date
        };
    }

    // Get trend data for charts (last 7 days)
    getTrendData() {
        const weeklyData = this.getWeeklyData();
        const last7Days = [];

        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toLocaleDateString();
            last7Days.push({
                date: dateKey,
                shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                data: weeklyData[dateKey] || { calories: 0, protein: 0, carbs: 0, fat: 0 }
            });
        }

        return last7Days;
    }

    // Clear all data
    clearAllData() {
        localStorage.setItem(this.storageKeys.meals, JSON.stringify([]));
        localStorage.setItem(this.storageKeys.weeklyData, JSON.stringify({}));
    }

    // Export data as JSON
    exportData() {
        return {
            meals: this.getAllMeals(),
            weeklyData: this.getWeeklyData(),
            exportDate: new Date().toISOString()
        };
    }

    // Import data from JSON
    importData(data) {
        if (data.meals) {
            localStorage.setItem(this.storageKeys.meals, JSON.stringify(data.meals));
        }
        if (data.weeklyData) {
            localStorage.setItem(this.storageKeys.weeklyData, JSON.stringify(data.weeklyData));
        }
    }
}

// Export instance
const dataManager = new DataManager();
