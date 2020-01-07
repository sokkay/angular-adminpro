import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable().pipe(
      //cantidad de intentos
      // retry(2)
    ).subscribe(
      numero => console.log('Subs - ', numero),
      error => console.log('error en el obs ', error),
      () => console.log('El observador Termino!')
    );
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {

      let contador = 0;

      let intervalo = setInterval(() => {
        contador++;

        let salida = {
          valor: contador
        };

        observer.next(salida);

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        // if (contador === 2) {
        //   // clearInterval(intervalo);
        //   observer.error('Exploto');
        // }

      }, 1000);
    }).pipe(
      map( resp => resp.valor),
      filter((value, index)=> {
        if ((value%2) === 1) {
          //impar
          return true;
        } else {
          //par 
          return false;
        }
      })
    );
  }

}
