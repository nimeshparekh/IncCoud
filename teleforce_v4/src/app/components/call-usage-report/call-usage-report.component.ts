import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-call-usage-report',
  templateUrl: './call-usage-report.component.html',
  styleUrls: ['./call-usage-report.component.css']
})
export class CallUsageReportComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
 displayedColumns: string[] = ['id', 'account_name',  'total_calls','incoming_usage', 'outgoing_usage', 'dialer_usage'];
  Length = 0;
  isLoading = true
  public searchform: FormGroup;
  callstatus=[];
  didarr=[];
  agents=[];
  callername=[];
  calltype=[];
  lastdestination=[];  
  kyc;
  constructor(
    private userservice: ReportService,
    public dialog: MatDialog,    
    private fb: FormBuilder,
    private router: Router
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource(); // create new object
    //this.getCallLog(userid) /* show all call log*/
    var currentdate = new Date();
    this.searchform = this.fb.group({
      startdate: [currentdate],
      enddate: [currentdate],
   
    });
    this.searchData();/* show current date call log*/

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  

  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    console.log(data);
    this.userservice.search_call_usage_report(data).then(
      data => {
        console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  

  resetform(){
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [null],
      enddate: [null],
     
    });
    this.searchData();
  }

 

 

}

