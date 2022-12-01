
import { Component, OnInit, ViewChild ,Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import{DisplayVisitorDataComponent} from '../display-visitor-data/display-visitor-data.component';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-visitor-traking',
  templateUrl: './visitor-traking.component.html',
  styleUrls: ['./visitor-traking.component.css']
})
export class VisitorTrakingComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','create_date','ip','city','zip','regionName','region','countryCode','country','lat','log','timezone','isp','path','heat'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService,public dialog: MatDialog) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.getVistiorTraking();
  }
  async getVistiorTraking(){
    await this.adminservice.getVistiorTraking().then(
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  displayIP(ip): void {
    //console.log(ip);
    const dialogRef = this.dialog.open(DisplayVisitorDataComponent,{
      width:'640px',disableClose: true,data:{ip:ip}
      //data:data['data']
    });
     dialogRef.afterClosed().subscribe(result => {
  
   });
  }
}

