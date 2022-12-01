
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { SmsServerComponent } from '../sms-server/sms-server.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-display-sms-server',
  templateUrl: './display-sms-server.component.html',
  styleUrls: ['./display-sms-server.component.css']
})
export class DisplaySmsServerComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'server_name','server_type', 'action'];
  Length = 0;
  isLoading = true;
  constructor(private adminservice: AdminService, public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getSmsServerData();
  }
  async getSmsServerData() {
    await this.adminservice.getSmsServerData().then(
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
    const dialogRef = this.dialog.open(SmsServerComponent, {
      width: '640px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getSmsServerData();
      }
    });
  }
  updatedialog(id): void {
    const dialogRef = this.dialog.open(SmsServerComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getSmsServerData();
      }
    });
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(SmsServerComponent, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        var userid = localStorage.getItem('access_id');
        this.getSmsServerData();
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}
