import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-callback-summary-report',
  templateUrl: './callback-summary-report.component.html',
  styleUrls: ['./callback-summary-report.component.css']
})
export class CallbackSummaryReportComponent implements OnInit {

  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading=false;
  agents=[];
  datalist=[];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','calls'];
  Length = 0;
  kyc;

  constructor(
    private reportservice: ReportService,
    private userservice: UserService,
    private fb: FormBuilder,
    private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); 
    this.searchform = this.fb.group({
      userid:[userid],
      startdate:[null,Validators.required],
      enddate:[null,Validators.required]
    });
  }

  async searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate);
    //console.log(data.userid);
    this.reportservice.managerCallBackSummary(data).then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }

  async checkkyc(id){
    //console.log(id);   
    await this.userservice.kycDocumentData(id).then(
      data => {
        this.kyc = data['data'].length;
        if(this.kyc == 0){
          this.router.navigate(['/kyc-document-upload']);
        }else if(data['data'][0]['status'] == 2){
          this.router.navigate(['/kyc-document-upload']);
        }else if(data['data'][0]['status'] == 0){
          this.router.navigate(['/kyc-document-upload']);
        }
        
      },
      err => {
        console.log('error');
      }
    );
  }

}
