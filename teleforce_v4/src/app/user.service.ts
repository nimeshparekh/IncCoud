import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.apiUrl;
  private debouncedTimeout;
  constructor(private http: HttpClient, ) { }

  getDIDRouting(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getdidrouting/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getDIDdetail(did_id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getDIDdetail/` + did_id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getOutgoingDID(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getoutbountdid/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateDIDconfig(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateDIDconfig/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  uploadsoundfile(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/uploadsound/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSoundList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getsoundlist/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getApproveSoundList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getApproveSoundList/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  deleteSound(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/deletesound/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIVR(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getivrlist/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIVRDetail(ivrid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getivrdetail/` + ivrid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveIVR(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveIVR/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateIVR(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateIVR/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteIVR(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteivr/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //Get Call Log
  getCallLog(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getcalllog/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //Get Call Log
  getLiveStatus(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getlivestatus/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //Get Call Log
  getOnCall(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getoncall/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgents(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getagents/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getManagerTime(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getmanagertime/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getAgentDatail(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getagentdetail/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentDetail(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getagentdetailbyid/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveAgent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateAgent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteAgent(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteagent/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  checkValidUsername(control) {
    const q = new Promise((resolve, reject) => {
      this.http.post(environment.apiUrl + '/signin/checkusername/', { check: control.value }).subscribe(data => {
        if (data['isexist']) {
          resolve({ 'name': true });
        } else {
          resolve(null);
        }
      });
    });
    return q;
  }
  getHuntgroup(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/gethuntgroup/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveHuntgroup(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveHuntgroup/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getHuntgroupDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getHuntgroupDetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateHuntgroup(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateHuntgroup/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteHuntgroup(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteHuntgroup/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAssignedAgents(groupid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getAssignedAgents/` + groupid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAssignedSupervisorAgentsByGroup(groupid, userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getgrouptosupervisoragent/` + userid + '/' + groupid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveAssignAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveAssignAgent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  AssignAgentsList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/AssignAgentsList/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteAssignAgent(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteAssignAgent/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  changepassword(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/changepassword/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  updateProfile(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateuser/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }

  updateWebhook(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updatewebhook/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }


  getLog(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getlog/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLogout(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getlogout/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchCallLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchCallLog/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  downloadAudio(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/downloadAudio/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchFeedbackform(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchFeedback/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getCallStatus(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getCallStatus/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentStatus(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getAgentStatus/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallDID(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getCallDID/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateSequenceno(id, no) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { id: id, seqno: no }
      this.http.post(environment.apiUrl + '/default/updateSequenceno/', data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallType(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getCallType/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getDisconnectedBy(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getDisconnectedBy/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgentCallLog(userid, calltypeid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { id: userid, type: calltypeid };
      this.http.post(`${this.apiUrl}/call/getagentcalllog/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgentMissedCallLog(userid, calltypeid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { id: userid, type: calltypeid };
      this.http.post(`${this.apiUrl}/call/getagentmissedcalllog/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getKycData() {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getkycdata/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getKycPendingData() {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getkycpendingdata/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  kycformData(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/savekycdata/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  updateAgentCallFeedback(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/updateAgentCallFeedback/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updatekycformData(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/updatekycdata/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {

        reject(error);
      });
    });
  }


  getAgentCallFeedback(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/call/getAgentCallFeedback/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  approvekyc(udata) {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/approvekyc/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  //
  agentOutgoingCall(agentid, mobile) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { agentid: agentid, mobile: mobile }
      this.http.post(environment.apiUrl + '/call/agentoutgoingcall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  agentScheduleOutgoingCall(agentid, mobile) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { agentid: agentid, mobile: mobile }
      this.http.post(environment.apiUrl + '/call/agentoutgoingcall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get kyc approve status
  getkycapprovestatus(id) {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getkycapprovestatus/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //Get Agent Current Call
  getAgentCurrentCall(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { id: agentid }
      this.http.post(environment.apiUrl + '/call/getagentcurrentcall1/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //Get agent top 20 recent call
  getAgentRecentCall(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/call/getagentrecentcall/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //Get agent top 20 recent products
  getAgentProducts(agentid) {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/products/getagentproducts/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchLiveCall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchLiveCall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchQueueCall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchQueueCall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  callmonitor(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/callmonitor/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  conferencecallwithmanager(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/conferencecallwithmanager/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //Add sclick to call script data
  saveClicktoCallScript(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveClicktoCallScript/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get click to call script data
  getClicktoCallScriptList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getClicktoCallScriptList/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteClicktoCallScript(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteClicktoCallScript/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getConferenceCall(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getConferenceCall/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getConferenceStatus(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getConferenceStatus/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveConferenceCall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/saveConferenceCall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateConferenceCall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/updateConferenceCall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getConferenceCallDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getConferenceCallDetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteConferenceCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/call/deleteConferenceCall/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get conference member with conference id
  getConferenceMembers(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getConferenceMembers/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  Getuserlimit(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getuserlimit/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total live call
  totalLiveCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalLiveCall/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total IVR call
  totalIVRCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalIVRCall/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total Miss call
  totalMissCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalMissCall/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total did numbers for manager
  totalDidNumbers(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalDidNumbers/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total today call for manager
  totalTodayCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalTodayCall/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total today incoming call for manager
  totalTodayIncomingCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalTodayIncomingCall/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total today outgoing call
  totalTodayOutgoingCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalTodayOutgoingCall/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get count total today missed call
  totalTodayMissedCall(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/totalTodayMissedCall/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //Get Agent Lead
  getAgentLead(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { id: id }
      this.http.post(`${this.apiUrl}/call/getagentassignlead/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //Agent Lead Call
  agentLeadCall(id, numid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { agentid: id, numid: numid }
      this.http.post(`${this.apiUrl}/call/agentleadcall/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLastDestination(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getlastdestination/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get interested,not interested,schedule feedback from manager
  getManagerLead(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //var data = { id: userid, feedback: feedback };
      this.http.post(`${this.apiUrl}/call/getmanagerleadwithfilter/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //get interested,not interested,schedule feedback from manager


  getFeedbackList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getfeedbacklist/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getCallFeedback(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getcallfeedback/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //get agent group and package from agent id
  getAgentGroupwithPackage(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getAgentGroupwithPackage/`).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //Get Miss Call Log
  searchMissCallLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/call/searchMissCallLog/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/searchAgent', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchLiveAllCall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchLiveAllCall', data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  // email temaplate 
  getEmailData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getemaildata/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getScheduleEmailData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getscheduleemaildata/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getScheduleSmsData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getschedulesmsdata/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //get template content
  getEmailTemplateData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getemaildetail/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  sendAdminEmail(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/sendadminemail/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateEmailData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateemaildata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveEmailData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveemaildata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getEmailDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getemaildetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteEmailData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteemaildata/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  // sms template..
  getSmsData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getsmsdata/` + userid).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSmsCampaign() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getsmscampaign/`).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  searchLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/liveagent', data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updatesmsData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updatesmsdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveSmsData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/savesmsdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  deleteSmsData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deletesmsdata/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsmsDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getsmsdetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get call status and count to show data in pie chart dashboard
  todayCallStatus(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/todayCallStatus/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get call type and count to show data in doughnut chart dashboard
  todayCallType(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/todayCallType/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchmaster(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/master/masterdata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //save start break time for agent
  startAgentBreakTime(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/startAgentBreakTimeWithReason/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //GET start break time for agent
  getAgentStartBreakTime(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/getAgentStartBreakTime/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //update stop break time for agent
  stopAgentBreakTime(userid, breakid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { user_id: userid, breakid: breakid }
      this.http.post(environment.apiUrl + '/setting/stopAgentBreakTime/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchCallLogexcel(data) {
    var agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent'
    data.agentrole = agentrole;
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchCallLogforexcel/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  kycDocumentView(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //var data = {status:status,id:id}
      this.http.get(environment.apiUrl + '/default/getkycviewdata/' + id).subscribe((data: any) => {
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

  getplanDetail(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getplandetail/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getKYCStatus(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getKYCStatus/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //serach data in manger lead manegment
  searchReqData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/searchReqData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get agent lead data in agent 
  getAgentdataLead(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/call/getagentdatalead/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get agent feedback in lead 
  getAgentleadFeedback(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/call/getAgentleadFeedback/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //update lead feedback in aget
  updateAgentleadFeedback(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/updateAgentleadFeedback/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchReqData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentcallSchedule(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var data = { id: userid, feedback: feedback };
      this.http.post(`${this.apiUrl}/call/getAgentcallSchedule/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCalldetailhistory(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getCalldetailhistory/` + data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getExtension(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getextension/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getNextcallSchedule(userid, feedback) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { feedback: feedback };
      this.http.post(`${this.apiUrl}/call/getNextcallSchedule/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  NotAssignAgentsList(userid, groupid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { userid: userid, groupid: groupid };
      this.http.post(`${this.apiUrl}/default/NotAssignAgentsList/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerCurrentplanDetail(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getManagerCurrentplanDetail/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveSMSConfig(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/saveSMSConfig/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSMSConfigDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/getSMSConfigDetail/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agentChangePassword(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/agentChangePassword/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  /*agentlocation(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/location/saveAgentLocation/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }*/
  //GET today break time for agent
  getAgentTodayBreakTime(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/getAgentTodayBreakTime/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentLocation(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/location/getAgentLocation/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchAgentLocation(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/location/searchAgentLocation/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //Call Control
  callhangup(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { callrefid: id }
      this.http.post(environment.apiUrl + '/zoho/hungupuri/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  calltransfer(id, agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { callrefid: id, agentid: agentid }
      this.http.post(environment.apiUrl + '/zoho/calltransfer/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  CheckZohoAgent(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { agentid: agentid }
      this.http.post(environment.apiUrl + '/zoho/checkzohouser/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get ANSWER and NO ANSWER call count
  todayCallStatusSummary(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/call/todayCallStatusSummary/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get agent wise assigned lead list
  getAgentAssignLead(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getAgentAssignLead/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //
  updateCallResult(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/updatecallresult/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentAnalytics() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiUrl + '/call/agentcallanalytics/', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //GET call Hold time for agent
  getCallStopTime() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/getCallStopTime/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //Hold Call for Agent
  startAgentHoldTime(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { status: data }
      this.http.post(environment.apiUrl + '/setting/startstopAgentHoldTime/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentQueue() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.post(environment.apiUrl + '/call/getagentqueuecall/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAllAgents() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.post(environment.apiUrl + '/default/getallagents/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatequeuecall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = data
      this.http.post(environment.apiUrl + '/call/updatequeuecall/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallHistory(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { id: id }
      this.http.post(environment.apiUrl + '/call/singlecallhistory/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getNotifications() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getnotifications/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcontactextrainfo(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { id: id }
      this.http.post(environment.apiUrl + '/contacts/getcontactextrainfo/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  // feedback forms 
  getFormsData() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getformdata/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getFormsDataById(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getformdatabyid/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //GET Agent contact data 
  getAgentContacts(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/contacts/getAgentContacts/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchAgentCallLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/call/searchagentcalllog/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchAgentMissedCallLog(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/call/searchagentmissedcalllog/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  savePlan(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();

      this.http.post(environment.apiUrl + '/default/savePlan/', data).subscribe((data: any) => {

        localStorage.setItem('newuserid', data['data'].insertId);
        resolve(data['data'].insertId);
      }, error => {
        reject(error);
      });
    });
  }

  addkycformData(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/savekycuserdata/', udata).subscribe((data: any) => {
        localStorage.setItem('kycid', data['data'].insertId);
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateuserkycformData(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/updateuserkycformData/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {

        reject(error);
      });
    });
  }

  updatePlan(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updatePlan/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getTempUser(username) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/gettempuser/` + username).subscribe((data: any) => {
        if (data.length > 0 && data['data'][0].userid > 0) {
          localStorage.setItem('newuserid', data['data'].insertId);
        }
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getTempKycData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/gettempkycdoc/` + userid).subscribe((data: any) => {
        if (data.length > 0 && data['data'][0].kycid > 0) {
          localStorage.setItem('kycid', data['data'].kycid);
        }
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getlmsdata(lead_id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getlmsdata/` + lead_id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getcontactdata(contid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getcontactdetail/` + contid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //save start break time for agent
  startAgentShiftTime(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/startAgentShiftTime/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  stopAgentShiftTime(userid, shiftid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { user_id: userid, shiftid: shiftid }
      this.http.post(environment.apiUrl + '/setting/stopAgentShiftTime/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //GET start break time for agent
  getAgentStartShiftTime(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/setting/getAgentStartShiftTime/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //GET today shift time for agent
  getAgentTodayShiftTime(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/getAgentTodayShiftTime/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveScheduleMeeting(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/saveScheduleMeeting/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveTemplate(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/template/saveDupTemplate/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getrequestedreport(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getrequestedreport/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  searchMissedCallData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchMissedcall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  forcelogout(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { user_id: userid }
      this.http.post(environment.apiUrl + '/signin/forcelogout', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentLiveStatus(group) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/getagentlivestatus/`, { group: group }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getFreeAgents() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.post(environment.apiUrl + '/default/getfreeagents/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTickets(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.post(environment.apiUrl + '/default/getTickets/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  createticket(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/savesmsdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  updateticket(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateticket/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  geticketdetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/geticketdetail/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getScheduleList(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getschedulelist/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getComingScheduleList(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getcomingschedulelist/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getScheduleCustomerList(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getcustomerschedulelist/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getScheduleCustomerListMeet(meetid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getcustomerschedulelistmeet/` + meetid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgentTime(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getagenttime/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgentTimeMeet(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getagenttimemeet/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getScheduleCustomerListManager(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getcustomerschedulelistmanager/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getCustomerBasicDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getleaddetail/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getScheduleManagerList(agentid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getschedulemanagerlist/` + agentid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  // email server data
  getEmailServerData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getemailserverdata/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getEmailServerDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getemailserverdetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  updateEmailserverData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/updateemailserverdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveEmailServerData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/saveemailserverdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  deleteEmailServerData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/deleteemailserverdata/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveConfiguration(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/saveConfiguration/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveCalenderConfiguration(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/SaveCalenderConfugurationMeta/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getConfiguration(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/getConfiguration/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getCalenderConfiguration(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/getCalenderConfiguration/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveNote(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/admin/savenotes/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }

  findconferencechart(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/findconferencechart/` + id).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSegments(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/contacts/getSegments/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getreportdata(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getreportdata/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveschedulereport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveschedulereport/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  getSechudelreportData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getsechudelreportdata/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getReasonData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getReasonData/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveHoldCallingReasonData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveHoldCallingReasonData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateReasonData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateReasonData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteReasonData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/deleteReasonData/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getReasonDetailData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getReasonDetailData/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  requestdemo(form) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(` api/default/requestdemo`, form).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getActiveAgents(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getactiveagents/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallReviewForm(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getCallReviewForm/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerCallReviewForm(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getManagerCallReviewForm/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveCallReviewFormData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/saveCallReviewFormData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateCallReviewFormData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updateCallReviewFormData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteCallReviewFormData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/deleteCallReviewFormData/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallReviewFormDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getCallReviewFormDetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveReviewRate(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/savereviewrate/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getReviewRate(cdrid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var data = {account_id:accountid,audioid:audioid,agentid:agentid}
      this.http.get(`${this.apiUrl}/default/getreviewrate/` + cdrid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveHeaderFooterSetting(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/saveheaderfootersetting/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {

        reject(error);
      });
    });
  }
  uploadHeaderImage(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/uploadheaderimage/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {

        reject(error);
      });
    });
  }
  uploadFooterImage(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/uploadfooterimage/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {

        reject(error);
      });
    });
  }
  getHeaderFooterSetting(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getheaderfootersetting/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {

        reject(error);
      });
    });
  }
  getcdrdetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getcdrdetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {

        reject(error);
      });
    });
  }
  // 
  generatecampaignfromLMS(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/generatecampaign/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //
  acwAgentHoldTime(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { status: data }
      this.http.post(environment.apiUrl + '/setting/acwAgentHoldTime/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgentAccessSetting(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/setting/getagentaccesssetting/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveAgentLeadAccessSetting(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/setting/saveagentleadaccesssetting/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getmorenotification() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getmorenotification/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsounddata(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();

      this.http.get(`${this.apiUrl}/default/getsounddata/` + userid).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchCallPulse(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchCallPulse/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  hangupqueuecall() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/hangupqueuecall/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveAgentConsultantData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/default/saveagentconsultantdata/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentConsultantData() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/default/getagentconsultantdata/`, {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentConsultantDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getagentconsultantdetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateAgentConsultantData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/default/updateagentconsultantdata/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  serachcampagindata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/contacts/serachcampagindata/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  calldisconnect(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { callrefid: id }
      this.http.post(environment.apiUrl + '/call/calldisconnect/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentcalllog(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/call/getagents/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveSupervisorAssignAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/savesupervisorassignagent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAssignedSupervisorAgents(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getAssignedSupervisorAgents/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  UnassignSupervisorAgentsList(id, groupid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { userid: id, groupid: groupid }
      this.http.post(`${this.apiUrl}/default/unassignsupervisoragentslist/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteSupervisorAssignAgent(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deletesupervisorassignagent/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchSupervisorAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/searchSupervisorAgent', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  agentdeleteshoft(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/agentdeleteshoft/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getdeleteAgentdata(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getdeleteAgentdata/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getinactiveAgents(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getinactiveAgents/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  accesssetting(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/setting/accesssetting/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //searchsupervisiorCallPulse
  searchsupervisiorCallPulse(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/searchsupervisiorCallPulse/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  search_supervisior_MissedCallData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/search_supervisior_MissedCallData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  search_supervisior_Feedbackform(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/search_supervisior_feedback/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  assignAgentLeadstoAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/assignAgentLeadstoAgent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  Notassignsupervisior(userid, groupid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { userid: userid, groupid: groupid };
      this.http.post(`${this.apiUrl}/default/Notassignsupervisior/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  save_assign_to_supervisior(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/save_assign_to_supervisior/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getassignsupervisior(groupid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getassignsupervisior/` + groupid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteassignsupervisior(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteassignsupervisior/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatesmsvariablesData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/updatesmsvariablesdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLeadTag(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getleadtags/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveleadtagdata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/setting/saveleadtagdata/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateleadtagdata(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/setting/updateleadtagdata/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getleadtagbyid(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getleadtagbyid/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteleadtagdata(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/deleteleadtagdata/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLeadTagAssignAgents(groupid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getleadtagassignagents/` + groupid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  UnassignLeadTagAgentsList(id, tagid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { userid: id, tagid: tagid }
      this.http.post(`${this.apiUrl}/setting/unassignleadtagagentslist/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveLeadTagAssignAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/saveleadtagassignagent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteLeadTagAssignAgent(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/setting/deleteleadtagassignagent/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentLeads(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //var data = { id: userid, feedback: feedback };
      this.http.post(`${this.apiUrl}/call/getagentleadfilter/`, data).subscribe((data: any) => {

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  scheduleAgentCall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/call/scheduleagentcall/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteallnotification() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/deleteallnotification/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getDholeraAgentDealDoneData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/getdholeraagentdealdonedata/', data).subscribe((data: any) => {
        //console.log(data);
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  uploadConsultantPhotoImage(udata) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/uploadconsultantphotoimage/', udata).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  uploadticketfile(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/setting/uploadticketfile/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIssueTypeList(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getissuetypes/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveIssueTypeData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/setting/saveissuetypedata/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateIssueTypeData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/setting/updateissuetypedata/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIssueTypeById(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/getissuetypebyid/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteIssueTypeData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/deleteissuetypedata/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAdminAccessSetting(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/setting/getadminaccesssetting/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  save_admin_setting(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/setting/save_admin_setting/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTicketStatusCount(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.post(environment.apiUrl + '/default/getticketstatuscount/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTicketTimeline(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.get(environment.apiUrl + '/default/gettickettimeline/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTicketDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.get(environment.apiUrl + '/default/getticketdetail/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  addTicketNote(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.post(environment.apiUrl + '/default/addticketnote/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //sent sms to customer for raise ticket solution
  sendSMSToCustomer(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/sendsmstocustomer/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTicketAssignAgentDetail(ticketid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/default/getticketassignagentdetail/' + ticketid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  sendticketmail(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/default/sendticketmail', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  uploadticketemailpdf(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/uploadticketemailpdf', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveTicketWhatsapp(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/saveticketwhatsapp', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  sentTicketMsgByWhatsupAPI(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/sentticketmsgbywhatsupapi', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getActiveSalesGroupAgents() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getactivesalesgroupagents/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  changeTicketAssignAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/default/changeticketassignagent/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getNotAssignedTicket() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/getnotassignedticket/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_admin_acitivy_log(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {}
      this.http.post(environment.apiUrl + '/default/get_admin_acitivy_log/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  checkotp(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/default/checkotp/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  requestotp(mobile) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/requestotp/` + mobile).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveSignupData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/default/signup/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  change_feedback_view_card_data(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/call/change_feedback_view_card_data/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_manager_id() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/default/get_manager_id/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_supervisior_FormsData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/setting/get_supervisior_FormsData/`+id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCallHistoryByMobile(mobile) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = { mobile: mobile }
      this.http.post(environment.apiUrl + '/call/singlecallhistorybymobile/', params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getActiveAgents2(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/default/getactiveagents_2/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}



