import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-billing-report',
  templateUrl: './billing-report.component.html',
  styleUrls: ['./billing-report.component.css']
})
export class BillingReportComponent implements OnInit {

  isLoading=true;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'email','plan_name','plan_type','startingdate','renewcount','lastrenewdate','expiredate','usercount','channelcount','billingdiscount','totalamount','invoice'];//,'plan_status'
  Length = 0;
  currentdate=new Date();
 

  constructor( private reportservice: ReportService,) { }

  @ViewChild('paginator') paginator: MatPaginator;  

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    this.getBillingData();
  }

  async getBillingData(){
    this.isLoading = true;
    this.reportservice.getBillingReport().then(
      data => {
        //this.datalist = data['data'];
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
        //this.totalcancel = (data['data'][0]['cnt']);
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
