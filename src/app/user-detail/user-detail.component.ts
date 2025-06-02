import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { RoleService } from '../role.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { NavigationService } from '../shared/navigation.service';
import { LoadingService } from '../loading.service';
@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
    userid = 0;
    Front_UserName = '';
    Front_RoleName = '';
    Front_Status = '';
    user!: UserTransactionResponse;
    transactions: Transaction[] = [];
    
    roles: { RoleID: number, RoleName: string }[] = [];
    constructor(private usersService: UsersService,private roleService: RoleService,private route: ActivatedRoute,
    private router: Router, private authService: AuthService, private navigationService: NavigationService,private loadingService: LoadingService) {}

    ngOnInit(): void {
      this.loadingService.showLoading('Cargando Perfil de Usuario...')
      const userIDParam = this.route.snapshot.paramMap.get('userid');
      this.userid = Number(userIDParam);
      this.roleService.getRoles()
      .then(data => {
        this.roles = data;
      })
      .catch(error => {
        console.error('Error al cargar roles:', error);
      });
      this.usersService.getUserInfo()
    .then(data => {
      this.Front_UserName = data.user.userName; //se extrae lo devuelto del servicio
      this.Front_RoleName = data.user.roleName; //se extrae lo devuelto del servicio
      console.log("Usuario:", this.Front_UserName); //se muestra la variable
      console.log("Rol:", this.Front_RoleName); //se muestra la variable
    })
    .catch(error => {
      console.error("Error al obtener datos del usuario:", error);
    });
    this.loadUserDetail();
    this.loadingService.hideLoading();
    }

    loadUserDetail(){
      console.log("info");
      this.usersService.getUserDetail(this.userid).then(response => {
      this.user = response;
      this.transactions = response.transacciones;
      if(this.user.activeStatus === 0){
          this.Front_Status = 'Inactivo'
      }
      if(this.user.activeStatus === 1){
          this.Front_Status = 'Activo'
      }
    }).catch(error => {
      console.error('Error al obtener transacciones:', error);
    });

    console.log(this.user);
    console.log(this.transactions);
    }

    hasRole(roles: string[]): boolean {
  return roles.includes(this.Front_RoleName);
}

    goToAdminMenu(event: Event){
     this.navigationService.goToAdminMenu(event);
    }

    logout(event: Event) {
        this.navigationService.logout(event);
      }

      goToProductsPanel(event: Event){
      this.navigationService.goToProductsPanel(event);
    }

    goToUsersPanel(event: Event){
      this.navigationService.goToUsersPanel(event)
    }
}

export interface Transaction {
  transactionID: number;
  operationName: string;
  productID: number;
  productName: string;
  transactionDateTime: string; // o Date si lo parseas
  quantity: number;
}

export interface UserTransactionResponse {
  userID: number;
  userName: string;
  roleName: string;
  activeStatus: number;
  cantidadTransacciones: number;
  transacciones: Transaction[];
}
