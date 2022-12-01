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
  selector: 'app-acw-report',
  templateUrl: './acw-report.component.html',
  styleUrls: ['./acw-report.component.css']
})
export class AcwReportComponent implements OnInit {
isDisabled=false
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'agentname', 'reasoname', 'date', 'startime', 'stoptime','duration'];
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
    this.getAgents(userid);
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      type:[0],
      startdate: [currentdate, Validators.required],
      enddate: [currentdate, Validators.required],
      agentid:[null],
      reportname :['acw']
    });
    //this.calculateDateTimeDiff();
    //this.searchData();
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

  async searchData() {

    let data: any = Object.assign(this.searchform.value);
    //var currentime = new Date("2020-11-20 07:00 AM");
    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
    //if (currentime.getHours() > 7 && currentime.getHours() < 20) {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      //if (daydiff <= 1) {
        this.msg = "";
        this.isLoading = true;
        this.isDisabled=true;
        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
        if(agentrole=="supervisor"){
        this.reportservice.agentsupervisiorHoldCallingReasonSummaryData(data).then(
          data => {
            console.log(data['data']);
            
            this.summarydata = data['data'];
            this.isDisabled=false;

          },
          err => {
            console.log('error');
          }
        );
        
        this.reportservice.agentsupervisiorHoldCallingReasonData(data).then(
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
          this.reportservice.agentHoldCallingReasonSummaryData(data).then(
            data => {
              this.summarydata = data['data'];
              this.isDisabled=false;
  
            },
            err => {
              console.log('error');
            }
          );
          
          this.reportservice.agentHoldCallingReasonData(data).then(
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



}
