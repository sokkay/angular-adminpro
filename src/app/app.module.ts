import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

//routes
import { APP_ROUTES } from './app.routes';

//components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
//modules
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

//temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//services
import { ServiceModule } from './services/service.module';
import { PagesComponent } from './pages/pages.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
