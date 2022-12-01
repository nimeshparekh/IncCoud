import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateTempManagerComponent } from '../create-temp-manager/create-temp-manager.component';
export interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  mobile: string;
  channel: string;
  users: string;
  expirydate: string;
  action: string;
}



@Component({
  selector: 'app-manager-request',
  templateUrl: './manager-request.component.html',
  styleUrls: ['./manager-request.component.css']
})
export class ManagerRequestComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['id', 'name','username', 'email', 'mobile', 'address', 'state', 'totalusers', 'amount','gst','totalamount','totalsms','created_date','action'];
  Length = 0;
  isLoading = true;
  constructor(
    private managerservice: ManagerService,
    public dialog: MatDialog,    
    private _snackBar: MatSnackBar,
    public router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.gettempuser()
  }
  async gettempuser() {
    await this.managerservice.gettempuser().then(
      data => {
        // console.log(data['data']);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }

  createmanager(id): void {
    const dialogRef = this.dialog.open(CreateTempManagerComponent, {
      width: '100%', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.gettempuser();
      }
    });
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
