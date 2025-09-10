const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Generate recipe based on user inputs
   */
  async generateRecipe(recipeData) {
    try {
      const prompt = this.buildPrompt(recipeData);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseRecipeResponse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate recipe');
    }
  }

  /**
   * Build comprehensive prompt for Gemini
   */
  buildPrompt(data) {
    const {
      ingredients,
      cookingTime,
      difficulty,
      servings,
      dietaryRestrictions,
      cuisine,
      mealType,
      equipment
    } = data;

    return `
Create a detailed recipe with the following specifications:

INGREDIENTS: ${ingredients.join(', ')}
COOKING TIME: ${cookingTime} minutes
DIFFICULTY LEVEL: ${difficulty}
SERVINGS: ${servings}
DIETARY RESTRICTIONS: ${dietaryRestrictions || 'None'}
CUISINE TYPE: ${cuisine || 'Any'}
MEAL TYPE: ${mealType || 'Any'}
AVAILABLE EQUIPMENT: ${equipment ? equipment.join(', ') : 'Basic kitchen equipment'}

Please provide a comprehensive recipe in the following JSON format:
{
  "title": "Recipe Name",
  "description": "Brief description of the dish",
  "prepTime": "preparation time in minutes",
  "cookTime": "cooking time in minutes",
  "totalTime": "total time in minutes",
  "servings": "number of servings",
  "difficulty": "Easy/Medium/Hard",
  "cuisine": "cuisine type",
  "ingredients": [
    {
      "item": "ingredient name",
      "amount": "quantity",
      "unit": "measurement unit",
      "notes": "optional preparation notes"
    }
  ],
  "equipment": ["list of required equipment"],
  "instructions": [
    {
      "step": 1,
      "instruction": "detailed step instruction",
      "time": "time for this step if applicable",
      "temperature": "temperature if applicable"
    }
  ],
  "tips": ["cooking tips and tricks"],
  "nutritionInfo": {
    "calories": "estimated calories per serving",
    "protein": "protein content",
    "carbs": "carbohydrate content",
    "fat": "fat content"
  },
  "storage": "storage instructions",
  "variations": ["possible recipe variations"]
}

Make sure the recipe is practical, uses the provided ingredients as main components, and can be completed within the specified time frame. Include detailed cooking instructions and helpful tips.
`;
  }

  /**
   * Parse and validate Gemini response
   */
  parseRecipeResponse(text) {
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonString = jsonMatch[0];
      const recipe = JSON.parse(jsonString);

      // Validate required fields
      const requiredFields = ['title', 'ingredients', 'instructions'];
      for (const field of requiredFields) {
        if (!recipe[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return recipe;
    } catch (error) {
      console.error('Parse error:', error);
      // Return a fallback structure if parsing fails
      return this.createFallbackRecipe(text);
    }
  }

  /**
   * Create fallback recipe structure when parsing fails
   */
  createFallbackRecipe(rawText) {
    return {
      title: "Custom Recipe",
      description: "Generated recipe based on your ingredients",
      prepTime: "15",
      cookTime: "30",
      totalTime: "45",
      servings: "4",
      difficulty: "Medium",
      cuisine: "Mixed",
      ingredients: [],
      equipment: ["Basic kitchen equipment"],
      instructions: [
        {
          step: 1,
          instruction: rawText || "Follow the cooking instructions based on your ingredients.",
          time: "",
          temperature: ""
        }
      ],
      tips: ["Adjust seasoning to taste", "Cook until done"],
      nutritionInfo: {
        calories: "Varies",
        protein: "Varies",
        carbs: "Varies",
        fat: "Varies"
      },
      storage: "Store in refrigerator for up to 3 days",
      variations: ["Add your favorite spices", "Substitute ingredients as needed"]
    };
  }

  /**
   * Validate recipe input data
   */
  validateInput(data) {
    const errors = [];

    if (!data.ingredients || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
      errors.push('At least one ingredient is required');
    }

    if (!data.cookingTime || data.cookingTime < 5 || data.cookingTime > 480) {
      errors.push('Cooking time must be between 5 and 480 minutes');
    }

    if (!data.servings || data.servings < 1 || data.servings > 20) {
      errors.push('Servings must be between 1 and 20');
    }

    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (data.difficulty && !validDifficulties.includes(data.difficulty)) {
      errors.push('Difficulty must be Easy, Medium, or Hard');
    }

    return errors;
  }
}

module.exports = new GeminiService();