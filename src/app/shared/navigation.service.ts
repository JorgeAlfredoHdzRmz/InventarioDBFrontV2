import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router, private authService: AuthService) {}

  goRegisterForm(event: Event){
    event.preventDefault(); // Evita que el navegador recargue la página
    this.router.navigate(['/registerUser']);
  }

  successLogin(): void { //cuando un usuario se loguea correctamente
    this.router.navigate(['/mainmenu']);
  }

  goToLogin(event: Event) {
    event.preventDefault(); // Evita que el navegador recargue la página
    this.router.navigate(['/login']); // Realiza la redirección
  }

  successRegister(): void { //cuando un usuario se registra correctamente
    this.router.navigate(['/login']);
  }

  goToAdminMenu(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/mainmenu']);
  }

  goToProductsPanel(event: Event){
    event.preventDefault(); // Evita que el navegador recargue la página
    this.router.navigate(['/productspanel']);
  }

  goToUsersPanel(event: Event){
  event.preventDefault(); // Evita que el navegador recargue la página
  this.router.navigate(['/userspanel']);
  }

  goToCategoriesPanel(event: Event){
  event.preventDefault(); // Evita que el navegador recargue la página
  this.router.navigate(['/categoriespanel']);
  }

  goToUserDetail(event: Event, userid: bigint){
    event.preventDefault(); // Evita que el navegador recargue la página
    this.router.navigate([`/userdetail/${userid}`]);
  }

  goToProductDetail(event: Event, productid: number){
    event.preventDefault(); // Evita que el navegador recargue la página
    this.router.navigate([`/productdetail/${productid}`]);
  }

  goToCategoryDetail(event: Event, categoryId: bigint){
    event.preventDefault(); // Evita que el navegador recargue la página
    this.router.navigate([`/categorydetail/${categoryId}`]);
  }

  logout(event: Event) {
    event.preventDefault(); // Evita que el navegador recargue la página
    this.authService.logout();
    this.router.navigate(['/login']); // Realiza la redirección
  }

  

  
}