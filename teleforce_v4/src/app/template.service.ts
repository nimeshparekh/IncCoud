import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, ) { }

  getApproveSMSTemplate() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/template/getApproveSMSTemplate/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getApproveSMSList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/template/getApproveSMSList/'+userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTransactionalSMSserver() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/template/getTransactionalSMSserver/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveEmailTemplate(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log("email template step 11");
      //console.log(JSON.stringify(data));
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/template/saveEmailTemplate/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  updateEmailTemplate(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/template/updateEmailTemplate/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getEmailTemplate(emailid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/template/getEmailTemplate/'+emailid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getApproveEmailList() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/template/getApproveEmailList/',{}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getApprovedAPI() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/template/getApprovedAPI/',{}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveWhatsappTemplate(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      console.log("email template step 11");
      console.log(JSON.stringify(data));
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/template/savewhatsapptemplate/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  updateWhatsappTemplate(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/template/updatewhatsapptemplate/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  getWhatsappTemplate(emailid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/template/getwhatsapptemplatedetail/'+emailid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getWhatsappTemplateData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/template/getwhatsapptemplatedata/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteWhatsappTemplateData(emailid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/template/deletewhatsapptemplatedata/'+emailid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatemailvariablesData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/template/updatemailvariablesdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}


