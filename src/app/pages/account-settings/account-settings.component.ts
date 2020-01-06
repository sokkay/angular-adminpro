import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { SettingsService } from 'src/app/services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor(public _ajustes: SettingsService) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor(tema: string, link: HTMLObjectElement) {
    this.aplicarCheck(link);
    this._ajustes.aplicarTema(tema);
  }

  aplicarCheck(link: HTMLObjectElement) {
    let selectores = document.querySelectorAll('.selector');
    selectores.forEach(ref => {
      ref.classList.remove('working');
    });
    link.classList.add('working');
  }

  colocarCheck(){
    let selectores = document.querySelectorAll('.selector');
    
    let tema = this._ajustes.ajustes.tema;
    
    selectores.forEach(ref => {
      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
        return;
      }
    });
  }
}
