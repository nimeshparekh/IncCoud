import { Component, OnInit, ViewChild, Inject,ElementRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { AdminService } from '../../admin.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditDidConfigComponent } from '../edit-did-config/edit-did-config.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import { interval, Subscription } from 'rxjs';
import { ChartDataSets,ChartType, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-live-channel2',
  templateUrl: './live-channel2.component.html',
  styleUrls: ['./live-channel2.component.css']
})
export class LiveChannel2Component implements OnInit {
servername=[];
  subscription: Subscription;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'status', 'caller','connected'];
  Length = 0;
  isLoading = true
  public searchform: FormGroup;
  callstatus=[];
  didarr=[];
  agents=[];
  callername=[];
  calltype=[];
  kyc;
  //Line Chart
  totalchannelArr = [0]
  totaltimeArr = ['00.00']
  public lineChartData: ChartDataSets[] = [
    { data: this.totalchannelArr, label: 'Total Channels' },
  ];
  public lineChartLabels: Label[] = this.totaltimeArr;
  public lineChartOptions: (ChartOptions) = {responsive: true};
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  
  //Bar Chart
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Channel'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'Total' },
    { data: [0], label: 'Up' },
    { data: [0], label: 'Down' },
    { data: [0], label: 'Ringing' },
  ];

  constructor(
    private adminservice: AdminService,
    public dialog: MatDialog,    
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource(); // create new object
    this.getLiveChannel() /* show all call log*/
    var currentdate = new Date();
    this.searchform = this.fb.group({
     
      server:[],
    });
    const source = interval(10000);
    this.subscription = source.subscribe(val => this.getLiveChannel());
  }
  searchdata(){

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
  getLiveChannel(){
    this.getChannelStat()
    this.isLoading = true;
    this.adminservice.getlivechannel2().then(
      data => {
        //console.log(data['data']);
        this.servername=data['data'];

        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
        let upcount = 0;
        let downcount = 0;
        let ringingcount = 0;
        let othercount = 0;
        for(var i =0;i<data['data'].length;i++){
          if(data['data'][i]['state']=='Up'){
            upcount = upcount + 1;
          }
          if(data['data'][i]['state']=='Down'){
            downcount = downcount + 1;
          }
          if(data['data'][i]['state']=='Ringing'){
            ringingcount = ringingcount + 1;
          }
          //if(data['data'][i]['state']!=''){
            othercount = othercount + 1;
          //}
        }
        console.log(othercount)
        this.barChartData = [
          { data: [othercount], label: 'Total' },
          { data: [upcount], label: 'Up' },
          { data: [downcount], label: 'Down' },
          { data: [ringingcount], label: 'Ringing' },
        ];
      },
      err => {
        console.log('error');
      }
    );
  }
  getChannelStat(){
    this.adminservice.getchannelstat2().then(
      data => {
        //console.log(data['data']);
        let statusArr = [];
        let statusvalue = [];
        for(var i =0;i<data['data'].length;i++){
          statusArr.push(data['data'][i]['totalchannel']);
          statusvalue.push(data['data'][i]['time']);
        } 
        this.totalchannelArr = statusArr
        this.totaltimeArr = statusvalue
        this.lineChartData = [{ data: this.totalchannelArr, label: 'Total Channels' }]
        this.lineChartLabels = this.totaltimeArr;

      },
      err => {
        console.log('error');
      }
    );
  }

}
