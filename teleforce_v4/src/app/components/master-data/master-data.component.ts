import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {ContactDataSource} from "./manage.datasource";
import {CountContactDataSource} from "./manage.datasource";
import {PinCountContactDataSource} from "./manage.datasource";
import { CrudService } from '../../crud.service';
import {merge, fromEvent} from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css']
})
export class MasterDataComponent implements OnInit {

  public dataSource: ContactDataSource;
  public countdataSource: CountContactDataSource;
  public pincountdataSource: PinCountContactDataSource;
  

  // public dataSource: MatTableDataSource<any>;
 displayedColumns: string[] = ['id', 'name', 'number', 'email', 'address','city', 'Pincode'];//'feedback'
 countdisplayedColumns: string[] = ['city', 'total'];//'feedback'
 pincountdisplayedColumns: string[] = ['Pincode', 'total'];//'feedback'
 public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
 public doughnutChartData = [120, 150, 180, 90];
 public doughnutChartType = 'doughnut';
 public doughnutChartLabels2 = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
 public doughnutChartData2 = [120, 150, 180, 90];
 public doughnutChartType2 = 'doughnut';
 
  Length = 0;
  Length2 = 0;
  Length3 = 0;
  loaddata;
  isLoading = true
  public searchform: FormGroup;
  callstatus=[];
  didarr=[];
  agents=[];
  callername=[];
  calltype=[];
  lastdestination=[];
  misscallservice=false;
  ivr=false;
  clicktocall=false;
  conference=false;
  public lineChartType: ChartType = 'line';
  constructor(
    private managerservice: ManagerService,
    public dialog: MatDialog,    
    private fb: FormBuilder,
    private userservice: CrudService) { }

  // @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  @ViewChild('countpaginator') countpaginator: MatPaginator;
  @ViewChild('pincountpaginator') pincountpaginator: MatPaginator;




  ngOnInit(): void {
    // this.dataSource = new ContactDataSource(); // create new object

    var currentdate = new Date();

    this.dataSource = new ContactDataSource(this.userservice);
    this.countdataSource = new CountContactDataSource(this.userservice); // create new object
    this.pincountdataSource = new PinCountContactDataSource(this.userservice); // create new object


    var userid = localStorage.getItem('access_id');
    this.dataSource.loadContacts({city:'',pincode:'',mobile:''}, 0, 50);
    this.totalcount();
    this.graph()
    this.countdataSource.loadContacts({city:'',pincode:'',mobile:''}, 0, 50);
    // this.totalpincount();
    this.pingraph()
    // this.pincountdataSource.loadContacts({city:'',pincode:'',mobile:''}, 0, 50);



    //this.getCallLog(userid) /* show all call log*/
    this.searchform = this.fb.group({
      city:[''],
      pincode:[''],
      mobile:['']
    });
    this.totalData();/* show current date call log*/
    

  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    merge(this.contactpaginator.page)
    .pipe(
        tap(() => this.loadContactPage())
    )
    .subscribe();
    // merge(this.countpaginator.page)
    // .pipe(
    //     tap(() => this.loadContactPage())
    // )
    // .subscribe();
    // merge(this.pincountpaginator.page)
    // .pipe(
    //     tap(() => this.loadContactPage())
    // )
    // .subscribe();
  }

  totalData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.userservice.totalmaster(data).then(
      data => {
        // this.dataSource.data = data['data'];
        this.Length = data['data'][0].total;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  totalcount(){
    this.isLoading = true;
    var data = localStorage.getItem('access_id');
    this.userservice.totalcount(data).then(
      data => {
        this.Length2 = data['data'];
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  totalpincount(){
    this.isLoading = true;
    var data = localStorage.getItem('access_id');
    this.userservice.totalpincount(data).then(
      data => {
        this.Length3 = data['data'];
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  graph(){
    this.isLoading = true;
    var data = localStorage.getItem('access_id');
    this.userservice.totalcountgraph(data).then(
      data => {
        let statusArr = [];
        let statusvalue = [];
        for(var i =0;i<data['data'].length;i++){
          statusArr.push(data['data'][i]['city']);
          statusvalue.push(data['data'][i]['total']);
        }  
        this.doughnutChartLabels=statusArr;
        this.doughnutChartData=statusvalue;  
        this.loaddata = data['data']
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  pingraph(){
    this.isLoading = true;
    var data = localStorage.getItem('access_id');
    this.userservice.totalpincountgraph(data).then(
      data => {
        let statusArr = [];
        let statusvalue = [];
        for(var i =0;i<data['data'].length;i++){
          statusArr.push(data['data'][i]['Pincode']);
          statusvalue.push(data['data'][i]['total']);
        }  
        this.doughnutChartLabels2=statusArr;
        this.doughnutChartData2=statusvalue;  
        // this.barChartLabels=statusArr;
        // this.barChartData=statusvalue;  

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
      city:[''],
      pincode:[''],
      mobile:['']
    });
    this.totalData();
    let data: any = Object.assign(this.searchform.value);
    // this.getContacts();
    this.dataSource.loadContacts(data,0, 50);
  }

  feedbackdialog(id): void {
    const dialogRef = this.dialog.open(AgentCallFeedbackComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {

       //this.searchData();
      }
    });
  }



  loadContactPage(){
    //this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize);
    this.countdataSource.loadContacts(data,
        this.countpaginator.pageIndex,
        this.countpaginator.pageSize);
    this.pincountdataSource.loadContacts(data,
      this.pincountpaginator.pageIndex,
      this.pincountpaginator.pageSize);
      
  }

  Filtercontact(){
    let data: any = Object.assign(this.searchform.value);
    this.totalData();
    this.dataSource.loadContacts(data,0, 50);
  }

  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40]},
    {data: [28, 48, 40, 19, 86, 27, 100]},
    
  ];
  

  // async todayCallType(id){
  //   //console.log(id);   
  //   await this.userservice.todayCallType(id).then(
  //     data => {
  //       //console.log(data['data']);
  //       let statusArr = [];
  //       let statusvalue = [];
  //       for(var i =0;i<data['data'].length;i++){
  //         statusArr.push(data['data'][i]['CallType'].toUpperCase()+'('+data['data'][i]['totalcnt']+')');
  //         statusvalue.push(data['data'][i]['totalcnt']);
  //       }       
  //       //for doughnutchart
  //       this.doughnutChartLabels=statusArr;
  //       this.doughnutChartData=statusvalue;
  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }

}
