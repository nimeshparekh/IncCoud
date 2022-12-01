import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Contact } from './components/contact-list/contact';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  apiUrl = environment.apiUrl;
  private debouncedTimeout;

  constructor(private http: HttpClient, ) { }

  deletecampaignlist(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/deletecampaign/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getallcampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getallcampaign/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getallvoipcampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getallvoipcampaign/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  gethuntgroup(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/gethuntgroup/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getCategorylist(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getallcontact/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getdidrouting(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getoutbountdid/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getmanager(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getmanager/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getivrlist(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getivrlist/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveCampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/contacts/createcampaign/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSegmentwithTotalContact(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getSegmentwithTotalContact/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign detail from campaign id
  getCampaignDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getCampaignDetail/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //get campaign detail from campaign id
  getCampaignCallLog(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getCampaignCallLog/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaignCallSummary(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getCampaignCallSummary/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign agent from campaign id
  getCampaignAgent(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getCampaignAgent/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign DID from campaign id
  getCampaignDID(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getCampaignDID/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //filter campaign call log 
  searchCampaignCallLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/searchCampaignCallLog/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign call log type
  getCampaignCallType(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getCallType/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign agents from  call log
  getAgentsCampaignCallLog(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getagentscampaigncalllog/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //  delete campaign agent
  deleteCampaignAgent(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/deleteCampaignAgent/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //  delete campaign did
  deleteCampaignAssignDID(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/deleteCampaignAssignDID/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveCampaignDID(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/saveCampaignDID/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaigAssignChannel(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getCampaigAssignChannel/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaigAssignAgent(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getCampaigAssignAgent/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaigAssignSupervisorAgent(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getCampaigAssignSupervisorAgent/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  predectiveassignAgentList(userid,campid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/predectiveassignAgentList/` + userid+`/`+campid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveCampaignAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/saveCampaignAgent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchCampaignCallLogexcel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/searchCampaignCallLogexcel/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaignSegment(camid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getCampaignSegment/' + camid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveCampaignContact(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/contacts/saveCampaignContact/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  savevoipCampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/contacts/savevoipCampaign/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getratedate(data) {
   // var data ={id:id,userid:userid}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getratedate/'+data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getConferenceDID() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/call/getConferenceDID/',{}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  ReGenerateCampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/contacts/regeneratecampaign/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deletecampaingnreq(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/contacts/deletecampaingnreq/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcampaigunassignagent(userid,camid) {
    var data = {userid:userid,camid:camid}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/contacts/getcampaigunassignagent/` ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcampaigunassignsupervisoragent(userid,camid) {
    var data = {userid:userid,camid:camid}
    //console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/contacts/getcampaigunassignsupervisoragent/` ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  savescheduleform(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/contacts/savescheduleform/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcampaignscheduledata(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getcampaignscheduledata/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatescheduleform(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/contacts/updatescheduleform/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getrunningCampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getrunningCampaign/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getcompaleteCampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getcompaleteCampaign/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSupervisorSegmentwithTotalContact(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getSupervisorSegmentwithTotalContact/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSegmentTotalContact(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/contacts/getsegmenttotalcontact/' ,{segmentarr:data}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAllOBDcampaign(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/obdcampaign/getallobdcampaign/' +userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  getOBDcampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/obdcampaign/getobdcampaign/' , data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveOBDCampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/obdcampaign/createobdcampaign/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallDisposition(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/getcalldisposition/'+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  searchOBDCampaignCallLogexcel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/obdcampaign/searchOBDCampaignCallLogexcel/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  findCalllog(filter,sortcolumn,sortdirection,pageNumber = 0, pageSize = 50):  Observable<Contact[]> {
    let userinfo = localStorage.getItem('access_id');
    var params = {user_id:userinfo,sortcolumn:sortcolumn,sortdirection:sortdirection,filter:filter,pageNumber:pageNumber,pageSize:pageSize}
    return this.http.post(environment.apiUrl+'/obdcampaign/CampaignCallLog',params).pipe(
        map(res =>  res["payload"])
    );
  }

  deleteOBDcampaingn(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/obdcampaign/deleteobdcampaingn/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  changecampaignaction(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/obdcampaign/changecampaignaction/' , data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  OBDCampaignCallLogLength(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/obdcampaign/obdcampaigncalloglength/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  ReGenerateOBDCampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/obdcampaign/regenerateobdcampaign/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getOBDCampaignCallSummary(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/obdcampaign/getobdcampaigncallsummary/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign detail from campaign id
  getOBDCampaignDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/obdcampaign/getcampaigndetail/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getobdcampaignratedate(data) {
    // var data ={id:id,userid:userid}
     return new Promise((resolve, reject) => {
       const headers = new Headers();
       this.http.get(environment.apiUrl + '/obdcampaign/getobdcampaignratedate/'+data).subscribe((data: any) => {
         resolve(data);
       }, error => {
         reject(error);
       });
     });
  }
  getOBDCampaignAgent(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/obdcampaign/getobdcampaignagent/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getOBDCallDisposition(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/obdcampaign/getobdcalldisposition/'+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  delete_campagin_data(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/delete_campagin_data/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  delete_agent_camp(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/contacts/delete_agent_camp/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  update_call_ratio(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/update_call_ratio/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchpendingdata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/searchpendingdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
