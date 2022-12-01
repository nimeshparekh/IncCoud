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
  selector: 'app-agent-perfomonce-report',
  templateUrl: './agent-perfomonce-report.component.html',
  styleUrls: ['./agent-perfomonce-report.component.css']
})
export class AgentPerfomonceReportComponent implements OnInit {
  isDisabled=false;
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'agentname', 'logintime', 'talktime', 'wrapuptime', 'acw', 'breaktime', 'totaltime','AHT','totalcalls','inboundcalls','outboundcalls','outboundconnectcalls','missedcalls'];

  //displayedColumns: string[] = ['id', 'agentname', 'logintime','breaktime', 'totalholdcalltime', 'talktime','wrapuptime', 'closetime', 'AHT','totalcalls', 'answercalls','outboundcalls','inboundcalls','outboundconnectcalls','missedcalls'];
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
  async searchData() {
  
    let data: any = Object.assign(this.searchform.value);
    await this.reportservice.agent_performance_report_data(data).then(
      rdata => {
        this.dataSource.data = rdata['data'];
        this.Length = rdata['data'].length;
        this.isLoading = false;
        this.isDisabled=false;
      },
      err => {
        console.log('error');
      });
    //}
  }
  calulatesectomin(time) {
    var hours = Math.floor(time / 3600);
    return new Date(time * 1000).toISOString().substr(11, 8)
    
  }
  calulatemintosec(time) {
    return new Date((time * 60) * 1000).toISOString().substr(11, 8)
  }
  calculateAHT(talktime, wraptime, answercalls) {

    if (wraptime == null) {
      wraptime = 0;
    }
    if (talktime == null) {
      talktime = 0;
    }
    var aht = ((parseInt(talktime) + parseInt(wraptime)) / answercalls)
    //console.log(idealtime)
    return answercalls > 0 ? new Date(aht * 1000).toISOString().substr(11, 8) : '00:00:00'
  }
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
    if(loggedtime>0){
      //if(loggedtime>( parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))){
        var idealtime = parseInt(loggedtime)-( parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))
     /* }else{
        var idealtime =  ( parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))-parseInt(loggedtime);
      }*/     
    }else{
      var idealtime = ( parseInt(talktime) + parseInt(wraptime) + parseInt(breaktime))
    }
    
    //return (loggedtime+"::"+talktime+"::"+wraptime+"::"+breaktime);
    return new Date(idealtime * 1000).toISOString().substr(11, 8)
  }
}
