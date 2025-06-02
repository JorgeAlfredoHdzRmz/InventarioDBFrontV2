import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://azinventariodbapi.azurewebsites.net/api/auth/login'

  constructor() { }

  async login(UserName: string, Password: string): Promise<string>
  {
    try {
      const response = await axios.post(this.baseUrl,{
        UserName: UserName, //aqui el primer UserName es la etiqueta del json que debe ir en el request, y el segundo es el parametro que se pasa
        Password: Password,
      });

      const token = response.data.token;
      if(token){
        localStorage.setItem('token', token);
        return token;
      }
      else
      {
        throw new Error('Token not found in response!')
      }

    } catch (error) {
      console.error('Ocurrio un error durante el login: ', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
