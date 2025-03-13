import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalDeleteService {

  constructor() {}

  /**
   * Muestra un SweetAlert de confirmación para eliminar un elemento.
   * @param mensaje Mensaje a mostrar en el SweetAlert.
   * @returns Una promesa que resuelve en `true` si el usuario confirma, `false` si cancela.
   */
  async confirmarEliminacion(mensaje: string): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }

  /**
   * Muestra un SweetAlert de éxito tras una eliminación.
   * @param mensaje Mensaje de éxito.
   */
  mostrarExito(mensaje: string): void {
    Swal.fire('Eliminado', mensaje, 'success');
  }

  /**
   * Muestra un SweetAlert de error si la eliminación falla.
   * @param mensaje Mensaje de error.
   */
  mostrarError(mensaje: string): void {
    Swal.fire('Error', mensaje, 'error');
  }
}
