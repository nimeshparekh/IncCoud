import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, ) { }

  searchCallSummary(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/searchCallSummary', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  agentLoginLogoutData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentLoginLogoutData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  gentLoginActivityData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentLoginActivityData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  agent_performance_data(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agent_performance_data', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getResourceAvailability() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getResourceAvailability').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agentHourlyCallData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentHourlyCallData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  hourlyCallData(data) {
    //console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/hourlyCallData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getBillingReport() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getBillingReport').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  managerDialResultData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/managerDialResultData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerCampaignData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getManagerCampaignData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentCallDurationData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getAgentCallDurationData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  managerCallBackSummary(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/managerCallBackSummary/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  managerCallBackDetail(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/managerCallBackDetail/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getChannelUtilizationData() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getChannelUtilizationData').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getRenewalBillingData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getRenewalBillingReport', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerMinuteAssignData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getManagerMinuteAssignData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSpamDIDdata() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getSpamDIDdata').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getPackageCallDurationData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getPackageCallDurationData/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  createinvoice(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}  
      this.http.post(environment.apiUrl + '/report/createinvoice/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIVRExtension(ivrid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/report/getIVRExtension/' + ivrid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerIVRInputs(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}  
      this.http.post(environment.apiUrl + '/report/getManagerIVRInputs/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getobdpulsereport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}  
      this.http.post(environment.apiUrl + '/report/getobdpulsereport/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getusercount() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getusercount/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getExpriedusercount() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getExpriedusercount/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getNewusercount() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getNewusercount/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchUserReportData(start, end) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      var data = { start: start, end: end }
      this.http.post(environment.apiUrl + '/report/searchUserReportData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentLoggedTime(agentid, start, end) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      var data = { agentid: agentid, start: start, end: end }
      this.http.post(environment.apiUrl + '/report/getAgentLoggedTime/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get ANSWER  call count lead
  hourlyAnswerCall(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/hourlyCallData/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  planMinutesData(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/report/planMinutesData/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign wise answer call lead agent count
  getPlanExpiryData(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/report/getPlanExpiryData/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //download excel file for call summary data 
  downloadStatusExcel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/downloadStatusExcel/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //download excel file for hourly call data 
  downloadHourlyCallExcel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/downloadHourlyCallExcel/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  downloadCampaignCallExcel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/downloadCampaignCallExcel/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaignCallCount(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/getCampaignCallCount/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerCampaigns(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/report/getManagerCampaigns/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerUserData() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getManagerUserData').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get campaign wise answer call lead agent count
  campaignCallLeadAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/campaignCallLeadAgent/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get hour wise answer call lead
  campaignAnswerCallLead(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/campaignAnswerCallLead/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get lead and date time wise agent
  hourlyCallLeadAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/hourlyCallLeadAgent/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get hour wise answer call lead
  hourlyAnswerCallLead(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/hourlyAnswerCallLead/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  //get ANSWER  call count lead
  todayAnswerCallLead(userid, sdate, edate) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { userid: userid, startdate: sdate, enddate: edate }
      this.http.post(`${this.apiUrl}/report/todayAnswerCallLead/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  //get lead wise agent count 
  todayCallLeadAgent(userid, lead, sdate, edate) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { userid: userid, lead: lead, startdate: sdate, enddate: edate };
      this.http.post(`${this.apiUrl}/report/todayCallLeadAgent/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getUserSMSBalance(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getUserSMSBalance/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTotalCalls(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getTotalCalls/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getManager(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/report/getmanagerlist/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getPackageManager(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getPackageManagerCalc/' + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getMostConvertedCallData(data) {
    // console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getMostConvertedCallData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaignPerformance(data) {
    // console.log(data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getCampaignPerformance', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  recordingrequest(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/recordingrequest', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  recordingrequestlist(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/recordingrequestlist', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  callsummaryreportexcel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/callsummaryreportexcel/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agentHoldCallingReasonData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentHoldCallingReasonData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agentAdherenceGraphReport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentadherencegraphreport', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agentPerformanceGraphData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentperformancegraphdata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentCallDurationGraphData(data) {
    //console.log(data)
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getagentcalldurationgraphdata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagerCampaignGraphData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getManagerCampaignGraphData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIVRInputsGraphData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}  
      this.http.post(environment.apiUrl + '/report/getivrinputsgraphdata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  gentLoginActivityGraphData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getagentloginactivitygraphdata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }



  getACWGraphData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/searchacwgraphdata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgentMissedCallGraphData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getagentmissedcallgraphdata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  agentReviewRateData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentreviewratedata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  agentHoldCallingReasonSummaryData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentHoldCallingReasonSummaryData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getIVRCampaign(ivrid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/report/getIVRCampaign/' + ivrid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgents(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/report/getactiveagents/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getallcampaign(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/report/getallcampaign/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsupervisiorCampaignDispositionData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/get_supervisior_campaign_disposition_data/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getDispositionCampaign() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getdispositioncampaign/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  calltrafficreport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/calltrafficreport', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  hourlycallreportgraph(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/hourlycallreportgraph', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsalesfunnelreport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getsalesfunnelreport', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getleadsourcereport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getleadsourcereport', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getQueueCalls(data) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      this.http.post(environment.apiUrl + '/report/getqueuecalls', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });

    });
  }
  search_call_usage_report(data) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      this.http.post(environment.apiUrl + '/report/search_call_usage_report', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });

    });
  }
  agent_performance_report_data(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agent_performance_report_data', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agent_break_time_report(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agent_break_time_report', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  total_break_time_report(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/total_break_time_report', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  callsupiviosertrafficreport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/callsupiviosertrafficreport', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  hourlysupiviorcallreportgraph(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/hourlysupiviorcallreportgraph', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAgentLiveStatus(group) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/report/getsupervisioragentlivestatus/`, { group: group }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsupervisiorsalesfunnelreport(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getsupervisiorsalesfunnelreport', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agent_supervisior_break_time_report(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agent_supervisior_break_time_report', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agent_supervisior_ReviewRateData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agent_supervisior_ReviewRateData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  supervisior_agentPerformanceData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/supervisior_agentPerformanceData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agentsupervisiorHoldCallingReasonSummaryData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentsupervisiorHoldCallingReasonSummaryData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  agentsupervisiorHoldCallingReasonData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/agentsupervisiorHoldCallingReasonData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  supervisior_agentLoginLogoutData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/supervisior_agentLoginLogoutData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_supervisior_AgentCallDurationData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/get_supervisior_AgentCallDurationData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsupervisiorCampaignData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getsupervisiorCampaignData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  supervisiorgetDispositionCampaign() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/report/getsupervisiordispositioncampaign/').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCampaignDispositionData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/getcampaigndispositiondata/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_supervisior_LoginActivityData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/get_supervisior_agent_login_activity', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_agent_callduration_talktime(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/get_agent_callduration_talktime/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  segement_wise_call_log(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/segement_wise_call_log/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  incoming_misscall_reports(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/incoming_misscall_reports/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  XLNCagentPerformanceData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/xlncagentperformancedata', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  new_caller_report(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/new_caller_report/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  supervisior_xlncagentPerformanceData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/report/supervisior_xlncagentPerformanceData', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getcommonagentperformnace(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}  
      this.http.post(environment.apiUrl + '/report/getcommonagentperformnace/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
