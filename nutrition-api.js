// Nutrition API - Fetch nutritional data

class NutritionAPI {
    constructor() {
        this.usdaApiKey = CONFIG.USDA_API_KEY;
        this.usdaApiUrl = CONFIG.USDA_API_URL;
        this.cache = new Map();
        this.localDatabase = null;
        this.loadLocalDatabase();
    }

    // Load local nutrition database
    async loadLocalDatabase() {
        try {
            const response = await fetch('nutrition-db.json');
            this.localDatabase = await response.json();
        } catch (error) {
            console.warn('Could not load local nutrition database:', error);
            this.localDatabase = this.getDefaultDatabase();
        }
    }

    // Default nutrition database for common Indian mess foods
    getDefaultDatabase() {
        return {
            "rice": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
            "roti": { calories: 71, protein: 3, carbs: 15, fat: 0.4, fiber: 2 },
            "chapati": { calories: 71, protein: 3, carbs: 15, fat: 0.4, fiber: 2 },
            "dal": { calories: 116, protein: 9, carbs: 20, fat: 0.5, fiber: 8 },
            "rajma": { calories: 140, protein: 8.7, carbs: 25, fat: 0.5, fiber: 6.4 },
            "chole": { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 },
            "paneer": { calories: 265, protein: 18, carbs: 3.6, fat: 20, fiber: 0 },
            "aloo": { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
            "paratha": { calories: 126, protein: 3, carbs: 18, fat: 5, fiber: 2 },
            "idli": { calories: 39, protein: 2, carbs: 8, fat: 0.3, fiber: 0.8 },
            "dosa": { calories: 133, protein: 3.9, carbs: 22, fat: 3.7, fiber: 1.6 },
            "poha": { calories: 76, protein: 1.5, carbs: 17, fat: 0.2, fiber: 0.6 },
            "upma": { calories: 85, protein: 2.5, carbs: 16, fat: 1.5, fiber: 1.2 },
            "samosa": { calories: 262, protein: 4, carbs: 25, fat: 17, fiber: 2 },
            "pakora": { calories: 150, protein: 3, carbs: 12, fat: 10, fiber: 2 },
            "sabzi": { calories: 60, protein: 2, carbs: 10, fat: 2, fiber: 3 },
            "curry": { calories: 150, protein: 5, carbs: 15, fat: 8, fiber: 3 },
            "biryani": { calories: 290, protein: 8, carbs: 45, fat: 8, fiber: 2 },
            "pulao": { calories: 200, protein: 5, carbs: 35, fat: 5, fiber: 2 },
            "raita": { calories: 60, protein: 3, carbs: 6, fat: 3, fiber: 0.5 },
            "salad": { calories: 25, protein: 1, carbs: 5, fat: 0.2, fiber: 2 },
            "pickle": { calories: 40, protein: 0.5, carbs: 8, fat: 1, fiber: 1 },
            "papad": { calories: 44, protein: 1.5, carbs: 6, fat: 2, fiber: 0.5 },
            "tea": { calories: 30, protein: 0.5, carbs: 7, fat: 0.5, fiber: 0 },
            "coffee": { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0 },
            "milk": { calories: 60, protein: 3.2, carbs: 4.5, fat: 3.2, fiber: 0 },
            "curd": { calories: 60, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0 },
            "yogurt": { calories: 60, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0 },
            "egg": { calories: 68, protein: 6, carbs: 0.6, fat: 4.8, fiber: 0 },
            "bread": { calories: 79, protein: 2.7, carbs: 15, fat: 1, fiber: 0.8 },
            "butter": { calories: 102, protein: 0.1, carbs: 0, fat: 11.5, fiber: 0 },
            "jam": { calories: 56, protein: 0.1, carbs: 14, fat: 0, fiber: 0.2 },
            "banana": { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
            "apple": { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 }
        };
    }

    // Get nutrition data for a food item
    async getNutritionData(foodItem) {
        // Check cache first
        const cacheKey = foodItem.toLowerCase().trim();
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Try local database first
        const localData = this.searchLocalDatabase(foodItem);
        if (localData) {
            this.cache.set(cacheKey, localData);
            return localData;
        }

        // Try USDA API
        try {
            const usdaData = await this.searchUSDA(foodItem);
            if (usdaData) {
                this.cache.set(cacheKey, usdaData);
                return usdaData;
            }
        } catch (error) {
            console.warn('USDA API error:', error);
        }

        // Default fallback
        const defaultData = {
            name: foodItem,
            calories: 150,
            protein: 5,
            carbs: 20,
            fat: 5,
            fiber: 2,
            serving: '100g',
            isEstimate: true
        };

        this.cache.set(cacheKey, defaultData);
        return defaultData;
    }

    // Search local database
    searchLocalDatabase(foodItem) {
        if (!this.localDatabase) {
            this.localDatabase = this.getDefaultDatabase();
        }

        const searchTerm = foodItem.toLowerCase().trim();

        // Direct match
        if (this.localDatabase[searchTerm]) {
            return {
                name: foodItem,
                ...this.localDatabase[searchTerm],
                serving: '100g'
            };
        }

        // Partial match
        for (const [key, value] of Object.entries(this.localDatabase)) {
            if (searchTerm.includes(key) || key.includes(searchTerm)) {
                return {
                    name: foodItem,
                    ...value,
                    serving: '100g'
                };
            }
        }

        return null;
    }

    // Search USDA FoodData Central
    async searchUSDA(foodItem) {
        try {
            const url = `${this.usdaApiUrl}/foods/search?api_key=${this.usdaApiKey}&query=${encodeURIComponent(foodItem)}&pageSize=1`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('USDA API error');
            }

            const data = await response.json();

            if (data.foods && data.foods.length > 0) {
                const food = data.foods[0];
                return this.parseUSDAFood(food, foodItem);
            }
        } catch (error) {
            console.error('Error fetching from USDA:', error);
        }

        return null;
    }

    // Parse USDA food data
    parseUSDAFood(food, originalName) {
        const nutrients = food.foodNutrients || [];

        const getNutrient = (nutrientName) => {
            const nutrient = nutrients.find(n => n.nutrientName.toLowerCase().includes(nutrientName));
            return nutrient ? nutrient.value : 0;
        };

        return {
            name: originalName,
            calories: getNutrient('energy') || getNutrient('calor'),
            protein: getNutrient('protein'),
            carbs: getNutrient('carbohydrate'),
            fat: getNutrient('total lipid') || getNutrient('fat'),
            fiber: getNutrient('fiber'),
            serving: '100g'
        };
    }

    // Get nutrition for multiple items
    async getNutritionForItems(foodItems) {
        const results = await Promise.all(
            foodItems.map(item => this.getNutritionData(item))
        );

        return results;
    }

    // Calculate total nutrition
    calculateTotalNutrition(nutritionDataArray) {
        const total = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0
        };

        nutritionDataArray.forEach(item => {
            total.calories += item.calories || 0;
            total.protein += item.protein || 0;
            total.carbs += item.carbs || 0;
            total.fat += item.fat || 0;
            total.fiber += item.fiber || 0;
        });

        // Round to 1 decimal place
        Object.keys(total).forEach(key => {
            total[key] = Math.round(total[key] * 10) / 10;
        });

        return total;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Export instance
const nutritionAPI = new NutritionAPI();
