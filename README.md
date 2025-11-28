# 🍽️ Mess Menu + Diet Analyzer Bot

> **AI-Powered Nutrition Tracking for College Students**

A comprehensive web application that uses OCR, AI, and nutrition APIs to help college students analyze their mess menus, track their diet, and receive personalized health insights.

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### 🎯 Core Functionality

- **📸 OCR Menu Scanning**: Upload photos of mess menus - AI extracts food items automatically
- **⌨️ Manual Input**: Type menu items directly for faster input
- **🧠 AI Menu Understanding**: Google Gemini AI cleans and interprets messy menu text
- **📊 Nutrition Analysis**: Complete breakdown of calories, protein, carbs, and fat
- **💡 Personalized Insights**: AI-powered pattern detection and health recommendations
- **💬 Chat Assistant**: Ask nutrition questions to a friendly AI chatbot
- **📈 Weekly Tracking**: Visualize your nutrition trends with interactive charts
- **🎨 Premium UI**: Modern dark mode with glassmorphism and smooth animations

### 🔍 Smart Features

- Pattern detection (high carbs, low protein alerts)
- Healthier alternatives suggestions
- Hydration reminders
- Portion control advice
- Weekly statistics and best day tracking
- Local data storage (privacy-first)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.x (for local server)
- Modern web browser
- Internet connection (for AI features)

### Installation & Running

1. **Clone or download** this repository

2. **Navigate to the project directory**:
   ```bash
   cd chat
   ```

3. **Start the local server**:
   ```bash
   python -m http.server 8000
   ```

4. **Open in browser**:
   ```
   http://localhost:8000
   ```

That's it! No build process, no dependencies to install. The app runs purely in the browser.

---

## 📁 Project Structure

```
chat/
├── index.html              # Main HTML structure
├── styles.css              # Premium CSS design system
├── config.js               # Configuration and API keys
├── app.js                  # Main application controller
├── ocr-processor.js        # OCR processing with Tesseract.js
├── llm-service.js          # Gemini AI integration
├── nutrition-api.js        # Nutrition data fetching
├── data-manager.js         # LocalStorage data management
├── chart-renderer.js       # Chart.js visualizations
├── nutrition-db.json       # Local Indian food database
└── README.md              # This file
```

---

## 🎨 Technology Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Custom design system (no frameworks)
- **Vanilla JavaScript**: Modular ES6 code

### APIs & Libraries
- **Google Gemini API**: AI-powered menu interpretation and chat
- **Tesseract.js**: Client-side OCR processing
- **Chart.js**: Data visualization
- **USDA FoodData Central**: Nutrition database (optional)
- **Local Database**: 65+ Indian mess food items

### External Dependencies (CDN)
- Tesseract.js v5.0.0
- Chart.js v4.4.0
- Font Awesome v6.4.0
- Google Fonts (Inter)

---

## 🔑 API Configuration

### Gemini API Key (Required)

The application uses Google Gemini API for AI features. The API key is already configured in `config.js`:

```javascript
GEMINI_API_KEY: 'AIzaSyCwIvRxP8qTp5pikl5UEBL0-747L-DPBbM'
```

### USDA API Key (Optional)

For additional nutrition data, you can add a USDA API key:

1. Get a free key at: https://fdc.nal.usda.gov/api-key-signup.html
2. Update `config.js`:
   ```javascript
   USDA_API_KEY: 'your-key-here'
   ```

---

## 📖 Usage Guide

### 1. Upload Menu

**Option A: Photo Upload**
- Click "Upload Photo"
- Select a clear image of the mess menu
- Wait for OCR processing
- Review extracted items

**Option B: Text Input**
- Type menu items (one per line)
- Click "Process Menu"
- Items are cleaned by AI

### 2. Analyze Nutrition

- Click "Analyze with AI" button
- View nutrition breakdown in cards
- Check detailed food items table
- Read AI-generated insights

### 3. Save & Track

- Click "Save to Weekly Tracker"
- Switch to "Trends" tab
- View interactive charts
- Check weekly statistics

### 4. Ask Questions

- Go to "Chat" tab
- Ask nutrition questions
- Get personalized advice
- Context-aware responses

---

## 🍽️ Nutrition Database

### 65+ Indian Mess Foods Included

**Categories:**
- Staples (rice, roti, dal, etc.)
- Breakfast items (idli, dosa, paratha, etc.)
- Main courses (biryani, curry, sabzi, etc.)
- Snacks (samosa, pakora, etc.)
- Beverages (tea, coffee, milk, etc.)
- Fruits and desserts

