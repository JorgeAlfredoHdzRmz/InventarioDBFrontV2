import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminMenuService } from '../admin-menu.service';
import { NavigationService } from '../shared/navigation.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent implements OnInit {
  Front_UserName = '';
  Front_RoleName = '';
  Front_UserID = BigInt(0);
  changePassword = 0;
  Front_Password = '';
  Front_ConfirmPasword = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private adminMenuService: AdminMenuService,
    private navigationService: NavigationService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
  this.adminMenuService.getUserInfo()
    .then(data => {
      this.Front_UserID = data.user.userId;
      this.Front_UserName = data.user.userName; //se extrae lo devuelto del servicio
      this.Front_RoleName = data.user.roleName; //se extrae lo devuelto del servicio
      console.log("Usuario:", this.Front_UserName); //se muestra la variable
      console.log("Rol:", this.Front_RoleName); //se muestra la variable
      console.log("UserID: ",this.Front_UserID)
    })
    .catch(error => {
      console.error("Error al obtener datos del usuario:", error);
    });
}

infoProfile(){
  console.log('Perfil informativo')
  this.changePassword = 1;
}

closeProfile(){
  console.log('Cerrar modal')
  this.changePassword = 0;
}

updatePassword(){
  console.log('1');
  if(this.Front_ConfirmPasword === this.Front_Password)
  {
      // console.log(this.Front_Password);
      // console.log(this.Front_UserID);
      this.usersService.changePassword(this.Front_Password).then(data =>
         Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Cambio realizado exitosamente',
          showConfirmButton: false,
          timer: 1000,
          width: '400px'  // <-- Aquí defines el ancho que quieres
        })
        
      ).catch(error => {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error inesperado, intentalo nuevamente',
            showConfirmButton: false,
            timer: 800,
            width: '400px'
            });
      });
      this.Front_Password = '';
      this.Front_ConfirmPasword = '';
      this.changePassword = 0;
  }
  else
  {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords no coinciden, intentalo nuevamente',
        showConfirmButton: false,
        timer: 1000,
        width: '400px'
        });
      this.Front_Password = '';
      this.Front_ConfirmPasword = '';
      this.changePassword = 0;
  }
}

hasRole(roles: string[]): boolean {
  return roles.includes(this.Front_RoleName);
}

logout(event: Event) {
    this.navigationService.logout(event);
  }


goToUsersPanel(event: Event){
  this.navigationService.goToUsersPanel(event);
}

goToProductsPanel(event: Event){
  this.navigationService.goToProductsPanel(event);
}

goToCategoriesPanel(event: Event){
  this.navigationService.goToCategoriesPanel(event);
}
}
