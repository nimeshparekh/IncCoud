import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdminUserComponent } from '../create-admin-user/create-admin-user.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class AdminUserListComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'account_name', 'email', 'mobile', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getAdminUsers(userid)
  }
  async getAdminUsers(userid) {
    await this.adminservice.getAdminUsers(userid).then(
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
    const dialogRef = this.dialog.open(CreateAdminUserComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getAdminUsers(userid);
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateAdminUserComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getAdminUsers(userid);
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateAdminUserComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getAdminUsers(userid);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async changepassword(id){
    const dialogRef = this.dialog.open(CreateAdminUserComponent, {
      width: '300px', disableClose: true, data: {action:'password',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Password'){
        var userid = localStorage.getItem('access_id');
        this.getAdminUsers(userid);
      }
    });
  }


}
