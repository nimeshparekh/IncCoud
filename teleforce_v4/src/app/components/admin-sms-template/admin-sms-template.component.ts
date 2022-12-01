
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdminSmsComponent } from '../create-admin-sms/create-admin-sms.component';
import { AdminSmsTemplateApproveComponent } from '../admin-sms-template-approve/admin-sms-template-approve.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-admin-sms-template',
  templateUrl: './admin-sms-template.component.html',
  styleUrls: ['./admin-sms-template.component.css']
})
export class AdminSmsTemplateComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'account_name','sms_title', 'sms_text','approve_status','action'];
  Length = 0;
  public notappdataSource: MatTableDataSource<any>;
  notApproveColumns: string[] = ['id', 'account_name','sms_title', 'sms_text','note','approve_status','action'];
  notLength = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('notapprovepaginator') notapprovepaginator: MatPaginator;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.notappdataSource = new MatTableDataSource();
    var userid = localStorage.getItem('access_id');
    this.getSmsData();
    this.getNotApproveSmsData();
  }
  async getSmsData(){
    await this.adminservice.getSmsData().then(
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
    const dialogRef = this.dialog.open(CreateAdminSmsComponent, {
      width: '340px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getSmsData();
        this.getNotApproveSmsData();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateAdminSmsComponent, {
      width: '340px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getSmsData();
        this.getNotApproveSmsData();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateAdminSmsComponent, {
      width: '340px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getSmsData();
        this.getNotApproveSmsData();
      }
    });
  }

  async getNotApproveSmsData(){
    await this.adminservice.getsmsunapprovedata().then(
      data => {
       // console.log(data['data']);
       this.notappdataSource.data = data['data'];
        this.notLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );

  }
  approvedialoag(id):void {
    //console.log(id);
    const dialogRef = this.dialog.open(AdminSmsTemplateApproveComponent, {
      width: '640px', disableClose: true, data:id
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.getSmsData();
        this.getNotApproveSmsData();
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.notappdataSource.paginator = this.notapprovepaginator;
    this.dataSource.sort = this.sort;

    this.notappdataSource.sort = this.sort;

  }

}
