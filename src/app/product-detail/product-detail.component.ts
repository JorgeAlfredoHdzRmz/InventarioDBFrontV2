import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { RoleService } from '../role.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { CategoryService } from '../category.service';
import { ProductService } from '../product.service';
import { NavigationService } from '../shared/navigation.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  productId = 0;
  Front_UserName = '';
  Front_RoleName = '';
  Front_Status = '';

  product!: ProductTransactionResponse;
  transactions: Transaction[] = [];
  roles: { RoleID: number, RoleName: string }[] = [];

  constructor(private usersService: UsersService,private roleService: RoleService,private route: ActivatedRoute,
    private router: Router, private authService: AuthService,
  private categoryService: CategoryService, private productService: ProductService, private navigationService: NavigationService,private loadingService: LoadingService) {}

  ngOnInit(): void{
    this.loadingService.showLoading('Cargando informacion del producto...')
    console.log('inicio')
    const productIDParam = this.route.snapshot.paramMap.get('productid');
    this.productId = Number(productIDParam);
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
    this.loadProductDetail();
    this.loadingService.hideLoading();
  };

  loadProductDetail(){
    console.log("info")
    this.productService.getProductDetail(this.productId).then(response =>{
      this.product = response;
      this.transactions = response.transacciones;
      if(this.product.activeStatus === 0){
          this.Front_Status = 'Inactivo'
      }
      if(this.product.activeStatus === 1){
          this.Front_Status = 'Activo'
      }
    }).catch(error => {
      console.error('Error al obtener detalle:', error);
    });
    console.log(this.product);
    console.log(this.transactions);
  }

  hasRole(roles: string[]): boolean {
  return roles.includes(this.Front_RoleName);
}

  goToProductsPanel(event: Event){
  this.navigationService.goToProductsPanel(event);
}

 goToUsersPanel(event: Event){
  this.navigationService.goToUsersPanel(event);
}

 goToCategoriesPanel(event: Event){
      this.navigationService.goToCategoriesPanel(event);
    }

logout(event: Event) {
    this.navigationService.logout(event);
  }

goToAdminMenu(event: Event){
      this.navigationService.goToAdminMenu(event);
    }
}

export interface Transaction {
  transactionID: number;
  operationName: string;
  userID: number;
  userName: string;
  transactionDateTime: string;
  quantity: number;
}

export interface ProductTransactionResponse {
  productId: number;
  productName: string;
  price: number;
  registrationDate: string;
  activeStatus: number;
  productSKU: string;
  categoryName: string;
  cantidadTransacciones: number;
  transacciones: Transaction[];
}

