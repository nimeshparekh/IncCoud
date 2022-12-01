import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CrudService } from '../../crud.service';
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { ViewFeedbackComponent } from '../view-feedback/view-feedback.component';
import { environment } from '../../../environments/environment';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-feedback-report',
  templateUrl: './feedback-report.component.html',
  styleUrls: ['./feedback-report.component.css']
})
export class FeedbackReportComponent implements OnInit {
  isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'DID', 'AgentName', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'AgentStatus', 'CallType', 'action'];//'feedback'
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
  formname='';
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(private userservice: UserService,
    private managerservice: ManagerService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userservicee: CrudService,
    private router: Router,
    private reportservice: ReportService,
    ) { }

  
    @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.getAgents(userid);
    this.getFormsData();
    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      agentid: [''],
      feedback:[''],
    });

  }
  async getFormsData() {
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';

    if(agentrole=="supervisor"){
      var id =localStorage.getItem('access_id');
      await this.userservice.get_supervisior_FormsData(id).then(
        data => {
          console.log("feedback",data['data']);
          console.log(data['data']);
          this.formname = data['data'];       
        },
        err => {
          console.log('error');
        }
      );
    }
    else{
      await this.userservice.getFormsData().then(
        data => {
          //console.log(data['data']);
          console.log(data['data']);
          this.formname = data['data'];       
        },
        err => {
          console.log('error');
        }
      );
    }
    
  }
  async getAgents(userid) {
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';

    if(agentrole=="supervisor"){
      await this.userservice.getAssignedSupervisorAgents(userid).then(
        data => {
          this.agents = data['data'];
      
        },
        err => {
          console.log('error');
        }
      );
    }
    else{
      await this.reportservice.getAgents(userid).then(
        data => {
          this.agents = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    }
    
  }

  feedbacklist(id) {
    const dialogRef = this.dialog.open(ViewFeedbackComponent, {
      width: '100%', disableClose: true, data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        
      }
    });
  }


  searchData() {
    this.isLoading = true;
    this.isDisabled=true
    let data: any = Object.assign(this.searchform.value);
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';

    if(agentrole=="supervisor"){
        this.userservice.search_supervisior_Feedbackform (data).then(
          sdata => {
            console.log("DATA");
            console.log(JSON.stringify(sdata));
            this.dataSource.data = sdata['data'];
            this.Length = sdata['data'].length;
            this.isLoading = false;
            this.isDisabled=false;
          },
          err => {
            console.log('error');
          }
        )
      }else{
        this.userservice.searchFeedbackform (data).then(
          sdata => {
            console.log("DATA");
            console.log(JSON.stringify(sdata));
            this.dataSource.data = sdata['data'];
            this.Length = sdata['data'].length;
            this.isLoading = false;
            this.isDisabled=false;
          },
          err => {
            console.log('error');
          }
        )
      }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [null],
      enddate: [null],
      agentid: [],
    });
    this.searchData();
    let data: any = Object.assign(this.searchform.value);
    // this.getContacts();
  }

}
