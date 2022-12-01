import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZohoService {
  apiUrl = environment.apiUrl;
  private debouncedTimeout;
  constructor(private http: HttpClient, ) { }

  getZohoUsers(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/zoho/getzohousers/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getZohoAccessManager(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/zoho/getzohoaccessmanager/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  MapZohoUser(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/zoho/mapzohouser/`,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getZohoUserById(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/zoho/getzohouserbyid/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  enabledisabledclicktodial(id,type){
    return new Promise((resolve, reject) => {
      var data = {userid:id,action:type}
      this.http.post(`${this.apiUrl}/zoho/enabledisabledclicktodial/`,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  enabledisabledintegration(id,type){
    return new Promise((resolve, reject) => {
      var data = {userid:id,action:type}
      this.http.post(`${this.apiUrl}/zoho/enabledisabledintegration/`,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getZohoReloadUser(id){
    return new Promise((resolve, reject) => {
      var data = {userid:id}
      this.http.post(`${this.apiUrl}/zoho/reloadzohouser/`,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  removezohoaccount(id){
    return new Promise((resolve, reject) => {
      var data = {userid:id}
      this.http.post(`${this.apiUrl}/zoho/removezohoaccount/`,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  enabledisabledleadintegration(id,type){
    return new Promise((resolve, reject) => {
      var data = {userid:id,action:type}
      this.http.post(`${this.apiUrl}/zoho/enabledisabledleadintegration/`,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
