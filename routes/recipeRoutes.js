
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

console.log('Routes file loaded'); // Add this line
console.log('Controller loaded:', typeof recipeController.generateRecipe); // Add this line

// POST /api/recipes/generate
router.post('/generate', recipeController.generateRecipe);
console.log('Generate route registered'); // Add this line

// POST /api/recipes/generate
router.post('/generate', recipeController.generateRecipe);

// GET /api/recipes/cuisines
router.get('/cuisines', recipeController.getCuisineTypes);

// GET /api/recipes/meal-types
router.get('/meal-types', recipeController.getMealTypes);

// GET /api/recipes/dietary-restrictions
router.get('/dietary-restrictions', recipeController.getDietaryRestrictions);

// GET /api/recipes/equipment
router.get('/equipment', recipeController.getEquipmentTypes);

// POST /api/recipes/validate
router.post('/validate', recipeController.validateRecipeInput);

module.exports = router;