import { Component,OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule,FormControl,FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  errorMessage: string | null= null;
  isAuthenticated: boolean=false;


  constructor(private router:Router){
    this.loginForm= new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required])
    })
   
  }
ngOnInit(): void {
  
      if(this.isAuthenticated)
{
  this.router.navigate(['/home']);
}
    }


login() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;
    
   
    console.log('Form submitted with:', email, password); // Debugging step

    if(email==='kala@isteer.com'&& password==='password123'){
      this.isAuthenticated=true;
      this.router.navigate(['/home']);
    }
    else{
      this.errorMessage="Invalid email or password";
    }
  }
  else {
    this.errorMessage='please fill in all fields correctly';
  }
}
  clearError(){
    this.errorMessage=null;
      
  }
}
