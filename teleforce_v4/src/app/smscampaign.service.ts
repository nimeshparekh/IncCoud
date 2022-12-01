import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map} from 'rxjs/operators';
import { Observable} from 'rxjs';
import { Campagins } from './components/sms/sms-campaign-detail/campagins';
import { Log } from './components/sms/sms-log/log';
@Injectable({
  providedIn: 'root'
})
export class SmscampaignService {
  apiUrl = environment.apiUrl;
  private debouncedTimeout;

  constructor(private http: HttpClient, ) { }


  getSMSCampaignsData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/smscampaign/getsmscampaignsdata/' ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getManagerSMSCampaignList(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/smscampaign/getmanagersmscampaignsdata/' ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  deleteSMSCampaign(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/deleteSMSCampaign/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getApproveSMSList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getApproveSMSList/'+userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveSMSCampaign(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/smscampaign/savesmscampaign/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSMSCampaignDetail(camid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getSMSCampaignDetail/' + camid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSMSCampaignSegment(camid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getSMSCampaignSegment/' + camid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getPromotionalSMSserver(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getPromotionalSMSserver/'+userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }  
  getSMSCampaignContactList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getSMSCampaignContactList/'+userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteCampaignContact(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/deleteCampaignContact/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSMSLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/smscampaign/getsmsloglength/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSMSTotalCredit(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/smscampaign/getsmstotalcredit/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSMStatus(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/smscampaign/getsmstatus/'+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveSMSLink(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/smscampaign/savesmslink/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateSMSLink(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/smscampaign/updatesmslink/',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSMSLinkList(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/smscampaign/getsmslinklist/'+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSMSLinkDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/smscampaign/getsmslinkdetail/'+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteSMSLink(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/smscampaign/deletesmslink/'+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getStatuswithContactCount(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/smscampaign/getstatuswithcontactcount/'+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getcampaignohitcount(numid) {
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getcampaignohitcount/'+numid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  } 
  getsmsdeliver(data){
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getsmsdeliver/'+data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  getsmssent(data){
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getsmssent/'+data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcampaigndetail(userid) {
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/getcampaigndetail/'+userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  gethitcount(userid) {
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/gethitcount/'+userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  } 

  searchsmscampaignumberdata(data){    
    return new Promise((resolve, reject) => {
      const headers = new Headers();
     // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl+'/smscampaign/searchsmscampaignumberdata/',data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  findContacts(filter,sortcolumn,sortdirection,pageNumber = 0, pageSize = 50):  Observable<Campagins[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = {user_id:userinfo,sortcolumn:sortcolumn,sortdirection:sortdirection,filter:filter,pageNumber:pageNumber,pageSize:pageSize}
    //console.log(params);
    return this.http.post(environment.apiUrl+'/smscampaign/searchsmscampaignnumberdata/',params).pipe(      
        map(res =>  res["payload"]
        )        
    );
  }
  searchsmscampaignumberlength(data){    
    return new Promise((resolve, reject) => {
      const headers = new Headers();
     // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl+'/smscampaign/searchsmscampaignumberlength/',data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  exportsmscampaignumberdatacsv(data){    
    return new Promise((resolve, reject) => {
      const headers = new Headers();
     // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl+'/smscampaign/exportsmscampaignumberdatacsv/',data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  findSMSLog(filter,sortcolumn,sortdirection,pageNumber = 0, pageSize = 50):  Observable<Log[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = {user_id:userinfo,sortcolumn:sortcolumn,sortdirection:sortdirection,filter:filter,pageNumber:pageNumber,pageSize:pageSize}
    //console.log(params);
    return this.http.post(environment.apiUrl+'/smscampaign/searchsmslogdata/',params).pipe(      
        map(res =>  res["payload"]
        )        
    );
  }
  
  searchsmsbalancedata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/smscampaign/searchsmsbalancedata/' ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  totalcountsmsgraph(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/smscampaign/totalcountsmsgraph/' ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTotalSMSCreditUsage(data){    
    return new Promise((resolve, reject) => {
      const headers = new Headers();
     // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl+'/smscampaign/gettotalsmscreditusage/',data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  searchsmslinkdata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/smscampaign/searchsmslinkdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  approvesmscampaign(camid) {
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/approvesmscampaign/'+camid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  } 
  rejectsmscampaign(camid) {
    return new Promise((resolve, reject) => {      
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/smscampaign/rejectsmscampaign/'+camid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  } 
  getlinkcountreport() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/smscampaign/getlinkcountreport').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchlinkcount(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/smscampaign/searchlinkcount', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  
  

  

}
