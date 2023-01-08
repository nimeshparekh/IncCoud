import { Component, OnInit,Inject } from '@angular/core';
import { ErpService } from './../../erp.service';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl,FormArray,ValidationErrors } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {ThemePalette} from '@angular/material/core';
import { AuthService } from '../../auth.service';
import { ManagerService } from '../../manager.service';
import { BaseComponent } from '../base/base.component';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareWhatsappComponent } from '../share-whatsapp/share-whatsapp.component';
import { ScheduleMeetingComponent } from '../schedule-meeting/schedule-meeting.component';
// import * as faker from 'faker';
import { LeadEmailSendComponent,LeadSmsSendComponent} from '../lead-details/lead-details.component'
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-erp-module',
  templateUrl: './erp-module.component.html',
  styleUrls: ['./erp-module.component.css']
})
export class ErpModuleComponent implements OnInit {
  isDisabled = false;
  isLoading= false;
  viewoftable: boolean = false;
  viewofgrid: boolean = true;
  erp_list;
  erp_list_not_lead;
  getQuotation;
  Opportunity_not_Quotation;
  Opportunity_Quotation;
  get_Customer_list;
  erp_list_won = []
  erp_list_lost = []
  dist = []
  settings=[];
  constructor(
    public authService: ErpService,
    public AuthService: AuthService,
    public managerservice: ManagerService,
    public dialog: MatDialog,
    private router: Router,
    private basecomponent: BaseComponent,
    private userservice: UserService, 
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { 
    this.formGroup = formBuilder.group({
      enableWifi: false,
    });
    this.formGroup_change = formBuilder.group({
      enable_list: this.list_view,
    });
  }
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  erp_list_isLoading = true
  erp_list_isLoading_deal = false;
  erp_list_not_lead_isLoading = true
  erp_list_not_lead_isLoading_deal = false;
  Opportunity_not_Quotation_isLoading = true
  Opportunity_not_Quotation_isLoading_deal = false
  Opportunity_Quotation_isLoading = true
  Opportunity_Quotation_isLoading_deal = false;
  getQuotation_isLoading = true
  get_Customer_list_isLoading = true
  get_Customer_list_isLoading_deal = false;
  erp_list_won_isLoading = false
  erp_list_lost_isLoading = false
  totallead = 0
  amount_lead = {
    'lead':0,
    'open':0,
    'quotation':0,
    'opportunity':0,
    'won':0,
    'lost':0
  }
  totalnotlead = 0
  totalwon = 0
  totallost = 0
  isagent = false
  totalopportunity = 0
  totalquotation = 0
  assign_erp = []
  start_unassign = false
  isChecked = true;
  formGroup: FormGroup;
  formGroup_change: FormGroup;
  user_id
  stage
  list_view
  showdelete=false;
  filteringSchedule: boolean;
  pagerecordform: FormGroup;
  pagerecord = localStorage.getItem('leadperstatusfilter');
  ngOnInit() {  
    this.list_view = localStorage.getItem('list_view')
    this.filteringSchedule = JSON.parse(localStorage.getItem('list_view'));
    //console.log(this.list_view)
    if(this.list_view == 'true'){
      //console.log("datatat")
      this.formGroup_change.value['enable_list'] = 'true'
      this.viewoftable = !this.viewoftable;
      this.viewofgrid = !this.viewofgrid
      this.formGroup_change = this.formBuilder.group({
        enable_list: this.filteringSchedule,
      });
    }
    //console.log("precord1::"+this.pagerecord);
    this.pagerecordform = this.formBuilder.group({
      pagerecord: [this.pagerecord],
    });
    this.user_id = localStorage.getItem('access_id')
    //console.log(this.user_id)
    this.AuthService.getRole(localStorage.getItem('access_id')).then(
      data => {
        if (data['data']['account_type'] == '1') {
          this.isagent = true
          this.getManagerDetail(localStorage.getItem('access_id'));
          this.accesssetting();
        }
        if (data['data']['account_type'] == '2') {
          this.showdelete=true;
        }
      }).catch(function (error) {
        //console.log('fdsfdsfd=======')
        this.logout()
      });
      this.stage_collum_status() 
    // this.get_Customer_list_isLoading_deal = false;
    // this.Opportunity_Quotation_isLoading_deal = false;
    // this.Opportunity_not_Quotation_isLoading_deal = false
    // this.erp_list_not_lead_isLoading_deal = false
    //this.get_lead_status_lead()
    //this.get_lead_status_notlead()
    //this.get_system_user_assign_without_lead();
    //this.getOpportunity_status_not_Quotation();
    //this.getOpportunity_status_Quotation();
    //this.getQuotation_status_order();
    //this.get_Customer_list_api()
    //this.get_lead_status_won()
    //this.get_lead_status_lost()
    this.getStages()
   
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');
    await this.userservice.accesssetting(userid).then(
      data => {
        if (data["data"][22]["setting_value"] == '1') {
          this.showdelete = true;
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  PageRecord(){
    let data: any = Object.assign(this.pagerecordform.value);
    localStorage.setItem('leadperstatusfilter',data['pagerecord']);
    //console.log("precord::"+data['pagerecord']);
    
    this.stage_collum_status()
  }

  refresh(){
    this.stage_collum_status()
    // this.get_lead_status_lead()
    // this.get_lead_status_notlead()
    // this.getOpportunity_status_not_Quotation();
    // this.getOpportunity_status_Quotation();
    // this.get_lead_status_won()
    // this.get_lead_status_lost()
  }

  ChangeView(formValue: any) {
    //console.log(formValue);
    if(formValue.enable_list == true){
      this.viewoftable = !this.viewoftable;
      this.viewofgrid = !this.viewofgrid
      localStorage.setItem('list_view','true')
    }else{
      this.viewoftable = !this.viewoftable;
      this.viewofgrid = !this.viewofgrid
      localStorage.setItem('list_view','false')
    }

    // this.viewoftable = !this.viewoftable;
    // this.viewofgrid = !this.viewofgrid
  }

  async stage_collum_status() {
    let data: any = Object.assign(this.pagerecordform.value);
    this.erp_list_isLoading = true;
    await this.authService.dynamic_lead_lists(data['pagerecord']).then(
      data => {
        if(data['data'].length>0){
          //console.log(data['data'])
          this.stage = data['data']
          this.erp_list_isLoading = false;
          //console.log(data['data']);
        }
        else{
          this.erp_list_isLoading = false;
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async onFormSubmit(formValue: any) {
    //console.log(formValue.enableWifi);
    if(formValue.enableWifi == true){
      await this.authService.dynamic_lead_lists_unassign().then(
        data => {
          if(data['data'].length>0){
            //console.log(data['data'])
            this.stage = data['data']
            this.erp_list_isLoading = false;
          }
          else{
            this.erp_list_isLoading = false;
          }
        },
        err => {
          console.log('error');
        }
      );
    }else{
      this.stage_collum_status()
      // this.start_unassign = false
    }
  }


  leaddetailpage(id) {
    // //console.log(this.erp_list[index])
    // this.authService.setSavedLeadid(this.erp_list[index]);
    this.router.navigateByUrl('/lead-details/'+id);
  }

  NotLeadDetail(index){
    //console.log(this.erp_list[index])
    this.authService.setSavedLeadid(this.erp_list_not_lead[index]);
    this.router.navigateByUrl('/lead-details');
  }

  OpportunityNotQuotationDetail(index){
    //console.log(this.Opportunity_not_Quotation[index])
    this.authService.setSavedLeadid(this.Opportunity_not_Quotation[index]);
    this.router.navigateByUrl('/lead-details');
  }

  OpportunityQuotationDetail(index){
    this.authService.setSavedLeadid(this.Opportunity_Quotation[index]);
    this.router.navigateByUrl('/lead-details');
  }

  getQuotationDetail(index){
    this.authService.setSavedLeadid(this.getQuotation[index]);
    this.router.navigateByUrl('/lead-details');
  }

  getCustomerListDetail(index){
    this.authService.setSavedLeadid(this.get_Customer_list[index]);
    this.router.navigateByUrl('/lead-details');
  }

  async get_lead_status_lead() {
    this.erp_list_isLoading = true;
    this.erp_list = []
    await this.authService.get_lead_status_lead().then(
      data => {
        //console.log(data['data'].length)
        if(data['data'].length>0){
          this.erp_list = data['data'];
          this.erp_list_isLoading = false;
          this.totallead = data['data'].length
          var total = 0
          this.erp_list.forEach(function (element) {
            if(element.opportunity_amount != null){
              total = total + parseInt(element.opportunity_amount);
            }
          });
          this.amount_lead.lead = total
        }else{
          this.erp_list_isLoading = false;
        }    
        
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_lead_status_notlead() {
    this.erp_list_not_lead_isLoading = true;
    this.erp_list_not_lead = []
    await this.authService.get_lead_status_notlead().then(
      data => {
        //console.log(data['data'])
        if(data['data'].length>0){
          this.erp_list_not_lead = data['data'];
          this.erp_list_not_lead_isLoading = false;
          this.totalnotlead = data['data'].length
          var total = 0
          this.erp_list_not_lead.forEach(function (element) {
            if(element.opportunity_amount != null){
              total = total + parseInt(element.opportunity_amount);
            }
          });
          this.amount_lead.open = total
        }else{
          this.erp_list_not_lead_isLoading = false;
        }     
          
      },
      err => {
        console.log('error');
      }
    );
  }


  whatsappdialog(number,lid,show_no_id): void {
    const dialogRef = this.dialog.open(ShareWhatsappComponent, {
      disableClose: true, data: { callernumber: number,lead_id:lid,show_no_id:show_no_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
      }
    });
  }

  async getOpportunity_status_not_Quotation() {
    this.Opportunity_not_Quotation_isLoading = true;
    this.Opportunity_not_Quotation = []
    await this.authService.getOpportunity_status_not_Quotation().then(
      data => {
        //console.log(data)
        if(data['data'].length>0){
          this.Opportunity_not_Quotation = data['data'];
          this.Opportunity_not_Quotation_isLoading = false;
          this.totalopportunity = data['data'].length
          var total = 0
          this.Opportunity_not_Quotation.forEach(function (element) {
            if(element.opportunity_amount != null){
              total = total + parseInt(element.opportunity_amount);
            }
          });
          this.amount_lead.quotation = total
        }else{
          this.Opportunity_not_Quotation_isLoading = false;
        }
        
      },
      err => {
        console.log('error');
      }
    );
  }

  async getOpportunity_status_Quotation() {
    this.Opportunity_Quotation_isLoading = true
    this.Opportunity_Quotation = []
    await this.authService.getOpportunity_status_Quotation().then(
      data => {
        //console.log(data)
        if(data['data'].length>0){
          this.Opportunity_Quotation = data['data']
          this.Opportunity_Quotation_isLoading = false
          this.totalquotation = data['data'].length
          var total = 0
          this.Opportunity_Quotation.forEach(function (element) {
            if(element.opportunity_amount != null){
              total = total + parseInt(element.opportunity_amount);
            }
          });
          this.amount_lead.opportunity = total
        }else{
          this.Opportunity_Quotation_isLoading = false
        }
        
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_lead_status_won() {
    this.erp_list_won_isLoading = true;
    this.erp_list_won = []
    await this.authService.get_lead_status_won().then(
      data => {
        //console.log(data['data'])
        if(data['data'].length>0){
          this.erp_list_won = data['data'];
          this.erp_list_won_isLoading = false;
          this.totalwon = data['data'].length
          var total = 0
          this.erp_list_won.forEach(function (element) {
            if(element.opportunity_amount != null){
              total = total + parseInt(element.opportunity_amount);
            }
          });
          this.amount_lead.won = total
        }else{
          this.erp_list_won_isLoading = false;
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_lead_status_lost() {
    this.erp_list_lost_isLoading = true;
    this.erp_list_lost = []
    await this.authService.get_lead_status_lost().then(
      data => {
        //console.log(data['data'])
        if(data['data'].length>0){
          this.erp_list_lost = data['data'];
          this.erp_list_lost_isLoading = false;
          this.totallost = data['data'].length
          var total = 0
          this.erp_list_lost.forEach(function (element) {
            if(element.opportunity_amount != null){
              total = total + parseInt(element.opportunity_amount);
            }
          });
          this.amount_lead.lost = total
        }else{
          this.erp_list_lost_isLoading = false;
        }
        

      },
      err => {
        console.log('error');
      }
    );
  }
  /*async get_system_user_assign_without_lead() {
    await this.authService.get_system_user_assign_without_lead().then(
      data => {
        console.log(data)
        this.erp_list_not_lead = data['data']
        this.erp_list_not_lead_isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }*/

  async getQuotation_status_order() {
    this.getQuotation_isLoading = true
    await this.authService.getQuotation_status_order().then(
      data => {
        //console.log(data)
        if(data['data'].length>0){
        this.getQuotation = data['data']
        this.getQuotation_isLoading = false}
        else{
          this.getQuotation_isLoading = false
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_Customer_list_api() {
    this.get_Customer_list_isLoading = true
    await this.authService.get_Customer_list_api().then(
      data => {
        //console.log(data)
        if(data['data'].length>0){
          this.get_Customer_list = data['data']
           this.get_Customer_list_isLoading = false
        }else{
          this.get_Customer_list_isLoading = false
        }
        
      },
      err => {
        console.log('error');
      }
    );
  }

  async deleteRequest(id){
    //console.log(id);
    
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}   
    }
    );  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.stage_collum_status() 
      }
    });
  }
  openDialog(name): void {
    //console.log(name)
    const dialogRef = this.dialog.open(erpassignComponent, {
      width: '640px',data: name

    });

    dialogRef.afterClosed().subscribe(() => {
      this.stage_collum_status() 
    });
  }


  openDialog2(index): void {
    //console.log(index)
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {
      width: '640px',data: index
      
    });

    dialogRef.afterClosed().subscribe(() => {
      this.stage_collum_status() 
    });
  }

  openDialog4(index): void {
    //console.log(this.Opportunity_not_Quotation[index])
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {data: this.Opportunity_not_Quotation[index]

    });

    dialogRef.afterClosed().subscribe(() => {
      this.get_lead_status_lead();
      this.get_lead_status_notlead();
      this.getOpportunity_status_not_Quotation();
      this.getOpportunity_status_Quotation();
      this.get_lead_status_won()
      this.get_lead_status_lost()
      
      
    });
  }

  openDialog5(index): void {
    //console.log(this.Opportunity_Quotation[index])
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {data: this.Opportunity_Quotation[index]

    });

    dialogRef.afterClosed().subscribe(() => {
      this.get_lead_status_lead();
      this.get_lead_status_notlead();
      this.getOpportunity_status_not_Quotation();
      this.getOpportunity_status_Quotation();
      this.get_lead_status_won()
      this.get_lead_status_lost()
      
      
    });
  }

  openDialog6(index): void {
    //console.log(this.erp_list_won[index])
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {data: this.erp_list_won[index]

    });

    dialogRef.afterClosed().subscribe(() => {
      this.get_lead_status_lead();
      this.get_lead_status_notlead();
      this.getOpportunity_status_not_Quotation();
      this.getOpportunity_status_Quotation();
      this.get_lead_status_won()
      this.get_lead_status_lost()
      
      
    });
  }
  

  openDialog7(index): void {
    //console.log(this.erp_list_lost[index])
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {data: this.erp_list_lost[index]

    });

    dialogRef.afterClosed().subscribe(() => {
      this.get_lead_status_lead();
      this.get_lead_status_notlead();
      this.getOpportunity_status_not_Quotation();
      this.getOpportunity_status_Quotation();
      this.get_lead_status_won()
      this.get_lead_status_lost()
      
      
    });
  }

  openDialog3(index): void {
    //console.log(this.erp_list_not_lead[index])
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {data: this.erp_list_not_lead[index]

    });

    dialogRef.afterClosed().subscribe(() => {
      this.get_lead_status_lead();
      this.get_lead_status_notlead();
      this.getOpportunity_status_not_Quotation();
      this.getOpportunity_status_Quotation();
      this.get_lead_status_won()
      this.get_lead_status_lost()
      
      
    });
  }
  openSchedule(index): void {
    //console.log("index ::"+ index);
    const dialogRef = this.dialog.open(ScheduleMeetingComponent, { width: '400px',data: {leadid:index} });

    dialogRef.afterClosed().subscribe(() => {
      this.stage_collum_status()
    });
  }

  openDialog_opp(index): void {
    //console.log(this.Opportunity_not_Quotation[index])
    const dialogRef = this.dialog.open(CreateOpportunityErpComponent, {data: this.Opportunity_not_Quotation[index]

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOpportunity_status_not_Quotation();
      this.getOpportunity_status_Quotation();
    });
  }

  openDialog_opp2(index): void {
    //console.log(this.Opportunity_Quotation[index])
    const dialogRef = this.dialog.open(CreateOpportunityErpComponent, {data: this.Opportunity_Quotation[index]

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOpportunity_status_not_Quotation();
      this.getOpportunity_status_Quotation();    });
  }

  create_customer(index){
    var data = {'customer_name':this.getQuotation[index].customer_name , 'lead_name':this.getQuotation[index].party_name}
    //console.log(data)
    this.authService.create_Customer(data).then(
    data => {
      //console.log(data)
      this.get_Customer_list_api();

      
    },
    err => {
      console.log('error');
    }
    );

  }

  openLeadDialog(value) {
    //console.log(value._elementRef.nativeElement.id)
    var dat = {'status':value._elementRef.nativeElement.id,'status_open':true}
    const dialogRef = this.dialog.open(CreateLeadErpComponent,{data : dat,
      disableClose: true, width: '660px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getpromsnalcam();
      }
      this.stage_collum_status()  
    });
  }

  openDialogOpp() {
    const dialogRef = this.dialog.open(CreateOpportunityErpComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getpromsnalcam();
      }
    });
  }


  openQue() {
    const dialogRef = this.dialog.open(CreatequotationErpComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getpromsnalcam();
      }
    });
  }

  //Calling Module
  clicktocall(mobile){
    mobile = mobile.substr(-10)
    var agentid = localStorage.getItem('access_id')
    if(this.isagent){
      if(confirm("Are you sure to call ?")) {
        var voipstatus = localStorage.getItem('voipstatus')
        if(voipstatus=='true'){
          this.basecomponent.voipcall(mobile)
        }else{
          this.userservice.agentOutgoingCall(agentid,mobile).then(
            data => {
              if(data['err']==false){
                this._snackBar.open(data['msg'], '', {
                  duration: 2000,verticalPosition: 'top'
                });
              }
            },
            err => {
              console.log('error');
            }
          );
        }
      }
    }else{
      this._snackBar.open('Not allow from manager!', '', {
        duration: 2000,verticalPosition: 'top'
      });
    }
  }

  clicktoemail(email){
    //console.log(email)                                                                                                                                   
    const dialogRef = this.dialog.open(LeadEmailSendComponent, {data: email,
      width: '650px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
    // this._snackBar.open('Coming soon!', '', {
    //   duration: 2000,verticalPosition: 'top'
    // });
  }

  clicktosms(mobileno,leadid){
    //console.log(leadid);
    const dialogRef = this.dialog.open(LeadSmsSendComponent, {
      width: '650px',data:{mobileno:mobileno,leadid:leadid}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
    // this._snackBar.open('Coming soon!', '', {
    //   duration: 2000,verticalPosition: 'top'
    // });
  }


  async getStages(){
    var userid = localStorage.getItem('access_id');

    await this.authService.getStages(userid).then(data => {
      if(data){
          
        //console.log(data['data'])
        var i;
        var insight_payload =[];
        var stage_name;
        // var dist = []
       
        for (i = 0; i < data['data'].length; i++) {
         // console.log(data['data'][i])
          stage_name = data['data'][i]['stage_name'];
          insight_payload.push({'stage_name':stage_name})
        }
        //console.log(insight_payload)
      }
    },
    err => {
      console.log('error');
    })
  }

  async getManagerDetail(managerid) {
    await this.managerservice.getManagerDetail(managerid).then(
      data => {
        var settingsArr = data['settings']
        //console.log(this.settings);
        if(settingsArr.length > 0){
          var that = this
          settingsArr.map(function(elem){
            var name = elem.setting_name
            that.settings[name] = elem.setting_value
          });
        }
        
      },
      err => {
        console.log('error');
      })
  }


}


@Component({
  selector: 'erp-assign',
  templateUrl: 'erp-assign.components.html',
  styleUrls: ['./erp-module.component.css']
})
export class erpassignComponent {
  memberForm : FormGroup;
  assign;
  isDisabled = false;
  isLoading= false;
  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<erpassignComponent>,public authService: ErpService,@Inject(MAT_DIALOG_DATA) public data: any,private _snackBar: MatSnackBar){}
  ngOnInit() {
    this.get_system_user_assign_lead();
    this.memberForm = this.formBuilder.group({
      agent_id: ['', Validators.required],
      description:[''],
      expected_closing:[''],
      priority:[''],
      name:this.data
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async get_system_user_assign_lead() {
    await this.authService.get_system_user_assign_lead().then(
      data => {
        //console.log(data['data'])
        this.assign  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  // createassign(){
  //   if(this.memberForm.invalid == true)
  //   {
  //     console.log(this.memberForm.value);
  //     return;
  //   }
  //   else{
  //     let data: any = Object.assign(this.memberForm.value);
  //     this.authService.assign_lead(data).then(
  //       data => {
  //         console.log(data['data'])
  //         this.dialogRef.close();
  //       },
  //       err => {
  //         console.log('error');
  //       }
  //     );

  //   }
  // }

  createassign(){
    if(this.memberForm.invalid == true)
    {
      //console.log(this.memberForm.value);
      return;
    }
    else{
      let data: any = Object.assign(this.memberForm.value);
      this.isDisabled = true;
      this.isLoading= true;
      this.authService.assign_lead(data).then(
        data => {
          this.memberForm.reset();
          this.dialogRef.close();

          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
         this.isDisabled = false;
          this.isLoading= false;
        },
        err => {
          console.log('error');
        }
      );

    }
  }

  
}




@Component({
  selector: 'create-lead-erp',
  templateUrl: 'create-lead-erp.component.html',
  styleUrls: ['./erp-module.component.css']

})
export class CreateLeadErpComponent {

  public addForm: FormGroup;  

  constructor(
    public dialogRef: MatDialogRef<CreateLeadErpComponent>,public authService: ErpService,public AuthService: AuthService,public userservice: UserService,
    private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,private _snackBar: MatSnackBar,
  ) { }
  Salutation;
  editmode = false
  Designation;
  Gender;
  status;
  Source;
  Campaign;
  Converted;
  Country;
  Company;
  selected='INR'
  isagent = false
  segment;
  Currency;
  status_data = false
  source_data = false
  industry;
  assign;
  public commentAddForm: FormGroup;
  memberForm : FormGroup;
  private comp:ErpModuleComponent;
  isDisabled=false;
  isLoading=false;
  // private ErpModule =  ErpModuleComponent;
  showno=false;
  tags=[]
  ngOnInit(): void {
    this.checkagent()
    this.getLeadTag();
    if (this.data != '' && this.data != null && this.data.status_open != true) {
      //console.log("Test")      
      this.editmode = true;
      this.addForm = this.fb.group({
        l_id:this.data,
        lead_name: ['',Validators.required],
        status: [null],
        company_name: [null],
        salutation: [null],
        email_id: [null],
        designation: [null],
        // gender: [null],
        source: [null],
        campaign_name: [null],
        contact_by: [null],
        contact_date: [null],
        ends_on: [null],
        notes:[null],
        address_type: ['Personal'],
        address_title: [null],
        state: [null],
        country:[null],
        address_line1: [null],
        address_line2: [null],
        pincode:[null],
        city: [null],
        county: [null],
        phone: [null],
        mobile_no: [null,Validators.required],
        fax:[null],
        type:[null],
        currency: ['INR'],
        company:[null],
        market_segment:[null],
        website:[null],
        industry:[null],
        // territory:[''],
        request_type:[null],
        product:[null],
        tag_id:[null],
        opportunity_amount:[null]
      });
      this.getleadDetail(this.data);
      this.get_system_user_assign_lead();
      this.commentAddForm = this.fb.group({
        //title: [null, [Validators.required]],
        note: [null, [Validators.required]],
        lead_id: [this.data],
        name: [this.data['name']],
        comment_by: [this.data['owner']]
      })

      this.memberForm = this.fb.group({
        agent_id: [this.data['agent_id'], Validators.required],
        // description:[''],
        // expected_closing:[''],
        // priority:[''],
        name:[this.data['name']]
      });
     

    }else{
      this.memberForm = this.fb.group({
        agent_id: ['', Validators.required],
        // description:[''],
        // expected_closing:[''],
        // priority:[''],
        name:[this.data['name']]
      });
      //console.log("Test 22")
      this.editmode = false;
      this.addForm = this.fb.group({
        l_id:0,
        lead_name: [,Validators.required],
        status: [this.data.status],
        company_name: [null],
        salutation: [null],
        email_id: [null],
        designation: [null],
        // gender: [null],
        source: [null],
        campaign_name: [null],
        contact_by: [null],
        contact_date: [null],
        ends_on: [null],
        notes:[null],
        address_type: ['Personal'],
        address_title: [null],
        state: [null],
        country:[null],
        currency: ['INR'],
        // probability: [null],
        opportunity_amount: [null],
        address_line1: [null],
        address_line2: [null],
        pincode:[null],
        city: [null],
        county: [null],
        phone: [null],
        mobile_no: [null,Validators.required],
        fax:[null],
        type:[null],
        company:[null],
        market_segment:[null],
        website:[null],
        industry:[null],
        // territory:[''],
        request_type:[null],
        product:[null],
        tag_id:[null]
      });
    }
    this.get_lead_Source();
    this.get_market_segment()
    this.get_Currency()
    this.get_lead_stage_status()
  }
  submit() {

  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  checkagent(){
    this.AuthService.getRole(localStorage.getItem('access_id')).then(
      data => {
        //console.log(data['data']['account_type']);
        if (data['data']['account_type'] == '1') {
          this.isagent = true
        }
      }).catch(function (error) {
        this.logout()
      });
  }

  async get_system_user_assign_lead() {
    await this.authService.get_system_user_assign_lead().then(
      data => {
        //console.log(data['data'])
        this.assign  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  } 
  
  async get_Currency() {
    await this.authService.get_Currency().then(
      data => {
        this.Currency  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  async get_Salutation_list() {
    await this.authService.get_Salutation_list().then(
      data => {
        this.Salutation  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_Designation() {
    await this.authService.get_Designation().then(
      data => {
        this.Designation  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  
  async get_lead_stage_status() {
    await this.authService.get_lead_stage_status().then(
      data => {
        if(data['data'].length>0){
          this.status  = data['data']
          this.status_data = false
        }else{
          this.status_data = true
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async getLeadTag() {
    await this.userservice.getLeadTag(localStorage.getItem("access_id")).then(
      data => {
        this.tags  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  
  commentsubmit() {
    if (this.commentAddForm.invalid == true) {
      //console.log(this.noteAddForm.value);
      return;
    }
    else {
      //console.log("456");
      let data: any = Object.assign(this.commentAddForm.value);
      //console.log(data)
      this.authService.commentLeadNote(data).then(
        data => {
          this.commentAddForm.reset();
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
        },
        err => {
          console.log('error');
        }
      );
    }
  }


  

  async get_lead_Source() {
    await this.authService.getAllLeadSource(localStorage.getItem('access_id')).then(
      data => {
        if(data['data'].length>0){
          this.Source  = data['data']
        }else{
          this.Source = []

        }        
      },
      err => {
        console.log('error');
      }
    );
  }


  createassign(){
    if(this.memberForm.invalid == true)
    {
      //console.log(this.memberForm.value);
      return;
    }
    else{
      let data: any = Object.assign(this.memberForm.value);
      this.authService.assign_lead(data).then(
        data => {
          this.memberForm.reset();
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
        },
        err => {
          console.log('error');
        }
      );

    }
  }

  change_form(){
    //console.log('hehehe');
    
  }

  async get_Campaign() {
    await this.authService.get_Campaign().then(
      data => {
        this.Campaign  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_user_list_filter() {
    await this.authService.get_user_list_filter().then(
      data => {
        this.Converted  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }


  async get_Country() {
    await this.authService.get_Country().then(
      data => {
        this.Country  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }


  async get_Company() {
    await this.authService.get_Company().then(
      data => {
        this.Company  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }


  async get_market_segment() {
    await this.authService.get_market_segment().then(
      data => {
        this.segment  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_industry_type() {
    await this.authService.get_industry_type().then(
      data => {
        this.industry = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  createlead(){
    console.log("lead");
    if(this.addForm.invalid == true)
    {
      //console.log(this.addForm.value);
      return;
    }
    else{
      let data: any = Object.assign(this.addForm.value);
      this.isLoading =true;
      this.isDisabled =true;
      if(!this.editmode){
        this.authService.post_Lead(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Cancel' });
            this.isDisabled=false;
            this.isLoading =false;

          },
          err => {
            console.log('error');
          }
        );

      }else{ 
       
        data.l_id = this.data
        this.authService.updateLeadAll(data).then(
          data1 => {
            this._snackBar.open(data1['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close();
            this.isDisabled=false;
            this.isLoading =false;
          },
          err => {
            console.log('error');
        })
      }
    }

    //assign
    if(this.memberForm.invalid == true)
    {
      //console.log(this.memberForm.value);
      return;
    }
    else{
      let data: any = Object.assign(this.memberForm.value);
      this.isDisabled=true;
      this.isLoading =true;
      if(this.data['agent_id'] != data.agent_id){
        this.authService.assign_lead(data).then(
          data => {
            this.memberForm.reset();
            this.dialogRef.close();
  
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.isDisabled=false;
            this.isLoading =false;
          },
          err => {
            console.log('error');
          }
        );
      }
      

    }


    // comments

    if (this.commentAddForm.invalid == true) {
      //console.log(this.noteAddForm.value);
      return;
    }
    else {
      //console.log("456");
      let data: any = Object.assign(this.commentAddForm.value);
      data.l_id = this.data
      //console.log(data)
      this.authService.commentLeadNote(data).then(
        data => {
          this.commentAddForm.reset();
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
        },
        err => {
          console.log('error');
        }
      );
    }
  }


  getleadDetail(id) {
    //console.log(id)
    this.authService.getLeadDetail(id).then(
      data => {
        console.log(data['data'][0]);
        var detais = data['data'][0]
        if(detais.show_no_id==0 || detais.show_no_id==null){
          this.showno=true;
        }
        this.addForm = this.fb.group({
          lead_name: [detais.lead_name,Validators.required],
          status: [detais.status],
          company_name: [detais.company_name],
          salutation: [detais.salutation],
          email_id: [detais.email_id],
          designation: [detais.designation],
          // gender: [this.data.gender],
          source: [detais.source],
          campaign_name: [detais.campaign_name],
          contact_by: [detais.contact_by],
          contact_date: [detais.contact_date],
          ends_on: [detais.ends_on],
          notes:[detais.notes],
          address_type: ['Personal'],
          address_title: [detais.address_title],
          state: [detais.state],
          country:[detais.country],
          address_line1: [detais.address],
          address_line2: [detais.address_line2],
          pincode:[detais.pincode],
          city: [detais.city],
          county: [detais.county],
          phone: [detais.phone],
          mobile_no: [detais.mobile_no,Validators.required],
          fax:[detais.fax],
          type:[detais.type],
          company:[detais.company],
          market_segment:[detais.market_segment],
          website:[detais.website],
          industry:[detais.industry],
          // territory:[''],
          request_type:[detais.request_type],
          product:[detais.product],
          currency: [detais.currency],
          // probability: [this.data.probability],
          opportunity_amount: [detais.opportunity_amount],
          name:[detais.name],
          tag_id:[detais.tag_id]
        });
        if(detais.currency == null){
          this.addForm = this.fb.group({
          lead_name: [detais.lead_name,Validators.required],
          status: [detais.status],
          company_name: [detais.company_name],
          salutation: [detais.salutation],
          email_id: [detais.email_id],
          designation: [detais.designation],
          // gender: [this.data.gender],
          source: [detais.source],
          campaign_name: [detais.campaign_name],
          contact_by: [detais.contact_by],
          contact_date: [detais.contact_date],
          ends_on: [detais.ends_on],
          notes:[detais.notes],
          address_type: ['Personal'],
          address_title: [detais.address_title],
          state: [detais.state],
          country:[detais.country],
          address_line1: [detais.address],
          address_line2: [detais.address_line2],
          pincode:[detais.pincode],
          city: [detais.city],
          county: [detais.county],
          phone: [detais.phone],
          mobile_no: [detais.mobile_no,Validators.required],
          fax:[detais.fax],
          type:[detais.type],
          company:[detais.company],
          market_segment:[detais.market_segment],
          website:[detais.website],
          industry:[detais.industry],
          // territory:[''],
          request_type:[detais.request_type],
          product:[detais.product],
          currency: ['INR'],
          // probability: [this.data.probability],
          opportunity_amount: [detais.opportunity_amount],
          name:[detais.name],
          tag_id:[detais.tag_id],
          })
        }
        this.memberForm = this.fb.group({
          agent_id: [detais['agent_id'], Validators.required],
          // description:[''],
          // expected_closing:[''],
          // priority:[''],
          name:[detais['name']]
        });
      },
      err => {
        console.log('error');
      }
    );
    return
    
    
  }
}










@Component({
  selector: 'create-opportunity-erp',
  templateUrl: 'create-opportunity-erp.component.html',
  styleUrls: ['./erp-module.component.css']

})
export class CreateOpportunityErpComponent {
  isLoading=false;
  isDisabled=false;
  public addForm: FormGroup;
  showitem = false;
  displayedColumns: string[] = ['id', 'itemcode', 'qty', 'itemname', 'action'];
  Opportunity_Type;
  Converted;
  sales_stage;
  Currency;
  Source;
  Company;
  customer;
  query='';
  Searching_data;
  leadstart = false;
  customerstart = false;
  editmode = false
  constructor(
    public dialogRef: MatDialogRef<CreateOpportunityErpComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public authService: ErpService,
  ) { }
  ngOnInit(): void {
    // var userid = localStorage.getItem('access_id');
    //console.log(this.data)
    if (this.data != '' && this.data != null) {
      //console.log("Test op")
      this.editmode = true;
      this.addForm = this.fb.group({
        opportunity_type: ['',Validators.required],
        opportunity_from: ['',Validators.required],
        status: ['',Validators.required],
        converted_by: [''],
        sales_stage: ['',Validators.required],
        expected_closing: [''],
        contact_by: [''],
        contact_date: [''],
        to_discuss: [''],
        currency: [''],
        // probability: [''],
        opportunity_amount: [''],
        withitem: [''],
        source: [''],
        company: ['',Validators.required],
        transaction_date: ['',Validators.required],
        party_name:['',Validators.required],
      });
      this.getoppDetail(this.data);
    }else{
      this.editmode = false;
      this.addForm = this.fb.group({
        opportunity_type: ['',Validators.required],
        opportunity_from: ['',Validators.required],
        status: ['',Validators.required],
        converted_by: [''],
        sales_stage: ['',Validators.required],
        expected_closing: [''],
        contact_by: [''],
        contact_date: [''],
        to_discuss: [''],
        currency: [''],
        // probability: [''],
        opportunity_amount: [''],
        withitem: [''],
        source: [''],
        company: ['',Validators.required],
        transaction_date: ['',Validators.required],
        party_name:['',Validators.required],
      });
    }
    
    this.get_Opportunity_Type();
    //this.get_user_list_filter();
    this.get_sales_stage();
    this.get_Currency();
    this.get_lead_Source();
    //this.get_Company();
    this.get_customer_list();
  }
  contactsubmit() {

  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  withitem(event) {
    if (event.checked == true) {
      this.showitem = true;
    } else {
      this.showitem = false;

    }
  }


  async get_Opportunity_Type() {
    await this.authService.get_Opportunity_Type().then(
      data => {
        this.Opportunity_Type = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_user_list_filter() {
    await this.authService.get_user_list_filter().then(
      data => {
        this.Converted  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_sales_stage() {
    await this.authService.get_sales_stage().then(
      data => {
        this.sales_stage  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_Currency() {
    await this.authService.get_Currency().then(
      data => {
        this.Currency  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }


  async get_lead_Source() {
    await this.authService.get_lead_Source().then(
      data => {
        this.Source  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_Company() {
    await this.authService.get_Company().then(
      data => {
        this.Company  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_customer_list() {
    await this.authService.get_customer_list().then(
      data => {
        this.customer  = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async search(data){
    //console.log(this.query)
    this.authService.get_lead_search({search_name:this.query}).then(
      data => {
        this.Searching_data = data['data']
        //console.log(data['data'])
      },
      err => {
        console.log('error');
      }
    );
  }


  Leadform(){
    this.leadstart = true;
    this.customerstart = false;
  }

  Customerform(){
    this.customerstart = true;
    this.leadstart = false
  }

  createopp(){
    if(this.addForm.invalid == true)
    {
      //console.log(this.addForm.value);
      return;
    }
    else{
      let data: any = Object.assign(this.addForm.value);
      this.isDisabled=true;
      this.isLoading= true;
      if(!this.editmode){
        this.authService.post_Opportunity(data).then(
          data => {
            this.dialogRef.close({ event: 'Cancel' });
            this.isDisabled=false;
            this.isLoading= false;
          },
          err => {
            console.log('error');
          }
        );
      }else{
        this.authService.update_Opportunity(data).then(
          data => {
            this.dialogRef.close({ event: 'Cancel' });
            this.isDisabled=false;
            this.isLoading= false;
          },
          err => {
            console.log('error');
          }
        );
      }
      

    }
  }
 
  getoppDetail(id) {
    //console.log(this.data)
    this.addForm = this.fb.group({
      opportunity_type: [this.data.opportunity_type,Validators.required],
      opportunity_from: [this.data.opportunity_from,Validators.required],
      status: [this.data.status,Validators.required],
      converted_by: [this.data.converted_by],
      sales_stage: [this.data.sales_stage,Validators.required],
      expected_closing: [this.data.expected_closing],
      contact_by: [this.data.contact_by],
      contact_date: [this.data.contact_date],
      to_discuss: [this.data.to_discuss],
      currency: [this.data.currency],
      // probability: [this.data.probability],
      opportunity_amount: [this.data.opportunity_amount],
      withitem: [this.data.withitem],
      source: [this.data.source],
      company: [this.data.company,Validators.required],
      transaction_date: [this.data.transaction_date,Validators.required],
      party_name:[this.data.party_name,Validators.required],
      name:[this.data.name]
    });
  }

  

}








@Component({
  selector: 'create-quotation',
  templateUrl: 'create-quotation.components.html',
  styleUrls: ['./erp-module.component.css']

})
export class CreatequotationErpComponent {
  displayedColumns: string[] = ['checked','id', 'itemcode', 'itemname'];
  public dataSource: MatTableDataSource<any>;
  showitem = false;

  constructor(
    public dialogRef: MatDialogRef<CreateOpportunityErpComponent>,
    private fb: FormBuilder,public authService: ErpService,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.get_lead();
  }


  async get_lead() {
    await this.authService.get_Item().then(
      data => {
        //console.log(data['data'])
        this.dataSource.data = data['data'];
        // this.Length = data['data'].length;

      },
      err => {
        console.log('error');
      }
    );
  }
  withitem(event) {
    if (event.checked == true) {
      this.showitem = true;
    } else {
      this.showitem = false;

    }
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./erp-module.component.css']

})
export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private ErpService: ErpService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      if(this.data!='' && this.data!=null){
        this.id = this.data.id
       
  
      }
   
  }
  async deleteRequest(id){
   
    await this.ErpService.deleteleadsreq(id).then(
      data => {
        this.toastr.success(data['data']);
        this.dialogRef.close({event:'Delete'});
      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
}
