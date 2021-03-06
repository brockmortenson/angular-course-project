import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports: [
        // path changed from 'shopping-list' to empty for lazy loading
        // (same in recipes and shopping list modules)
        RouterModule.forChild([{ path: '', component: ShoppingListComponent }]),
        FormsModule,
        SharedModule,
    ]
})
export class ShoppingListModule { }