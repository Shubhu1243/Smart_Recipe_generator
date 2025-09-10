const geminiService = require('../services/geminiService');
const { asyncHandler } = require('../middleware/asyncHandler');

/**
 * Generate recipe using Gemini API
 */
const generateRecipe = asyncHandler(async (req, res) => {
  const recipeData = req.body;

  // Validate input
  const validationErrors = geminiService.validateInput(recipeData);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validationErrors
    });
  }

  try {
    console.log('Generating recipe with data:', recipeData);
    const recipe = await geminiService.generateRecipe(recipeData);
    
    res.json({
      success: true,
      data: recipe,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recipe generation error:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recipe',
      message: error.message,
      details: error.stack
    });
  }
});

/**
 * Get available cuisine types
 */
const getCuisineTypes = (req, res) => {
  const cuisines = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'Thai',
    'French', 'Mediterranean', 'American', 'Korean', 'Vietnamese',
    'Middle Eastern', 'Greek', 'Spanish', 'German', 'British',
    'Russian', 'Brazilian', 'Moroccan', 'Ethiopian'
  ];

  res.json({
    success: true,
    data: cuisines
  });
};

/**
 * Get meal types
 */
const getMealTypes = (req, res) => {
  const mealTypes = [
    'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack', 
    'Dessert', 'Appetizer', 'Side Dish', 'Soup', 'Salad'
  ];

  res.json({
    success: true,
    data: mealTypes
  });
};

/**
 * Get dietary restrictions
 */
const getDietaryRestrictions = (req, res) => {
  const restrictions = [
    'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Nut-Free', 'Low-Carb', 'Keto', 'Paleo', 'Low-Sodium',
    'Diabetic-Friendly', 'Heart-Healthy', 'Halal', 'Kosher'
  ];

  res.json({
    success: true,
    data: restrictions
  });
};

/**
 * Get equipment types
 */
const getEquipmentTypes = (req, res) => {
  const equipment = [
    'Oven', 'Stovetop', 'Microwave', 'Slow Cooker', 'Pressure Cooker',
    'Air Fryer', 'Grill', 'Blender', 'Food Processor', 'Stand Mixer',
    'Hand Mixer', 'Toaster', 'Rice Cooker', 'Wok', 'Cast Iron Pan',
    'Non-stick Pan', 'Baking Sheet', 'Dutch Oven', 'Steamer'
  ];

  res.json({
    success: true,
    data: equipment
  });
};

/**
 * Validate recipe input without generating
 */
const validateRecipeInput = (req, res) => {
  const validationErrors = geminiService.validateInput(req.body);
  
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      valid: false,
      errors: validationErrors
    });
  }

  res.json({
    success: true,
    valid: true,
    message: 'Input is valid'
  });
};

module.exports = {
  generateRecipe,
  getCuisineTypes,
  getMealTypes,
  getDietaryRestrictions,
  getEquipmentTypes,
  validateRecipeInput
};