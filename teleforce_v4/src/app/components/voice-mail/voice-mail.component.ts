import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ContactDataSource } from "../call-log/call.datasource";
import { CrudService } from '../../crud.service';
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { GenerateContactComponent } from '../generate-contact/generate-contact.component';
import { ManagerNumberHistoryComponent } from '../manager-number-history/manager-number-history.component';
import { environment } from '../../../environments/environment';
import { CreateAssignLeadComponent } from '../create-assign-lead/create-assign-lead.component'

@Component({
  selector: 'app-voice-mail',
  templateUrl: './voice-mail.component.html',
  styleUrls: ['./voice-mail.component.css']
})
export class VoiceMailComponent implements OnInit {

  public dataSource: ContactDataSource;

  // public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['assignlead', 'id', 'DID', 'AgentName', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'AgentStatus', 'CallType', 'DisconnectedBy','recording','action'];//'feedback'
  Length = 0;
  isLoading = false
  public searchform: FormGroup;
  callstatus = [];
  didarr = [];
  agents = [];
  callername = [];
  calltype = [];
  lastdestination = [];
  misscallservice = false;
  ivr = false;
  clicktocall = false;
  conference = false;
  sortcolumn = 'CallStartTime';
  sortdirection = 'DESC';
  kyc;
  extensions = [];
  logidArr = [];
  disconnected_by = [];

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
    // this.dataSource = new ContactDataSource(); // create new object
    var userid = localStorage.getItem('access_id');

    this.checkkyc(userid);
    var currentdate = new Date();

    this.dataSource = new ContactDataSource(this.userservicee);
    var userid = localStorage.getItem('access_id');
    //this.dataSource.loadContacts({ customer_id: userid, startdate: [currentdate], enddate: [currentdate] }, this.sortcolumn, this.sortdirection, 0, 50);

    //this.getCallLog(userid) /* show all call log*/

    this.getCallDID(userid);
    this.getAgents(userid);

    console.log(userid);

    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      did: [''],
      agentid: [''],
      callerno: [''],
      lastdestination: ['Voicemail']
    });

    
    this.getManagerDetail(userid);
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
    this.isLoading = false;
    
    await this.userservice.getCallLog(userid).then(
      data => {
        
        //console.log(data['data'].length);
        // this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  openrecording(id) {
    const dialogRef = this.dialog.open(RecordingCallComponent, {
      width: '640px', disableClose: true, data: id
    });
  }

  searchData() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.userservice.searchCallLog(data).then(
      data => {
        // this.dataSource.data = data['data'];
        this.Length = data['data'][0]['total'];
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  async getCallDID(userid) {
    await this.userservice.getCallDID(userid).then(
      data => {
        this.didarr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getAgents(userid) {
    await this.userservice.getAgents(userid).then(
      data => {
        this.agents = data['data'];
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
      startdate: [null],
      enddate: [null],
      did: [],
      agentid: [],
      callerno: [],
      lastdestination: ['Voicemail']
    });
    this.searchData();
    let data: any = Object.assign(this.searchform.value);
    // this.getContacts();
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
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
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data,
      this.sortcolumn, this.sortdirection,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize);

  }

  Filtercontact() {
    let data: any = Object.assign(this.searchform.value);
    
    // this.searchData();
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

  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

        } else {
          this.router.navigate(['/kyc-document-upload']);
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  contacthistorydialog(id, callernumber): void {
    const dialogRef = this.dialog.open(ManagerNumberHistoryComponent, {
      width: '100%', disableClose: true, data: { id: id, callernumber: callernumber }
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
    this.isLoading = true
    let data: any = Object.assign(this.searchform.value);
    await this.userservice.searchCallLogexcel(data).then(
      data => {
        this.isLoading = false
        var url = environment.apiUrl + '/' + data['data']
        window.open(url, '_blank');
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
  templateUrl: '../call-log/recording-call.component.html',
  styleUrls: ['../call-log/call-log.component.css']
})
export class RecordingCallComponent implements OnInit {
  audioid = '';
  constructor(
    public dialogRef: MatDialogRef<RecordingCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private adminservice: UserService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      this.audioid = this.data
      console.log(this.audioid)

    }
   
  }
  cancelDialog(): void {
    this.dialog.closeAll();
  }
 

}