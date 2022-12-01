import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePackagesComponent } from '../create-packages/create-packages.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-admin-packages',
  templateUrl: './admin-packages.component.html',
  styleUrls: ['./admin-packages.component.css']
})
export class AdminPackagesComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'package_name', 'package_price', 'package_validity', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.getPackages()
  }

  async getPackages() {
    await this.adminservice.getPackages().then(
      data => {
        console.log(data['data']);
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
    const dialogRef = this.dialog.open(CreatePackagesComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getPackages();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreatePackagesComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.getPackages();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreatePackagesComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getPackages();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
