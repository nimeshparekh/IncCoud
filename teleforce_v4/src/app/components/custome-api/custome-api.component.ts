import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManagerService } from '../../manager.service';
import { CreateCustomeApiComponent } from '../create-custome-api/create-custome-api.component';
import { Router, ActivatedRoute } from "@angular/router";
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-custome-api',
  templateUrl: './custome-api.component.html',
  styleUrls: ['./custome-api.component.css']
})
export class CustomeApiComponent implements OnInit {

  constructor(private ManagerService: ManagerService,public dialog: MatDialog,  
      private fb: FormBuilder,
    ) { }
  public dataSource: MatTableDataSource<any>;
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;

  displayedColumns: string[] = ['id', 'api_name', 'api_endpoint', 'api_payload', 'api_header', 'api_method','status','created_date','action'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    var currentdate = new Date();

    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getcustomapi(userid)
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [currentdate],
      api_method:[''],
      api_name:[''],
      status:[],
    });
  }
  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    console.log(data);
    this.ManagerService.searchcustomapi(data).then(
      data => {
        console.log(data['data']);
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
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [null],
      api_method:[''],
      api_name:[''],
      status:[],

    });
    this.searchData();
  }

  async getcustomapi(userid) {
    await this.ManagerService.getcustomapi(userid).then(
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
    const dialogRef = this.dialog.open(CreateCustomeApiComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getcustomapi(userid);
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateCustomeApiComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getcustomapi(userid);
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateCustomeApiComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getcustomapi(userid);
      }
    });
  }
   public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
   
    this.dataSource.sort = this.sort;
  }


}
