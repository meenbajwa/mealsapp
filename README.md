# Meals App 🍽️

Discover and explore delicious meal recipes from around the world! Meals App is a React-based application that provides access to a comprehensive database of recipes, allowing users to search for meals by name, browse meal categories, and get detailed recipe information including ingredients and cooking instructions.

## 🌟 Key Features

- **Search Functionality** - Find meals by name or ingredient
- **Browse Categories** - Explore meals organized by cuisine type
- **Detailed Recipe Information** - View ingredients, measurements, and cooking instructions
- **Responsive Design** - Seamless experience on all devices
- **Fast Performance** - Optimized rendering with React + Vite
- **Interactive UI** - Smooth animations and transitions
- **External API Integration** - Real data from TheMealDB API

## 🛠️ Tech Stack

- **Frontend Framework**: React.js
- **Build Tool**: Vite (modern, lightning-fast build tool)
- **Styling**: CSS3 with modern animations
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Requests**: Fetch API
- **API**: TheMealDB (free meal database API)
- **Package Manager**: npm/yarn

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/meenbajwa/mealsapp.git
   cd mealsapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173` (Vite's default port)

4. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 How to Use

### 1. **Search for Meals**
   - Enter any meal name in the search bar (e.g., "Pasta", "Biryani", "Tacos")
   - Browse the search results instantly

### 2. **Browse by Category**
   - Click on different meal categories
   - View all meals in that category

### 3. **View Recipe Details**
   - Click on any meal card to see full recipe
   - See all ingredients needed
   - Read step-by-step cooking instructions
   - Check meal origin and details

### 4. **Explore Random Meals**
   - Click "Random Meal" button for meal inspiration
   - Discover new recipes

## 📁 Project Structure

```
mealsapp/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable components
│   │   ├── Meals/
│   │   ├── MealDetail/
│   │   └── ...
│   ├── styles/       # CSS files
│   ├── App.jsx       # Main component
│   └── main.jsx      # Entry point
├── package.json      # Dependencies
└── vite.config.js    # Vite configuration
```

## 🎯 Key Components

- **MealsList** - Displays grid of meal cards
- **MealDetail** - Shows detailed recipe information
- **SearchBar** - Search functionality
- **CategoryFilter** - Filter meals by category
- **MealCard** - Individual meal card component

## 🔌 API Integration

The app uses **TheMealDB** - a free, open-source meal database API.

### Example API Calls:
```javascript
// Search by meal name
https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata

// Get meal by ID
https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772

// Get all categories
https://www.themealdb.com/api/json/v1/1/categories.php

// Get meals by category
https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood
```

## 🎨 Features Highlights

- **Smooth Animations** - CSS transitions and animations for better UX
- **Image Optimization** - Efficient image loading and caching
- **Error Handling** - Graceful error messages for failed requests
- **Loading States** - Visual feedback during data fetching
- **No Authentication Required** - Public API for easy access

## 🚧 Future Enhancements

- **Favorites System** - Save favorite recipes locally
- **Recipe Rating** - Rate and review meals
- **Filter by Ingredients** - Find meals by available ingredients
- **Nutrition Information** - Display calorie and nutrient data
- **Meal Planning** - Create weekly meal plans
- **Share Recipes** - Share recipes with friends via social media
- **Dark Mode** - Eye-friendly dark theme
- **Offline Support** - Service worker for offline browsing

## 🔍 Performance Optimizations

- **Vite** - Fast HMR (Hot Module Replacement) during development
- **Code Splitting** - Lazy load components for faster initial load
- **Image Lazy Loading** - Load images only when visible
- **Caching** - API response caching to reduce requests
- **Production Build** - Minified and optimized bundle

## 🌐 Live Demo

Visit the deployed app to start exploring recipes!

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

We welcome contributions! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share feedback

## 👨‍💻 Author

**Jasmeen Kaur**
- GitHub: [@meenbajwa](https://github.com/meenbajwa)
- LinkedIn: [Jasmeen Kaur](https://www.linkedin.com/in/jasmeen-kaur-bb8b86409/)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **API**: [TheMealDB](https://www.themealdb.com/) - Free meal database
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **React**: [React.js](https://react.dev/) - JavaScript library for building UIs

---

**Explore, Cook, and Enjoy! 👨‍🍳**
