import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateConferenceCallComponent } from '../create-conference-call/create-conference-call.component';
import { UserService } from '../../user.service';
import { ConferenceDetailComponent } from '../conference-detail/conference-detail.component';
import { Router } from "@angular/router";

@Component({
  selector: 'app-conference-call',
  templateUrl: './conference-call.component.html',
  styleUrls: ['./conference-call.component.css']
})
export class ConferenceCallComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'date', 'name', 'type', 'membertype', 'pin', 'action'];
  Length = 0;
  isLoading = true;
  kyc;

  activecnt = 0;
  livecnt = 0;
  completedcnt = 0;

  constructor(private userservice: UserService, public dialog: MatDialog, private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getConferenceCall(userid);
    this.getConferenceStatus(userid);
    //window.location.href='/dashboard/';
  }

  async getConferenceCall(userid) {
    await this.userservice.getConferenceCall(userid).then(
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

  async getConferenceStatus(userid) {
    await this.userservice.getConferenceStatus(userid).then(
      data => {
        //console.log("active data");
        //console.log(JSON.stringify(data['data']));
        if (data['data'].length > 0) {

          this.activecnt = data['data'][0]['active'];
          this.livecnt = data['data'][0]['live'];
          this.completedcnt = data['data'][0]['completed'];
        }

      },
      err => {
        console.log('error');
      }
    );
  }

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateConferenceCallComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getConferenceCall(userid);
      }
    });
  }

  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateConferenceCallComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getConferenceCall(userid);
      }
    });
  }

  // viewDetail(id): void {
  //   const dialogRef = this.dialog.open(ConferenceDetailComponent, {
  //     width: '840px', disableClose: true, data: id
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result.event == 'Update') {
  //       var userid = localStorage.getItem('access_id');
  //       this.getConferenceCall(userid);
  //     }
  //   });
  // }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateConferenceCallComponent, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        var userid = localStorage.getItem('access_id');
        this.getConferenceCall(userid);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

        } else {
          this.router.navigate(['/kyc-document-upload']);
        }
      },
      err => {
        console.log('error');
      }
    );
  }

}
