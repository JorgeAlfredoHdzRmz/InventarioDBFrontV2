import { Injectable } from '@angular/core';
import axios from 'axios';

export interface Role {
  RoleID: number;
  RoleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'https://azinventariodbapi.azurewebsites.net/api/v1/Roles';

  getRoles(): Promise<Role[]> {
    return axios.get(this.baseUrl)
      .then(res => {
        // Mapear los nombres del backend (camelCase) a los del frontend (PascalCase si así lo usas)
        return res.data.roles.map((r: any) => ({
          RoleID: Number(r.roleID),
          RoleName: r.roleName
        })) as Role[];
      })
      .catch(error => {
        console.error("Error al obtener roles:", error);
        throw error;
      });
  }
}
