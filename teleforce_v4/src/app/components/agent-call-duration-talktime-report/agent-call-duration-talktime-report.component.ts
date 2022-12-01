import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";

import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";@Component({
  selector: 'app-agent-call-duration-talktime-report',
  templateUrl: './agent-call-duration-talktime-report.component.html',
  styleUrls: ['./agent-call-duration-talktime-report.component.css']
})
export class AgentCallDurationTalktimeReportComponent implements OnInit {
  isDisabled=false
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'CallTalkTime',  'AgentTalkTime'];
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

    });
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
  }

  async searchData() {
    //this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
 
          this.reportservice.get_agent_callduration_talktime(data).then(
            data => {
             
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
