import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
export const appRoutes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "login", component: LoginComponent},
    {path:"products", component: ProductComponent},
    {path:"cart",component:CartComponent},
    {path: "", redirectTo:'/login',pathMatch:'full'},
];
