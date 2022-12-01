import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminGstComponent } from '../admin-gst/admin-gst.component';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-admin-gst-display',
  templateUrl: './admin-gst-display.component.html',
  styleUrls: ['./admin-gst-display.component.css']
})
export class AdminGstDisplayComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'GST_Number', 'State', 'State_code','Data_Date' ,'action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getGSTdata();
  }
  async getGSTdata() {
    await this.adminservice.getGSTdata().then(
      data => {
        //console.log(data['data']);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  Createdialog(): void {
    const dialogRef = this.dialog.open(AdminGstComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getGSTdata();
      }
    });
  }



  updatedialog(id): void {
   
    const dialogRef = this.dialog.open(AdminGstComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getGSTdata();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(AdminGstComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getGSTdata();
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
