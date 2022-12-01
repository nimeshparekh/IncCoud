import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManagerService } from '../../manager.service';
import { Router, ActivatedRoute } from "@angular/router";
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { CreateDispotionCallComponent } from '../create-dispotion-call/create-dispotion-call.component';

@Component({
  selector: 'app-dispotion-call',
  templateUrl: './dispotion-call.component.html',
  styleUrls: ['./dispotion-call.component.css']
})
export class DispotionCallComponent implements OnInit {

  constructor(private ManagerService: ManagerService,public dialog: MatDialog,  
    private fb: FormBuilder,
  ) { } 
  public dataSource: MatTableDataSource<any>;
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;

  displayedColumns: string[] = ['id', 'disposition','action'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    var currentdate = new Date();

    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getdispotion(userid)
  

  }
  async getdispotion(userid) {
    await this.ManagerService.getdispotion(userid).then(
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
   
    this.dataSource.sort = this.sort;  }

  
    Createdialog(): void {
      const dialogRef = this.dialog.open(CreateDispotionCallComponent, {
        width: '640px', disableClose: true,maxHeight:'800px',
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
          var userid = localStorage.getItem('access_id');
          this.getdispotion(userid);
        }
      });
    }
  
  
  
    updatedialog(id): void {
      const dialogRef = this.dialog.open(CreateDispotionCallComponent, {
        width: '640px', disableClose: true, data: id
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Update'){
          var userid = localStorage.getItem('access_id');
          this.getdispotion(userid);
        }
      });
    }
  
    async deleteData(id){
      const dialogRef = this.dialog.open(CreateDispotionCallComponent, {
        width: '640px', disableClose: true, data: {action:'delete',id:id}
      });  
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Delete'){
          var userid = localStorage.getItem('access_id');
          this.getdispotion(userid);
        }
      });
    }

 

}

