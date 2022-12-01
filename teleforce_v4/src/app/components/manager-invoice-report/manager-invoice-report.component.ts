import { Component, OnInit,ViewChild } from '@angular/core';
import { ManagerService } from "../../manager.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manager-invoice-report',
  templateUrl: './manager-invoice-report.component.html',
  styleUrls: ['./manager-invoice-report.component.css']
})
export class ManagerInvoiceReportComponent implements OnInit {

  public billdataSource: MatTableDataSource<any>;
  billdisplayedColumns: string[] = ['id', 'billdate', 'package','invoice'];
  billLength = 0;
  isLoading = true;

  constructor( private managerservice: ManagerService,) {
    }

  @ViewChild('billpaginator') billpaginator: MatPaginator;

  ngOnInit(): void {
    this.billdataSource = new MatTableDataSource();
    var userid = localStorage.getItem("access_id");
    //var userid = '232';
    this.getBillingData(userid);
  }

  async getBillingData(managerid) {
    await this.managerservice.getBillingData(managerid).then(
      data => {
        //console.log(data['data']);
        this.billdataSource.data = data['data'];
        this.billLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }

  ngAfterViewInit() {
    this.billdataSource.paginator = this.billpaginator;
  }
}
