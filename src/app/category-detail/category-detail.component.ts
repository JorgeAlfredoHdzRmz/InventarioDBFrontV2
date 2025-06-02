import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CategoryService } from '../category.service';
import { LoadingService } from '../loading.service';
import { ProductService } from '../product.service';
import { RoleService } from '../role.service';
import { NavigationService } from '../shared/navigation.service';
import { UsersService } from '../users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent {

    categoryId = BigInt(0);
    Front_UserName = '';
    Front_RoleName = '';
    category!: CategoryResponseDTO;
    products: Product[] = [];
    roles: { RoleID: number, RoleName: string }[] = [];

    constructor(private usersService: UsersService,private roleService: RoleService,private route: ActivatedRoute,
    private router: Router, private authService: AuthService,
    private categoryService: CategoryService, private productService: ProductService, private navigationService: NavigationService,private loadingService: LoadingService) {}

    ngOnInit(): void{
        this.loadingService.showLoading('Cargando informacion de la categoria...')
        console.log('inicio')
        const categoryIDParam = this.route.snapshot.paramMap.get('categoryid') ?? '0';
        this.categoryId = BigInt(categoryIDParam);
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
        this.loadCategoryDetail();
        this.loadingService.hideLoading();
    }

    loadCategoryDetail(){
    console.log("info")
    this.categoryService.getCategoryDetail(this.categoryId).then(response =>{
      this.category = response;
      this.products = response.productos;
    }).catch(error => {
      console.error('Error al obtener detalle:', error);
    });
    console.log("Categoria: ",this.category);
    console.log("Productos: ",this.products);
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

export interface Product{
  productId: bigint;
  productName: string;
  productSKU: string;
}

export interface CategoryResponseDTO{
  categoryId: bigint;
  categoryName: string;
  description: string;
  categorySKU: string;
  cantidadProductos: number;
  productos: Product[];
}
