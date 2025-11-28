// Application Configuration
const CONFIG = {
  // API Keys
  // IMPORTANT: Get your own FREE API key from: https://makersuite.google.com/app/apikey
  // The key below may be invalid or expired - replace it with yours!
  GEMINI_API_KEY: 'AIzaSyDFHupQsJEnXPJDzumPdrC0SoHT68mX7bk',
  USDA_API_KEY: 'DEMO_KEY', // Get your own from https://fdc.nal.usda.gov/api-key-signup.html

  // API Endpoints
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  USDA_API_URL: 'https://api.nal.usda.gov/fdc/v1',

  // Nutritional Thresholds and Goals
  DAILY_GOALS: {
    calories: 2000,
    protein: 50,      // grams
    carbs: 275,       // grams
    fat: 65,          // grams
    fiber: 25,        // grams
    water: 8          // glasses
  },

  // Alert Thresholds
  ALERTS: {
    highCarbs: 300,   // grams per day
    lowProtein: 30,   // grams per day
    highCalories: 2500,
    lowCalories: 1200
  },

  // LLM Prompts
  PROMPTS: {
    cleanMenu: `You are a nutrition expert. Extract and clean the following mess menu text. 
List only the food items, one per line, with proper names. Remove any prices, timings, or extra text.
Menu text: `,

    classifyFood: `Classify the following food items into categories (Breakfast, Lunch, Dinner, Snacks, Beverages).
Also identify the main ingredients and cooking method. Return as JSON.
Food items: `,

    analyzeDiet: `As a friendly nutritionist, analyze this daily meal data and provide insights:
- Highlight any nutritional patterns (high carbs, low protein, etc.)
- Suggest 2-3 healthier alternatives
- Give hydration reminders if needed
- Provide portion advice
- Be conversational and encouraging

Meal data: `,

    chatResponse: `You are a friendly college nutritionist chatbot helping students eat healthier. 
Respond in a warm, conversational tone. Provide practical advice for college mess food.
Keep responses concise (2-3 sentences). User question: `
  },

  // UI Settings
  UI: {
    animationDuration: 300,
    chartColors: {
      protein: '#FF6B6B',
      carbs: '#4ECDC4',
      fat: '#FFE66D',
      fiber: '#95E1D3',
      calories: '#A8DADC'
    }
  },

  // Storage Keys
  STORAGE_KEYS: {
    meals: 'mess_analyzer_meals',
    preferences: 'mess_analyzer_preferences',
    weeklyData: 'mess_analyzer_weekly'
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
