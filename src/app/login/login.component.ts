import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../shared/navigation.service';
import { every } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  UserName: string = "";
  Password: string = "";

  constructor(private authService: AuthService, private router: Router, private navigationService: NavigationService,
      private loadingService: LoadingService){}

  async onLogin(){
    try {
      this.loadingService.showLoading('Ingresando...');
      await this.authService.login(this.UserName, this.Password);
      this.navigationService.successLogin();
      this.loadingService.hideLoading();
      this.UserName = '';
      this.Password = '';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error, favor revisar los datos ingresados',
        showConfirmButton: false,
        timer: 800,
        width: '400px'
        });
      this.Password = '';
    }
  }

  goRegisterForm(event: Event){
    this.navigationService.goRegisterForm(event);
  }
}
