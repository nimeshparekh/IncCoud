import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import {CreateAdminEmailComponent} from '../create-admin-email/create-admin-email.component'
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-admin-email-template',
  templateUrl: './admin-email-template.component.html',
  styleUrls: ['./admin-email-template.component.css']
})
export class AdminEmailTemplateComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','account_name','email_title', 'email_subject', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getEmailData();
  }
  async getEmailData() {
    await this.adminservice.getEmailData().then(
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
    const dialogRef = this.dialog.open(CreateAdminEmailComponent, {height:'700px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getEmailData();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateAdminEmailComponent, {
      disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getEmailData();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateAdminEmailComponent, {
     disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getEmailData();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
