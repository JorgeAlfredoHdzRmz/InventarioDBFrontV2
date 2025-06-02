import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

function getLastUrl(): string {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('lastUrl') || '/login';
    }
    return '/login';
  }

export const routes: Routes = [
    {
        path: '',
        redirectTo: getLastUrl(),
        pathMatch: 'full',
    },
    {path: 'login', component: LoginComponent},
    { path: 'mainmenu', component: AdminMenuComponent },
    { path: 'registerUser', component: RegisterUserComponent },
    { path: 'userspanel', component: UsersComponent },
    { path: 'userdetail/:userid', component: UserDetailComponent },
    { path: 'productspanel', component: ProductsComponent },
    { path: 'productdetail/:productid', component: ProductDetailComponent },
    { path: 'categoriespanel', component: CategoriesComponent },
    { path: 'categorydetail/:categoryid', component: CategoryDetailComponent },
];
