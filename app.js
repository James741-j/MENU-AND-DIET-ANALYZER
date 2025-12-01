// Main Application Logic

class MessMenuAnalyzer {
    constructor() {
        this.currentMeal = null;
        this.currentNutrition = null;
        this.initializeEventListeners();
        this.loadTrendsData();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.nav-btn').dataset.tab));
        });

        // Image upload
        const imageUpload = document.getElementById('image-upload');
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Text input processing
        const processTextBtn = document.getElementById('process-text-btn');
        if (processTextBtn) {
            processTextBtn.addEventListener('click', () => this.handleTextInput());
        }

        // Analyze menu button
        const analyzeBtn = document.getElementById('analyze-menu-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeMenu());
        }

        // Save meal button
        const saveMealBtn = document.getElementById('save-meal-btn');
        if (saveMealBtn) {
            saveMealBtn.addEventListener('click', () => this.saveMeal());
        }

        // Chat input
        const chatInput = document.getElementById('chat-input');
        const chatSendBtn = document.getElementById('chat-send-btn');

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleChatMessage();
            });
        }

        if (chatSendBtn) {
            chatSendBtn.addEventListener('click', () => this.handleChatMessage());
        }

        // Clear data button
        const clearDataBtn = document.getElementById('clear-data-btn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.clearData());
        }
    }

    // Switch between tabs
    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Load trends data when switching to trends tab
        if (tabName === 'trends') {
            this.loadTrendsData();
        }
    }

    // Handle image upload
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Validate image
            ocrProcessor.validateImage(file);

            // Show preview section
            const previewSection = document.getElementById('preview-section');
            const previewImage = document.getElementById('preview-image');
            const ocrProgress = document.getElementById('ocr-progress');
            const ocrResult = document.getElementById('ocr-result');

            previewSection.style.display = 'block';
            ocrProgress.style.display = 'block';
            ocrResult.style.display = 'none';

            // Display image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Process OCR
            const progressFill = document.getElementById('ocr-progress-fill');
            const result = await ocrProcessor.processImage(file, (progress) => {
                progressFill.style.width = `${progress}%`;
            });

            // Hide progress, show results
            ocrProgress.style.display = 'none';
            ocrResult.style.display = 'block';

            // Clean extracted text with LLM
            this.showLoading('Cleaning menu text with AI...');
            const cleanedItems = await llmService.cleanMenuText(result.text);
            this.hideLoading();

            // Display extracted items
            const extractedItemsDiv = document.getElementById('extracted-items');
            extractedItemsDiv.innerHTML = cleanedItems.map(item =>
                `<p>${item}</p>`
            ).join('');

            this.currentMeal = { items: cleanedItems };

        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error(error);
            this.hideLoading();
        }
    }

    // Handle text input
    async handleTextInput() {
        const textInput = document.getElementById('menu-text-input');
        const rawText = textInput.value.trim();

        if (!rawText) {
            alert('Please enter menu items');
            return;
        }

        try {
            this.showLoading('Processing menu items...');

            // Clean text with LLM
            const cleanedItems = await llmService.cleanMenuText(rawText);

            this.hideLoading();

            // Show results
            const previewSection = document.getElementById('preview-section');
            const ocrResult = document.getElementById('ocr-result');
            const extractedItemsDiv = document.getElementById('extracted-items');

            previewSection.style.display = 'block';
            ocrResult.style.display = 'block';

            extractedItemsDiv.innerHTML = cleanedItems.map(item =>
                `<p>${item}</p>`
            ).join('');

            this.currentMeal = { items: cleanedItems };

        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error(error);
            this.hideLoading();
        }
    }

    // Analyze menu with nutrition data and AI insights
    async analyzeMenu() {
        if (!this.currentMeal || !this.currentMeal.items || this.currentMeal.items.length === 0) {
            alert('No menu items to analyze');
            return;
        }

        try {
            this.showLoading('Fetching nutrition data...');

            // Get nutrition data for all items
            const nutritionData = await nutritionAPI.getNutritionForItems(this.currentMeal.items);

            // Calculate totals
            const totalNutrition = nutritionAPI.calculateTotalNutrition(nutritionData);

            this.currentMeal.nutritionDetails = nutritionData;
            this.currentNutrition = totalNutrition;

            // Switch to analysis tab
            this.switchTab('analysis');

            // Display nutrition cards
            this.displayNutritionSummary(totalNutrition);

            // Display food items breakdown
            this.displayFoodItems(nutritionData);

            // Generate and display AI insights
            this.showLoading('Generating personalized insights...');
            const insights = await llmService.generateInsights(totalNutrition);
            this.displayInsights(insights);

            this.hideLoading();

        } catch (error) {
            alert(`Error analyzing menu: ${error.message}`);
            console.error(error);
            this.hideLoading();
        }
    }

    // Display nutrition summary cards
    displayNutritionSummary(nutrition) {
        document.getElementById('total-calories').textContent = Math.round(nutrition.calories);
        document.getElementById('total-protein').textContent = Math.round(nutrition.protein) + 'g';
        document.getElementById('total-carbs').textContent = Math.round(nutrition.carbs) + 'g';
        document.getElementById('total-fat').textContent = Math.round(nutrition.fat) + 'g';
    }

    // Display food items breakdown
    displayFoodItems(nutritionData) {
        const foodItemsList = document.getElementById('food-items-list');

        foodItemsList.innerHTML = nutritionData.map(food => `
            <div class="food-item">
                <div class="food-name">${food.name}</div>
                <div class="food-nutrient">
                    <div class="label">Calories</div>
                    <div class="value">${Math.round(food.calories)}</div>
                </div>
                <div class="food-nutrient">
                    <div class="label">Protein</div>
                    <div class="value">${Math.round(food.protein)}g</div>
                </div>
                <div class="food-nutrient">
                    <div class="label">Carbs</div>
                    <div class="value">${Math.round(food.carbs)}g</div>
                </div>
                <div class="food-nutrient">
                    <div class="label">Fat</div>
                    <div class="value">${Math.round(food.fat)}g</div>
                </div>
            </div>
        `).join('');
    }

    // Display AI insights
    displayInsights(insights) {
        const insightsContent = document.getElementById('insights-content');

        insightsContent.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <h4><i class="fas fa-${this.getInsightIcon(insight.type)}"></i> ${insight.title}</h4>
                <p>${insight.message}</p>
            </div>
        `).join('');

        // Add hydration reminder
        const hydrationTip = llmService.getHydrationReminder();
        const portionTip = llmService.getPortionAdvice(this.currentNutrition.calories);

        insightsContent.innerHTML += `
            <div class="insight-item">
                <p>${hydrationTip}</p>
            </div>
            <div class="insight-item">
                <p>${portionTip}</p>
            </div>
        `;
    }

    // Get icon for insight type
    getInsightIcon(type) {
        const icons = {
            'warning': 'exclamation-triangle',
            'info': 'info-circle',
            'ai': 'brain',
            'success': 'check-circle'
        };
        return icons[type] || 'lightbulb';
    }

    // Save meal to weekly tracker
    saveMeal() {
        if (!this.currentMeal || !this.currentNutrition) {
            alert('No meal to save. Please analyze a menu first.');
            return;
        }

        const mealData = {
            items: this.currentMeal.items,
            nutrition: this.currentNutrition,
            insights: 'Saved meal'
        };

        dataManager.saveMeal(mealData);

        alert('✅ Meal saved to weekly tracker!');

        // Update trends if on trends tab
        if (document.getElementById('trends-tab').classList.contains('active')) {
            this.loadTrendsData();
        }
    }

    // Load and display trends data
    loadTrendsData() {
        // Get trend data
        const trendData = dataManager.getTrendData();
        const weeklyStats = dataManager.getWeeklyStats();

        // Calculate total nutrition from current week
        const totalNutrition = {
            protein: weeklyStats.avgProtein,
            carbs: weeklyStats.avgCarbs,
            fat: weeklyStats.avgFat
        };

        // Render charts
        chartRenderer.renderAllCharts(trendData, totalNutrition);

        // Update weekly summary
        document.getElementById('total-meals').textContent = weeklyStats.totalMeals;
        document.getElementById('avg-calories').textContent = weeklyStats.avgCalories + ' kcal';
        document.getElementById('best-day').textContent = weeklyStats.bestDay || 'No data yet';
    }

    // Handle chat messages
    async handleChatMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        try {
            // Get AI response
            const context = this.currentNutrition ? {
                nutrition: this.currentNutrition,
                items: this.currentMeal?.items
            } : null;

            const response = await llmService.getChatResponse(message, context);

            // Add bot response to chat
            this.addChatMessage(response, 'bot');

        } catch (error) {
            this.addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
            console.error(error);
        }
    }

    // Add message to chat
    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${this.formatMessage(message)}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Format message (convert line breaks, etc.)
    formatMessage(message) {
        return message.replace(/\n/g, '<br>');
    }

    // Clear all data
    clearData() {
        if (confirm('Are you sure you want to clear all tracked data? This cannot be undone.')) {
            dataManager.clearAllData();
            this.loadTrendsData();
            alert('All data cleared!');
        }
    }

    // Show loading overlay
    showLoading(text = 'Processing...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');

        if (overlay && loadingText) {
            loadingText.textContent = text;
            overlay.classList.add('active');
        }
    }

    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MessMenuAnalyzer();
    console.log('🍽️ Mess Menu Analyzer initialized!');
});
