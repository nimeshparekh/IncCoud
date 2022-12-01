import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

@Component({
  selector: 'app-renewal-report',
  templateUrl: './renewal-report.component.html',
  styleUrls: ['./renewal-report.component.css']
})
export class RenewalReportComponent implements OnInit {
  isDisabled=false;
  searchform: FormGroup;
  isLoading = false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'email', 'plan_name', 'plan_status', 'plan_type', 'startingdate', 'renewcount', 'lastrenewdate', 'expiredate', 'usercount', 'channelcount', 'totalamount', 'billingdiscount','renew_account_manager'];
  Length = 0;
  currentdate = new Date();

  constructor(private reportservice: ReportService,
    private formBuilder: FormBuilder, ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    this.searchform = this.formBuilder.group({
      type: ['', [Validators.required]]
    });
  }

  async searchData() {
    let data: any = Object.assign(this.searchform.value);
    this.isLoading = true;
    this.isDisabled=true;
    this.reportservice.getRenewalBillingData(data).then(
      data => {
        //this.datalist = data['data'];
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
       this.isDisabled=false;
        //this.totalcancel = (data['data'][0]['cnt']);
      },
      err => {
        this.isDisabled=false;

        console.log('error');
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
