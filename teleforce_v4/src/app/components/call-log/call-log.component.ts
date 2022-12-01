import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl,FormArray } from '@angular/forms';
import { ContactDataSource } from "./call.datasource";
import { CrudService } from '../../crud.service';
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { GenerateContactComponent } from '../generate-contact/generate-contact.component';
import { ManagerNumberHistoryComponent } from '../manager-number-history/manager-number-history.component';
import { environment } from '../../../environments/environment';
import { CreateAssignLeadComponent } from '../create-assign-lead/create-assign-lead.component';
import { CallRecordingListComponent } from '../call-recording-list/call-recording-list.component';
import { ShareWhatsappComponent } from '../share-whatsapp/share-whatsapp.component';
import { ShareWhatsappCallLogComponent} from '../share-whatsapp-call-log/share-whatsapp-call-log.component'

import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-call-log',
  templateUrl: './call-log.component.html',
  styleUrls: ['./call-log.component.css']
})
export class CallLogComponent implements OnInit {
  isDisabled = false;
  isDisabled1 = false;
  public dataSource: ContactDataSource;

  // public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['assignlead', 'id', 'DID', 'AgentName', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallTalkTime','AgentTalkTime', 'CallStatus', 'AgentStatus', 'CallType', 'AgentGroup','DisconnectedBy', 'recording', 'action'];//'feedback'
  Length = 0;
  isLoading = false
  public searchform: FormGroup;
  callstatus = [];
  agentstatus = [];
  didarr = [];
  agents = [];
  callername = [];
  calltype = [];
  lastdestination = [];
  misscallservice = false;
  ivr = false;
  clicktocall = false;
  conference = false;
  sortcolumn = 'id';
  sortdirection = 'DESC';
  kyc;
  extensions = [];
  logidArr = [];
  disconnected_by = [];
  access='';
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(
    private userservice: UserService,
    private managerservice: ManagerService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userservicee: CrudService,
    private router: Router) { }

  // @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;


