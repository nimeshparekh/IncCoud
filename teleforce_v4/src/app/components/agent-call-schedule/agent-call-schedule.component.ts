import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BaseComponent } from '../base/base.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallRecordingListComponent } from '../call-recording-list/call-recording-list.component';



@Component({
  selector: 'app-agent-call-schedule',
  templateUrl: './agent-call-schedule.component.html',
  styleUrls: ['./agent-call-schedule.component.css']
})
export class AgentCallScheduleComponent implements OnInit {
  public searchform: FormGroup;
  public scheduledataSource: MatTableDataSource<any>;
  scheduleColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type', 'status', 'agent', 'feedback', 'note', 'scheduledate', 'action'];
  scheduleLength = 0;
  isLoading = true;
  settings = [];
  isCSV = false;
  access=0;
  timezone = localStorage.getItem('timezone') ? localStorage.getItem('timezone') : '+5:30'
  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private managerservice: ManagerService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private basecomponent: BaseComponent
  ) { }
  @ViewChild('schedulepaginator') schedulepaginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    console.log(localStorage.getItem('access_id'));
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [''],
      enddate: [''],
      callerno: [''],
    });

    this.scheduledataSource = new MatTableDataSource(); // create new object
    this.getScheduleLead('schedule');// 2-incoming  
    this.getManagerDetail(localStorage.getItem('access_id'));
    this.accesssetting();
  }
  searchData() {

    this.getScheduleLead('schedule');// 2-incoming 

  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.userservice.accesssetting(userid).then(
      data => {
        if (data["data"][8]["setting_value"] == 1) {
          this.isCSV = true;
        }
        this.access = data['data'][20]["setting_value"]

      },
      err => {
        console.log('error');
      }
    );
  }
  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [''],
      enddate: [''],
      callerno: [''],
    });

    this.getScheduleLead('schedule');
    this.getManagerDetail(localStorage.getItem('access_id'));
  }
  clicktocall(agentid, mobile) {
    if (confirm("Are you sure to call ?")) {
      var voipstatus = localStorage.getItem('voipstatus')
      if (voipstatus == 'true') {
        this.basecomponent.voipcall(mobile)
      } else {
        this.userservice.agentOutgoingCall(agentid, mobile).then(
          data => {
            if (data['err'] == false) {
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
            }
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }
  async getScheduleLead(feedback) {
    let data: any = Object.assign(this.searchform.value);
    Object.assign(data, { feedback: feedback });
    await this.userservice.getAgentcallSchedule(data).then(
      data => {
        this.scheduledataSource.data = data['data'];
        this.scheduleLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  ngAfterViewInit() {
    this.scheduledataSource.paginator = this.schedulepaginator;
  }
  async getManagerDetail(managerid) {
    await this.managerservice.getManagerDetail(managerid).then(
      data => {
        var settingsArr = data['settings']
        //console.log(this.settings);
        if (settingsArr.length > 0) {
          var that = this
          settingsArr.map(function (elem) {
            var name = elem.setting_name
            that.settings[name] = elem.setting_value
          });
        }

      },
      err => {
        console.log('error');
      })
  }
  schedulecall(id): void {
    const dialogRef = this.dialog.open(RescheduleCallComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        // this.getInterestedLead('interested');
        this.getScheduleLead(userid)
      }
    });
  }
  openrecording(id, path) {
    const dialogRef = this.dialog.open(CallRecordingListComponent, {
      width: '640px', disableClose: true, data: { id: id, recpath: path }
    });
  }
}

@Component({
  selector: 'app-reschedule-call',
  templateUrl: './reschedule-call.component.html',
  styleUrls: ['./agent-call-schedule.component.css']
})

export class RescheduleCallComponent implements OnInit {

  public feedbackform: FormGroup;
  addmode = true;
  schedule = false;
  feedbaclvalues = []
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RescheduleCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
    private _snackBar: MatSnackBar, ) { }

  ngOnInit(): void {

    this.feedbackform = this.fb.group({
      id: [this.data],
      scheduledate: [],
      starttime: [],
      endtime: [],
      customer_name: [null],
      agentId: [null],
      mobile: [null]
    });
    this.getAgentCallFeedback(this.data);

  }
  async getAgentCallFeedback(id) {
    await this.userservice.getAgentCallFeedback(id).then(
      data => {
        //console.log(data);
        this.feedbaclvalues = data['feedbackvalues'];
        console.log(this.feedbaclvalues)
        this.feedbackform = this.fb.group({
          id: [data['data'][0].id],
          scheduledate: [data['data'][0].scheduledate],
          starttime: [new Date(data['data'][0].scheduledate).toLocaleTimeString()],
          endtime: [new Date(data['data'][0].scheduledate).toLocaleTimeString()],
          customer_name: [data['data'][0].CallerName],
          agentId: [data['data'][0].AgentID],
          mobile: [data['data'][0].CallerNumber]
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  submit() {
    if (this.feedbackform.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {

      let data: any = Object.assign(this.feedbackform.value);
      //console.log(data);
      this.userservice.scheduleAgentCall(data).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Update' });
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }


}

