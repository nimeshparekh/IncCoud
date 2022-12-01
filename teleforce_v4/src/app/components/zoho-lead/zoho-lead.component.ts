import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ZohoService } from '../../zoho.service';
import { MatDialog } from '@angular/material/dialog';
import { ZohoUserMapComponent } from '../../components/zoho-user-map/zoho-user-map.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-zoho-lead',
  templateUrl: './zoho-lead.component.html',
  styleUrls: ['./zoho-lead.component.css']
})
export class ZohoLeadComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  public zohoSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'userid', 'username',  'email','mapuser','action','zohoaction'];//,
  Length = 0;
  isLoading = true
  zohodisplayedColumns: string[] = ['id',  'username',  'status','action','zohoaction'];//,

  constructor(private zohoservice: ZohoService,public dialog: MatDialog,private _snackBar: MatSnackBar,) { }

  @ViewChild('paginator') paginator: MatPaginator;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.zohoSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getZohoUsers(userid)
    this.getZohoAccessManager(userid)
  }
  async getZohoUsers(userid) {
    await this.zohoservice.getZohoUsers(userid).then(
      data => {
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }
  async getZohoAccessManager(userid) {
    await this.zohoservice.getZohoAccessManager(userid).then(
      data => {
       this.zohoSource.data = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  viewdialog(id,username): void {
    const dialogRef = this.dialog.open(ZohoUserMapComponent, {
      width: '400px', disableClose: true, data: {id:id,username:username}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getZohoUsers(userid);
      }
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  viewzohodialog(id,type): void {
    if(confirm("Are you sure to "+type+" Click to Dial for this user?")){
      this.zohoservice.enabledisabledclicktodial(id,type).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000,verticalPosition: 'top'
          });
          var userid = localStorage.getItem('access_id');
          this.getZohoUsers(userid)
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  viewzohointedialog(id,type): void {
    if(confirm("Are you sure to "+type+" zoho integration for this account?")){
      this.zohoservice.enabledisabledleadintegration(id,type).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000,verticalPosition: 'top'
          });
          var userid = localStorage.getItem('access_id');
          this.getZohoAccessManager(userid)
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  async ReloadZohoUser(){
    var userid = localStorage.getItem('access_id');
    await this.zohoservice.getZohoReloadUser(userid).then(
      data => {
       //this.zohoSource.data = data['data'];
       this._snackBar.open(data['msg'], '', {
        duration: 2000,verticalPosition: 'top'
      });
       this.getZohoUsers(userid)
      },
      err => {
        console.log('error');
      }
    );
  }
  async deletezohointegration(accountid){
    if(confirm("Are you sure to remove zoho integration for this account?")){
      await this.zohoservice.removezohoaccount(accountid).then(
        data => {
        //this.zohoSource.data = data['data'];
        this._snackBar.open(data['msg'], '', {
          duration: 2000,verticalPosition: 'top'
        });
        this.getZohoUsers(accountid)
        this.getZohoAccessManager(accountid)
        },
        err => {
          console.log('error');
        }
      );
    }
  }

}
