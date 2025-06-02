declare var bootstrap: any;
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
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
   users: ListUsers[] = [];
  selectedUser: any = null;
  isLoading: boolean = false;
  Front_UserName = '';
  Front_RoleName = '';
  filter = '';
  Front_pageNumber = 1;
  Front_pageSize = 10;
  Front_totalPages = 0;
  editMode = 0;
  editRowId: bigint = BigInt(0);
  roles: { RoleID: number, RoleName: string }[] = [];
  reason = '';
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'info' = 'success';
  ConfirmPassword = '';
  modalInstance: any;

  constructor(private usersService: UsersService,private roleService: RoleService,private route: ActivatedRoute,
    private router: Router, private authService: AuthService, private navigationService: NavigationService,private loadingService: LoadingService) {}

  registerUser = {
      UserName: '',
      Password: '',
      RoleID: 0
  } ; 

  ngOnInit(): void {
    this.loadingService.showLoading('Cargando usuarios...')
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
    this.loadUsers();
    this.loadingService.hideLoading();
  }

  
  loadUsers(): void {
  this.isLoading = true;
  if(this.Front_pageNumber > this.Front_totalPages)
  {
    this.Front_pageNumber = 1;
  }
  this.usersService.getAllUsers(this.filter,this.Front_pageNumber,this.Front_pageSize)
    .then(data => {
      this.users = data.users;
      this.Front_totalPages = data.totalPages
      console.log("data: ",this.users)
      this.isLoading = false;
    })
    .catch(error => {
      console.error('Error al cargar usuarios', error);
      this.isLoading = false;
    });
}


  selectUser(userId: bigint): void {
    this.usersService.getUserById(userId)
      .then(user => {
        this.selectedUser = user;
      })
      .catch(error => console.error('Error al obtener usuario', error));
  }

  updateUser(): void {
    if (!this.selectedUser?.id) return;

    this.usersService.updateUser(this.selectedUser.id, this.selectedUser)
      .then(() => {
        alert('Usuario actualizado');
        this.loadUsers(); // refrescar lista
      })
      .catch(error => console.error('Error actualizando usuario', error));
  }

onSubmit(): void {
  if (this.registerUser.Password === this.ConfirmPassword && this.ConfirmPassword !== '') {
    this.usersService.registerUser(this.registerUser)
      .then(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario agregado exitosamente',
          showConfirmButton: false,
          timer: 800,
          width: '400px'  // <-- Aquí defines el ancho que quieres
        });
        // Cerrar el modal
        this.cerrarModal();
        this.loadUsers(); // Recargar la lista
      })
      .catch(error => {
        
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Error inesperado',
        showConfirmButton: false,
        timer: 800,
        width: '400px'
        });

        this.registerUser.UserName = '';
        this.registerUser.Password = '';
        this.registerUser.RoleID = 0;
        this.ConfirmPassword = '';
      });
  } else {
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Las contrasenias no coinciden, intentalo nuevamente',
    showConfirmButton: false,
    timer: 800,
    width: '400px'
    });
    this.registerUser.UserName = '';
    this.registerUser.Password = '';
    this.registerUser.RoleID = 0;
    this.ConfirmPassword = '';
  }
}

 toggleStatus(user: any) {
  user.activeStatus = user.activeStatus === 1 ? 0 : 1;

  // Envías el cambio al backend
  this.usersService.changeStatus(user.userID, user.activeStatus)
    .then(() => {
      console.log(`Usuario ${user.userName} nuevo estado: ${user.activeStatus}`);
    })
    .catch(error => {
      console.error('Error actualizando estado', error);
      // Opcional: revertir el cambio si falla la actualización
      user.activeStatus = user.activeStatus === 1 ? 0 : 1;
    });
}

goToFormMode(userID: bigint) {
  const user = this.users.find(u => u.userID === userID);
  const userWithReason = {
  ...user,
  reason: this.reason
  };

  console.log("usuario seleccionado",user)
  if (userWithReason) {
    this.selectedUser = userWithReason; 
    this.editRowId = userID;
    this.editMode = 1;
  }
}

openModal(): void {
  const modalElement = document.getElementById('agregarUsuarioModal');
  if (modalElement) {
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }
}

cerrarModal() {
  const modalEl = document.getElementById('agregarUsuarioModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
      // Mover el foco al botón que abrió el modal
      const btnOpen = document.querySelector('button[data-bs-target="#agregarUsuarioModal"]');
      if (btnOpen instanceof HTMLElement) {
        btnOpen.focus();
      }
    }
  }
}


cancelEdit() {
  this.editMode = 0;
  this.editRowId = BigInt(0);
  console.log('Editando fila con ID:', this.editRowId, 'Modo edicion: ', this.editMode);
  this.loadUsers(); 
}

saveUser() {
  if (!this.selectedUser?.userID) return;

  const requestBody = {
      userName: this.selectedUser.userName,
      newRoleID: this.selectedUser.roleID,
      reason: this.reason
    };

    console.log("Usuario Original", this.selectedUser);
    console.log("Request:", requestBody);

  this.usersService.updateUser(this.selectedUser.userID, requestBody)
    .then(() => {
      Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Informacion Actualizada correctamente',
      showConfirmButton: false,
      timer: 800,
      width: '400px'  // <-- Aquí defines el ancho que quieres
    });
      this.loadUsers(); // refresca la lista
      this.editRowId = BigInt(0);
      this.selectedUser = null;
      this.editMode = 0;
    })
    .catch(error => {
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Algo salió mal',
    showConfirmButton: false,
    timer: 800,
    width: '400px'
    });
    // this.showAlert('Error al actualizar', 'danger');
    
    this.loadUsers();
    this.editRowId = BigInt(0);
    this.selectedUser = null;
    this.editMode = 0;
    console.error('Error actualizando usuario', error);
  });
}

hasRole(roles: string[]): boolean {
  return roles.includes(this.Front_RoleName);
}

goToNextPage(){
  if (this.Front_pageNumber >= 0 && this.Front_pageNumber < this.Front_totalPages){
      this.Front_pageNumber = this.Front_pageNumber + 1;
      this.loadUsers();
  }
}

goToPreviousPage(){
  if (this.Front_pageNumber >= 2){
      this.Front_pageNumber = this.Front_pageNumber - 1;
      this.loadUsers();
  }
}

goToAdminMenu(event: Event){
  this.navigationService.goToAdminMenu(event);
}

logout(event: Event) {
    this.navigationService.logout(event);
  }

 goToUserDetail(event: Event, userid: bigint){
  this.navigationService.goToUserDetail(event,userid);
 }

goToProductsPanel(event: Event){
  this.navigationService.goToProductsPanel(event);
}

goToCategoriesPanel(event: Event){
  this.navigationService.goToCategoriesPanel(event);
}

}

export interface ListUsers {
  userID: bigint,
  userName: string,
  roleID: number,
  roleName: string,
  activeStatus: number
}

export interface PaginationUser{
  users: ListUsers[],
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}
