import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateFeedbackFormComponent } from '../create-feedback-form/create-feedback-form.component';
import {Router} from "@angular/router";

@Component({
  selector: 'app-feedback-forms',
  templateUrl: './feedback-forms.component.html',
  styleUrls: ['./feedback-forms.component.css']
})
export class FeedbackFormsComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'created_date', 'action'];
  Length = 0;
  isLoading = true;
  kyc;
  constructor(private userservice: UserService,public dialog: MatDialog,private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.getFormsData();
  }

  async getFormsData() {
    await this.userservice.getFormsData().then(
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

  Createform(): void {
    const dialogRef = this.dialog.open(CreateFeedbackFormComponent, {
       disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getFormsData();
      }
    });
  }

  updateform(id): void {
    const dialogRef = this.dialog.open(CreateFeedbackFormComponent, {
      disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.getFormsData();
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateFeedbackFormComponent, {
      disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getFormsData();
      }
    });
  }
  


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
