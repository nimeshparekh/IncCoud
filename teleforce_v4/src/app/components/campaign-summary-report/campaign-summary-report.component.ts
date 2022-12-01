import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";


import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
  selector: 'app-campaign-summary-report',
  templateUrl: './campaign-summary-report.component.html',
  styleUrls: ['./campaign-summary-report.component.css']
})
export class CampaignSummaryReportComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','name', 'records','calls','answer','noanswer','notinterested','schedule','connected_ratio'];
  Length = 0;
  isLoading = false;
  public searchform: FormGroup;
  startdate;
  enddate;
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
      userid:[userid],
      startdate:[currentdate,Validators.required],
      enddate:[currentdate,Validators.required],
      reportname :['campaign_summary']
    });
    //this.getManagerCampaignData();
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
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
    var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
    // if (daydiff <= 1) {
      this.msg = "";
      this.isLoading = true;
      this.startdate = new Date(data.startdate);
      this.enddate = new Date(data.enddate);
      //console.log(data.userid);
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
      if(agentrole=="supervisor"){
      this.reportservice.getsupervisiorCampaignData(data).then(
        data => {
          //this.datalist = data['data'];
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false;
          //this.totalcancel = (data['data'][0]['cnt']);
        },
        err => {
          console.log('error');
        }
      );
    }
      else{
        this.reportservice.getManagerCampaignData(data).then(
          data => {
            console.log(data['data']);
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
            //this.totalcancel = (data['data'][0]['cnt']);
          },
          err => {
            console.log('error');
          }
        );
      }
    // } else {
    //   this.msg = "Please select search date difference below 1 day between 8 AM To 8 PM. For More date difference , Press Request Report";
    //   this.dataSource.data = [];
    //   this.Length = 0;
    // }







  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async checkkyc(id){
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
        }else{
          this.router.navigate(['/kyc-document-upload']);
        }        
      },
      err => {
        console.log('error');
      }
    );
  }

}
