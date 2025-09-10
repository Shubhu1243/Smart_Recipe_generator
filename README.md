# AI Recipe Generator

A modern, responsive web application that generates personalized recipes using Google's Gemini AI based on your available ingredients, cooking preferences, and dietary restrictions.

## 🌟 Features

- **Intelligent Recipe Generation**: Uses Google Gemini AI to create detailed, personalized recipes
- **Flexible Input Options**: Add ingredients, set cooking time, difficulty, cuisine preferences
- **Dietary Restrictions**: Support for vegetarian, vegan, gluten-free, and other dietary needs
- **Equipment-Based Recipes**: Generates recipes based on your available kitchen equipment
- **Detailed Recipe Information**: Includes prep time, cooking instructions, tips, and nutritional info
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Print-Friendly**: Clean print layout for saving physical copies

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- Google Gemini API key

### Installation

1. **Clone or download the project files**
```bash
mkdir recipe-generator
cd recipe-generator
```

2. **Create the project structure and copy all the provided files**

3. **Install dependencies**
```bash
npm install
```

4. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

5. **Start the development server**
```bash
npm run dev
```
or
```bash
npm start
```

6. **Open your browser**
   - Navigate to `http://localhost:3000`

## 🔧 Project Structure

```
recipe-generator/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (create this)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── README.md                # This file
├── controllers/
│   └── recipeController.js  # Route handlers
├── services/
│   └── geminiService.js     # Gemini AI integration
├── routes/
│   └── recipeRoutes.js      # API routes
├── middleware/
│   ├── errorHandler.js      # Error handling
│   └── asyncHandler.js      # Async wrapper
└── public/
    ├── index.html           # Frontend HTML
    ├── styles.css           # Styling
    └── app.js              # Frontend JavaScript
```

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env` file

## 📱 Usage

1. **Add Ingredients**: Type ingredients and press Enter or click the + button
2. **Set Preferences**: Choose cooking time, servings, difficulty level
3. **Select Options**: Pick cuisine type, meal type, dietary restrictions
4. **Choose Equipment**: Select available kitchen equipment
5. **Generate Recipe**: Click "Generate Recipe" and wait for AI magic!
6. **View Results**: Get detailed recipe with instructions, tips, and nutrition info

## 🔌 API Endpoints

- `POST /api/recipes/generate` - Generate a recipe
- `GET /api/recipes/cuisines` - Get available cuisine types
- `GET /api/recipes/meal-types` - Get meal types
- `GET /api/recipes/dietary-restrictions` - Get dietary restriction options
- `GET /api/recipes/equipment` - Get kitchen equipment options
- `POST /api/recipes/validate` - Validate recipe input

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts.

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## 📋 Input Validation

The application validates:
- At least one ingredient required
- Cooking time: 5-480 minutes
- Servings: 1-20 people
- Proper difficulty levels: Easy, Medium, Hard

## 🔒 Security Features

- Helmet.js for security headers
- CORS enabled for cross-origin requests
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- Error handling middleware

## 🎨 Frontend Features

- **Responsive Design**: Mobile-first approach
- **Interactive UI**: Real-time ingredient management
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Print Support**: Clean print layouts
- **Keyboard Shortcuts**: 
  - `Escape`: Return to form from recipe view
  - `Ctrl/Cmd + Enter`: Generate recipe

## 🚀 Deployment

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Add your Gemini API key to hosting platform's environment variables
3. Ensure `PORT` is set correctly for your hosting platform

### Recommended Platforms
- **Heroku**: Easy deployment with git
- **Railway**: Modern deployment platform
- **Render**: Free tier available
- **Vercel**: Great for full-stack applications

## 🔧 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **API key not working**
   - Verify the key is correct in `.env`
   - Ensure no spaces around the key
   - Restart the server after adding the key

3. **Port already in use**
   - Change `PORT` in `.env` to a different number
   - Kill the process using the port: `lsof -ti:3000 | xargs kill`

4. **Recipe generation fails**
   - Check your Gemini API key is valid
   - Verify you have an active internet connection
   - Check the browser console for error messages

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🙏 Acknowledgments

- Google Gemini AI for recipe generation
- Express.js for the web framework
- Font Awesome for icons
- Modern CSS Grid and Flexbox for layouts

## 📞 Support

If you encounter any issues:
1. Check this README for troubleshooting steps
2. Verify all dependencies are installed correctly
3. Ensure your Gemini API key is valid
4. Check the browser console for error messages

---

**Enjoy creating amazing recipes with AI! 🍳✨**
