import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {

  private baseUrl = 'https://azinventariodbapi.azurewebsites.net/api/v1/Users/userinfo';

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

  getUserInfo(): Promise<{ user: { userId:bigint, userName: string; roleName: string } }> {
  const token = this.getToken();
  return axios.get(this.baseUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.data);
}

}

// ✅ Interfaz fuera de la clase
export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}
