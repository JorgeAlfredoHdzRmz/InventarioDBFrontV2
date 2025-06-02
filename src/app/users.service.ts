import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'https://azinventariodbapi.azurewebsites.net/api/v1/Users/list';

  private UrlInfo = 'https://azinventariodbapi.azurewebsites.net/api/v1/Users/userinfo';

  private mainURL = 'https://azinventariodbapi.azurewebsites.net/api/v1/Users';

  filter = '';
  activeStatus = '';

  //usado de momento en el component registerUser
  registerUser(userData: UserRegisterDTO): Promise<any> {
    return axios.post(this.mainURL, userData)
      .then(response => response.data)
      .catch(error => {
        console.error("Error en registro:", error);
        throw error;
      });
  }

  async deleteUser(userid: bigint): Promise<void> {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${this.baseUrl}/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting user', error);
      throw error;
    }
  }

  async updateUser(userId: bigint, updatedData: any): Promise<any> {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${this.mainURL}/${userId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user', error);
    throw error;
  }
}

async getUserById(userId: bigint): Promise<any> {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${this.baseUrl}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID', error);
    throw error;
  }
}

async getAllUsers(filter: string = '',pageNumber: number = 0, pageSize: number = 0): Promise<PaginationUser> {
  const token = this.getToken();

  const dto = {
    filter: filter, 
    pageNumber: pageNumber,
    pageSize: pageSize
  };

  try {
    const response = await axios.post(this.baseUrl, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("servicio users")
    console.log(response.data);
    return response.data;
   
  } catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
}

async changeStatus(userid: bigint, NewactiveStatus: number): Promise<void> {
  const token = localStorage.getItem('token');
  const dto = {
    activeStatus: NewactiveStatus
  };
  try {
    await axios.put(`${this.mainURL}/${userid}/status`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error actualizando estado', error);
    throw error;
  }
}

async changePassword(NewPassword: string): Promise<void> {
  const token = localStorage.getItem('token');
  const dto = {
    newPassword: NewPassword
  };
  try {
    await axios.put(`${this.mainURL}/password`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error actualizando password', error);
    throw error;
  }
}

async getUserDetail(userId: number){
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${this.mainURL}/${userId}`,{
      headers:{
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error al cargar el detalle del usuario ", error)
  }
}




 // ✅ Interfaz debe ir FUERA de la clase
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


}

export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

export interface UserRegisterDTO {
  UserName: string;
  Password: string;
  RoleID: number;
}

export interface User {
  userID: bigint,
  userName: string,
  roleID: number,
  roleName: string,
  activeStatus: number
}

export interface PaginationUser{
  users: User[],
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  totalPages: number
}