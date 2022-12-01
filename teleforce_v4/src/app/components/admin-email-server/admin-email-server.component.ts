
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEmailServerComponent } from '../create-email-server/create-email-server.component';

import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-admin-email-server',
  templateUrl: './admin-email-server.component.html',
  styleUrls: ['./admin-email-server.component.css']
})
export class AdminEmailServerComponent implements OnInit {

  
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'smtp_server', 'smtp_port','smtp_username','smtp_password','perday_limit','attachment_size','action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getEmailServerData();
  }
  async getEmailServerData(){
    await this.adminservice.getEmailServerData().then(
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

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateEmailServerComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getEmailServerData();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateEmailServerComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getEmailServerData();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateEmailServerComponent, {
      width: '340px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getEmailServerData();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }



}
