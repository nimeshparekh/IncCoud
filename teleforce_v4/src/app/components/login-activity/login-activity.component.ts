import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-activity',
  templateUrl: './login-activity.component.html',
  styleUrls: ['./login-activity.component.css']
})
export class LoginActivityComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'date', 'login', 'logout', 'ip'];
  Length = 0;
  manualLength = 0;
  isLoading = true;
  constructor(
    private userservice: UserService,
    public dialog: MatDialog
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    var id = localStorage.getItem('access_id');
    this.getLog(id);
  }
  getLog(id) {
    this.userservice.getLog(id).then(
      data => {
        // console.log("data");
        // console.log(JSON.stringify(data['data']));
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
  }

}
