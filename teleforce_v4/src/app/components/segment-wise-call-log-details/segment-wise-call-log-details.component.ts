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
  selector: 'app-segment-wise-call-log-details',
  templateUrl: './segment-wise-call-log-details.component.html',
  styleUrls: ['./segment-wise-call-log-details.component.css']
})
export class SegmentWiseCallLogDetailsComponent implements OnInit {
  isDisabled=false
  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'DID', 'AgentName', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallTalkTime','AgentTalkTime', 'CallStatus', 'AgentStatus', 'CallType', 'segment_name','DisconnectedBy']; //'agentname',
  Length = 0;
  kyc;
  date2;
  date1;
  msg = '';
  category='';
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
      category:[null],
      reportname :['segment-wise-calllog']

    });
    //this.calculateDateTimeDiff();
    this.getContactCategory();
      }
      getContactCategory() {
        let userinfo = localStorage.getItem('access_id');
     
          this.http.get(environment.apiUrl + '/contacts/getCategorylist/' + userinfo).subscribe((data: any) => {
            this.category = data['data'];
          
          });
          
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
        this.reportservice.segement_wise_call_log(data).then(
          data => {
    
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

  secondsToHms(d) {
    d = Number(d);
    var days = Math.floor(d / 86400);
    var hours = Math.floor((d % 86400) / 3600);
    var mins = Math.floor(((d % 86400) % 3600) / 60);
    var secs = ((d % 86400) % 3600) % 60;
    return (days > 0 ? days + 'd ' : '') + ('00' + hours).slice(-2) + ':' + ('00' + mins).slice(-2) + ':' + ('00' + secs).slice(-2);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



}
