import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  token: string;
  usuario: Usuario;

  constructor(
    public http: HttpClient,
    public SubirArchivoService: SubirArchivoService
  ) { 
    this.cargarStorage();
  }

  public cargarHospitales(desde: number = 0){
    const url = URL_SERVICIOS + `/hospital?desde=${desde}`;
    return this.http.get(url);
  }
  
  public obtenerHospital(id: string){
    const url = `${URL_SERVICIOS}/hospital/${id}`;

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.hospital;
      })
    );
  }

  public actualizarHospital(hospital: Hospital){
    const url =  `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this.token}`
    return this.http.put(url, hospital);
  }

  private cargarStorage() {
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
    } else {
      this.token = "";
      this.usuario = null;
    }
  }

  public crearHospital(nombre: string){
    const url = `${URL_SERVICIOS}/hospital?token=${this.token}`;
    const hospital: Hospital = {
      nombre
    };

    return this.http.post(url, hospital).pipe(
      map((resp: any) => {
        swal('Hospital creado', `${hospital.nombre} fue creado correctamente`, 'success');
        return resp.hospital;
      })
    );
  }

  public borrarHospital(hospital: Hospital){
    const url = `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this.token}`;

    return this.http.delete(url).pipe(
      map(resp => {
        swal('Hospital borrado', 'El hospital a sido eliminado corectamente', 'success');
        return true;
      })
    )
  }

  public buscarHospital(termino: string){
    const url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${termino}`;
    return this.http.get(url).pipe(
      map((resp: any) => resp.hospitales)
    );
  }
}