**Data per 100g:**
- Calories (kcal)
- Protein (g)
- Carbohydrates (g)
- Fat (g)
- Fiber (g)

---

## 🎯 Key Features Explained

### OCR Processing
- Uses Tesseract.js for text extraction
- Client-side processing (privacy-first)
- Progress tracking with visual feedback
- Automatic text cleaning

### AI Menu Understanding
- Gemini AI cleans messy OCR text
- Removes prices, timings, extra info
- Classifies food into categories
- Standardizes food names

### Nutrition Analysis
- Local database for Indian foods
- USDA API for additional items
- Caching for better performance
- Accurate macro calculations

### Personalized Insights
- Pattern detection (high/low nutrients)
- Healthier alternatives
- Hydration reminders
- Portion control advice
- Weekly trend analysis

### Chat Assistant
- Context-aware responses
- Friendly, conversational tone
- Practical college mess advice
- Instant AI-powered answers

---

## 📊 Charts & Visualization

- **Calorie Trends**: 7-day line chart
- **Macro Distribution**: Interactive pie chart
- **Protein Tracking**: Daily bar chart
- **Weekly Summary**: Key statistics

All charts are:
- Fully responsive
- Interactive with tooltips
- Theme-matched colors
- Real-time updated

---

## 🔐 Privacy & Security

- **Local-First**: All data stored in browser LocalStorage
- **No Backend**: No external database or server
- **API-Only**: Only menu text sent to APIs
- **User Control**: Clear data anytime
- **No Tracking**: No analytics or user tracking

---

## 🎨 Design Philosophy

### Visual Design
- **Dark Mode First**: Easy on eyes for late-night studying
- **Glassmorphism**: Modern frosted glass effects
- **Vibrant Gradients**: Purple-to-teal color scheme
- **Smooth Animations**: 60fps transitions

### User Experience
- **Intuitive Navigation**: Clear tab-based interface
- **Instant Feedback**: Loading states and progress bars
- **Error Handling**: Friendly error messages
- **Responsive**: Works on all devices

---

## 🧪 Testing

### Tested Features ✅

- ✓ OCR image processing
- ✓ AI menu interpretation
- ✓ Nutrition data fetching
- ✓ Calorie calculations
- ✓ LocalStorage persistence
- ✓ Chart rendering
- ✓ Chat responses
- ✓ Responsive design

### Test the Application

1. **Upload a menu photo** (use `sample_mess_menu.png`)
2. **Try text input** with sample menu
3. **Analyze nutrition** and check results
4. **Ask questions** in chat
5. **Save meals** and view trends

---

## 🚧 Future Enhancements

**Planned Features:**
- Barcode scanning for packaged foods
- Meal planning and recommendations
- Social sharing features
- Fitness tracker integration
- Recipe suggestions
- Allergen filters
- Multi-language support
- Progressive Web App (offline mode)
- Mobile apps (iOS/Android)

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Add more food items to nutrition database
- Improve OCR accuracy with preprocessing
- Add unit tests
- Optimize performance
- Enhance UI/UX
- Add new chart types
- Implement export features

---

## 📄 License

MIT License - feel free to use for personal or educational purposes.

---

## 🙏 Acknowledgments

- **Google Gemini API**: AI-powered insights
- **Tesseract.js**: OCR technology
- **Chart.js**: Beautiful visualizations
- **USDA FoodData Central**: Nutrition database
- **Font Awesome**: Icon library
- **Google Fonts**: Inter typography

---

## 📞 Support

### Common Issues

**Q: OCR not accurate?**
→ Use clear, well-lit photos or manual text input

**Q: AI responses slow?**
→ Check internet connection; API requires network

**Q: Nutrition data missing?**
→ Add custom items to `nutrition-db.json`

**Q: Charts not showing?**
→ Save at least one meal first

---

## 🎓 Built For

College students who want to:
- Track their mess food nutrition
- Make healthier choices
- Understand their diet patterns
- Get personalized health advice
- Maintain a balanced diet

---

**🌟 Star this project if you find it useful!**

**Made with ❤️ for college students**

---

## 📸 Screenshots

### Upload Interface
Clean, modern interface for photo and text input with real-time OCR processing.

### Analysis Dashboard
Comprehensive nutrition breakdown with AI-powered insights and recommendations.

### Chat Assistant
Conversational AI nutritionist ready to answer all your diet questions.

### Weekly Trends
Interactive charts showing your nutrition patterns over time.

---

**Server Status:** ✅ Running on http://localhost:8000

**Ready to use!** Open your browser and start tracking your meals.
