import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../report.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from "@angular/router";
import { UserService } from '../../user.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-call-summary-report',
  templateUrl: './call-summary-report.component.html',
  styleUrls: ['./call-summary-report.component.css']
})
export class CallSummaryReportComponent implements OnInit {

  isDisabled=false;
  isLoading = false;
  totalcancel = 0;
  totalnoanswer = 0;
  totalanswer = 0;
  totalincoming = 0;
  totaldialer = 0;
  totaloutgoing = 0;
  totalinterest = 0;
  totalnotinterest = 0;
  totalschedule = 0;
  msg = '';

  public searchform: FormGroup;
  startdate;
  enddate;
  kyc;
  constructor(

    private reportservice: ReportService,
    private fb: FormBuilder,
    private router: Router,
    private userservice: UserService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [null, Validators.required],
      enddate: [null, Validators.required],
      reportname :['call_summary']

    });
  }

  async requestData() {
    let data: any = Object.assign(this.searchform.value);

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
    //var currentime = new Date("2020-11-11 08:59 PM");

    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
    this.isDisabled=true
    if (currentime.getHours() > 7 && currentime.getHours() < 20) {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      if (daydiff <= 1) {
        this.msg = "";
        this.isLoading = true;
        this.isDisabled=true

        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        this.reportservice.searchCallSummary(data).then(
          data => {
            this.totalcancel = (data['data'][0].CANCEL);
            this.totalnoanswer = data['data'][0].NOANSWER;
            this.totalanswer = data['data'][0].ANSWER;
            this.totalincoming = data['data'][0].INCOMMING;
            this.totaloutgoing = data['data'][0].OUTGOING;
            this.totaldialer = data['data'][0].DIALER;
            this.totalinterest = data['data'][0].interested;
            this.totalnotinterest = data['data'][0].not_interested;
            this.totalschedule = data['data'][0].schedule;
            this.isLoading = false;
            this.isDisabled=false;

          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.msg = "Please select search date difference below 1 day between 8 AM To 8 PM. For More date difference , Press Request Report";
        this.totalcancel = 0;
        this.totalnoanswer = 0;
        this.totalanswer = 0;
        this.totalincoming = 0;
        this.totaldialer = 0;
        this.totaloutgoing = 0;
        this.totalinterest = 0;
        this.totalnotinterest = 0;
        this.totalschedule = 0;
      }
    } else {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      if (daydiff <= 31) {
        this.msg = "";
        this.isLoading = true;
        this.isDisabled=true

        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        this.reportservice.searchCallSummary(data).then(
          data => {
            this.totalcancel = (data['data'][0].CANCEL);
            this.totalnoanswer = data['data'][0].NOANSWER;
            this.totalanswer = data['data'][0].ANSWER;
            this.totalincoming = data['data'][0].INCOMMING;
            this.totaloutgoing = data['data'][0].OUTGOING;
            this.totaldialer = data['data'][0].DIALER;
            this.totalinterest = data['data'][0].interested;
            this.totalnotinterest = data['data'][0].not_interested;
            this.totalschedule = data['data'][0].schedule;
            this.isLoading = false;
            this.isDisabled=false;

          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.msg = "Please select search date difference below 31 day";
        this.totalcancel = 0;
        this.totalnoanswer = 0;
        this.totalanswer = 0;
        this.totalincoming = 0;
        this.totaldialer = 0;
        this.totaloutgoing = 0;
        this.totalinterest = 0;
        this.totalnotinterest = 0;
        this.totalschedule = 0;
      }
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
  createExcel(){
    this.isLoading = true
    let data: any = Object.assign(this.searchform.value);
     this.reportservice.callsummaryreportexcel(data).then(
      data => {
        this.isLoading = false;
       var url = environment.apiUrl+'/'+data['data']
       window.open(url, '_blank');
      },
      err => {
        console.log('error');
      }
    );
  }


}
