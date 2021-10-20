import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
      
    // private recipes: Recipe[] = [
    //     new Recipe('A test recipe', 'This is a test', 'https://i.guim.co.uk/img/media/bb0e4ef9f335c2a2daa2c2a8f20948fcc5c6caee/0_3838_5955_3573/master/5955.jpg?width=300&quality=85&auto=format&fit=max&s=499f1c644c6e0f10aa433f34a2791971',
    //     [
    //         new Ingredient('Meat', 1),
    //         new Ingredient('Milk', 14)
    //     ]),
    //     new Recipe('also a test', 'just some food', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/210510-cl-fooddigital0696-1620844202.jpg?crop=0.913xw:0.731xh;0.0721xw,0.177xh&resize=640:*',
    //     [
    //         new Ingredient('Bread', 10),
    //         new Ingredient('Cheese', 3)
    //     ])
    //   ];

    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }
    
    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}