import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateBlockNumberComponent } from '../create-block-number/create-block-number.component';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.css']
})
export class BlackListComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','date', 'number','action'];
  Length = 0;
 
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getData();
  }
  async getData(){
    await this.adminservice.getblocknumberdatas().then(
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



}
