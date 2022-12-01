import { Component, OnInit,ChangeDetectionStrategy,Input,Inject ,ElementRef,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl} from "@angular/forms";
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import {Router,ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { AuthService } from '../../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ZohoService } from '../../zoho.service';
import { ZohoUserMapComponent } from '../../components/zoho-user-map/zoho-user-map.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudService } from '../../crud.service';
import { UserService } from '../../user.service';
import { AdminService } from '../../admin.service';
@Component({
  selector: 'app-zoho-users',
  templateUrl: './zoho-users.component.html',
  styleUrls: ['./zoho-users.component.css']
})
export class ZohoUsersComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  public zohoSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'userid', 'username',  'email','mapuser','action','zohoaction'];//,
  Length = 0;
  isLoading = true
  zohodisplayedColumns: string[] = ['id',  'username',  'status','action','zohoaction'];//,

  constructor(private zohoservice: ZohoService,public dialog: MatDialog,    private _snackBar: MatSnackBar,) { }

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
      this.zohoservice.enabledisabledintegration(id,type).then(
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
  async deleteRequest(id){
    console.log(id);
    
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}   
    }
    );  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getZohoAccessManager(userid)      }
    });
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
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./zoho-users.component.css']

})
export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private adminservice: AdminService,    private _snackBar: MatSnackBar,

    private toastr: ToastrService) {}

    ngOnInit(): void {
      if(this.data!='' && this.data!=null){
        this.id = this.data.id
       
  
      }
   
  }
  async deleteRequest(id){
   
    await this.adminservice.delete_mappping_zohouser(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });        this.dialogRef.close({event:'Delete'});
      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
}
