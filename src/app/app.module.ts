import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AppComponent} from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { provideHttpClient,withInterceptorsFromDi } from '@angular/common/http';
import { ProductService } from './product/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CartService } from './cart/cart.service';

import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProductComponent
  ],
  imports: [
    
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TableModule,CommonModule,
  
    BrowserAnimationsModule,
    DialogModule,ButtonModule,InputTextModule,
    
  ],
  exports:[
    LoginComponent,TableModule
  ],
  providers:[ProductService,CartService,provideHttpClient(withInterceptorsFromDi()) ,NgxImageCompressService],
  bootstrap:[AppComponent]
})
export class AppModule { }
