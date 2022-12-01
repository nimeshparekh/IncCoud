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
  selector: 'app-agent-callduration-report',
  templateUrl: './agent-callduration-report.component.html',
  styleUrls: ['./agent-callduration-report.component.css']
})
export class AgentCalldurationReportComponent implements OnInit {
  isDisabled=false
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'agentname',  'incoming', 'incomingduration','incomingconnectcalls', 'outgoing', 'outgoingduration' , 'outgoingconnectcalls', 'dialer', 'dialerduration', 'dialerconnectcalls' , 'totalcalls', 'duration','totalconnectcalls'];
  Length = 0;
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
    this.dataSource = new MatTableDataSource(); // create new object    
    var userid = localStorage.getItem('access_id');
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate, Validators.required],
      enddate: [currentdate, Validators.required],
      reportname :['agent_wise_call_duration']

    });
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
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
    //this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
   // if (currentime.getHours() > 7 && currentime.getHours() < 20) {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      //if (daydiff <= 1) {
        this.msg = "";
        this.isLoading = true;
        this.isDisabled=true;
        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
        if(agentrole=="supervisor"){
            this.reportservice.get_supervisior_AgentCallDurationData(data).then(
              data => {
                //this.datalist = data['data'];
                //console.log(data['data']);
                this.dataSource.data = data['data'];
                this.Length = data['data'].length;
                this.isLoading = false;
                this.isDisabled=false;
                //this.totalcancel = (data['data'][0]['cnt']);
              },
              err => {
                console.log('error');
              }
            );
        }else{
          this.reportservice.getAgentCallDurationData(data).then(
            data => {
              //this.datalist = data['data'];
              //console.log(data['data']);
              this.dataSource.data = data['data'];
              this.Length = data['data'].length;
              this.isLoading = false;
              this.isDisabled=false;
              //this.totalcancel = (data['data'][0]['cnt']);
            },
            err => {
              console.log('error');
            }
          );
        }
     /* } else {
        this.msg = "Please select search date difference below 1 day between 8 AM To 8 PM. For More date difference , Press Request Report";
        this.dataSource.data = [];
        this.Length = 0;
      }
    } else {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      if (daydiff <= 31) {
        this.msg = "";
        this.isLoading = true;
      this.isDisabled =true;
        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        this.reportservice.getAgentCallDurationData(data).then(
          data => {
            //this.datalist = data['data'];
            //console.log(data['data']);
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
            this.isDisabled=false;
            //this.totalcancel = (data['data'][0]['cnt']);
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.msg = "Please select search date difference below 31 day";
        this.dataSource.data = [];
        this.Length = 0;
      }
    }*/




  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  secondsToHms(d) {
    d = Number(d);
    var days = Math.floor(d / 86400);
    var hours = Math.floor((d % 86400) / 3600);
    var mins = Math.floor(((d % 86400) % 3600) / 60);
    var secs = ((d % 86400) % 3600) % 60;
    return (days > 0 ? days + 'd ' : '') + ('00' + hours).slice(-2) + ':' + ('00' + mins).slice(-2) + ':' + ('00' + secs).slice(-2);
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
  calulatesectomin(time){
    var hours = Math.floor(time / 3600);
    return new Date(time * 1000).toISOString().substr(11, 8)
  }
}
