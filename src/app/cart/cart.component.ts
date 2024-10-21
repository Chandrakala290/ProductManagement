import { Component,OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Product } from '../product/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ButtonModule,TableModule,ToastModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  providers:[CartService,MessageService]
})
export class CartComponent implements OnInit{
 cartItems:Product[]=[];
 constructor(private cartService:CartService ,
  private messageService : MessageService,
   private router:Router){}
 ngOnInit(): void {
  this.cartService.loadCartItems();
   this.cartService.cartItems$.subscribe(items=>{
    this.cartItems=items;
   })
 }

 clearCart():void{
  this.cartService.clearCart().subscribe({
    next:()=>{
      console.log('cart has been cleared.');
      this.messageService.add({severity:'success',summary:'Success',detail:'Delete the all products'})
      this.cartItems=[];

    },
    error:(err)=>{
      console.error('Failed to clear the cart:',err)
    }  })
 }
 removeFromCart(product: Product): void {
  this.cartService.removeFromCart(product).subscribe({
    next: () => {
      console.log(`Removed ${product.name} from cart.`);
      this.messageService.add({severity:'success',summary:'Success',detail:'delete the product'})
    },
    error: (err) => {
      console.error('Failed to remove item from cart:', err);
    }
  });
}
navigateToCart(){
  this.router.navigate(['/cart'])
}
logout(){

  this.router.navigate(['/login'])
}
updateQuantity(item:Product,change:number):void{
  if(item.quantity+change<1){
    return;
  }
  item.quantity+=change;
  this.cartService.updateCartItem(item).subscribe(()=>{
    console.log(`Quantity of ${item.name} updated to ${item.quantity}`)
  })
}
getTotalPrice():number{
  return this.cartItems.reduce((total,item)=>{
    const itemTotal=(item.price||0)*(item.quantity||1);
    return total+itemTotal;
  },0)
}
}