  ngOnInit(): void {
   // console.log(localStorage);
    // this.dataSource = new ContactDataSource(); // create new object
    var userid = localStorage.getItem('access_id');

    this.checkkyc(userid);
    var currentdate = new Date();

    this.dataSource = new ContactDataSource(this.userservicee);
    var userid = localStorage.getItem('access_id');
    //this.dataSource.loadContacts({ customer_id: userid, startdate: [currentdate], enddate: [currentdate] }, this.sortcolumn, this.sortdirection, 0, 50);

    //this.getCallLog(userid) /* show all call log*/
    var agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    this.getCallStatus(userid);
    this.getAgentStatus(userid);
    this.getCallDID(userid);
    if(agentrole=="supervisor"){
      this.getSupervisorAgent(userid);
    }else{
      this.getAgents(userid);
    }   
    this.getCallType(userid);
    this.getDisconnectedBy(userid);
    this.getLastDestination(userid);
    this.getCallExtension(userid);
    //console.log(userid);

    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      status: [''],
      did: [''],
      agentid: [''],
      lastdestination: [''],
      callerno: [''],
      calltype: [''],
      disconnected_by: [''],
      service: [''],
      extension: [],
      agentstatus:['']
    });
    //this.searchData();/* show current date call log*/
    this.getManagerDetail(userid);
    var id:any = localStorage.getItem('access_id')
    if(id == 	3472){
     this.displayedColumns= ['assignlead', 'id', 'DID', 'AgentName', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'AgentStatus', 'CallType', 'AgentGroup','DisconnectedBy', 'recording', 'action'];//'feedback'

    }
  }
  
  ngAfterViewInit() {
    merge(this.contactpaginator.page)
      .pipe(
        tap(() => this.loadContactPage())
      )
      .subscribe()
    // this.dataSource.paginator = this.paginator;
  }
  async getCallLog(userid) {
 this.isDisabled = true;

    this.isLoading = false;
    ;
    await this.userservice.getCallLog(userid).then(
      data => {
        //console.log(data['data'].length);
        // this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
        this.isDisabled = false;

      },
      err => {
        console.log('error');
      }
    );
  }
  openrecording(id,path) {
    const dialogRef = this.dialog.open(CallRecordingListComponent, {
      width: '640px', disableClose: true, data:{id:id,recpath:path}
    });
  }

  searchData() {
    this.isDisabled = true;
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.userservice.searchCallLog(data).then(
      data => {
        // this.dataSource.data = data['data'];
        this.Length = data['data'][0]['total'];
        this.isLoading = false;
        this.isDisabled = false;

      },
      err => {
        console.log('error');
      }
    );
  }
  async getAgentStatus(userid) {
    await this.userservice.getAgentStatus(userid).then(
      data => {
        this.agentstatus = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  
  async getCallStatus(userid) {
    await this.userservice.getCallStatus(userid).then(
      data => {
        this.callstatus = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCallDID(userid) {
    await this.userservice.getCallDID(userid).then(
      data => {
        //console.log(data['data']);        
        this.didarr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getAgents(userid) {
    await this.userservice.getAgentcalllog(userid).then(
      data => {
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getSupervisorAgent(userid) {
    await this.userservice.getAssignedSupervisorAgents(userid).then(
      data => {
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getDisconnectedBy(userid) {
    await this.userservice.getDisconnectedBy(userid).then(
      data => {
        this.disconnected_by = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getCallType(userid) {
    await this.userservice.getCallType(userid).then(
      data => {
        this.calltype = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getLastDestination(userid) {
    await this.userservice.getLastDestination(userid).then(
      data => {
        console.log("lastdeato",data['data']);
        
        this.lastdestination = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getCallExtension(userid) {
    await this.userservice.getExtension(userid).then(
      data => {
        this.extensions = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      status: [],
      did: [],
      agentid: [],
      lastdestination: [],
      disconnected_by: [],
      callerno: [],
      calltype: [],
      service: []
    });
    // this.searchData();
    // let data: any = Object.assign(this.searchform.value);
    // this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }

  refreshform() {
    this.isDisabled = true;
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.userservice.searchCallLog(data).then(
      data => {
        // this.dataSource.data = data['data'];
        this.Length = data['data'][0]['total'];
        this.isLoading = false;
        this.isDisabled = false;

      },
      err => {
        console.log('error');
      }
    );
  }

  feedbackdialog(id): void {
    const dialogRef = this.dialog.open(AgentCallFeedbackComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        this.searchData();
      }
    });
  }

  secondsToHms(d) {
    d = Number(d);
    var days = Math.floor(d / 86400);
    var hours = Math.floor((d % 86400) / 3600);
    var mins = Math.floor(((d % 86400) % 3600) / 60);
    var secs = ((d % 86400) % 3600) % 60;
    return (days > 0 ? days + 'd ' : '') + ('00' + hours).slice(-2) + ':' + ('00' + mins).slice(-2) + ':' + ('00' + secs).slice(-2);
  }

  async getManagerDetail(userid) {
    await this.managerservice.getManagerDetail(userid).then(
      data => {
        if (data['data']['services'].length > 1) {
          //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for (var i = 0; i < data['data']['services'].length; i++) {

            if (serviceArr[i] == '0') {
              this.ivr = true;
            }
            if (serviceArr[i] == '1') {
              this.misscallservice = true;;
            }
            if (serviceArr[i] == '2') {
              this.conference = true;
            }
            if (serviceArr[i] == '4') {
              this.clicktocall = true;
            }
          }
        } else {
          var service = data['data']['services'];
          if (service == '1') {
            this.misscallservice = true;
          }
          if (service == '0') {
            this.ivr = true;
          }
          if (service == '2') {
            this.conference = true;
          }
          if (service == '4') {
            this.clicktocall = true;
          }
        }
      },
      err => {
        console.log('error');
      }
    );
  }


  loadContactPage() {
    this.isDisabled = true;
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data,
      this.sortcolumn, this.sortdirection,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize);
      this.isDisabled = false;


  }

  Filtercontact() {
    let data: any = Object.assign(this.searchform.value);
     this.searchData();
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }

  sortData(event) {
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    this.sortcolumn = event['active'];
    this.sortdirection = event['direction'];
    this.dataSource.loadContacts(data, event['active'], event['direction'], this.contactpaginator.pageIndex, this.contactpaginator.pageSize);
    //console.log(this.contactpaginator.pageIndex+'---'+this.contactpaginator.pageSize);
  }
  whatsappdialog(callernumber,cdrid,show_no_id): void {
    const dialogRef = this.dialog.open(ShareWhatsappCallLogComponent, {
      width: '360px', disableClose: true, data: { callernumber: callernumber,cdrid:cdrid }
    });
  }
  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if (data['data'][0].account_role == 0){
          if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

          } else {
            this.router.navigate(['/kyc-document-upload']);
          }
        }        
      },
      err => {
        console.log('error');
      }
    );
  }
  contacthistorydialog(id, callernumber, calltype): void {
    const dialogRef = this.dialog.open(ManagerNumberHistoryComponent, {
      width: '100%', disableClose: true, data: { id: id, callernumber: callernumber,calltype:calltype }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.Filtercontact();
      }
    });
  }
  contactdialog(id, callernumber): void {
    var userid = localStorage.getItem('access_id');
    const dialogRef = this.dialog.open(GenerateContactComponent, {
      width: '640px', disableClose: true, data: { id: id, callernumber: callernumber, managerid: userid }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
        this.Filtercontact();
      }
    });
  }

  async createExcel() {
    this.isDisabled1 = true;

    this.isLoading = true
    let data: any = Object.assign(this.searchform.value);
    await this.userservice.searchCallLogexcel(data).then(
      data => {
        //console.log(data['data']);
        this.isLoading = false;
        this.isDisabled1 = false;

        // this.dataSource.data = data['data'];
        //this.Length = data['data'].length;
        // this.isLoading = false
        var url = environment.apiUrl + '/' + data['data']
        window.open(url, '_blank');
      },
      err => {
        console.log('error');
      }
    );
  }

  async downloadAudio(){
    console.log("Audio");
    console.log(this.logidArr);
    await this.userservice.downloadAudio(this.logidArr).then(
      data => {
       console.log("data here !!");
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
        
  }

  clickAssignLead(id) {
    if (this.logidArr.indexOf(id) == (-1)) {
      this.logidArr.push(id);
    } else {
      this.logidArr.splice(this.logidArr.indexOf(id), 1);
    }
    //console.log(this.filterCriteria);   
  }
  assignLead(): void {
    const dialogRef = this.dialog.open(CreateAssignLeadComponent, {
      width: '640px', disableClose: true, maxHeight: '800px', data: this.logidArr
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.Filtercontact();
        this.logidArr = [];
      }
    });
  }
}


@Component({
  selector: 'app-incoming-call',
  templateUrl: './recording-call.component.html',
  styleUrls: ['./call-log.component.css']
})
export class RecordingCallComponent implements OnInit {
  audioid = '';
  public addForm: FormGroup;
  reviewform;
  reviews: FormArray;
  constructor(
    public dialogRef: MatDialogRef<RecordingCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private adminservice: UserService,
    private fb: FormBuilder,
  ) { }

  public ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      this.audioid = this.data
      console.log(this.audioid)     
    }
    this.getForm(userid);
    this.addForm = this.fb.group({
      account_id: [userid],
      reviews: this.fb.array([])
    });
    
  }
  
  cancelDialog(): void {
    this.dialog.closeAll();
  }
  saverate(id,value){    
    var reviews = this.reviews;
   for(var i=0;i<reviews.length;i++){
      if(reviews[i].formid==id){
        reviews[i].rate=value;
      }
    }
    console.log(reviews);
    
  }

  submit(event:any) {
    let data: any = Object.assign(this.addForm.value);
    
    var reviewArr =  this.reviewform;
    for(var i=0;i<reviewArr.length;i++){
      console.log(event.target.rate.value);
      /*this.reviews.push(this.fb.group({
        otherkey: element.meta_key,
        othervalue: element.meta_value,
      }));*/
     
    }
   //console.log();
  }

  async getForm(userid) {
    await this.adminservice.getCallReviewForm(userid).then(
      data => {
        console.log(data['data']);
        this.reviewform = data['data'];
        var reviewArr =  this.reviewform;
        this.reviews = this.addForm.get('reviews') as FormArray; 
        for(var i=0;i<reviewArr.length;i++){
          this.reviews.push(this.fb.group({
            formid: reviewArr[i].form_id,
            rate: 0,
          }));
        }
          
    
      },
      err => {
        console.log('error');
      }
    );
  }
  

}

