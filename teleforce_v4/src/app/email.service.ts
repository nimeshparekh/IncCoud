import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Campagins } from './components/email/email-campaign-detail/campagins';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Log } from './components/email/email-log/log';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getEmailCampaignsData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/email/getemailcampaignsdata/' ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getemailtemplatedata() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/email/getemailtemplatedata/`,{}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getStagesList(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/smscampaign/getstatuswithcontactcount/`+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //
  saveemailcampagin(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/email/saveemailcampagin/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  searchCampaignEmailLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/email/searchCampaignEmailLog/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getcampaigndetail(userid) {
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/email/getcampaigndetail/'+userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  findCalllog(filter,sortcolumn,sortdirection,pageNumber = 0, pageSize = 50):  Observable<Campagins[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = {user_id:userinfo,sortcolumn:sortcolumn,sortdirection:sortdirection,filter:filter,pageNumber:pageNumber,pageSize:pageSize}
    return this.http.post(environment.apiUrl+'/email/CampaignEmailLog',params).pipe(
        map(res =>  res["payload"])
    );
  }
  getcampaignsummary(campaignid) {
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/email/getcampaignsummary',{campaignid:campaignid}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getEmailLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/email/getemaillog/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchemailcountgraph(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/email/searchemailcountgraph/' ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  findEmailLog(filter,sortcolumn,sortdirection,pageNumber = 0, pageSize = 50):  Observable<Log[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = {user_id:userinfo,sortcolumn:sortcolumn,sortdirection:sortdirection,filter:filter,pageNumber:pageNumber,pageSize:pageSize}
    //console.log(params);
    return this.http.post(environment.apiUrl+'/email/searchemaillogdata/',params).pipe(      
        map(res =>  res["payload"]
        )        
    );
  }
  regenerateemailcampagin(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/email/regenerateemailcampagin/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  redirect_email_to_lms(data) {
    var email = {email:data};
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/email/redirect_email_to_lms/', email).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
