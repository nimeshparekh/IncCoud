import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Lead } from './components/erp-leadlist/lead';
import {  map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ErpService {
  apiUrl = environment.apiUrl;
  private savedLeadid;

  constructor(private http: HttpClient) { }


  get_lead(data) {
    //console.log('step 1');
    data.agentrole=localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_lead/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_lead_excel(data) {
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/get_lead_excel/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_lead_timeline_excel(data) {
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/get_lead_timeline_excel/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_lead_status_lead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_lead_status_lead', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getquotation_db(name) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getquotation_db', name).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getleadquotation(leadid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/getleadquotation/'+leadid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getleadquotationdetail(quotationid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/getleadquotationdetail/'+quotationid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_lead_status_notlead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_lead_status_notlead', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_customers() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_customers').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_system_user_assign_without_lead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_system_user_assign_without_lead', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getQuotation_status_order() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getQuotation_status_order', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  dynamic_lead_lists(pagerecord) {
    var agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/dynamic_lead_lists', { pagerecord: pagerecord,agentrole:agentrole }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  change_view_card_data() { 
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/change_view_card_data', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  change_view_card_data_search(data) {
    data.agentrole=localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/change_view_card_data_search', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  dynamic_lead_lists_unassign() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/dynamic_lead_lists_unassign', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Customer_list_api() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Customer_list_api', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_issue() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_issue').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveIssue(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/saveissue', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveLeadNote(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/save_leadnote', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  login() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/test', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  commentLeadNote(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/save_leadcomment', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  setSavedLeadid(data) {
    this.savedLeadid = data;
  }

  getSavedLeadid() {
    // let temp = this.savedGroupid;
    // this.clearSavedGroupid();
    return this.savedLeadid;
  }

  clearSavedLeadid() {
    this.savedLeadid = undefined;
  }

  get_projects() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_projects').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Opportunity_Type() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Opportunity_Type', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_user_list_filter() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_user_list_filter', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_sales_stage() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_sales_stage', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_Currency() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Currency', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_lead_Source() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/source_list', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Company() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/getCompany').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_contacts() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_contacts').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_customer_list() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_customer_list', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_lead_search(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/get_lead_search', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_ServiceLevelAgreement() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_ServiceLevelAgreement').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  post_Opportunity(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/post_Opportunity', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  update_Opportunity(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/update_Opportunity', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getEmailAccount() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/getEmailAccount').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  post_Lead(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/post_Lead', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  saveLeadQuotation(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/saveleadquotation', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateLeadQuotation(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/updateleadquotation', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  
  updateLeadAll(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/updateLeadAll', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  updateLeadAll_address(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/updateLeadAll_address', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_system_user_assign_lead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_system_user_assign_lead', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  assign_lead(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/assign_lead', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Salutation_list() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Salutation_list', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Designation() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Designation', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_Gender() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Gender', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_lead_stage_status() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_lead_stage_status', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_lead_stage_source() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_lead_stage_source', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  master_status() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/master_status', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  unassign_master_status() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/unassign_master_status', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Campaign() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Campaign', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Country() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Country', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_market_segment() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_market_segment', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_industry_type() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_industry_type', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getOpportunity_status_not_Quotation() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getOpportunity_status_not_Quotation', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getOpportunity_status_Quotation() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getOpportunity_status_Quotation', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Item() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_Item', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getActiveProduct() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getactiveproduct', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  sales_taxes_api() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/sales_taxes_api', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_qt(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data)
      this.http.post(environment.apiUrl + '/erp/get_qt', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  Tax_Category() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/Tax_Category', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  create_Customer(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/create_Customer', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  create_Customer_salesOrder(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/create_Customer_salesOrder', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_issuetype() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/getissuetype').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_PriceList() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_PriceList').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_Warehouse() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_Warehouse').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_SellingShippingRule() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_SellingShippingRule').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }



  get_salestaxesandchargestemplate() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_salestaxesandchargestemplate').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_couponcode() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_couponcode').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_paymentermstemplate() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_paymentermstemplate').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_termsconditions() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_termsconditions').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_purchaseorder() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_purchaseorder').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_leadsource() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_leadsource').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_letterhead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_letterhead').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_printheading() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_printheading').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_salespartner() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_salespartner').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_autorepeat() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_autorepeat').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  send_mail(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/send_mail', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  send_quotationmail(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/send_quotationmail', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  uploadpdf(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/uploadpdf', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  create_User(data1) {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/create_User', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getLeadDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getLeadDetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getLeadComments(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getLeadComments/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getLeadContacts(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getLeadContacts/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  save_whatsapp(data1) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/save_whatsapp', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  get_lead_status_won() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_lead_status_won', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_lead_status_lost() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/get_lead_status_lost', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  create_Item(data1) {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/create_Item', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  update_Item(data1) {

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //console.log(data1)
      this.http.post(environment.apiUrl + '/erp/update_Item', data1).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  /*getLeadTimeline(lid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getLeadTimeline', { lid: lid }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getLeadTimeline_whatsapp(lid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getLeadTimeline_whatsapp', { lid: lid }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }*/

  getLeadTimeline_status(lid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getLeadTimeline_status', { lid: lid }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getLeadFeedback(fid, cid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getleadfeedback', { formid: fid, cdrid: cid }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getLeadTimeline_feedback(lid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_lead_timeline_feedback', { lid: lid }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getLeadTimeline_email(lid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getLeadTimeline_email', { lid: lid }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getLeadTimeline_appointment(lid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getLeadTimeline_appointment', { lid: lid }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAgents(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getagents/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  check_lead_by_number(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/check_lead_by_number', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  count_won() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_won', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_won_date(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_won_date', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_negotiation() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_negotiation', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_negotiation_date(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_negotiation_date', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_lead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_lead', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_proposal_date(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_proposal_date', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_proposal() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_proposal', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_Junk_need_analysis() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_Junk_need_analysis', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_Junk_need_analysis_date(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_Junk_need_analysis_date', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_lead_date(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_lead_date', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_Junk_lead_date(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_Junk_lead_date', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  count_Junk_lead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/count_Junk_lead', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getStatus(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getstatus/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSource(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getsource/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getStages(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getstages/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatestages(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/updatestages/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  savestageData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/saveleadstageData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatestageData(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/updateleadstageData/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteleadstages(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/deleteleadstages/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getStagesstatus(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getStagesstatus/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getstagestatusbyid(data) {
    //console.log(data);

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/getstagestatusbyid/' + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  savestagestatus(data) {
    //console.log(data);

    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/savestagestatus/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updatestagestatus(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/updatestagestatus/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteleadstagesstatus(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/deleteleadstagesstatus/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getsmstemplate(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/getsmstemplate/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getemailtemplate(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/getemailtemplate/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  uploadcsv(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/uploadcsv', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  updateOtherDetail(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/updateotherdetail', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getActiveAgentGroup() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/getactiveagentgroup').subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  lead_assign_agent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/lead_assign_agent', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_module_access_generate_campaign() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_module_access_generate_campaign', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAccessSettingByName(id, name) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var data = { account_id: id, setting_name: name }
      this.http.post(environment.apiUrl + '/erp/getaccessettingbyname', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  sentMsgByWhatsupAPI(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/sentmsgbywhatsupapi', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  deleteleadsreq(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/deleteleadsreq/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  sendSMSToAgent(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.post(environment.apiUrl + '/erp/sendsmstoagent/' ,data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getdealdonedatabyleadid(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getdealdonedatabyleadid/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getEmailTemplateDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getemailtemplatedetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSegmentNameByLeadId(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getsegmentnamebyleadid/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  geerateHtmltoPDF(html) {
    //console.log(html);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/erp/geerateHtmltoPDF/` ,{ html:html}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_lead_status() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_lead_status', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  get_trigger_action_value(action) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_action_Value', {action:action}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  create_trigger(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/create_trigger', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_trigger_list(){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_trigger_list', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_supervisor_Stages(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/get_supervisor_Stages/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchleaddata(filter, sortcolumn, sortdirection, pageNumber = 0, pageSize = 50): Observable<Lead[]> {
   // console.log('service');
    let userinfo = localStorage.getItem('access_id');
    var params = { user_id: userinfo, sortcolumn: sortcolumn, sortdirection: sortdirection, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
    return this.http.post(environment.apiUrl + '/erp/searchleaddata/', params).pipe(
      map(res => res["payload"])
    );
  }
  getleaddatalength(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getleaddatalength/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLeadAgentDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getleadagentdetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getSMSTemplateDetail(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getsmstemplatedetail/` + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAdsNameByUserid(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/erp/getadsnamebyuserid/` , data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saveleadstatus(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/saveleadstatus/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  checkleadstatus(name){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(environment.apiUrl + '/erp/checkleadstatus/'+ name).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLeadTag(userid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getleadtags/` + userid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getNextLeadDetail(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/erp/getnextleaddetail/`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  
  getProductDetail(productid) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/products/getproductdetail/`+productid).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLeadStageNameByStatus(status) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getleadstagenamebystatus/` + status).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getManagers() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/erp/getmanagers/`).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  searchleaddata_isdeleted(filter, sortcolumn, sortdirection, pageNumber = 0, pageSize = 50): Observable<Lead[]> {
    // console.log('service');
     let userinfo = localStorage.getItem('access_id');
     var params = { user_id: userinfo, sortcolumn: sortcolumn, sortdirection: sortdirection, filter: filter, pageNumber: pageNumber, pageSize: pageSize }
     return this.http.post(environment.apiUrl + '/erp/searchleaddata_isdeleted/', params).pipe(
       map(res => res["payload"])
     );
   }
 
  getleaddatalength_isdelete(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/getleaddatalength_isdeleted/', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  delete_leads_restore_data(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/deleteleadsrestore/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAssignedSupervisorAgents(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/getassignedsupervisoragents/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAllLeadSource(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/getallleadsource/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getTicketLastStatus(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {user_id:userinfo}
      this.http.get(environment.apiUrl + '/erp/getticketlaststatus/' + id).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  Delete_all_lead_data(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/delete_all_lead_data', data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}

