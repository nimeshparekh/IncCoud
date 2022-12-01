import { Component, OnInit , ViewChild } from '@angular/core';
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
  selector: 'app-campaign-disposition-report',
  templateUrl: './campaign-disposition-report.component.html',
  styleUrls: ['./campaign-disposition-report.component.css']
})
export class CampaignDispositionReportComponent implements OnInit {
  isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','name','dname','count'];
  Length = 0;
  isLoading = false;
  public searchform: FormGroup;
  startdate;
  enddate;
  msg = '';
  campaigns=[];

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
    this.getCampaign();
    this.searchform = this.fb.group({
      userid:[userid],
      startdate:[currentdate,Validators.required],
      enddate:[currentdate,Validators.required],
      campaignid :['campaign_summary']

    });
  }
  
  async searchData() {
    this.isLoading = true;
    this.isDisabled=true;
    let data: any = Object.assign(this.searchform.value);
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
    this.reportservice.getsupervisiorCampaignDispositionData(data).then(
      data => {
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
    else{
      this.reportservice.getCampaignDispositionData(data).then(
        data => {
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
  }
  async getCampaign() {
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
      this.reportservice.supervisiorgetDispositionCampaign().then(
        data => {
          console.log(data['data']);        
          this.campaigns = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    }
    else{
      this.reportservice.getDispositionCampaign().then(
        data => {
          console.log(data['data']);        
          this.campaigns = data['data'];
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
