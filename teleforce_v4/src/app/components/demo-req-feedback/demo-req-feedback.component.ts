import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';


import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-demo-req-feedback',
  templateUrl: './demo-req-feedback.component.html',
  styleUrls: ['./demo-req-feedback.component.css']
})
export class DemoReqFeedbackComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['id','date','feedback'];

  public feedbackform: FormGroup;
  addmode=true;
  schedule=false;
  Length = 0;
  isLoading = true;
  constructor( 
    private fb: FormBuilder,    
    public dialogRef: MatDialogRef<DemoReqFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,) { }

    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();


    this.feedbackform = this.fb.group({
      requestid:[this.data],
      feedback: ['',[Validators.required]],
      
    });
    this.getDemoreqFeedback(this.data);
  }
  async getDemoreqFeedback(id){
    await this.adminservice.getDemoreqFeedback(id).then(
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
  submit(){
    if(this.feedbackform.invalid == true)
  	{
      // console.log(form.value);
  		return;
  	}
  	else
  	{
      
      let data: any = Object.assign(this.feedbackform.value);
      //console.log(data);
      this.adminservice.updateDemoreqFeedback(data).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000,verticalPosition: 'top'
          });
          this.dialogRef.close({event:'Update'});
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
}
