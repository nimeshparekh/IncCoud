import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateVendorComponent } from '../create-vendor/create-vendor.component';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'ven_name', 'ven_email','ven_mobile','ven_address','ven_city','ven_state','ven_pincode','ven_status'];
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;
  managerid ='';
  constructor(private managerservice: ManagerService,public dialog: MatDialog, private fb: FormBuilder) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getagentdetail(userid);
    console.log(this.managerid);
    
    this.searchform = this.fb.group({
      ven_city:[''],
      account_id:[''],
      ven_mobile:[''],
      ven_pincode:['']
    });
    //this.getagentdetail(userid);
  }
  async getagentdetail(agentid){
    await this.managerservice.getagentdetail(agentid).then(
      data => {
      this.getVendorList(data['data']['created_by']);
       this.managerid = data['data']['created_by'];
       console.log("managerid", this.managerid);
       
      },
      err => {
        console.log('error');
      })
  }
  async searchData(){
    this.isLoading = true;
    var account_id =this.managerid;
    let data: any = Object.assign(this.searchform.value);
    Object.assign(data,{account_id:account_id});
    this.managerservice.searchVendorlist(data).then(
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
      account_id:[this.managerid],
      ven_mobile:[''],
      ven_pincode:[''] 
    });
    this.getVendorList(this.managerid);
   
  }
  async getVendorList(id){
    await this.managerservice.getVendorList(id).then(
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

}
