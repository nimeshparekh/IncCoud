import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
  selector: 'app-create-schedule-report',
  templateUrl: './create-schedule-report.component.html',
  styleUrls: ['./create-schedule-report.component.css']
})
export class CreateScheduleReportComponent implements OnInit {


  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;  
  smserver =[];
  constructor(
    public dialogRef: MatDialogRef<CreateScheduleReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.adminid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.adminid = this.data
        this.editmode = true;
        this.addmode = false;
      }
    }
    this.addForm = this.fb.group({
      report_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      frequency:['',[Validators.required]],
      account_id: [userid],
    });
    this.getreportdata(userid)

  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  invalidUserName() {
    return (this.submitted && this.addForm.controls.report_name.errors != null);
  }
 
  async getreportdata(userid) {
    await this.userservice.getreportdata(userid).then(
      data => {
       

        this.smserver = data['data'];
        console.log(this.smserver);
        
      },
      err => {
        console.log('error');
      }
    );
  }
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); 
    
      //console.log(data);
      if (this.data != '' && this.data != null) {
       
      } else {
        this.userservice.saveschedulereport(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
            this.submitted=false;
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }
}
