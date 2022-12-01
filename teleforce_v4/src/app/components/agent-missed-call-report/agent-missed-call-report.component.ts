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
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-agent-missed-call-report',
  templateUrl: './agent-missed-call-report.component.html',
  styleUrls: ['./agent-missed-call-report.component.css']
})
export class AgentMissedCallReportComponent implements OnInit {
  isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'DID', 'AgentName','missedtime','CallerNumber','CallerName','callback'];//'feedback'
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
  timezone = localStorage.getItem('timezone') ? localStorage.getItem('timezone') : '+5:30'

  constructor(private userservice: UserService,
    private managerservice: ManagerService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userservicee: CrudService,
    private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.getAgents(userid);
    console.log(userid);

    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      agentid: [''],
    });
  }

  async getAgents(userid) {
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
       this.userservice.getAssignedSupervisorAgents(userid).then(
        data => {
          this.agents = data['data'];
      
        },
        err => {
          console.log('error');
        }
      );
    }
    else{
    await this.userservice.getAgents(userid).then(
      data => {
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
    }
  }

  searchData() {
    this.isLoading = true;
    this.isDisabled=true;
    let data: any = Object.assign(this.searchform.value);
    var timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30';
    data['timezone'] = timezone;
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
        this.userservice.search_supervisior_MissedCallData (data).then(
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
        );
    }
    else{
      this.userservice.searchMissedCallData (data).then(
        sdata => {
         
          this.dataSource.data = sdata['data'];
          this.Length = sdata['data'].length;
          this.isLoading = false;
          this.isDisabled=false;
        },
        err => {
          console.log('error');
        }
      );
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
