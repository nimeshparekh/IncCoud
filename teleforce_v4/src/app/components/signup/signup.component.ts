import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup,Validators,AbstractControl,FormArray,ValidationErrors } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  fieldTextType: boolean;
  fieldTextType1: boolean;
  otpverified = false
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  private debouncedTimeout;
  otpsend=false;
  userdetailnext=false;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public userservice: UserService,
    private _snackBar: MatSnackBar,
    public router: Router,
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      username: ['', [Validators.required,, Validators.maxLength(15)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
      password: ['', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]],
      confirmpassword: ['', [Validators.required,this.matchValues('password')]],
    })
    this.secondFormGroup = this.fb.group({
      mobile: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
    });
    this.thirdFormGroup = this.fb.group({
      otp: ['', [Validators.required]],
    });   
  }

  
  /*signin() {
    if (this.signinForm.invalid == true) {
      return;
    } else {
      //console.log("ip :"+ this.ipadd);
      this.signinForm.get('ip').setValue(this.ipadd);
      this.authService.signIn(this.signinForm.value).then(
        data => {
          console.log(data);
          if(data['user']){
            this._snackBar.open('Login Successful !!', '', {
              duration: 2000,
            });
            const path = '/dashboard/';
            this.router.navigate([path]);
            window.location.href = '/dashboard/';
          }else{
            if(data['otherlogin']){
              this.authService.getLoginDetail(data['otherlogin']).then(
                data => {
                  this.logindata = data['data']
                }
              )
            }
            if(data['redirecturl']){
              window.location.href = data['redirecturl'];
            }
          }
        },
        err => {
          // console.log('error');
          this._snackBar.open('Authentication Failed !!', '', {
            duration: 2000,
          });
          localStorage.removeItem('access_token');
          localStorage.clear();

        });
    }
  }*/
  passshowhide() {
    this.fieldTextType = !this.fieldTextType;
  }
  confirmpassshowhide() {
    this.fieldTextType1 = !this.fieldTextType1;
  }
  public  matchValues(
    matchTo: string // name of the control to match to
    ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }
  invalidUserName() {
    if(this.firstFormGroup.value.username!=''){
      return (this.firstFormGroup.controls.username.errors != null);
    }
  }
  private checkUsernameValid(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    //console.log(control)
    if (control.value == null) {
      console.log('control' + control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/signin/checkusername/', { check: control.value }).subscribe(data => {
          if (data['isexist']) {
            resolve({ 'username': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
  }
  checkotp(){
    let data: any = Object.assign(this.firstFormGroup.value);
    data = Object.assign(data,this.secondFormGroup.value);
    if(data.otp!=''){
      this.userservice.checkotp(data).then(
        data => {
          if(data['msg']){
            this.otpverified = true
          }else{
            this._snackBar.open("Invalid otp! please try again", 'Dissmis', {
              duration: 3000,verticalPosition: 'top'
            }); 
            this.otpverified = false
          }
        },
        err => {
          console.log('error');
        }
      );
      /*this.userservice.checkotp(data).subscribe((res)=>{
        console.log(res)
        if(res['msg']){
          this.otpverified = true
        }else{
          this._snackBar.open("Invalid otp! please try again", 'Dissmis', {
            duration: 3000,verticalPosition: 'top'
          }); 
          this.otpverified = false
          //this.stepper.previous();
        }        
      })*/
    }
  }
  submit(){
    if(this.firstFormGroup.invalid == true)
    {
      // console.log(form.value);
      return;
    }
    else
    {
      let data: any = Object.assign(this.firstFormGroup.value);
      //console.log(data)
      data = Object.assign(data,this.secondFormGroup.value);
      //console.log(data)
      this.userservice.saveSignupData(data).then(
        data => {          
            this._snackBar.open(data['msg'], '', {
              duration: 3000,verticalPosition: 'top'
            }); 
            this.router.navigate(['/signin']);
        },
        err => {
          console.log('error');
        }
      );
      /*this.apiservice.savesignupdata(data).subscribe((res)=>{
        this._snackBar.open("Account created successfully.Please check your mail for account verification!", 'Dissmis', {
          duration: 5000,verticalPosition: 'top'
        });  
        this.firstFormGroup.reset();
        window.location.reload()
      })*/
    } 
  }
  sendotp(){
    let data: any = Object.assign(this.secondFormGroup.value);
    console.log(data)
    if(data.mobile!=''){
      this.userservice.requestotp(data.mobile).then(
        data => {
          this.otpsend = true
          this._snackBar.open(data['msg'], '', {
            duration: 5000,
          });
        },
        err => {
          console.log('error');
        }
      );

      
    }
  }
  

}
