import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-admin-display-careers-data',
  templateUrl: './admin-display-careers-data.component.html',
  styleUrls: ['./admin-display-careers-data.component.css']
})
export class AdminDisplayCareersDataComponent implements OnInit {

  
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name','email','mobile','msg','address','date','uploadfile'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getCareersData();
  }
  async getCareersData(){
    await this.adminservice.getCareersData().then(
      data => {
       // console.log(data['data']);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}
