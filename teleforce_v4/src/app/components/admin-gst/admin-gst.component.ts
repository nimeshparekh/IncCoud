import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-admin-gst',
  templateUrl: './admin-gst.component.html',
  styleUrls: ['./admin-gst.component.css']
})
export class AdminGstComponent implements OnInit {


  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  

  constructor(
    public dialogRef: MatDialogRef<AdminGstComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminservice: AdminService,
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
        this.getGstDetail(this.data);
      }

    }
    this.addForm = this.fb.group({      
      GST_Number	: [null, [Validators.required]],
      State: [null, [Validators.required]],
      State_code: [null, [Validators.required]],
      address: [null, [Validators.required]],
      Created_By: [userid]
    });
  }
  invalidUserName() {
    return (this.submitted && this.addForm.controls.GST_Number.errors != null);
  }


  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); //console.log(data);
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.adminservice.updateGSTData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.adminservice.saveGSTData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }
  getGstDetail(id) {
    this.adminservice.getGstDetail(id).then(
      data => {
        this.addForm = this.fb.group({
          GST_ID:[data['data'][0].GST_ID],
          GST_Number: [data['data'][0].GST_Number],
          State: [data['data'][0].State, [Validators.required]],
          State_code: [data['data'][0].State_code, [Validators.required]],
          address: [data['data'][0].Address, [Validators.required]],
          Created_By: [data['data'][0]['Created_By']]
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteGST(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
      },
      err => {
        console.log('error');
      }
    );
  }
  
}
