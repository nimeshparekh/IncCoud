import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-spam-did-report',
  templateUrl: './spam-did-report.component.html',
  styleUrls: ['./spam-did-report.component.css']
})
export class SpamDidReportComponent implements OnInit {

  isLoading=true;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'did', 'spamdate', 'assign'];
  Length = 0;
 
  constructor( private reportservice: ReportService,) { }

  @ViewChild('paginator') paginator: MatPaginator; 

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    this.getSpamDIDdata();
  }
  async getSpamDIDdata(){
    this.isLoading = true;
    this.reportservice.getSpamDIDdata().then(
      data => {
        //this.datalist = data['data'];
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
        //console.log(data['data'][0]);
      },
      err => {
        console.log('error');
      }
    );
  }

}
