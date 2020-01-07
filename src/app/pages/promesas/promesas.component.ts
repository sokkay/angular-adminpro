import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    this.contarTres().then(() => {
      console.log('Termino');
    })
      .catch((err) => {
        console.log('Error en la promesa' + err);

      });

  }

  ngOnInit() {
  }

  contarTres(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

      let contador = 0;

      let intervalo = setInterval(() => {
        contador += 1;
        console.log(contador);

        if (contador === 3) {
          //se puede incluir una salida en resolve pasandolo como parametro
          resolve(true);
          // reject('mensaje de error');
          clearInterval(intervalo);
        }
      }, 1000);

    });
  }

}
