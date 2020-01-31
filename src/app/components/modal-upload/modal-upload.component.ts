import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import swal from 'sweetalert';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';


@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(
    public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  seleccionImagen(event: any){
    const imagen: File = event.target.files[0];
    if (!imagen) {
      this.imagenSubir = null;
      return;
    }

    if (imagen.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = imagen;

    const reader = new FileReader();
    reader.readAsDataURL(imagen);

    reader.onloadend = () => this.imagenTemp = reader.result;

    console.log(imagen);
  }

  subirImagen(){
    this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then( resp => {
        this.modalUploadService.notificacion.emit(resp);
        this.cerarModal();
      })
      .catch( err =>{
        console.log('Error en la carga...');
        
      });
  }

  cerarModal(){
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }

}
