import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from 'rxjs/operators';

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ) { }

    storeRecipes() {
        // .json is required by firebase
        const recipes = this.recipeService.getRecipes();
        this.http
            .put('https://ng-course-recipe-book-c241a-default-rtdb.firebaseio.com/recipes.json', recipes)
            .subscribe(res => {
                console.log(res);
            });
    }

    fetchRecipes() {
        return this.http
            // Firebase requires a query param for the token;
            /* can be added with ('...json?auth=' + user.token)
            or pass in an object as the second argument as
            { params: new HttpParams().set('auth', user.token) } */
            .get<Recipe[]>('https://ng-course-recipe-book-c241a-default-rtdb.firebaseio.com//recipes.json?')
            .pipe(map(recipes => {
                console.log('rxjs MAP', recipes);
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }), tap(recipes => {
                this.recipeService.setRecipes(recipes);
            }));
    }
}