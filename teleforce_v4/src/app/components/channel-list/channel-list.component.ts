import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css']
})
export class ChannelListComponent implements OnInit {
 
  public dataSource: MatTableDataSource<any>;
  public manualdataSource: MatTableDataSource<any>;
  public expriredataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'did_name', 'did_number', 'did', 'status', 'managername'];
  manualdisplayedColumns:string[]=['id', 'did_name', 'did_number', 'did', 'status','action'];
  expriredisplayedColumns: string[] = ['id', 'did_name', 'did_number', 'did', 'status', 'managername'];
  exprireLength=0;
  Length = 0;
  manualLength=0;

  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('exprirepaginator')exprirepaginator: MatPaginator;
  @ViewChild('manualpaginator')manualpaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.manualdataSource= new MatTableDataSource();
    this.expriredataSource = new MatTableDataSource();
    var userid = localStorage.getItem('access_id');
    this.getChannels(userid)
    this.getUnusedDid(userid);
    this.ExprieDid(userid);
  }

  async getChannels(userid) {
    await this.adminservice.getChannels(userid).then(
      data => {
       // console.log(data['data']);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getUnusedDid(userid) {
    await this.adminservice.getUnusedDid(userid).then(
      data => {
       // console.log(data['data']);
       this.manualdataSource.data = data['data'];
        this.manualLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async ExprieDid(userid) {
    await this.adminservice.ExprieDid(userid).then(
      data => {
       // console.log(data['data']);
       this.expriredataSource.data = data['data'];
        this.exprireLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getChannels(userid);
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getChannels(userid);
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateChannelComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getChannels(userid);
      }
    });
  }
   public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.manualdataSource.filter=value.trim().toLocaleLowerCase();
    this.expriredataSource.filter=value.trim().toLocaleLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.manualdataSource.paginator = this.manualpaginator;
    this.expriredataSource.paginator=this.exprirepaginator;
    this.manualdataSource.sort = this.sort;
    this.expriredataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
  }


}
