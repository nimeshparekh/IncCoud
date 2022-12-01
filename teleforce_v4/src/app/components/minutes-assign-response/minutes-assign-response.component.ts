import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { CampaignService } from '../../campaign.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-minutes-assign-response',
  templateUrl: './minutes-assign-response.component.html',
  styleUrls: ['./minutes-assign-response.component.css']
})
export class MinutesAssignResponseComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'callername', 'callerno', 'agentname', 'created_date', 'complete_time', 'diff'];
  Length = 0;
  isLoading = false;
  public searchform: FormGroup;
  campaigns = [];
  startdate;
  enddate;
  msg;

  constructor(private reportservice: ReportService,
    private fb: FormBuilder,
    private campaignservice: CampaignService,
    private userservice: UserService,
    private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      campid: [null, Validators.required],
      startdate: [null],
      enddate: [null]
    });
    this.getCampaigns();
  }

  async searchData() {
    //this. isLoading = true;
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
        this.reportservice.getManagerMinuteAssignData(data).then(
          data => {
            //this.datalist = data['data'];
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
        this.reportservice.getManagerMinuteAssignData(data).then(
          data => {
            //this.datalist = data['data'];
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
      } else {
        this.msg = "Please select search date difference below 31 day";
        this.dataSource.data = [];
        this.Length = 0;
      }
    }



  }

  async getCampaigns() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getallcampaign(userinfo).then(data => {
      if (data) {
        this.campaigns = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

}
