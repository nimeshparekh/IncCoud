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
  selector: 'app-agent-performance',
  templateUrl: './agent-performance.component.html',
  styleUrls: ['./agent-performance.component.css']
})
export class AgentPerformanceComponent implements OnInit {
  isDisabled = false;
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'agentname', 'logintime', 'talktime', 'wraptime', 'acw', 'breaktime', 'totaltime', 'AHT', 'inboundcall', 'outboundcall', 'outboundconnectcall', 'missedcall'];
  Length = 0;
  kyc
  data = [];
  loggedtime = [];
  msg = '';
  maindata = [];
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
    this.dataSource = new MatTableDataSource(); // create new object  
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate, Validators.required],
      enddate: [currentdate, Validators.required],
      reportname: ['agent_performance']
    });
    // this.searchData();
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

    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
    var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
    //console.log("day diff :" + daydiff);

    /* if (daydiff > 0) {
       this.msg = "Please select search date difference below 1 day between 8 AM To 8 PM. For More date difference , Press Request Report";
       this.dataSource.data = [];
       this.Length = 0;
     } else {*/
    this.msg = "";
    this.isLoading = true;
    this.isDisabled = true;
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate);
    let agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    if (agentrole == "supervisor") {
      await this.reportservice.supervisior_agentPerformanceData(data).then(
        rdata => {

          this.dataSource.data = rdata['data'];
          this.Length = rdata['data'].length;
          this.isLoading = false;
          this.isDisabled = false;

          this.maindata = rdata['data'];
        },
        err => {
          console.log('error');
        });
    } else {
      await this.reportservice.agent_performance_data(data).then(
        rdata => {
          console.log(rdata['data']);

          this.dataSource.data = rdata['data'];
          console.log(this.dataSource.data);
          
          this.Length = rdata['data'].length;
          this.isLoading = false;
          this.isDisabled = false;

          this.maindata = rdata['data'];
        },
        err => {
          console.log('error');
        });
    }
  }
  calculateDateTimeDiff(date1, date2) {
    var dt1: any = new Date(date1);
    var dt2: any = new Date(date2);
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    //console.log(diff/60)
    //diff /= (60);
    //diff /= (60 * 60 * 60);
    var date = new Date(0);
    date.setSeconds(diff); // specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);
    return timeString;
  }

  calulatesectomin(time) {
    if (time) {
      var d = time;
      //var hours = Math.floor(time / 3600);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h <= 9 ?'0'+h+':':h > 9 ? h+':' :"00:";
      var mDisplay = m <= 9 ?'0'+m+':':m > 9 ? m+':' :"00:";
      var sDisplay = s <= 9 ?'0'+s:s > 9 ? s :"00:";
      return hDisplay + mDisplay + sDisplay;
      return new Date(time * 1000).toISOString().substr(11, 8)
    } else {
      return '00:00:00';
    }


  }

  calulatemintosec(time) {
    
    return new Date((time * 60) * 1000).toISOString().substr(11, 8)
  }

  // calculateidealtime(date1,date2,talktime,wraptime,breaktime){
  calculateidealtime(loggedtime, talktime, wraptime, breaktime) {
    //console.log(date1+"=="+date2+"=="+talktime+"=="+wraptime+"=="+breaktime+"==")
    if (breaktime == null) {
      breaktime = 0;
    }
    if (wraptime == null) {
      wraptime = 0;
    }
    if (talktime == null) {
      talktime = 0;
    }
    if (loggedtime == null) {
      loggedtime = 0;
    }

    /*var dt1: any = new Date(date1);
    var dt2: any = new Date(date2);
    var loggedtime = (dt2.getTime() - dt1.getTime()) / 1000;
    var idealtime = parseInt(loggedtime.toString()) - parseInt(talktime) - parseInt(wraptime) - parseInt(breaktime)
    */
    //console.log(loggedtime);
    if (loggedtime > 0) {
      //if(loggedtime>( parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))){
      var idealtime = parseInt(loggedtime) - (parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))
      /* }else{
         var idealtime =  ( parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))-parseInt(loggedtime);
       }*/
    } else {
      var idealtime = (parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))
    }

    //return (loggedtime+"::"+talktime+"::"+wraptime+"::"+breaktime);
    var d = idealtime;
    var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h <= 9 ?'0'+h+':':h > 9 ? h+':' :"00:";
      var mDisplay = m <= 9 ?'0'+m+':':m > 9 ? m+':' :"00:";
      var sDisplay = s <= 9 ?'0'+s:s > 9 ? s :"00:";
      return hDisplay + mDisplay + sDisplay;
    //return new Date(idealtime * 1000).toISOString().substr(11, 8)
  }
  //calculateperformancetime(date1,date2,talktime,wraptime,breaktime,holdtime){
  calculateperformancetime(loggedtime, talktime, wraptime, breaktime, holdtime) {
    //console.log(date1+"=="+date2+"=="+talktime+"=="+wraptime+"=="+breaktime+"==")
    if (breaktime == null) {
      breaktime = 0;
    }

    if (wraptime == null) {
      wraptime = 0;
    }
    if (talktime == null) {
      talktime = 0;
    }
    if (loggedtime == null) {
      loggedtime = 0;
    }
    if (holdtime == null) {
      holdtime = 0;
    }
    /*var dt1: any = new Date(date1);
    var dt2: any = new Date(date2);
    var loggedtime = (dt2.getTime() - dt1.getTime()) / 1000;*/
    //console.log(talktime+"::"+wraptime+"::"+loggedtime);
    if (loggedtime > 0) {
      var idealtime = ((parseInt(holdtime) + parseInt(talktime) + parseInt(wraptime)) * 100) / parseInt(loggedtime)
    } else {
      var idealtime = 0;
    }

    //console.log(idealtime)
    return idealtime > 0 ? Math.round(idealtime) : 0
  }
  roundedPercentage(myValue, totalValue) {
    if (myValue != 0 && totalValue != 0) {
      var result = ((myValue / totalValue) * 100)
      return Math.round(result);
    } else {
      return 0;
    }

  }

  calculateAHT(talktime, wraptime, answercalls) {

    if (wraptime == null) {
      wraptime = 0;
    }
    if (talktime == null) {
      talktime = 0;
    }
    var aht = ((parseInt(talktime) + parseInt(wraptime)) / answercalls)
    var d = aht;
    //console.log(idealtime)
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h <= 9 ?'0'+h+':':h > 9 ? h+':' :"00:";
    var mDisplay = m <= 9 ?'0'+m+':':m > 9 ? m+':' :"00:";
    var sDisplay = s <= 9 ?'0'+s:s > 9 ? s :"00:";
    return answercalls > 0 ? hDisplay + mDisplay + sDisplay: '00:00:00';
    //return answercalls > 0 ? new Date(aht * 1000).toISOString().substr(11, 8) : '00:00:00'
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


}
