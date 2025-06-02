import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export interface Category {
  CategoryID: number;
  CategoryName: string;
}

export interface ShowCategory {
  categoryId: bigint;
  categoryName: string;
  description: string;
  categorySKU: string;
}

export interface PaginationCategory{
  categories: ShowCategory[];
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}

export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'https://azinventariodbapi.azurewebsites.net/api/v1/Category';
  private listUrl = 'https://azinventariodbapi.azurewebsites.net/api/v1/Category/list';
  private UrlInfo = 'https://azinventariodbapi.azurewebsites.net/api/v1/Users/userinfo';

  async registerCategory(categoryRequest: CategoryRegisterDTO): Promise<CategoryDTO>{
    const token = localStorage.getItem('token')
    return axios.post(this.baseUrl, categoryRequest,{
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

  async getCategories(): Promise<Category[]> {
    return axios.get(this.baseUrl)
      .then(res => {
        return res.data.categories.map((r: any) => ({
          CategoryID: Number(r.categoryID),
          CategoryName: r.categoryName
        })) as Category[];
      })
      .catch(error => {
        console.error("Error al obtener Categorias:", error);
        throw error;
      });
  }

  async loadCategories(filter: string = '',pageNumber: number = 0, pageSize: number = 0): Promise<PaginationCategory>{
    const token = this.getToken();

    const dto = {
      filter: filter,
      pageNumber: pageNumber,
      pageSize: pageSize
    };
     try {
        const response = await axios.post(this.listUrl,dto,{
        headers:{
          Authorization: `Bearer ${token}`,
        } 
      })
      console.log("servicio")
      return response.data;
     } catch (error) {
        console.error('Error fetching categories', error);
        throw error;
     }
  }

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

async updateCategory(categoryId: bigint, updatedData: CategoryUpdateDTO): Promise<CategoryUpdateDTO> {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${this.baseUrl}/${categoryId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category', error);
    throw error;
  }
}

 async getCategoryDetail(categoryId: bigint){
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${this.baseUrl}/${categoryId}`,{
          headers:{
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.log("error al cargar el detalle de la categoria", error)
      }
  }

}

export interface CategoryRegisterDTO{
  categoryName: string,
  description: string,
  categorySKU: string
}

export interface CategoryUpdateDTO{
  categoryName: string,
  description: string,
  categorySKU: string
}

export interface CategoryDTO{
  categoryId: bigint,
  categoryName: string,
  description: string,
  categorySKU: string
}

