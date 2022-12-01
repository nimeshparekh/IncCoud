import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeledigitalPackageComponent } from '../create-teledigital-package/create-teledigital-package.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-tele-digital-package',
  templateUrl: './tele-digital-package.component.html',
  styleUrls: ['./tele-digital-package.component.css']
})
export class TeleDigitalPackageComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'plan', 'planvalue', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.getTeleDigitalPackages();
  }

  async getTeleDigitalPackages() {
    await this.adminservice.getTeleDigitalPackages().then(
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
    const dialogRef = this.dialog.open(CreateTeledigitalPackageComponent, {
      width: '800px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getTeleDigitalPackages();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateTeledigitalPackageComponent, {
      width: '800px', disableClose: true, data: id,maxHeight:'800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.getTeleDigitalPackages();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateTeledigitalPackageComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getTeleDigitalPackages();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



}
