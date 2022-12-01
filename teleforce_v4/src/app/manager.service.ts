import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getManagers(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getManagers/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerDetail(managerid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getManagerDetail/` + managerid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTempManagerDetail(managerid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getTempManagerDetail/` + managerid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveManager(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/saveManager/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateManager(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/updateManager/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  create_subscription(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/create_subscription/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  update_erp_manager(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/updateErpManager/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  renewManagerPackage(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/renewManagerPackage/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteManager(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/manager/deleteManager/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerChannels(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getManagerChannels/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAssignChannel(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getAssignChannel/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveManagerChannel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/saveManagerChannel/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsounddata() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(`${this.apiUrl}/manager/getsounddata/`);

      this.http.get(`${this.apiUrl}/manager/getsounddata/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  Pendingsounddata() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/Pendingsounddata/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsoundapprovestatus(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(`${this.apiUrl}/manager/getsoundapprovestatus/`);

      this.http.get(`${this.apiUrl}/manager/getsoundapprovestatus/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  savesoundstatus(udata) {
    //console.log("hello" + JSON.stringify(udata));
    //console.log(environment.apiUrl + '/manager/savesoundstatus/', udata);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/savesoundstatus/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  changeStatus(status, id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { status: status, id: id }
      this.http.post(environment.apiUrl + '/manager/changeStatus/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  kycDocumentData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //var data = {status:status,id:id}
      this.http.get(environment.apiUrl + '/default/getkycformdata/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteAssignChannel(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/manager/deleteAssignChannel/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //update manager module access service
  updateService(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/updateManagerService/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  expireremine(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getexpire/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  expire(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/expire/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getBillingData(managerid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getBillingData/` + managerid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsubscriptionData(managerid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getsubscriptionData/` + managerid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  change_subscription(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/change_subscription/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  generateinvoice(billid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/generateinvoice/` + billid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallloghistory(data) {
    //console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(this.http.get(`${this.apiUrl}/call/getCallloghistory/` + data));

      this.http.get(`${this.apiUrl}/call/getCallloghistory/` + data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getfeedback(data) {
    //console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/get_Call_feedback_data/` + data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getcalllogaudio(data) {
    //console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getcalllogaudio/` + data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getVendordata() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getVendordata`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getVenderByid(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getVenderByid/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  updateVenderData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/updateVenderData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveVendorData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/saveVendorData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  deleteVendorData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/manager/deleteVendorData/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchVendor(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      //console.log(this.http.post(environment.apiUrl + '/manager/searchVendor', data));

      this.http.post(environment.apiUrl + '/manager/searchVendor', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerRenewPackageDetail(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getManagerRenewPackageDetail/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getagentdetail(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getagentdetail/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getVendorList(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getVendorList/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchVendorlist(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      //console.log(this.http.post(environment.apiUrl + '/manager/searchVendorlist', data));

      this.http.post(environment.apiUrl + '/manager/searchVendorlist', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAssignSmsServer(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getAssignSmsServer/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveManagerSmsServer(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/saveManagerSmsServer/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerSmsServer(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getManagerSmsServer/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteAssignSmsServer(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/manager/deleteAssignSmsServer/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  directLogin(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/directLogin/',data).subscribe((data: any) => {
        if (data['islogin']) {
          localStorage.setItem('access_token', data['access_token']);
          localStorage.setItem('access_id', data['user'].id);
          localStorage.setItem('username', data['user'].name);
        }
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  checkManagerMobile(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/findmanagermobile/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  checkMobileOTP(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/checkMobileOTP/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  changeManagerPassword(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/changeManagerPassword/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAuthKey(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/tfapi/generateauthkey/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  gettempuser() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/gettempuser`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  tempkycDocumentData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //var data = {status:status,id:id}
      this.http.get(environment.apiUrl + '/manager/gettempkycformdata/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  gettempusernamebyid(managerid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/gettempusernamebyid/` + managerid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  gettemptransctiondata(managerid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/gettemptransctiondata/` + managerid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  saveTempManager(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/saveTempManager/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //update manager module access service
  updateDigitalAccess(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/updateDigitalAccess/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcustomapi(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/getcustomapi/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deletecustomapi(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/deletecustomapi/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcustomapibyid(data) {
    //console.log("getdara",data);
    
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getcustomapibyids/` + data).subscribe((data: any) => {

      // this.http.post(environment.apiUrl + '/manager/getcustomapibyids',data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  savecustomapi(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/savecustomapi/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatecustomapi(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/updatecustomapi/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchcustomapi(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/searchcustomapi/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getDholaraCompany() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getdholeracompany/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getDholeraProjects(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/erp/getdholeraprojects/`,{companyid:id}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getDholeraPlotNumbers(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/erp/getdholeraplotnumber/`,{id:id}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getDholeraPlotProposals(name) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/erp/getdholeraplotproposal/`,{name:name}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getDholeraDealers() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getagentdealerdata/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveLeadDealDoneData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/erp/saveleaddealdonedata/`,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchmanagaerdata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/searchmanagaerdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  supervisiordirectLogin(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/manager/supervisiordirectLogin/',data).subscribe((data: any) => {
        if (data['islogin']) {
          localStorage.setItem('access_token', data['access_token']);
          localStorage.setItem('access_id', data['user'].id);
          localStorage.setItem('username', data['user'].name);
        }
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatedispotiondata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/updatedispotiondata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  savedispotiondata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/savedispotiondata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getdispotion(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/getdispotion/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getdispositionbyid(data) {
    //console.log("getdara",data);
    
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/getdispositionbyid/` + data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deletedispositon(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/deletedispositon/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallRoutingDetail(cdrid) {
    //console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();

      this.http.get(`${this.apiUrl}/call/getcallroutingdetail/` + cdrid).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //for dholera deal done
  getLeadGenerator() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getleadgenerator/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_ip_for_instert_data(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/manager/get_ip_for_instert_data/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_all_managers_account_status(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/get_all_managers_account_status/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  active_user_account_status(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/active_user_account_status/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  expire_user_account_status(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/manager/expire_user_account_status/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIVRRoutingDetail(cdrid) {
    //console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();

      this.http.get(`${this.apiUrl}/call/getivrroutingdetail/` + cdrid).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
