import { Component, OnInit ,ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CartService } from '../cart/cart.service';
import { Observable } from 'rxjs';
import {ToastModule} from 'primeng/toast'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,ToastModule, ReactiveFormsModule,ButtonModule,DialogModule,TableModule,IconFieldModule,InputIconModule,InputTextModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService,MessageService]
})
export class ProductComponent implements OnInit {
  @ViewChild('table') table!: Table;
  products: Product[] = [];
  selectedProduct: Product | null = null; 
  newProductForm: FormGroup;
  editProductForm: FormGroup;
  displayAddModal: boolean = false;
  displayEditModal: boolean = false;
  displayViewModal: boolean = false;
  viewedProduct : Product | null=null;
  imagePreviewAdd: string |ArrayBuffer | null=null;
  imagePreviewEdit :string | ArrayBuffer | null=null;
  cartItemCount$: Observable<number>;
  cartItemCount:number=0;
  constructor(private router: Router,
     private productService: ProductService,
     private messageService : MessageService,
      private fb:FormBuilder,
       private imageCompress: NgxImageCompressService,
        private cartService:CartService) {
    this.cartItemCount$ = this.cartService.cartItemCount$; 
    this.newProductForm = this.fb.group({
      name:['',Validators.required],
      image:['',Validators.required],
      price:[0,[Validators.required,Validators.min(0)]],
      productdescription:['',Validators.required],
    });
    this.editProductForm = this.fb.group({
      id:[null],
      name:['',Validators.required],
      image:['',Validators.required],
      price:[0,[Validators.required,Validators.min(0)]],
      productdescription:['',Validators.required],
    })
    

  }


  ngOnInit(): void {
    this.loadProducts();
    this.cartService.loadCartItems();
    this.cartService.cartItemCount$.subscribe(count=>{
      console.log('Cart item count:',count);
      this.cartItemCount = count;
    })
    
  }
  filterProducts(event: Event,table: Table): void {
    const inputElement = event.target as HTMLInputElement; // Type assertion
    const searchValue = inputElement.value;
    table.filterGlobal(searchValue, 'contains'); // Ensure table is accessible
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }
  onImageSelect(event: Event, mode: 'add' | 'edit'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (mode === 'add') {
            this.imageCompress.compressFile(reader.result as string, -1, 50, 50).then(
              (compressedImage) => {
                  this.imagePreviewAdd = compressedImage; // Set the compressed image for preview
                  this.newProductForm.patchValue({ image: compressedImage }); // Set the image in the form
              }
          );
      } else {
          // Compress the image
          this.imageCompress.compressFile(reader.result as string, -1, 50, 50).then(
              (compressedImage) => {
                  this.imagePreviewEdit = compressedImage; // Set the compressed image for preview
                  this.editProductForm.patchValue({ image: compressedImage }); // Set the image in the form
              }
          );
      }
  };

        reader.readAsDataURL(file); // Convert image file to base64 string
    }
}
  logout() {
    this.router.navigate(['/login']); 
  }
openViewModal(product:Product):void{
  this.viewedProduct = product;
  this.displayViewModal=true;
}


  openEditModal(product: Product): void {
    this.displayEditModal = true;
    this.editProductForm.patchValue(product);
    this.imagePreviewEdit=product.image;
  }
  updateProduct(): void {
    if (this.editProductForm.valid) {
      const updatedProduct: Product = { ...this.editProductForm.value };
      updatedProduct.image = this.imagePreviewEdit as string;
      this.productService.updateProduct(updatedProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.displayEditModal = false; 
          this.imagePreviewEdit =null;// Close the dialog
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    }
  }

  openAddProductModal(): void {
    console.log('Add Product Modal Opened')
    this.displayAddModal = true;
    this.newProductForm.reset(); 
    this.imagePreviewAdd=null;
    this.newProductForm.patchValue({image:''});// Reset the form for new product
  }

  addProduct(): void {
    console.log('Form Valid:', this.newProductForm.valid); // Debugging line
    console.log('Form Value:', this.newProductForm.value);
    if (this.newProductForm.valid) {
      const productData={
        ...this.newProductForm.value,
        image:this.imagePreviewAdd as string
      };
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.displayAddModal = false;
          this.imagePreviewAdd = null;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error adding product:', err);
        }
      });
    }
    else{
      console.error('Form is invalid')
    }
  }

 
 

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting product:', err);
        }
      });
  }
}

addToCart(product:Product):void{
  this.cartService.addToCart(product).subscribe({
    next:()=>{
      this.messageService.add({severity:'success',summary:'Success',detail:'Add the item into cart'})
      console.log(`${product.name} has been added to the cart.`);
    },
    error:(err)=>{
      console.error('Failed to add product to cart:',err);
      console.error('Error details:',err.error);
    }
  });
}
navigateToCart():void{
  this.router.navigate(['/cart']);
  //his.messageService.add({severity:'success',summary:'Success',detail:'navigate to cart'})
}
}