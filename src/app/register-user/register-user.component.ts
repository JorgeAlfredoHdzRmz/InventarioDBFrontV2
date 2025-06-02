import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { RoleService } from '../role.service';
import { NavigationService } from '../shared/navigation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  user = {
    UserName: '',
    Password: '',
    RoleID: 0
  };

  ConfirmPassword = '';

  roles: { RoleID: number, RoleName: string }[] = [];

  constructor(private userService: UsersService, private router: Router,private roleService: RoleService,private navigationService: NavigationService) {}

  onSubmit(): void {
    if(this.user.Password == this.ConfirmPassword && this.ConfirmPassword != ''){
      this.userService.registerUser(this.user)
      .then(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro exitoso',
          showConfirmButton: false,
          timer: 800,
          width: '400px'  // <-- Aquí defines el ancho que quieres
        });
        this.navigationService.successRegister();
      })
      .catch(error => {
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error inesperado, intentalo nuevamente',
        showConfirmButton: false,
        timer: 800,
        width: '400px'
        });
      });
    }
    else
    {
      Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No coinciden los password, intentalo nuevamente',
      showConfirmButton: false,
      timer: 800,
      width: '400px'
      });
      this.user.UserName = '';
      this.user.Password = '';
      this.user.RoleID = 0;
      this.ConfirmPassword = '';
    }
  }

  ngOnInit(): void {
    this.roleService.getRoles()
      .then(data => {
        this.roles = data;
      })
      .catch(error => {
        console.error('Error al cargar roles:', error);
      });
  }

  goToLogin(event: Event) {
    this.navigationService.goToLogin(event);
  }
}
