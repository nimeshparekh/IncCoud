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
  selector: 'app-agent-login-logout',
  templateUrl: './agent-login-logout.component.html',
  styleUrls: ['./agent-login-logout.component.css']
})
export class AgentLoginLogoutComponent implements OnInit {
  isDisabled=false;
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'agentname', 'date', 'logintime', 'logouttime', 'loggedtime', 'breaktime', 'workingtime'];
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
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate, Validators.required],
      enddate: [currentdate, Validators.required],
      reportname :['agent_login_logout']
    });
    //this.calculateDateTimeDiff();
    //this.searchData();

  }

  calculateDateTimeDiff(date1, date2) {
    var dt1: any   = new Date(date1);
    var dt2: any = new Date(date2);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    console.log(diff)
    //diff /= (60);
    //diff /= (60 * 60 * 60);
    var date = new Date(0);
    date.setSeconds(diff); // specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);
    return timeString;
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

  async searchData() {

    let data: any = Object.assign(this.searchform.value);
    //var currentime = new Date("2020-11-20 07:00 AM");
    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
    this.isDisabled=true;
    if (currentime.getHours() > 7 && currentime.getHours() < 20) {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      if (daydiff <= 1) {
        this.msg = "";
        this.isLoading = true;
        this.isDisabled=true;

        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        //console.log(data.userid);
         this.enddate = new Date(data.enddate);
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
          if(agentrole=="supervisor"){
            this.reportservice.supervisior_agentLoginLogoutData(data).then(
              data => {
                console.log("Data");
                console.log(JSON.stringify(data));
                this.dataSource.data = data['data'];
                this.Length = data['data'].length;
                this.isLoading = false;
                this.isDisabled=false;

              },
              err => {
                console.log('error');
              }
            );
          }else{
            this.reportservice.agentLoginLogoutData(data).then(
              data => {
                console.log("Data");
                console.log(JSON.stringify(data));
                this.dataSource.data = data['data'];
                this.Length = data['data'].length;
                this.isLoading = false;
                this.isDisabled=false;

              },
              err => {
                console.log('error');
              }
            );
          }
      } else {
        this.msg = "Please select search date difference below 1 day between 8 AM To 8 PM. For More date difference , Press Request Report";
        this.dataSource.data = [];
        this.Length = 0;
      }
    } else {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      if (daydiff <= 31) {
        this.msg = "";
        this.isLoading = true;
        this.isDisabled=true;

        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        //console.log(data.userid);
        let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
          if(agentrole=="supervisor"){
            this.reportservice.supervisior_agentLoginLogoutData(data).then(
              data => {
                console.log("Data");
                console.log(JSON.stringify(data));
                this.dataSource.data = data['data'];
                this.Length = data['data'].length;
                this.isLoading = false;
                this.isDisabled=false;

              },
              err => {
                console.log('error');
              }
            );
          }else{
            this.reportservice.agentLoginLogoutData(data).then(
              data => {
                console.log("Data");
                console.log(JSON.stringify(data));
                this.dataSource.data = data['data'];
                this.Length = data['data'].length;
                this.isLoading = false;
                this.isDisabled=false;

              },
              err => {
                console.log('error');
              }
            );
          }
      } else {
        this.msg = "Please select search date difference below 31 day";
        this.dataSource.data = [];
        this.Length = 0;
      }
    }




  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  calculateDiff(date1, date2, breaktime) {
    console.log('date2:' + date2);
    if (date2 != null || breaktime != null) {
      if (date2 != null) {
        //var totaltime = total.split(':'); // split it at the colons
        var dt1: any = new Date(date1);
        var dt2: any = new Date(date2);
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        var totalseconds = diff;
      } else {
        var totalseconds = 0;
      }
      if (breaktime != null) {
        var breaktime = breaktime.split(':'); // split it at the colons  
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var breakseconds = (+breaktime[0]) * 60 * 60 + (+breaktime[1]) * 60 + (+breaktime[2]);
      } else {
        var breakseconds = 0;
      }
      if (totalseconds > 0) {
        var worktime = totalseconds - breakseconds;
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



}
