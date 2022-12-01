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
  selector: 'app-agents-break-report',
  templateUrl: './agents-break-report.component.html',
  styleUrls: ['./agents-break-report.component.css']
})
export class AgentsBreakReportComponent implements OnInit {
total=0;
  isDisabled=false
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','name', 'date','break_start_time','break_end_time' ,'break_duration','type']; //'agentname',
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
      agentid:[''],

    });
    //this.calculateDateTimeDiff();
    this.getAgents(userid);
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
    if (this.searchform.invalid == true) {
      this.isDisabled=false

      return;
    }
    else {
    let data: any = Object.assign(this.searchform.value);
  
      this.isDisabled=true
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
      if(agentrole=="supervisor"){
        this.reportservice.agent_supervisior_break_time_report(data).then(
          data => {
            console.log("agent break Data");
            console.log(JSON.stringify(data));
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
            this.isDisabled=false
            this.getTotal();
  
          },
          err => {
            console.log('error');
          }
        );
      }
      else{
        //]]]console.log(data.userid);
      this.reportservice.agent_break_time_report(data).then(
        data => {
          console.log("agent break Data");
          console.log(JSON.stringify(data));
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false;
          this.isDisabled=false
          this.getTotal();

        },
        err => {
          console.log('error');
        }
      );
      }
      
      }

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTotal() {
    if (this.searchform.invalid) {
      return;
    }
    else {
    let data: any = Object.assign(this.searchform.value);
     this.reportservice.total_break_time_report(data).then(
        data => {
        
          this.total =data["data"][0]["break_duration"];
          console.log(data["data"]);
          
        },
        err => {
          console.log('error');
        }
      );
      }
   // return this.dataSource.data.map(t => t.break_duration).reduce((acc, value) => acc + value, 0);
  }
  getdatetotal(){
    return this.dataSource.data.map(t => t.break_duration).reduce((acc, value) => acc + value, 0);
  }
}
