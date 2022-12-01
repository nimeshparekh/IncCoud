import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-more-notification',
  templateUrl: './more-notification.component.html',
  styleUrls: ['./more-notification.component.css']
})
export class MoreNotificationComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'date', 'title', 'body'];
  Length = 0;
  manualLength = 0;
  isLoading = true;
  constructor(
    private userservice: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,private router: Router, private activatedRoute: ActivatedRoute
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

 
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    var id = localStorage.getItem('access_id');
    this.getmorenotification();
  }
  getmorenotification() {
    this.userservice.getmorenotification().then(
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

  clearallnotification(){
    if(confirm('Are you sure to delete all notification?')){
      this.userservice.deleteallnotification().then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getmorenotification();
          window.location.reload();
          this.router.navigate([this.router.url])

        },
        err => {
          console.log('error');
        }
      );
    }
  }

}
