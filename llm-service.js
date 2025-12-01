// LLM Service - Gemini API Integration

class LLMService {
    constructor() {
        this.apiKey = CONFIG.GEMINI_API_KEY;
        this.apiUrl = CONFIG.GEMINI_API_URL;
    }

    // Generic method to call Gemini API
    async callGemini(prompt) {
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);

                if (response.status === 404) {
                    throw new Error('API endpoint not found. The Gemini API model may have changed. Please check config.js for the correct API URL.');
                } else if (response.status === 400) {
                    throw new Error('Invalid API key or request format. Please verify your GEMINI_API_KEY in config.js. Get a free key at https://aistudio.google.com/app/apikey');
                } else if (response.status === 403) {
                    throw new Error('API key is invalid or expired. Please get a new API key at https://aistudio.google.com/app/apikey and update config.js');
                } else {
                    throw new Error(`API Error (${response.status}): ${errorText}`);
                }
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('No response from AI');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    // Clean and extract menu items from OCR text
    async cleanMenuText(rawText) {
        const prompt = CONFIG.PROMPTS.cleanMenu + rawText;
        const response = await this.callGemini(prompt);

        // Parse response into array of food items
        const items = response.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('-') && !line.startsWith('*'))
            .map(line => line.replace(/^[\d.)\-*]+\s*/, '').trim())
            .filter(line => line.length > 2);

        return items;
    }

    // Classify food items and extract details
    async classifyFoodItems(foodItems) {
        const prompt = CONFIG.PROMPTS.classifyFood + foodItems.join(', ');
        const response = await this.callGemini(prompt);

        try {
            // Try to parse JSON response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.log('Could not parse classification JSON, using simple parsing');
        }

        // Fallback: return simple classification
        return {
            items: foodItems.map(item => ({
                name: item,
                category: this.guessCategory(item),
                ingredients: [item]
            }))
        };
    }

    // Simple category guessing
    guessCategory(foodItem) {
        const lower = foodItem.toLowerCase();

        if (lower.includes('tea') || lower.includes('coffee') || lower.includes('juice') ||
            lower.includes('milk') || lower.includes('shake')) {
            return 'Beverages';
        }

        if (lower.includes('paratha') || lower.includes('poha') || lower.includes('upma') ||
            lower.includes('idli') || lower.includes('dosa') || lower.includes('breakfast')) {
            return 'Breakfast';
        }

        if (lower.includes('rice') || lower.includes('roti') || lower.includes('dal') ||
            lower.includes('curry') || lower.includes('sabzi')) {
            return 'Lunch/Dinner';
        }

        if (lower.includes('samosa') || lower.includes('pakora') || lower.includes('biscuit')) {
            return 'Snacks';
        }

        return 'Main Course';
    }

    // Analyze diet and provide insights
    async analyzeDiet(nutritionData) {
        const prompt = CONFIG.PROMPTS.analyzeDiet + JSON.stringify(nutritionData, null, 2);
        const response = await this.callGemini(prompt);
        return response;
    }

    // Generate personalized insights based on nutrition data
    async generateInsights(nutritionData, historicalData = null) {
        let insights = [];

        // Pattern detection
        if (nutritionData.carbs > CONFIG.ALERTS.highCarbs) {
            insights.push({
                type: 'warning',
                title: 'High Carbs Alert',
                message: 'Your meal is high in carbohydrates today. Consider adding more protein-rich foods.'
            });
        }

        if (nutritionData.protein < CONFIG.ALERTS.lowProtein) {
            insights.push({
                type: 'warning',
                title: 'Low Protein',
                message: 'You might not be getting enough protein. Try adding dal, paneer, or eggs to your diet.'
            });
        }

        if (nutritionData.calories > CONFIG.ALERTS.highCalories) {
            insights.push({
                type: 'info',
                title: 'Calorie Watch',
                message: 'You\'re close to exceeding your daily calorie goal. Consider lighter meals for the rest of the day.'
            });
        }

        if (nutritionData.calories < CONFIG.ALERTS.lowCalories) {
            insights.push({
                type: 'info',
                title: 'Low Calories',
                message: 'Your calorie intake seems low. Make sure you\'re eating enough to fuel your activities.'
            });
        }

        // Get AI-powered detailed analysis
        try {
            const aiInsight = await this.analyzeDiet(nutritionData);
            insights.push({
                type: 'ai',
                title: 'AI Nutritionist Says',
                message: aiInsight
            });
        } catch (error) {
            console.error('Error getting AI insights:', error);
        }

        return insights;
    }

    // Suggest healthier alternatives
    async suggestAlternatives(foodItems) {
        const prompt = `As a nutritionist, suggest 3 healthier alternatives for these mess food items: ${foodItems.join(', ')}. 
        Keep it brief and practical for college students. Format as a simple numbered list.`;

        try {
            const response = await this.callGemini(prompt);
            return response;
        } catch (error) {
            console.error('Error suggesting alternatives:', error);
            return 'Try adding more vegetables, choosing brown rice over white rice, and including protein in every meal.';
        }
    }

    // Chat response
    async getChatResponse(userMessage, context = null) {
        let prompt = CONFIG.PROMPTS.chatResponse + userMessage;

        if (context) {
            prompt += `\n\nContext (today's meal data): ${JSON.stringify(context)}`;
        }

        try {
            const response = await this.callGemini(prompt);
            return response;
        } catch (error) {
            console.error('Chat error:', error);
            return 'Sorry, I\'m having trouble connecting right now. Please try again!';
        }
    }

    // Generate hydration reminder
    getHydrationReminder() {
        const tips = [
            '💧 Remember to drink water! Aim for 8 glasses throughout the day.',
            '💧 Stay hydrated! Water helps with digestion and energy levels.',
            '💧 Don\'t forget your water intake! Keep a bottle with you.',
            '💧 Hydration check: Have you had enough water today?'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Generate portion advice
    getPortionAdvice(calories) {
        if (calories > 800) {
            return '🍽️ Large meal detected! Consider eating slowly and stopping when you feel 80% full.';
        } else if (calories < 300) {
            return '🍽️ Light meal! Make sure to have balanced snacks if you get hungry later.';
        } else {
            return '🍽️ Portion size looks good! Remember to eat mindfully and enjoy your food.';
        }
    }
}

// Export instance
const llmService = new LLMService();
