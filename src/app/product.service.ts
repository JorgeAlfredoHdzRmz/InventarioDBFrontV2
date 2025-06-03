import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export interface Products {
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

export interface PaginationProduct{
  products: Products[];
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // constructor() { }

  private baseUrl = 'https://azinventariodbapi.azurewebsites.net/api/v1/Products';
  private urlList = 'https://azinventariodbapi.azurewebsites.net/api/v1/products/list';
  private UrlInfo = 'https://azinventariodbapi.azurewebsites.net/api/v1/Users/userinfo';

  private stockURL = 'https://azinventariodbapi.azurewebsites.net/api/v1/Products/add-stock';
  private changeCategoryURL = 'https://azinventariodbapi.azurewebsites.net/api/v1/Products/changeCategory';
  private importProdURL = 'https://azinventariodbapi.azurewebsites.net/api/v1/Products/importProducts'

  //para registrar un nuevo producto
  registerProduct(productRequest: ProductRegisterDTO): Promise<any> {
    const token = localStorage.getItem('token')
    return axios.post(this.baseUrl, productRequest,{
      headers:{
              Authorization: `Bearer ${token}`,
          },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("error: ",error);
      throw error;
    });
  }

  //para obtener todos los productos
  async getAllProducts(filter: string = '',pageNumber: number = 0, pageSize: number = 0): Promise<PaginationProduct>{
    const token = this.getToken();

    const dto = {
      filter: filter,
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    try {
        const response = await axios.post(this.urlList,dto,{
          headers:{
              Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products', error);
        throw error;
    }
  }

  async changeStatus(productid: number,NewactiveStatus: number): Promise<void>{
    const token = localStorage.getItem('token')
    const requestdto = {
      activeStatus: NewactiveStatus
    };
    try {
      await axios.put(`${this.baseUrl}/${productid}/status`,requestdto,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
    } catch (error) {
      console.error('Error actualizando estado', error);
      throw error;
    }
  }

  async getProductDetail(productId: number){
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${this.baseUrl}/${productId}`,{
          headers:{
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.log("error al cargar el detalle del producto ", error)
      }
  }

  //utilidades para otros procesos
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserDataFromToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Token inválido:', error);
      return null;
    }
  }

  getUserInfo(): Promise<{ user: { userName: string; roleName: string } }> {
  const token = this.getToken();
  return axios.get(this.UrlInfo, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.data);
}

async updateProduct(productId: number, updatedData: ProductUpdateDTO): Promise<any> {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${this.baseUrl}/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product', error);
    throw error;
  }
}

async updateStock(productId: number, updatedData: AddStockDTO): Promise<any>{
  const token = localStorage.getItem('token');
  console.log("cambio de stock")
  console.log(productId);
  try {
    const response = await axios.patch(`${this.stockURL}/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // return response.data;
  } catch (error) {
    console.error('Error updating STOCK', error);
    throw error;
  }

}

async changeCategory(productId: number, updatedData: ChangeCategoryDTO): Promise<any>{
  const token = localStorage.getItem('token'); 
  console.log("cambio de categoria")
  console.log(productId);
  try {
    const response = await axios.patch(`${this.changeCategoryURL}/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // return response.data;
  } catch (error) {
    console.error('Error changing category', error);
    throw error;
  }
}

async importProducts(archivoExcel: File) {
  const token = localStorage.getItem('token'); 
    const formData = new FormData();
    formData.append('archivoExcel', archivoExcel, archivoExcel.name);

    try {
    const response = await axios.post(`${this.importProdURL}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // return response.data;
  } catch (error) {
    console.error('Error importing products', error);
    throw error;
  }
  }

}


export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

export interface ProductRegisterDTO{
  productName: string,
  price: number,
  availableStock: number,
  productSKU: string,
  categoryID: number
}

export interface ProductUpdateDTO{
  productName: string,
  price: number,
  productSKU: string
}

export interface AddStockDTO{
  addedStock: number
}

export interface ChangeCategoryDTO{
  newCategoryID: number
}