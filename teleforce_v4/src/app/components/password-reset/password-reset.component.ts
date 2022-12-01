import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms'; import { AuthService } from '../../auth.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from "@angular/router";
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  public searchform: FormGroup;
  public otpform: FormGroup;
  public passwordform: FormGroup;
  msg='';
  otpmode=false;
  resetmode=true;
  passwordmode=false;
  username='';

  constructor(
    private fb: FormBuilder,
    public managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchform = this.fb.group({
      mobile: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    });
    this.otpform = this.fb.group({
      userid:[null],
      otp: [null, [Validators.required]],
    });
    this.passwordform = this.fb.group({
      userid:[null],
      password: [null, [Validators.required]],
    });
  }
  resetPassword() {
    let data: any = Object.assign(this.searchform.value);
    if (this.searchform.invalid == true) {
      return;
    }
    else {
      data.check = data.mobile;
      //console.log(data);
      this.managerservice.checkManagerMobile(data).then(
        data => {
          //console.log(data['data']);
         
          if(data['isexist']==true){
            this._snackBar.open('Please check your phone to enter your OTP', '', {
              duration: 3000, verticalPosition: 'top'
            });
            this.username=data['username'];
            this.otpmode=true;
            this.resetmode=false;
            this.otpform = this.fb.group({
              userid:[data['userid']],
              otp: [null, [Validators.required]],
            });
          }else{
            this.msg = 'Please registered your mobile no. !!';
            this.otpmode=false;
            this.resetmode=true;
          }
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  checkOTP(){
    let data: any = Object.assign(this.otpform.value);
    if (this.otpform.invalid == true) {
      return;
    }
    else {
      //console.log(data);
      this.managerservice.checkMobileOTP(data).then(
        data => {
          //console.log(data['data']);
          
          if(data['data'].length>0){
            this.otpmode=false;
            this.resetmode=false;
            this.passwordmode=true;
            this.passwordform = this.fb.group({
              userid:[data['data'][0].account_id],
              password: [null, [Validators.required]],
            });
          }else{
            this.msg = 'Please enter correct OTP !!';
            //console.log(this.msg);
            this.otpmode=true;
            this.resetmode=false;
            this.passwordmode=false;
          }
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  changePassword(){
    let data: any = Object.assign(this.passwordform.value);
    if (this.passwordform.invalid == true) {
      return;
    }
    else {
       this.managerservice.changeManagerPassword(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.router.navigate(['/signin']);
        },
        err => {
          console.log('error');
        }
      );
    }
  }


}
