import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "src/app/config/config";
import { map } from "rxjs/operators";
import { UsuarioService } from "../usuario/usuario.service";
import swal from 'sweetalert';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: "root"
})
export class MedicoService {
  totalMedicos: number = 0;

  constructor(public http: HttpClient, public usuarioService: UsuarioService) {}

  public cargarMedicos() {
    const url = `${URL_SERVICIOS}/medico`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalMedicos = resp.total;
        return resp.medico;
      })
    );
  }

  public buscarMedico(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;
    return this.http.get(url).pipe(map((resp: any) => resp.medicos));
  }

  public borrarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}?token=${this.usuarioService.token}`;
    return this.http.delete(url).pipe(
      map(resp => {
        swal('Médico Borrado', 'Médico borrado correctamente', 'success');
        return resp;
      })
    );
  }

  public guardarMedico( medico: Medico){
    let url = `${URL_SERVICIOS}/medico`;

    if (medico._id) {
      // acualizando
      url += `/${medico._id}?token=${this.usuarioService.token}`;
      return this.http.put(url, medico).pipe(
        map( (resp: any) =>{
          swal('Médico actualizado', medico.nombre, 'success');        
          return resp.medico;
        })
      );
    } else {
      url += `?token=${this.usuarioService.token}`;
      return this.http.post(url, medico).pipe(
        map((resp: any) =>{
          swal('Médico creado', medico.nombre, 'success');        
          return resp.medico;
        })
      );
    }
  }

  public cargarMedico(id: string){
    const url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => resp.medico)
    );
  }
}
