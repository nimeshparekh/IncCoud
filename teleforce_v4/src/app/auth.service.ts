import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router,NavigationEnd,ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jwt_decode from 'jwt-decode';
import { Location } from "@angular/common";
import { filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentRoute: string;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public router: Router,
    private _snackBar: MatSnackBar,
    location: Location,
    private activatedRoute: ActivatedRoute
  ) { 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
        //console.log(event['url']);
        this.currentRoute = event['url'];
    });
    // router.events.subscribe(val => {
    //   if (location.path() != "") {
    //     this.route = location.path();
    //   } else {
    //     this.route = "Home";
    //   }
    // });
  }
  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }
  isAuthenticated(path) {
    //console.log(this.currentRoute)
    var userid = localStorage.getItem('access_id');
    var data = {path:path,userid:userid}
    return this.http.post(`${this.apiUrl}/signin/getaccess/`,data);
  }  
  getData() {
    return JSON.parse(localStorage.getItem('userData'));
  }
  signIn(user) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/signin`, user).subscribe((data: any) => {
        console.log("=====sign=====",data);
        
        if (data['islogin']) {
          localStorage.setItem('access_token', data['access_token']);
          let tokenInfo = this.getDecodedAccessToken(data['access_token']);
          //console.log(tokenInfo)
          localStorage.setItem('secret', btoa(tokenInfo.secret));
          if(data){
            localStorage.setItem('user', data['username']);

          }
          if(data['user']){
            localStorage.setItem('access_id', data['user']['id']);
            localStorage.setItem('username', data['user']['name']);
            const agent_role =  localStorage.removeItem('agent_role');

            if(data['user']['supervisior_role']==0){
              localStorage.setItem('agent_role', 'agent');

            }else{
              localStorage.setItem('agent_role', 'supervisor');

            }
            if(data['user']['voip_status']==0){
              localStorage.setItem('voipstatus', 'true');
            }
          }
          resolve(data);
        } else {
          this._snackBar.open(data['msg'], '', {
            duration: 2000,verticalPosition: 'top'
          });
          resolve(data);
        }


      }, error => {
        reject(error);
      });
    });
  }

  getRole(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/signin/getrole/`).subscribe((data: any) => {
        //console.log(data['data'][0]);
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }
  doLogout() {
    var userid = localStorage.getItem('access_id');
    //console.log(userid);
    this.http.get(`${this.apiUrl}/signin/logout/` + userid).subscribe((data: any) => {
      // console.log("logout data");
      // console.log(JSON.stringify(data));
    });
    const removeToken = localStorage.removeItem('access_token');
    const username = localStorage.removeItem('username');
    const access_id = localStorage.removeItem('access_id');
    const newuserid = localStorage.removeItem('newuserid');
    const kycid = localStorage.removeItem('kycid');
    const user = localStorage.removeItem('user');
    const secret = localStorage.removeItem('secret');
    const voipstatus = localStorage.removeItem('voipstatus');    
    const feedback =  localStorage.removeItem('feedback');
    const agent_role =  localStorage.removeItem('agent_role');

    localStorage.clear();
    // localStorage.removeItem("expires_at");
    if (removeToken == null) {
     // this.router.navigate(['log-=in']);
    }

  }
  setliveip(ip){
    var userid = localStorage.getItem('access_id');
    var data = {agentid:userid,ip:ip}
    this.http.post(`${this.apiUrl}/signin/setagentliveip/`, data).subscribe((data:any) => {
      //console.log(data);
    });
  }
  getLoginDetail(user) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/signin/getlogindetail/`,{id:user}).subscribe((data: any) => {
        //console.log(data['data'][0]);
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  forcelogout(user) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/signin/forcelogout/`,{user_id:user}).subscribe((data: any) => {
        //console.log(data['data'][0]);
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  userlogout() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var userid = localStorage.getItem('access_id');
      //console.log(userid);
      this.http.get(`${this.apiUrl}/signin/logout/` + userid).subscribe((data: any) => {
        // console.log("logout data");
        const removeToken = localStorage.removeItem('access_token');
        const username = localStorage.removeItem('username');
        const access_id = localStorage.removeItem('access_id');
        const newuserid = localStorage.removeItem('newuserid');
        const kycid = localStorage.removeItem('kycid');
        const user = localStorage.removeItem('user');
        const secret = localStorage.removeItem('secret');
        const voipstatus = localStorage.removeItem('voipstatus');    
        const feedback =localStorage.removeItem('feedback')
        localStorage.clear();
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
