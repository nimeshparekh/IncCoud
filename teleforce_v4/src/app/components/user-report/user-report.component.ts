import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import {MatDatepicker} from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { FormBuilder, FormControl,FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Moment } from 'moment';
import * as _moment from 'moment';
const moment = _moment;
import { interval, Subscription } from 'rxjs';
import { ChartDataSets,ChartType, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class UserReportComponent implements OnInit {
  searchform: FormGroup;
  currnetdate ;
  date = new FormControl(moment());
  enddate = new FormControl(moment());
  isLoading = false;
  Length = 0;
  currentdate = new Date();
  public barChartOptions = {
    responsive: true
  };
  public barChartLabels : Label[] =['oct 2020'];
  public barChartType = 'bar';
  public barChartLegend = true;
   public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'Expried User(0)' },
    { data: [0], label: 'New User(0)' },
    { data: [0], label: 'Active User(0)' },
      
    
   ];

  constructor(
    private reportservice: ReportService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    //this.getusercount();
    //this.getusercounts();
    this.searchform = this.formBuilder.group({
      date: ['', [Validators.required]],
      enddate: ['', [Validators.required]]
    });
    this.searchData();
  }

  chosenYearHandler(normalizedYear: Moment){
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    
  }
  chosenMonthHandler(normalizedMonth: Moment, startpicker: MatDatepicker<Moment>){
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    console.log("start date: ", this.date);    
    startpicker.close();    
  }
  endchosenYearHandler(normalizedYear: Moment){
    const ctrlValue = this.enddate.value;
    ctrlValue.year(normalizedYear.year());
    this.enddate.setValue(ctrlValue);
    
  }
  endchosenMonthHandler(normalizedMonth: Moment, endpicker: MatDatepicker<Moment>){
   
    const ctrlValue = this.enddate.value;
    ctrlValue.month(normalizedMonth.month());
    this.enddate.setValue(ctrlValue);
    console.log("end date: ", this.date);
    
    endpicker.close();
    
    
  }
  searchData(){    
    this.reportservice.searchUserReportData(this.date.value._d,this.enddate.value._d).then(
      data => { 
        var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December' ];
        var frommonth =  (new Date(this.date.value._d).getMonth()).toString().slice(-2);
        var fromyear =  (new Date(this.date.value._d).getFullYear()).toString();
        var tomonth =  (new Date(this.enddate.value._d).getMonth()).toString().slice(-2);
        var toyear =  (new Date(this.enddate.value._d).getFullYear()).toString();
        this.barChartLabels = [ monthNames[frommonth]+' '+fromyear+' - '+monthNames[tomonth]+' '+toyear];     
        let New = data['data'][0].adduser;
        let expireds= data['data'][0].expireuser;
        let active = data['data'][0].active;
        
        this.barChartData = [
          { data: [expireds], label: 'Expried User('+data['data'][0].expireuser+')' },
          { data: [New], label: 'New User('+data['data'][0].adduser+')' },
          { data: [active], label: 'Active User('+data['data'][0].active+')' },
        ];     
      },
      err => {
        console.log('error');
      }
    );
   
  }
  getusercounts(){
    this.reportservice.getNewusercount().then(
      data => {
       
        let New = data['data'][0].newadd;
        let expireds= data['data'][0].expired;
        let active = data['data'][0].active;
        let total =New+expireds+active;
       
        console.log("total",total);
        
        this.barChartData = [
          { data: [expireds], label: 'Expried User' },
          { data: [New], label: 'ADD User' },
          { data: [active], label: 'Acrive User' },
          { data:[total],label:'total'},
        ];
        
       
       
      },
      err => {
        console.log('error');
      }
    );

  }
  getusercount(){
    console.log(this.barChartData);
    
    this.reportservice.getNewusercount().then(
      data => {
        console.log("hello",data['data']);
        let New = data['data'][0].newadd;
        this.barChartData.push({ data: [New], label: 'ADD User' });
      },
      err => {
        console.log('error');
      }
    );
    this.reportservice.getExpriedusercount().then(
      data => {
        console.log("hello",data['data']);
        let Expried = data['data'][0].expired;
        
          const expiredData = { data: [Expried], label: 'Expried User' }
          this.barChartData.push(expiredData);
        
      
      },
      err => {
        console.log('error');
      }
    );
   
    this.reportservice.getusercount().then(
      data => {
       
        let upcount = data['data'][0].active;
        this.barChartData.push({ data: [upcount], label: 'Active User' });
      },
      err => {
        console.log('error');
      }
    );


 

  }
  
}
