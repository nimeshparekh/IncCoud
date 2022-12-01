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
  selector: 'app-review-rate-report',
  templateUrl: './review-rate-report.component.html',
  styleUrls: ['./review-rate-report.component.css']
})
export class ReviewRateReportComponent implements OnInit {
  isDisabled=false;
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  formparameter = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'agentname', 'CallStartTime', 'CallerName', 'CallerNumber','CallTalkTime','parameter','rate','date'];
  Length = 0;
  kyc;
  date2;
  date1;
  msg = '';
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
    currentdate = new Date();
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.getAgents(userid);
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      agentid:[null],
      parameter :[null],
    startdate:[currentdate],
    enddate:[currentdate]
    });
    //this.calculateDateTimeDiff();
    //this.searchData();
    this.getForm(userid);
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

  async getForm(userid) {
    await this.userservice.getCallReviewForm(userid).then(
      data => {
        this.formparameter = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  

  async searchData() {
    let data: any = Object.assign(this.searchform.value);
    this.isDisabled=true
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
    this.reportservice.agent_supervisior_ReviewRateData(data).then(
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
      this.reportservice.agentReviewRateData(data).then(
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

  secondsToHms(d) {
    d = Number(d);
    var days = Math.floor(d / 86400);
    var hours = Math.floor((d % 86400) / 3600);
    var mins = Math.floor(((d % 86400) % 3600) / 60);
    var secs = ((d % 86400) % 3600) % 60;
    return (days > 0 ? days + 'd ' : '') + ('00' + hours).slice(-2) + ':' + ('00' + mins).slice(-2) + ':' + ('00' + secs).slice(-2);
  }






  

}
