import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  showLoading(message: string) {
    Swal.fire({
      title: message,
      // html: `
      //   <div class="d-flex justify-content-center">
      //     <div class="spinner-border text-primary" role="status">
      //       <span class="visually-hidden">Loading...</span>
      //     </div>
      //   </div>
      // `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // opcional si usas un spinner propio
      }
    });
  }

  hideLoading() {
    Swal.close();
  }
}
