import { Component, OnInit , ViewChild } from '@angular/core';
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
  selector: 'app-call-pluse-report',
  templateUrl: './call-pluse-report.component.html',
  styleUrls: ['./call-pluse-report.component.css']
})
export class CallPluseReportComponent implements OnInit {
  isDisabled = false;
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'DID', 'AgentName', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallTalkTime','AgentTalkTime', 'CallStatus', 'AgentStatus', 'CallType', 'CallPulse'];
  Length = 0;
  kyc;
  date2;
  date1;
  msg = '';
  summarydata=[];
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
    this.checkkyc(userid);
    // this.getAgents(userid);
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate, Validators.required],
      enddate: [currentdate, Validators.required],
    });
    //this.calculateDateTimeDiff();
    //this.searchData();
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

  async searchData() {
    this.isLoading = true;
    this.isDisabled =true
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
    var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
    if (daydiff <= 31) {
      this.msg = ""
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';

    if(agentrole=="supervisor"){
      this.userservice.searchsupervisiorCallPulse(data).then(
        data => {
          console.log(data['data']);
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false
          this.isDisabled=false;
        },
        err => {
          console.log('error');
        }
      );
    }
    else{
      this.userservice.searchCallPulse(data).then(
        data => {
          console.log(data['data']);
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false
          this.isDisabled=false;
        },
        err => {
          console.log('error');
        }
      );
    }
     
    }else{
      this.isLoading = false
      this.isDisabled=false
      this.msg = "Please select search date difference below 30 day. For More date difference , Press Request Report";
      this.dataSource.data = [];
      this.Length = 0;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  calculateDiff(date1, date2) {
    console.log('date2:' + date2);
    if (date2 != null) {
      if (date2 != null) {
        //var totaltime = total.split(':'); // split it at the colons
        var dt1: any = new Date(date1);
        var dt2: any = new Date(date2);
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        var totalseconds = diff;
      } else {
        var totalseconds = 0;
      }
     
      if (totalseconds > 0) {
        var worktime = totalseconds;
        var date = new Date(0);
        date.setSeconds(worktime); // specify value for SECONDS here
        var timeString = date.toISOString().substr(11, 8);
        return timeString;
      } else {
        return '00:00:00';
      }

    } else {
      return '00:00:00';
    }
  }

  calulatesectomin(time){
    var hours = Math.floor(time / 3600);
    return new Date(time * 1000).toISOString().substr(11, 8)
  }

  resetform() {
    var userid = localStorage.getItem('access_id');
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate, Validators.required],
      enddate: [currentdate, Validators.required],
    });
    this.searchData();
  }

  getTotalpulse() {
    return this.dataSource.data.map(t => t.CallPluse).reduce((acc, value) => acc + value, 0);
  }
}
