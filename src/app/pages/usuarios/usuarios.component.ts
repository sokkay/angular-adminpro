import { Component, OnInit } from "@angular/core";
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from "src/app/services/service.index";
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde = 0;
  totalregistros = 0;

  cargando = true;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
      this.totalregistros = resp.total
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number){
    let desde = this.desde + valor;
    if (desde >= this.totalregistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuarios(termino: string){
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino)
      .subscribe((usuarios: Usuario[]) =>{
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario( usuario: Usuario ){
    if (usuario._id === this.usuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No se puede borrar asi mismo', 'error');
      return;
    }

    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        this.usuarioService.borrarUsuario(usuario._id)
          .subscribe( borrado => {
            this.cargarUsuarios();
          });
      }
    });
  }

  guardarUsuario(usuario: Usuario){
    this.usuarioService.actualizarUsuario(usuario).subscribe();
  }

  mostrarModal(id: string){
    this.modalUploadService.mostrarModal('usuario', id);
  }
}
