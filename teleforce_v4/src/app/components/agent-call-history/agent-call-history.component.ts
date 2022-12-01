import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatDialog } from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenerateContactComponent } from '../generate-contact/generate-contact.component';
import { AgentNumberHistoryComponent } from '../agent-number-history/agent-number-history.component';
import { MatSort } from '@angular/material/sort';
import { ShareWhatsappComponent } from '../share-whatsapp/share-whatsapp.component';
import { BaseComponent } from '../base/base.component';
import { CallRecordingListComponent } from '../call-recording-list/call-recording-list.component';

@Component({
  selector: 'app-agent-call-history',
  templateUrl: './agent-call-history.component.html',
  styleUrls: ['./agent-call-history.component.css']
})
export class AgentCallHistoryComponent implements OnInit {

  public searchform: FormGroup;
  public manualdataSource: MatTableDataSource<any>;
  public dialerdataSource: MatTableDataSource<any>;
  public incomingdataSource: MatTableDataSource<any>;
  public misseddataSource: MatTableDataSource<any>;

  manualColumns: string[] = ['id', 'CallStartTime', 'DID', 'CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'feedback', 'action'];
  dialerColumns: string[] = ['id', 'CallStartTime', 'DID', 'CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'feedback', 'action'];
  incomingColumns: string[] = ['id', 'CallStartTime', 'DID', 'CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'feedback', 'action'];
  missedColumns: string[] = ['id', 'CallStartTime', 'DID', 'CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'callback', 'feedback', 'action'];
  manualLength = 0;
  dialerLength = 0;
  incomingLength = 0;
  missedLength = 0;
  isLoading = true;
  isLoading1 = true;
  isLoading2 = true;
  dialer = false;
  managerid = '';
  feedbaclvalues = [];
  currentab = 'Missed';
  access=''
  wpform: FormGroup
  timezone = localStorage.getItem('timezone') ? localStorage.getItem('timezone') : '+5:30'
  constructor(
    private userservice: UserService,
    private managerservice: ManagerService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private basecomponent: BaseComponent) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('manualpaginator') manualpaginator: MatPaginator;
  @ViewChild('dialerpaginator') dialerpaginator: MatPaginator;
  @ViewChild('incomingpaginator') incomingpaginator: MatPaginator;
  @ViewChild('missedpaginator') missedpaginator: MatPaginator;

  ngOnInit(): void {
    this.manualdataSource = new MatTableDataSource(); // create new object
    this.dialerdataSource = new MatTableDataSource(); // create new object
    this.incomingdataSource = new MatTableDataSource(); // create new object
    this.misseddataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.accesssetting();
    //this.getAgentMissedCall(userid, 2);
    this.getAgentDetail(userid);
    //this.getAgentCallLogData(userid,2);
    this.wpform = this.fb.group({
      mobile: [null],
      message: [null]
    });
    this.searchform = this.fb.group({
      agent_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      name: [null],
      mobile: [null],
      feedback: [null]

    });
  }
  onTabClick(event) {
    //console.log(event);
    var userid = localStorage.getItem('access_id');
    let data: any = Object.assign(this.searchform.value);
    this.currentab = event.tab.textLabel;
    if (data.startdate != null || data.enddate != null || data.name != null || data.mobile != null ||  data.feedback != null) {      
      this.searchData();
    }else{
      this.searchData();
      // if (event.tab.textLabel == 'Outgoing') {
      //   this.getAgentManualCall(userid, 0);// 0-outgoing
      // } else if (event.tab.textLabel == 'Incoming') {
      //   this.getAgentIncomingCall(userid, 2);// 2-incoming
      // } else if (event.tab.textLabel == 'Dialer') {
      //   this.getAgentDialerCall(userid, 1);// 1-dialer
      // } else {
      //   this.getAgentMissedCall(userid, 2);
      // }
    }


  }



  async getAgentManualCall(userid, calltypeid) {
    await this.userservice.getAgentCallLog(userid, calltypeid).then(
      data => {
        //console.log('manual:' + data['data']);
        this.manualdataSource.data = data['data'];
        this.manualLength = data['data'].length;
        this.isLoading1 = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getAgentDialerCall(userid, calltypeid) {
    await this.userservice.getAgentCallLog(userid, calltypeid).then(
      data => {
        this.dialerdataSource.data = data['data'];
        this.dialerLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getAgentIncomingCall(userid, calltypeid) {
    await this.userservice.getAgentCallLog(userid, calltypeid).then(
      data => {
        var incomingcall = []
        // var missedcall = []
        var rsArr = data['data']
        rsArr.map(ag => {
          //console.log(ag)
          if (ag.CallTalkTime == 0) {
            //missedcall.push(ag)
          } else {
            incomingcall.push(ag)
          }
        })
        this.incomingdataSource.data = incomingcall;
        this.incomingLength = incomingcall.length;

        this.isLoading2 = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  async getAgentMissedCall(userid, calltypeid) {
    await this.userservice.getAgentMissedCallLog(userid, calltypeid).then(
      data => {
        var missedcall = []
        var rsArr = data['data']
        rsArr.map(ag => {
          //console.log(ag)
          if (ag.CallTalkTime == 0) {
            missedcall.push(ag)
          } else {

          }
        })
        this.misseddataSource.data = missedcall;
        this.missedLength = missedcall.length;

        this.isLoading2 = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  ngAfterViewInit() {

    this.manualdataSource.paginator = this.manualpaginator;
    //
    this.dialerdataSource.paginator = this.dialerpaginator;
    //
    this.incomingdataSource.paginator = this.incomingpaginator;

    this.misseddataSource.paginator = this.missedpaginator;

    this.manualdataSource.sort = this.sort;
    this.dialerdataSource.sort = this.sort;
    this.incomingdataSource.sort = this.sort;
    this.misseddataSource.sort = this.sort;

  }

  manualfeedbackdialog(id): void {
    const dialogRef = this.dialog.open(AgentCallFeedbackComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getAgentManualCall(userid, 0);
      }
    });
  }
  dialerfeedbackdialog(id): void {
    const dialogRef = this.dialog.open(AgentCallFeedbackComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getAgentDialerCall(userid, 1);
      }
    });
  }
  incomingfeedbackdialog(id): void {
    const dialogRef = this.dialog.open(AgentCallFeedbackComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getAgentIncomingCall(userid, 2);
      }
    });
  }
  clicktocall(agentid, mobile) {
    //alert(mobile)
    if (confirm("Are you sure to call ?")) {
      var voipstatus = localStorage.getItem('voipstatus')
      if (voipstatus == 'true') {
        this.basecomponent.voipcall(mobile)
      } else {
        this.userservice.agentOutgoingCall(agentid, mobile).then(
          data => {
            //if (data['err'] == false) {
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
            //}
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }
  async getAgentDetail(agentid) {
    await this.userservice.getAgentDatail(agentid).then(
      data => {
        this.getManagerDetail(data['data']['created_by']);
        this.managerid = data['data']['created_by'];
        this.searchData();
      },
      err => {
        console.log('error');
      })
  }
  async getManagerDetail(managerid) {
    await this.managerservice.getManagerDetail(managerid).then(
      data => {
        if (data['data']['services'].length > 1) {
          var services = JSON.parse(data['data']['services']);
          if (services.length > 0) {
            for (var i = 0; i < services.length; i++) {
              if (services[i] == '3') {
                this.dialer = true;
              }
            }

          } else {
            var services = data['data']['services'];
            if (services == '3') {
              this.dialer = true;
            }
          }
        }
      },
      err => {
        console.log('error');
      })
  }

  contactdialog(id, callernumber): void {
    const dialogRef = this.dialog.open(GenerateContactComponent, {
      width: '50%', disableClose: true, data: { id: id, callernumber: callernumber, managerid: this.managerid }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getAgentIncomingCall(userid, 2);
        this.getAgentManualCall(userid, 0);
        this.getAgentDialerCall(userid, 1);
      }
    });
  }
  contacthistorydialog(id, callernumber): void {

    //console.log('managerid:::'+this.managerid);
    const dialogRef = this.dialog.open(AgentNumberHistoryComponent, {
      width: '100%', disableClose: true, data: { id: id, callernumber: callernumber, managerid: this.managerid }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getAgentIncomingCall(userid, 2);
        this.getAgentManualCall(userid, 0);
        this.getAgentDialerCall(userid, 1);
      }
    });
  }
  whatsappdialog(callernumber,cdrid,show_no_id): void {
    const dialogRef = this.dialog.open(ShareWhatsappComponent, {
      width: '360px', disableClose: true, data: { callernumber: callernumber,cdrid:cdrid,show_no_id:show_no_id }
    });
  }

  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      agent_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      name: [null],
      mobile: [null],
      feedback: [null]
    });
    if (this.currentab == "Outgoing") {
      this.getAgentManualCall(userid, 0);// 0-outgoing
    } else if (this.currentab == "Incoming") {
      this.getAgentIncomingCall(userid, 2);// 2-incoming
    } else if (this.currentab == "Dialer") {
      this.getAgentDialerCall(userid, 1);// 1-dialer
    } else {
      this.getAgentMissedCall(userid, 2);// 2-incoming
    }
   
    
    
  }
  searchData() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    //if (data.startdate != null) {
      //console.log(this.currentab);
      if (this.currentab == "Outgoing") {
        this.searchAgentManualCall();
      } else if (this.currentab == "Incoming") {
        this.searchAgentIncomingCall();
      } else if (this.currentab == "Dialer") {
        this.searchAgentDialerCall();
      } else {
        this.searchAgentMissedCall();
      }

    //}



  }

  async searchAgentManualCall() {
    this.isLoading1 = true;
    let data: any = Object.assign(this.searchform.value);
    data.calltypeid = 0;
    //console.log('formdata:'+JSON.stringify(data));
    await this.userservice.searchAgentCallLog(data).then(
      data => {
        console.log('data:' + JSON.stringify(data['data'].length));
        this.manualdataSource.data = data['data'];
        this.manualLength = data['data'].length;
        this.isLoading1 = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async searchAgentDialerCall() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    data.calltypeid = 1;
    await this.userservice.searchAgentCallLog(data).then(
      data => {
        this.dialerdataSource.data = data['data'];
        this.dialerLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async searchAgentIncomingCall() {
    let data: any = Object.assign(this.searchform.value);
    data.calltypeid = 2;
    this.isLoading2 = true;
    await this.userservice.searchAgentCallLog(data).then(
      data => {
        var incomingcall = []
        //var missedcall = []
        var rsArr = data['data']
        rsArr.map(ag => {
          //console.log(ag)
          if (ag.CallTalkTime == 0) {
            //missedcall.push(ag)
          } else {
            incomingcall.push(ag)
          }
        })
        this.incomingdataSource.data = incomingcall;
        this.incomingLength = incomingcall.length;
        //this.misseddataSource.data = missedcall;
        //this.missedLength = missedcall.length;


          this.isLoading2 = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async searchAgentMissedCall() {
    let data: any = Object.assign(this.searchform.value);
    data.calltypeid = 2;
    await this.userservice.searchAgentMissedCallLog(data).then(
      data => {
        //var incomingcall = []
        var missedcall = []
        var rsArr = data['data']
        /*rsArr.map(ag => {
          //console.log(ag)
          if (ag.CallTalkTime == 0) {
            missedcall.push(ag)
          } else {
            // incomingcall.push(ag)
          }
        })*/
        //this.incomingdataSource.data = incomingcall;
        // this.incomingLength = incomingcall.length;
        this.misseddataSource.data = rsArr;
        this.missedLength = rsArr.length;

        if (data['data'].length == 0) {
          this.isLoading2 = true;
        }
        else {

          this.isLoading2 = false;
        }
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
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

       await this.userservice.accesssetting(userid).then(
         data => {
          this.access =data['data'][20]["setting_value"]
          console.log("accesss",this.access);
          
         },
         err => {
           console.log('error');
         }
       );
     }
}
