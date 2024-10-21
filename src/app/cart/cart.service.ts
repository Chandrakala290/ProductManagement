import { Injectable } from "@angular/core";
import { BehaviorSubject,Observable } from "rxjs";
import { Product } from "../product/product.model";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class CartService{
    private apiUrl="https://caff18773abf2e1b34a5.free.beeceptor.com/api/cart"
    private cartItems = new BehaviorSubject<Product[]>([]);
    private cartItemCount =  new BehaviorSubject<number>(0);
    cartItems$: Observable<Product[]> = this.cartItems.asObservable();
    cartItemCount$: Observable<number> = this.cartItemCount.asObservable();
    constructor(private http:HttpClient){}
    addToCart(product:Product):Observable<Product>{
        const headers=new HttpHeaders({'Content-Type':'application/json'})
        return this.http.post<Product>(`${this.apiUrl}`,product,{headers}).pipe(
            tap(()=>{
                const currentCart = this.cartItems.value;
                this.cartItems.next([...currentCart,product]);
                this.cartItemCount.next(this.cartItems.value.length);
            })
        )
       
    }

    removeFromCart(product:Product):Observable<void>{
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.delete<void>(`${this.apiUrl}/${product.id}`,{headers}).pipe(
            tap(()=>{
                const currentCart =this.cartItems.value.filter(item=>item.id !== product.id);
                this.cartItems.next(currentCart);
                this.cartItemCount.next(this.cartItems.value.length);
            })
        );


    }
    clearCart():Observable<void>{

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.delete<void>(`${this.apiUrl}`,{headers}).pipe(
            tap(()=>{
                this.cartItems.next([]);
                this.cartItemCount.next(0);
            })
        )
        
    }
    loadCartItems():void{
        this.http.get<Product[]>(`${this.apiUrl}`).subscribe({
            next:(items)=>{
                console.log('Loaded cart items:',items);
                this.cartItems.next(items),
                this.cartItemCount.next(items.length);
            },
            error: (err) => {
                if (err.status === 404) {
                  console.warn('Cart items not found, initializing to an empty array.');
                  this.cartItems.next([]);
                  this.cartItemCount.next(0);
                } else {
                  console.error('Failed to load cart items:', err);
                }
              }
            });
    }

    getCartItems():Product[]{
        return this.cartItems.value;
    }
    updateCartItem(product:Product):Observable<void>{
        const headers=new HttpHeaders({'Content-Type':'application/json'});
        return this.http.put<void>(`${this.apiUrl}/${product.id}`,product,{headers}).pipe(
            tap(()=>{
                const currentCart=this.cartItems.value;
                const index = currentCart.findIndex(item=>item.id ===product.id);
                if (index!==-1){
                    currentCart[index]=product;
                    this.cartItems.next(currentCart);
                }
            })
        )
    }
}