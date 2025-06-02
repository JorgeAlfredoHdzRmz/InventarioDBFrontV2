declare var bootstrap: any;
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { UsersService } from '../users.service';
import { RoleService } from '../role.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { CategoryService } from '../category.service';
import { NavigationService } from '../shared/navigation.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
    constructor(private usersService: UsersService,private productService: ProductService,private roleService: RoleService,private route: ActivatedRoute,
        private router: Router, private authService: AuthService, private categoryService: CategoryService, private navigationService: NavigationService,
      private loadingService: LoadingService) {}

  //json de registro
    registerProduct = {
    productName: '',
    price: 0,
    availableStock: 0,
    productSKU: '',
    categoryID: 0
  };

  //json actualizar producto
  updateProduct = {
    productName: '',
    price: 0,
    productSKU: ''
  };

  selectedProduct: Product  = 
  { activeStatus: 0,
    availableStock: 0,
    categoryID: 0,
    categoryName: '',
    price: 0,
    productId: 0,
    productName: '',
    productSKU: '',
    registrationDate: ''
   };

  modalInstance: any;
  filter = '';
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  Front_UserName = '';
  Front_RoleName = '';
  // products: {
  // activeStatus: number;
  // availableStock: number;
  // categoryID: number;
  // categoryName: string;
  // price: number;
  // productId: null;
  // productName: string;
  // productSKU: string;
  // registrationDate: string;
  // }[] = [];
  products: Product[] = [];

  roles: { RoleID: number, RoleName: string }[] = [];
  categories: { CategoryID: number, CategoryName: string }[] = [];
  
  editMode = 0;
  editRowId: number | null = null;
  FRONT_AddedStock = 0;

  ngOnInit(): void{
    this.loadingService.showLoading('Cargando Productos...');
    console.log("inicio");
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

    this.categoryService.getCategories()
    .then(data => {
      this.categories = data;
    })
    .catch(error => {
        console.error('Error al cargar categorias:', error);
      });
    
    this.loadProducts();
    this.loadingService.hideLoading();
  }

  openModal(): void {
  const modalElement = document.getElementById('agregarProductoModal');
  if (modalElement) {
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }
}

cerrarModal() {
  const modalEl = document.getElementById('agregarProductoModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
      // Mover el foco al botón que abrió el modal
      const btnOpen = document.querySelector('button[data-bs-target="#agregarProductoModal"]');
      if (btnOpen instanceof HTMLElement) {
        btnOpen.focus();
      }
    }
  }
}


  loadProducts(){
    this.productService.getAllProducts(this.filter,this.pageNumber,this.pageSize)
    .then(data => {
      this.products =  data.products;
      this.totalPages = data.totalPages
    })
    .catch(error => {
      console.error("error: ", error);
    })
  }

  goToNextPage(){
    if (this.pageNumber >= 0 && this.pageNumber < this.totalPages){
        this.pageNumber = this.pageNumber + 1;
        this.loadProducts();
    }
  }

  goToPreviousPage(){
    if (this.pageNumber >= 2){
        this.pageNumber = this.pageNumber - 1;
        this.loadProducts();
    }
  }

  hasRole(roles: string[]): boolean {
  return roles.includes(this.Front_RoleName);
}

  toggleStatus(product: Product) {
  product.activeStatus = product.activeStatus === 1 ? 0 : 1;

  this.productService.changeStatus(product.productId, product.activeStatus)
    .then(() => {
      console.log(`Usuario ${product.productName} nuevo estado: ${product.activeStatus}`);
    })
    .catch(error => {
      console.error('Error actualizando estado', error);
      product.activeStatus = product.activeStatus === 1 ? 0 : 1;
    });
}

  onSubmit(): void{
    this.productService.registerProduct(this.registerProduct)
    .then(() => {
      Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Producto agregado exitosamente',
                showConfirmButton: false,
                timer: 800,
                width: '400px'  // <-- Aquí defines el ancho que quieres
              });
              this.cerrarModal();
              this.loadProducts();
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
    
            this.registerProduct.productName = '';
            this.registerProduct.price = 0,
            this.registerProduct.availableStock = 0,
            this.registerProduct.productSKU = '',
            this.registerProduct.categoryID = 0
            this.loadProducts();
          });
          
  }

  goToFormMode(productID: number) {
  console.log(this.products)
  const product = this.products.find(p => p.productId === productID);
  console.log("producto seleccionado",product)
  if (product) {
    this.selectedProduct = product; 
    this.editRowId = productID;
    this.editMode = 1;
  }
}

cancelEdit() {
  this.editMode = 0;
  this.editRowId = null;
  console.log('Editando fila con ID:', this.editRowId, 'Modo edicion: ', this.editMode);
  this.loadProducts(); 
}

saveProduct() {
  console.log('Guardando producto...');
  if (!this.selectedProduct?.productId) return;

  const requestBody = {
      productName: this.selectedProduct.productName,
      price: this.selectedProduct.price,
      productSKU: this.selectedProduct.productSKU
    };

    const changeCategoryBody = {
      newCategoryID: this.selectedProduct.categoryID //825
    };

    const updateStock = {
      addedStock: this.FRONT_AddedStock
    };

    console.log("Producto Original", this.selectedProduct);
    console.log("Request:", requestBody);
    console.log("Request Cambio Categoria", changeCategoryBody);
    console.log("Request Cambio Stock", updateStock);
  
  this.productService.changeCategory(this.selectedProduct.productId,changeCategoryBody);
  this.productService.updateStock(this.selectedProduct.productId,updateStock);  
  this.productService.updateProduct(this.selectedProduct.productId, requestBody)
    .then(() => {
      Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Informacion Actualizada correctamente',
      showConfirmButton: false,
      timer: 2000,
      width: '400px'  // <-- Aquí defines el ancho que quieres
    });
      this.loadProducts(); // refresca la lista
      this.FRONT_AddedStock = 0;
      this.editRowId = null;
      this.selectedProduct = { activeStatus: 0,
        availableStock: 0,
        categoryID: 0,
        categoryName: '',
        price: 0,
        productId: 0,
        productName: '',
        productSKU: '',
        registrationDate: ''
      };
      this.editMode = 0;
    })
    .catch(error => {
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Algo salió mal',
    showConfirmButton: false,
    timer: 2000,
    width: '400px'
    });
    // this.showAlert('Error al actualizar', 'danger');
    
    this.loadProducts();
    this.FRONT_AddedStock = 0;
    this.editRowId = null;
    this.selectedProduct = { activeStatus: 0,
        availableStock: 0,
        categoryID: 0,
        categoryName: '',
        price: 0,
        productId: 0,
        productName: '',
        productSKU: '',
        registrationDate: ''
      };
    this.editMode = 0;
    console.error('Error actualizando producto', error);
  });
}

goToAdminMenu(event: Event){
  this.navigationService.goToAdminMenu(event);
}

goToUsersPanel(event: Event){
  this.navigationService.goToUsersPanel(event);
}

goToCategoriesPanel(event:Event){
  this.navigationService.goToCategoriesPanel(event);
}

logout(event: Event) {
    this.navigationService.logout(event);
  }

 goToProductDetail(event: Event, productid: number){
  this.navigationService.goToProductDetail(event,productid);
}


}

export interface Product {
  activeStatus: number;
  availableStock: number;
  categoryID: number;
  categoryName: string;
  price: number;
  productId: number;
  productName: string;
  productSKU: string;
  registrationDate: string;
}