import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CampaignService } from "../../campaign.service";
import { ManagerService } from "../../manager.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudService } from '../../crud.service';
// import {ContactDataSource} from "./campaign.datasource";
import {merge, fromEvent} from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-accounting-status',
  templateUrl: './accounting-status.component.html',
  styleUrls: ['./accounting-status.component.css']
})
export class AccountingStatusComponent implements OnInit {

  campaignid = this.route.snapshot.paramMap.get('id');
  campaignname = '';
  public summarydataSource: MatTableDataSource<any>;
  displayedSummaryColumns: string[] = ['id', 'status', 'count', 'action'];
  displayedColumns: string[] = ['id', 'name', 'email', 'mobile','channel','users','packagename','SalesManager'];
 // displayedColumns: string[] = ['id', 'name', 'email', 'mobile','channel','users','usedduration','packagename'];
 expireremainColumns: string[] = ['id', 'name', 'email', 'mobile','channel','users','packagename', 'expirydate','SalesManager'];
 //expireremainColumns: string[] = ['id', 'name', 'email', 'mobile','channel','users','usedduration','packagename', 'expirydate'];
 expireColumns: string[] = ['id', 'name', 'email', 'mobile','channel','users','packagename', 'expirydate','SalesManager'];
 //expireColumns: string[] = ['id', 'name', 'email', 'mobile','channel','users','usedduration','packagename', 'expirydate'];


  summaryLength = 0;
  ActiveLength = 0;
  expireLength = 0;


  // public logdataSource: MatTableDataSource<any>;
  // public logdataSource: ContactDataSource;

  public userdataSource: MatTableDataSource<any>;
  public expiredataSource: MatTableDataSource<any>;
  isLoading = true;
  liveagent = false;
  outboundcam = false;


  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userservicee: CrudService
  ) { }

  @ViewChild('summarypaginator') summarypaginator: MatPaginator;
  @ViewChild('logpaginator') logpaginator: MatPaginator;
  @ViewChild('agentpaginator') agentpaginator: MatPaginator;


  ngOnInit(): void {
    this.userdataSource = new MatTableDataSource();
    this.expiredataSource = new MatTableDataSource();
    this.summarydataSource = new MatTableDataSource();
    this.getCampaignCallSummary();
    this.getexpireremine();
    this.expireuser();
  }


  async getCampaignCallSummary() {
    var userid = localStorage.getItem('access_id');
    await this.managerservice.get_all_managers_account_status(userid).then(
      data => {
        this.summarydataSource.data = data['data'];
        this.summaryLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }

  async getexpireremine() {
    var userid = localStorage.getItem('access_id');
    await this.managerservice.active_user_account_status(userid).then(
      data => {
        this.userdataSource.data = data['data'];
        this.ActiveLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  public doFilter = (value: string) => {
    this.userdataSource.filter = value.trim().toLocaleLowerCase();
    this.expiredataSource.filter = value.trim().toLocaleLowerCase();
    this.summarydataSource.filter = value.trim().toLocaleLowerCase();
  }
  async expireuser() {
    var userid = localStorage.getItem('access_id');
    await this.managerservice.expire_user_account_status(userid).then(
      data => {
        this.expiredataSource.data = data['data'];
        this.expireLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }

 



}
