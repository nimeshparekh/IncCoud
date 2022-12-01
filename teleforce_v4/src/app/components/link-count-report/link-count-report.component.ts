import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateSmsTemplateComponent } from '../create-sms-template/create-sms-template.component';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { SmscampaignService } from '../../smscampaign.service';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-link-count-report',
  templateUrl: './link-count-report.component.html',
  styleUrls: ['./link-count-report.component.css']
})
export class LinkCountReportComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'cam_name', 'mobile', 'hit_count'];
  Length = 0;
  isLoading = true;
  kyc;
  isDisabled = false;
  public searchform: FormGroup;

  constructor(private userservice: UserService,
    private SmscampaignService: SmscampaignService,
    private ReportService: ReportService,
    public dialog: MatDialog, private router: Router, private fb: FormBuilder) { }

  @ViewChild('paginator') paginator: MatPaginator;


  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource(); // create new object
    this.getlinkcountreport();
    this.searchform = this.fb.group({
      cam_name: [''],
      userid: [userid],

      mobile: [''],
      hit_count: ['']
    });
  }
  async getlinkcountreport() {
    await this.SmscampaignService.getlinkcountreport().then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );

  }
  async searchData() {
    this.isLoading = true;
    this.isDisabled = true;
    let data: any = Object.assign(this.searchform.value);
    this.SmscampaignService.searchlinkcount(data).then(
      data => {
        //console.log(data);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
        this.isDisabled = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  resetform() {
    this.isLoading = true;
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      cam_name: [''],
      userid: [userid],

      mobile: [''],
      hit_count: ['']
    });
    this.getlinkcountreport();

  }
  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
  }
}

