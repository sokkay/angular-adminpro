import { Injectable } from "@angular/core";
import { Usuario } from "src/app/models/usuario.model";
import { HttpClient } from "@angular/common/http";
import { URL_SERVICIOS } from "src/app/config/config";

import swal from "sweetalert";

import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { SubirArchivoService } from "../subir-archivo/subir-archivo.service";
import { throwError } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  logout() {
    this.usuario = null;
    this.token = "";

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("id");
    localStorage.removeItem("menu");

    this.router.navigate(["/login"]);
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("menu", JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  estaLogueado(): boolean {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.menu = JSON.parse(localStorage.getItem("menu"));
    } else {
      this.token = "";
      this.usuario = null;
      this.menu = null;
    }
  }

  public crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + "/usuario";

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        swal("Usuario creado", usuario.email, "success");
        return resp.usuario;
      })
    );
  }

  public actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + "/usuario/" + usuario._id;
    url += "?token=" + this.token;
    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        if (usuario._id === this.usuario._id) {
          const usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }
        
        swal("Usuario actualizado", usuario.nombre, "success");
        return true;
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService
      .subirArchivo(archivo, "usuarios", id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        swal("Imagen actualizada", this.usuario.nombre, "success");
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      })
      .catch(resp => {
        console.log(resp);
      });
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + "/login/google";

    return this.http.post(url, { token }).pipe(
      map((resp: any) => {
        console.log(resp);
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
    );
  }

  public login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem("email", usuario.email);
    } else {
      localStorage.removeItem("email");
    }

    const url = URL_SERVICIOS + "/login";
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }),
      catchError( err =>{
        swal('Error en el login', err.error.mensaje, 'error');
        return throwError(err);
      })
    );
  }

  public cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + `/usuario?desde=${desde}`
    return this.http.get(url);
  }

  public buscarUsuarios(termino: string){
    let url = URL_SERVICIOS + `/busqueda/coleccion/usuarios/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.usuarios)
      );
  }

  public borrarUsuario( id: string){
    let url = URL_SERVICIOS + `/usuario/${id}?token=${this.token}`;
    return this.http.delete(url).pipe(
      map( resp => {
        swal('Usuario Borrado', 'El usuario a sido eliminado correctamente', 'success');
        return true;
      })
    );
  }
}
