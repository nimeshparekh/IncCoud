import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
  selector: 'app-admin-activity-log',
  templateUrl: './admin-activity-log.component.html',
  styleUrls: ['./admin-activity-log.component.css']
})
export class AdminActivityLogComponent implements OnInit {

  isDisabled=false
  public searchform: FormGroup;
 
  isLoading = false;

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'account_id','account_name' ,'date', 'ip','action','old_req','new_req']; //'agentname',
  Length = 0;
  kyc;
  manager_data=[];
    timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(
    private userservice: UserService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource();
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      account_id:['']


    }); 
    this.searchData();
    this.get_manager_id()
  }

 get_manager_id(){
  this.userservice.get_manager_id().then(
    data => {
     this.manager_data=data['data']
    },
    err => {
      console.log('error');
    }
  );
 }


  async searchData() {

    let data: any = Object.assign(this.searchform.value);
    
        this.userservice.get_admin_acitivy_log(data).then(
          data => {
            console.log("agent Login Activity Data");
            console.log(JSON.stringify(data));
            this.dataSource.data = data['data'];
            this.Length = data['data'].length;
            this.isLoading = false;
            this.isDisabled=false

          },
          err => {
            console.log('error');
          }
        );
      

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }





}
