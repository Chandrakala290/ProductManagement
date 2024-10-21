import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl='https://cafddb56369afcaa2a60.free.beeceptor.com/api/products'
  
 
  constructor(private http:HttpClient) { }
  
  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this.apiUrl)
  }
  getProductById(id:number):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  createProduct(product:Product):Observable<Product>{
    return this.http.post<Product>(this.apiUrl, product,{
      headers: new HttpHeaders({'Content-Type':'application/json'}),
    });
  }
  updateProduct(product:Product):Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`,product,{
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
    });

  }
  deleteProduct(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
