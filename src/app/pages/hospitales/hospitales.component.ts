import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  cargando: boolean = true;
  totalRegistros: number;
  desde = 0;

  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion.subscribe(resp => this.cargarHospitales());
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde).subscribe((resp: any) =>{
      this.hospitales = resp.hospital;
      this.totalRegistros =  resp.total;
      this.cargando = false;
    });
  }

  buscarHospital(termino: string){
    if(termino.length <= 0 ){
      this.cargarHospitales();
      return;
    }
    this.cargando = true;

    this.hospitalService.buscarHospital(termino).subscribe((hospitales: Hospital[]) =>{
      this.hospitales = hospitales;
      this.cargando =  false;
    })
  }

  guardarHospital(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital)
      .subscribe((resp) =>{
        swal('Hospital actualizado', 'Nombre de hospital a sido actualizado', 'success');
      });    
  }

  crearHospital(){
    swal("Ingresa nombre de hospital:", {
      content: "input",
    })
    .then((value) => {
      this.hospitalService.crearHospital(value)
      .subscribe(resp =>{
        this.cargarHospitales();
      });
    });
  }

  borrarHospital(hospital: Hospital){
    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then( borrar => {
      if (borrar) {
        this.hospitalService.borrarHospital(hospital)
        .subscribe(borrardo => {
          this.cargarHospitales();
        });
      }
    });
  }

  mostrarModal(id: string){
    this.modalUploadService.mostrarModal('hospitales', id);
    
  }

  cambiarDesde(valor: number){
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }
}
