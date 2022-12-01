import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateVendorComponent } from '../create-vendor/create-vendor.component';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-display-vendor',
  templateUrl: './display-vendor.component.html',
  styleUrls: ['./display-vendor.component.css']
})
export class DisplayVendorComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'ven_name', 'ven_email','ven_mobile','ven_address','ven_city','ven_state','ven_pincode','ven_status','action'];
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;

  constructor(private managerservice: ManagerService,public dialog: MatDialog, private fb: FormBuilder) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      ven_city:[''],
      account_id:[userid],
      ven_mobile:[''],
      ven_pincode:['']
    });
    this.getVendordata();
  }
  async searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.managerservice.searchVendor(data).then(
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

  resetform(){
    this.isLoading = true;
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      ven_city:[''],
      account_id:[userid],
      ven_mobile:[''],
      ven_pincode:[''] 
    });
    this.getVendordata();
   
  }
  async getVendordata(){
    await this.managerservice.getVendordata().then(
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

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateVendorComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getVendordata();
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateVendorComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getVendordata();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateVendorComponent, {
      width: '340px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getVendordata();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }




}
