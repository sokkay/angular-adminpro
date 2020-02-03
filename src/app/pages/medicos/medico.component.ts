import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Hospital } from "../../models/hospital.model";
import { MedicoService, HospitalService } from "src/app/services/service.index";
import { Medico } from "../../models/medico.model";
import { Event, Router, ActivatedRoute } from "@angular/router";
import { ModalUploadService } from "../../components/modal-upload/modal-upload.service";

@Component({
  selector: "app-medico",
  templateUrl: "./medico.component.html",
  styles: []
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico("", "", "", "");
  hospital: Hospital = new Hospital("");

  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id !== "nuevo") {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion.subscribe( resp => {
      this.medico.img = resp.medico.img;
    });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe((resp: any) => {
      this.hospitales = resp.hospital;
    });
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico).subscribe(medico => {
      this.medico._id = medico._id;
      this.router.navigate(["/medico", medico._id]);
    });
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico(id).subscribe(medico => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambioHospital(medico.hospital);
    });
  }

  cambioHospital(id: string) {
    this.hospitalService.obtenerHospital(id).subscribe(hospital => {
      this.hospital = hospital;
    });
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }
}
