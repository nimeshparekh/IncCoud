import { Component, OnInit , ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTelemailPackageComponent } from '../create-telemail-package/create-telemail-package.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-tele-mail-package',
  templateUrl: './tele-mail-package.component.html',
  styleUrls: ['./tele-mail-package.component.css']
})
export class TeleMailPackageComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'plan', 'planvalue', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.getTeleMailPackages();
  }

  async getTeleMailPackages() {
    await this.adminservice.getTeleMailPackages().then(
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
    const dialogRef = this.dialog.open(CreateTelemailPackageComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getTeleMailPackages();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateTelemailPackageComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.getTeleMailPackages();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateTelemailPackageComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getTeleMailPackages();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
