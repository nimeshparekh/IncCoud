import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-callback-detailed-report',
  templateUrl: './callback-detailed-report.component.html',
  styleUrls: ['./callback-detailed-report.component.css']
})
export class CallbackDetailedReportComponent implements OnInit {

  public searchform: FormGroup;
  isLoading=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'calldate', 'scheduledate', 'finalizedate','agent','callername','callerno', 'status'];
  Length = 0;
  kyc;

  constructor(
    private reportservice: ReportService,
    private userservice: UserService,
    private fb: FormBuilder,
    private router: Router
  ) { }

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
    this.searchData();
  }

  async searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    //console.log(data.userid);
    this.reportservice.managerCallBackDetail(data).then(
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
