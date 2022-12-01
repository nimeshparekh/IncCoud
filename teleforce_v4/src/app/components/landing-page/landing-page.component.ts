import { Component, OnInit,Inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient ,HttpHeaders } from "@angular/common/http";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import {UserService } from '../../user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {
  requestForm: FormGroup

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    public defaultService: UserService
  ) { }

  ngOnInit(): void {

    if (this.authService.isLoggedIn == true) {
      const path = '/dashboard/';
      this.router.navigate([path]);
      window.location.href = '/dashboard/';
    }
    this.requestForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      intrest: ['', [Validators.required]],
    })
  }
  requestdemo(){
    if(this.requestForm.invalid == true)
    {
      // console.log(form.value);
      return;
    }
    else
    {
      let data: any = Object.assign(this.requestForm.value);
      
      this.defaultService.requestdemo(data).then((res)=>{
        this.requestForm.reset();
        this._snackBar.open("Thank you for booking a free trail or demo. We will contact you soon!", 'Dissmis', {
          duration: 5000,
        });  

        //this.router.navigate([path]); 
      })
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(GetTouchSalesComponents, {
     
    });
  }

}



@Component({
  selector: 'get-touch-sales',
  templateUrl: 'get-touch-sales.component.html',
})
export class GetTouchSalesComponents {
  requestForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<GetTouchSalesComponents>,
    @Inject(MAT_DIALOG_DATA) public data: LandingPageComponent,private _snackBar: MatSnackBar,
    private fb: FormBuilder,public defaultService: UserService) {}
   
  
      ngOnInit() {
        this.requestForm = this.fb.group({
          name: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          mobile: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          intrest: ['', [Validators.required]],
        })
       
        }
    
      
   
    requestdemo(){
      if(this.requestForm.invalid == true)
      {
        // console.log(form.value);
        return;
      }
      else
      {
        let data: any = Object.assign(this.requestForm.value);
        
        this.defaultService.requestdemo(data).then((res)=>{
          this.requestForm.reset();
          this._snackBar.open("Thank you for booking a free trail or demo. We will contact you soon!", 'Dissmis', {
            duration: 5000,
          });  
          this.dialogRef.close({ event: 'Add' });
  
          //this.router.navigate([path]); 
        })
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}