import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  login_expiredmsg='';
  signinForm: FormGroup;
  fieldTextType: boolean;
  ipadd;
  deviceInfo = null;
  logindata = []
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    public router: Router,
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    console.log(this.document.location.hostname)
    const promise = this.http.get("https://sbc2.cloudX.in/ip.php").toPromise();

    promise.then((data)=>{
      console.log("data['ip']"+ data['ip']);
      this.ipadd = data['ip'];
    }).catch((error)=>{
      console.log("Promise rejected with " + JSON.stringify(error));
    });

    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      ip: [''],
      deviceinfo: [this.deviceInfo],
      host: [this.document.location.hostname],
    });

    if (this.authService.isLoggedIn == true) {
      const path = '/dashboard/';
      this.router.navigate([path]);
      window.location.href = '/dashboard/';
    }
  }

  
  signin() {
    if (this.signinForm.invalid == true) {
      return;
    } else {
      //console.log("ip :"+ this.ipadd);
      this.signinForm.get('ip').setValue(this.ipadd);
      this.authService.signIn(this.signinForm.value).then(
        data => {
          console.log(data);
          if(data['Expired']){
            this.login_expiredmsg ='Your account is expired !!   Kindly Pay and Contact us 07968120301 OR mail us  support@cloudX.in'
          }
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
  }
  passshowhide() {
    this.fieldTextType = !this.fieldTextType;
  }
  forcelogout(id){
    this.authService.forcelogout(id).then(
      data => {
        this._snackBar.open('Logout successfully!!', '', {
          duration: 2000,
        });
        //window.location.href = '/';
      }
    )
  }
}