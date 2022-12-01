import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";


@Component({
  selector: 'app-hourly-call-report',
  templateUrl: './hourly-call-report.component.html',
  styleUrls: ['./hourly-call-report.component.css']
})
export class HourlyCallReportComponent implements OnInit {

  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading=false;
  agents=[];
  datalist=[];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','11','12','13','14','15','16','17','18','19', '1','2','3','4','5','6','7','8','9','10','20','21','22','23','24'];
  Length = 0;
  kyc;

  constructor(
    private reportservice: ReportService,
    private fb: FormBuilder,
    private router: Router,
    private userservice: UserService
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); 
    this.searchform = this.fb.group({
      userid:[userid],
      startdate:[null,Validators.required],
     // enddate:[null,Validators.required]
    });
  }

  async searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    //console.log(data.userid);
    this.reportservice.hourlyCallData(data).then(
      data => {
        console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async checkkyc(id){
    //console.log(id);   
    await this.userservice.kycDocumentData(id).then(
      data => {
        this.kyc = data['data'].length;
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
