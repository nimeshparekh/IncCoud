import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";


@Component({
  selector: 'app-dial-result-report',
  templateUrl: './dial-result-report.component.html',
  styleUrls: ['./dial-result-report.component.css']
})
export class DialResultReportComponent implements OnInit {

  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'calltype', 'calls', 'interested', 'notinterested', 'schedule', 'answer', 'noanswer'];
  Length = 0;
  kyc;
  msg = '';

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
      userid: [userid],
      startdate: [null, Validators.required],
      enddate: [null, Validators.required]
    });
  }

  async searchData() {
    //this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    var currentime = new Date();
    this.startdate = new Date(data.startdate);
    this.enddate = new Date(data.enddate)
    if (currentime.getHours() > 7 && currentime.getHours() < 20) {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      if (daydiff <= 1) {
        this.msg = "";
        this.isLoading = true;
        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        //console.log(data.userid);
        this.reportservice.managerDialResultData(data).then(
          data => {
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.msg = "Please select search date difference below 1 day between 8 AM TO 8 PM";
        this.dataSource.data = [];
        this.Length = 0;
      }
    } else {
      var daydiff = (this.enddate.getTime() - this.startdate.getTime()) / 1000 / 60 / 60 / 24;
      if (daydiff <= 31) {
        this.msg = "";
        this.isLoading = true;
        this.startdate = new Date(data.startdate);
        this.enddate = new Date(data.enddate);
        //console.log(data.userid);
        this.reportservice.managerDialResultData(data).then(
          data => {
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
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
    }




  }

  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.kycDocumentData(id).then(
      data => {
        this.kyc = data['data'].length;
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


}
