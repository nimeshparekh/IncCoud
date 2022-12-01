import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-agent-login-activity-report',
  templateUrl: './agent-login-activity-report.component.html',
  styleUrls: ['./agent-login-activity-report.component.css']
})
export class AgentLoginActivityReportComponent implements OnInit {
  isDisabled=false
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'agent' ,'date', 'login', 'logout', 'ip']; //'agentname',
  Length = 0;
  kyc;
  date2;
  date1;
  msg = '';
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(
    private reportservice: ReportService,
    private userservice: UserService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate, Validators.required],
      enddate: [currentdate, Validators.required],
      agentid:[null],
      reportname :['agent_login_activity']

    });
    //this.calculateDateTimeDiff();
    this.getAgents(userid);
  }
  async requestData() {
    var data: any = Object.assign(this.searchform.value);
   
    this.http.post(environment.apiUrl + '/report/createreqreport', data).subscribe((data: any) => {
      if (data.msg) {
        this._snackBar.open('Report Request sent sucessfully!', '', {
          duration: 2000, verticalPosition: 'top'
        });

      }
    });
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

  async searchData() {

    let data: any = Object.assign(this.searchform.value);
    // console.log("Data");
    // console.log(JSON.stringify(data));
    //var currentime = new Date("2020-11-20 07:00 AM");
    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)

    var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
   // if (daydiff < 1) {
      this.msg = "";
      this.isLoading = true;
      this.isDisabled=true
      this.startdate = new Date(data.startdate);
      this.enddate = new Date(data.enddate);
      //]]]console.log(data.userid);
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';

    if(agentrole=="supervisor"){
        this.reportservice.get_supervisior_LoginActivityData(data).then(
          data => {
            console.log("agent Login Activity Data");
            console.log(JSON.stringify(data));
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
            this.isDisabled=false

          },
          err => {
            console.log('error');
          }
        );
      }else{
        this.reportservice.gentLoginActivityData(data).then(
          data => {
            console.log("agent Login Activity Data");
            console.log(JSON.stringify(data));
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
            this.isDisabled=false

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



}
