// Recipe Generator Frontend JavaScript

class RecipeGenerator {
    constructor() {
        this.ingredients = [];
        this.selectedEquipment = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDropdownOptions();
        this.setupIngredientInput();
    }

    bindEvents() {
        // Form submission
        document.getElementById('recipeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateRecipe();
        });

        // Add ingredient button
        document.getElementById('addIngredient').addEventListener('click', () => {
            this.addIngredient();
        });

        // Ingredient input enter key
        document.getElementById('ingredientInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addIngredient();
            }
        });
    }

    setupIngredientInput() {
        const input = document.getElementById('ingredientInput');
        
        // Auto-focus on ingredient input
        input.focus();
        
        // Clear input on focus if placeholder text
        input.addEventListener('focus', function() {
            if (this.value === this.placeholder) {
                this.value = '';
            }
        });
    }

    async loadDropdownOptions() {
        try {
            // Load cuisine types
            const cuisines = await this.fetchAPI('/api/recipes/cuisines');
            this.populateSelect('cuisine', cuisines.data);

            // Load meal types
            const mealTypes = await this.fetchAPI('/api/recipes/meal-types');
            this.populateSelect('mealType', mealTypes.data);

            // Load dietary restrictions
            const dietary = await this.fetchAPI('/api/recipes/dietary-restrictions');
            this.populateSelect('dietaryRestrictions', dietary.data);

            // Load equipment options
            const equipment = await this.fetchAPI('/api/recipes/equipment');
            this.populateEquipmentGrid(equipment.data);

        } catch (error) {
            console.error('Error loading dropdown options:', error);
            this.showError('Failed to load options. Please refresh the page.');
        }
    }

    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    populateEquipmentGrid(equipmentList) {
        const grid = document.getElementById('equipmentGrid');
        
        equipmentList.forEach(equipment => {
            const item = document.createElement('div');
            item.className = 'equipment-item';
            item.innerHTML = `
                <input type="checkbox" id="eq_${equipment}" value="${equipment}">
                <label for="eq_${equipment}">${equipment}</label>
            `;
            
            // Add click handler for the entire item
            item.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                }
                
                this.updateEquipmentSelection(item, equipment);
            });
            
            // Add change handler for checkbox
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                this.updateEquipmentSelection(item, equipment);
            });
            
            grid.appendChild(item);
        });
    }

    updateEquipmentSelection(item, equipment) {
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        if (checkbox.checked) {
            item.classList.add('selected');
            if (!this.selectedEquipment.includes(equipment)) {
                this.selectedEquipment.push(equipment);
            }
        } else {
            item.classList.remove('selected');
            this.selectedEquipment = this.selectedEquipment.filter(eq => eq !== equipment);
        }
    }

    addIngredient() {
        const input = document.getElementById('ingredientInput');
        const ingredient = input.value.trim();
        
        if (ingredient && !this.ingredients.includes(ingredient)) {
            this.ingredients.push(ingredient);
            this.updateIngredientsDisplay();
            input.value = '';
            input.focus();
        }
    }

    removeIngredient(ingredient) {
        this.ingredients = this.ingredients.filter(ing => ing !== ingredient);
        this.updateIngredientsDisplay();
    }

    updateIngredientsDisplay() {
        const container = document.getElementById('ingredientsList');
        container.innerHTML = '';
        
        this.ingredients.forEach(ingredient => {
            const tag = document.createElement('div');
            tag.className = 'ingredient-tag';
            tag.innerHTML = `
                <span>${ingredient}</span>
                <button type="button" class="remove-ingredient" onclick="recipeGenerator.removeIngredient('${ingredient}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(tag);
        });
    }

    collectFormData() {
        return {
            ingredients: this.ingredients,
            cookingTime: parseInt(document.getElementById('cookingTime').value),
            servings: parseInt(document.getElementById('servings').value),
            difficulty: document.getElementById('difficulty').value,
            cuisine: document.getElementById('cuisine').value,
            mealType: document.getElementById('mealType').value,
            dietaryRestrictions: document.getElementById('dietaryRestrictions').value,
            equipment: this.selectedEquipment
        };
    }

    validateForm(data) {
        const errors = [];
        
        if (data.ingredients.length === 0) {
            errors.push('Please add at least one ingredient');
        }
        
        if (data.cookingTime < 5 || data.cookingTime > 480) {
            errors.push('Cooking time must be between 5 and 480 minutes');
        }
        
        if (data.servings < 1 || data.servings > 20) {
            errors.push('Servings must be between 1 and 20');
        }
        
        return errors;
    }

    async generateRecipe() {
        const formData = this.collectFormData();
        const validationErrors = this.validateForm(formData);
        
        if (validationErrors.length > 0) {
            this.showError(validationErrors.join('. '));
            return;
        }

        this.setLoadingState(true);
        this.hideError();

        try {
            const response = await this.fetchAPI('/api/recipes/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.success) {
                this.displayRecipe(response.data);
                this.scrollToRecipe();
            } else {
                throw new Error(response.error || 'Failed to generate recipe');
            }

        } catch (error) {
            console.error('Recipe generation error:', error);
            this.showError(error.message || 'Failed to generate recipe. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async fetchAPI(endpoint, options = {}) {
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    setLoadingState(loading) {
        const button = document.getElementById('generateBtn');
        
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    displayRecipe(recipe) {
        // Hide form and show result
        document.querySelector('.form-container').style.display = 'none';
        document.getElementById('recipeResult').classList.remove('hidden');

        // Basic info
        document.getElementById('recipeTitle').textContent = recipe.title || 'Generated Recipe';
        document.getElementById('recipeDescription').textContent = recipe.description || '';
        document.getElementById('recipeTotalTime').textContent = `${recipe.totalTime || recipe.cookTime} min`;
        document.getElementById('recipeServings').textContent = `${recipe.servings} servings`;
        document.getElementById('recipeDifficulty').textContent = recipe.difficulty || 'Medium';
        document.getElementById('recipeCuisine').textContent = recipe.cuisine || 'Mixed';

        // Ingredients
        this.displayIngredients(recipe.ingredients || []);

        // Equipment
        this.displayEquipment(recipe.equipment || []);

        // Instructions
        this.displayInstructions(recipe.instructions || []);

        // Tips
        this.displayTips(recipe.tips || []);

        // Nutrition
        this.displayNutrition(recipe.nutritionInfo || {});

        // Storage
        document.getElementById('recipeStorage').textContent = recipe.storage || 'Store in refrigerator';

        // Variations
        this.displayVariations(recipe.variations || []);
    }

    displayIngredients(ingredients) {
        const container = document.getElementById('recipeIngredients');
        container.innerHTML = '';

        ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            
            if (typeof ingredient === 'string') {
                li.textContent = ingredient;
            } else {
                li.innerHTML = `
                    <div>
                        <span class="ingredient-name">${ingredient.item || ingredient.name}</span>
                        ${ingredient.notes ? `<div class="ingredient-notes">${ingredient.notes}</div>` : ''}
                    </div>
                    <span class="ingredient-amount">${ingredient.amount || ''} ${ingredient.unit || ''}</span>
                `;
            }
            
            container.appendChild(li);
        });
    }

    displayEquipment(equipment) {
        const container = document.getElementById('recipeEquipment');
        container.innerHTML = '';

        equipment.forEach(item => {
            const badge = document.createElement('span');
            badge.className = 'equipment-badge';
            badge.textContent = item;
            container.appendChild(badge);
        });
    }

    displayInstructions(instructions) {
        const container = document.getElementById('recipeInstructions');
        container.innerHTML = '';

        instructions.forEach((instruction, index) => {
            const li = document.createElement('li');
            
            if (typeof instruction === 'string') {
                li.textContent = instruction;
            } else {
                li.innerHTML = `
                    <div class="instruction-text">${instruction.instruction}</div>
                    ${(instruction.time || instruction.temperature) ? `
                        <div class="instruction-meta">
                            ${instruction.time ? `<span class="instruction-time"><i class="fas fa-clock"></i> ${instruction.time}</span>` : ''}
                            ${instruction.temperature ? `<span class="instruction-temp"><i class="fas fa-thermometer-half"></i> ${instruction.temperature}</span>` : ''}
                        </div>
                    ` : ''}
                `;
            }
            
            container.appendChild(li);
        });
    }

    displayTips(tips) {
        const container = document.getElementById('recipeTips');
        container.innerHTML = '';

        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            container.appendChild(li);
        });
    }

    displayNutrition(nutrition) {
        const container = document.getElementById('recipeNutrition');
        container.innerHTML = '';

        const nutritionItems = [
            { label: 'Calories', value: nutrition.calories, key: 'calories' },
            { label: 'Protein', value: nutrition.protein, key: 'protein' },
            { label: 'Carbs', value: nutrition.carbs, key: 'carbs' },
            { label: 'Fat', value: nutrition.fat, key: 'fat' }
        ];

        nutritionItems.forEach(item => {
            if (item.value) {
                const div = document.createElement('div');
                div.className = 'nutrition-item';
                div.innerHTML = `
                    <div class="label">${item.label}</div>
                    <div class="value">${item.value}</div>
                `;
                container.appendChild(div);
            }
        });

        if (container.innerHTML === '') {
            container.innerHTML = '<p>Nutrition information not available</p>';
        }
    }

    displayVariations(variations) {
        const container = document.getElementById('recipeVariations');
        container.innerHTML = '';

        variations.forEach(variation => {
            const li = document.createElement('li');
            li.textContent = variation;
            container.appendChild(li);
        });

        if (variations.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Try adding different spices or substituting ingredients to make it your own!';
            container.appendChild(li);
        }
    }

    scrollToRecipe() {
        setTimeout(() => {
            document.getElementById('recipeResult').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        errorText.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Auto-hide error after 8 seconds
        setTimeout(() => {
            this.hideError();
        }, 8000);

        // Scroll to error
        errorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    hideError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }

    // Helper method to get form values safely
    getFormValue(id, defaultValue = '') {
        const element = document.getElementById(id);
        return element ? element.value : defaultValue;
    }

    // Helper method to set form values
    setFormValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    }
}

// Global functions for HTML onclick events
function resetForm() {
    // Show form and hide result
    document.querySelector('.form-container').style.display = 'block';
    document.getElementById('recipeResult').classList.add('hidden');
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Clear form data
    recipeGenerator.ingredients = [];
    recipeGenerator.selectedEquipment = [];
    recipeGenerator.updateIngredientsDisplay();
    
    // Reset equipment checkboxes
    const equipmentItems = document.querySelectorAll('.equipment-item');
    equipmentItems.forEach(item => {
        item.classList.remove('selected');
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
    });
    
    // Reset form fields to default values
    document.getElementById('cookingTime').value = '30';
    document.getElementById('servings').value = '4';
    document.getElementById('difficulty').value = 'Medium';
    document.getElementById('cuisine').value = '';
    document.getElementById('mealType').value = '';
    document.getElementById('dietaryRestrictions').value = '';
    document.getElementById('ingredientInput').value = '';
    
    // Focus on ingredient input
    document.getElementById('ingredientInput').focus();
    
    // Hide any error messages
    recipeGenerator.hideError();
}

function printRecipe() {
    window.print();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the recipe generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the recipe generator
    window.recipeGenerator = new RecipeGenerator();
    
    // Add some sample ingredients for demo (optional)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        recipeGenerator.ingredients = ['chicken breast', 'rice', 'broccoli'];
        recipeGenerator.updateIngredientsDisplay();
    }
});

// Handle browser back button
window.addEventListener('popstate', function(event) {
    // If user navigates back, reset to form view
    if (document.getElementById('recipeResult').classList.contains('hidden') === false) {
        resetForm();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to close recipe view and return to form
    if (event.key === 'Escape' && !document.getElementById('recipeResult').classList.contains('hidden')) {
        resetForm();
    }
    
    // Ctrl/Cmd + Enter to generate recipe
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        const form = document.getElementById('recipeForm');
        if (form.style.display !== 'none') {
            recipeGenerator.generateRecipe();
        }
    }
});

// Add some visual feedback for form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects to form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add loading animation to images (if any are added later)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// Error handling for network issues
window.addEventListener('online', function() {
    recipeGenerator.hideError();
    console.log('Network connection restored');
});

window.addEventListener('offline', function() {
    recipeGenerator.showError('Network connection lost. Please check your internet connection.');
});

// Performance optimization - lazy load non-critical resources
if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('.lazy-load');
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}