import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateAdminSmsComponent } from '../create-admin-sms/create-admin-sms.component';
import { CreateBlockNumberComponent } from '../create-block-number/create-block-number.component';
import {MatSort} from '@angular/material/sort';
import { ContactDataSource } from "./call.datasource";
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-block-number-list',
  templateUrl: './block-number-list.component.html',
  styleUrls: ['./block-number-list.component.css']
})
export class BlockNumberListComponent implements OnInit {
  isDisabled = false;
  isDisabled1 = false;
  public dataSource: ContactDataSource;
  sortcolumn = 'num_id';
  sortdirection = 'DESC';
  // public dataSource: MatTableDataSource<any>;
//displayedColumns: string[] = ['assignlead', 'id', 'DID', 'AgentName', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallTalkTime','AgentTalkTime', 'CallStatus', 'AgentStatus', 'CallType', 'DisconnectedBy', 'recording', 'action'];//'feedback'
  Length = 0;
  isLoading = false
  // public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','date', 'number','action'];
  // Length = 0;
 
  // isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;


  ngOnInit(): void {
   // this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
   this.getData()
   this.dataSource = new ContactDataSource(this.adminservice);

   this.dataSource.loadContacts(this.sortcolumn, this.sortdirection, 0, 50);
  }
  async getData(){
    await this.adminservice.getBlockNumbertotalData().then(
      data => {
        //console.log(data['data']);
       //this.dataSource.data = data['data'];
       this.Length = data['data'][0]['total'];
       this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );

  }

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateBlockNumberComponent, {
       disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getData();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateBlockNumberComponent, {
      width: '340px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getData();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateBlockNumberComponent, {
      width: '340px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getData();
      }
    });
  }
 
  loadContactPage() {
    this.isDisabled = true;

    this.isLoading = true;
    
    this.dataSource.loadContacts
      (this.sortcolumn, this.sortdirection,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize)
      this.isDisabled = false;

  }
  Filtercontact() {
   // let data: any = Object.assign(this.searchform.value);

    this.dataSource.loadContacts(this.sortcolumn, this.sortdirection, 0, 50);
  }
  sortData(event) {
    //let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    this.sortcolumn = event['active'];
    this.sortdirection = event['direction'];
    this.dataSource.loadContacts(event['active'], event['direction'], this.contactpaginator.pageIndex, this.contactpaginator.pageSize);
    //console.log(this.contactpaginator.pageIndex+'---'+this.contactpaginator.pageSize);
  }
  ngAfterViewInit() {
    merge(this.contactpaginator.page)
      .pipe(
        tap(() => this.loadContactPage())
      )
      .subscribe()
    // this.dataSource.paginator = this.paginator;
  }
}
