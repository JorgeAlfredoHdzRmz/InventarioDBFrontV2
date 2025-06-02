declare var bootstrap: any;
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CategoryService } from '../category.service';
import { LoadingService } from '../loading.service';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import { RoleService } from '../role.service';
import { NavigationService } from '../shared/navigation.service';
import { UsersService } from '../users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  filter = '';
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  Front_UserName = '';
  Front_RoleName = '';
  Front_categories: ListCategory[] = [];
  categories: Category[] = [];
  roles: { RoleID: number, RoleName: string }[] = [];
  editMode = 0;
  editRowId: bigint | null = null;
  modalInstance: any;
  isSidebarVisible: number = 1;

  // paginationCategory: PaginationCategory = {
  //   filter: '',
  //   pageNumber: 0,
  //   pageSize: 0
  // }

  selectedCategory: Category = {
    categoryId: BigInt(0),
    categoryName: '',
    description: '',
    categorySKU: ''
  }

  registerCategory: RegisterCategory ={
    categoryName: '',
    description: '',
    categorySKU: ''
  }
  
      constructor(private usersService: UsersService,private productService: ProductService,private roleService: RoleService,private route: ActivatedRoute,
      private router: Router, private authService: AuthService, private categoryService: CategoryService, private navigationService: NavigationService,
      private loadingService: LoadingService) {}

      ngOnInit(): void{
          this.loadingService.showLoading('Cargando Categorias...');
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
          this.loadCategories();
          this.loadingService.hideLoading();    
      }

      loadCategories(){
        this.categoryService.loadCategories(this.filter,this.pageNumber,this.pageSize)
        .then(data => {
          this.Front_categories = data.categories
          this.totalPages = data.totalPages
          console.log("data: ",this.Front_categories)
        })
        .catch(error => {
          console.error("error: ", error);
        })
      }

      goToNextPage(){
        if (this.pageNumber >= 0 && this.pageNumber < this.totalPages){
            this.pageNumber = this.pageNumber + 1;
            this.loadCategories();
        }
      }

      goToPreviousPage(){
        if (this.pageNumber >= 2){
            this.pageNumber = this.pageNumber - 1;
            this.loadCategories();
        }
      }

      toggleSidebar(): void {
        this.isSidebarVisible = 0
      }



      hasRole(roles: string[]): boolean {
        return roles.includes(this.Front_RoleName);
      }

      onSubmit(): void{
          this.categoryService.registerCategory(this.registerCategory)
          .then(() => {
            Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Categoria agregada exitosamente',
                      showConfirmButton: false,
                      timer: 800,
                      width: '400px'  // <-- Aquí defines el ancho que quieres
                    });
                    this.cerrarModal();
                    this.loadCategories();
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
          
                  this.registerCategory.categoryName = '';
                  this.registerCategory.description = '';
                  this.registerCategory.categorySKU = '';
                  
                  this.loadCategories();
                });
                
        }

      openModal(): void {
        const modalElement = document.getElementById('agregarCategoriaModal');
        if (modalElement) {
          this.modalInstance = new bootstrap.Modal(modalElement);
          this.modalInstance.show();
        }
      }

      cerrarModal() {
        const modalEl = document.getElementById('agregarCategoriaModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) {
            modal.hide();
            // Mover el foco al botón que abrió el modal
            const btnOpen = document.querySelector('button[data-bs-target="#agregarCategoriaModal"]');
            if (btnOpen instanceof HTMLElement) {
              btnOpen.focus();
            }
          }
        }
      }

      saveCategory() {
        console.log('Guardando Categoria...');
        if (!this.selectedCategory?.categoryId) return;
      
        const requestBody = {
            categoryName: this.selectedCategory.categoryName,
            description: this.selectedCategory.description,
            categorySKU: this.selectedCategory.categorySKU
          };
      
          console.log("Producto Original", this.selectedCategory);
          console.log("Request:", requestBody);

        this.categoryService.updateCategory(this.selectedCategory.categoryId, requestBody)
          .then(() => {
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Informacion Actualizada correctamente',
            showConfirmButton: false,
            timer: 2000,
            width: '400px'  // <-- Aquí defines el ancho que quieres
          });
            this.loadCategories(); // refresca la lista
            this.editRowId = null;
            this.selectedCategory = { 
              categoryId: BigInt(0),
              categoryName: '',
              description: '',
              categorySKU: ''
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
          
          this.loadCategories();
          this.editRowId = null;
          this.selectedCategory = { 
              categoryId: BigInt(0),
              categoryName: '',
              description: '',
              categorySKU: ''
            };
          this.editMode = 0;
          console.error('Error actualizando categoria', error);
        });
      }

      goToFormMode(categoryId: bigint) {
        console.log(this.categories)
        const category = this.Front_categories.find(c => c.categoryId === categoryId);
        console.log("categoria seleccionada",category)
        if (category) {
          this.selectedCategory = category; 
          this.editRowId = categoryId;
          this.editMode = 1;
        }
        console.log('Editando fila con ID:', this.editRowId, 'Modo edicion: ', this.editMode);
      }

      cancelEdit() {
        this.editMode = 0;
        this.editRowId = null;
        console.log('Editando fila con ID:', this.editRowId, 'Modo edicion: ', this.editMode);
        this.loadCategories(); 
      }

      exportToExcel() {
        const worksheet = XLSX.utils.json_to_sheet(this.categories);
        const workbook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, 'reporte.xlsx');
      }





      goToCategoryDetail(event:Event,categoryId:bigint){
        this.navigationService.goToCategoryDetail(event,categoryId);
      }

      goToAdminMenu(event: Event){
        this.navigationService.goToAdminMenu(event);
      }

      goToUsersPanel(event: Event){
        this.navigationService.goToUsersPanel(event);
      }

      goToProductsPanel(event: Event){
        this.navigationService.goToProductsPanel(event);
      }

      logout(event: Event) {
        this.navigationService.logout(event);
      }
}

export interface Category {
  categoryId: bigint,
  categoryName: string,
  description: string,
  categorySKU: string
}

export interface RegisterCategory{
  categoryName: string,
  description: string,
  categorySKU: string
}

export interface UpdateCategory{
   categoryName: string,
    description: string,
    categorySKU: string
}

export interface ListCategory {
  categoryId: bigint,
  categoryName: string,
  description: string,
  categorySKU: string
}

export interface PaginationCategory{
  categories: ListCategory[];
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}