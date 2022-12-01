import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-admin-sms',
  templateUrl: './create-admin-sms.component.html',
  styleUrls: ['./create-admin-sms.component.css']
})
export class CreateAdminSmsComponent implements OnInit {
  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateAdminSmsComponent>,
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
        this.getsmsDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      sms_title: [null, [Validators.required]],
      sms_text: [null, [Validators.required]],
      templateid: [null],
      contentid: [null],
      senderid: [null],
      entityid: [null],
      templatetype:[null],
      account_id: [userid],
      isgeneric: [false]
    });

  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  invalidUserName() {
    return (this.submitted && this.addForm.controls.sms_text.errors != null);
  }
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {

      let data: any = Object.assign(this.addForm.value);
      
      if (this.data != '' && this.data != null) {
        this.adminservice.updatesmsData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
            this.submitted = false;
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.adminservice.saveSmsData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
            this.submitted = false;
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }
  getsmsDetail(id) {
    console.log(id);

    this.adminservice.getsmsDetail(id).then(
      data => {
        //console.log(data);
        this.addForm = this.fb.group({
          account_id: [data['data'][0].account_id],
          sms_title: [data['data'][0].sms_title, [Validators.required]],
          sms_text: [data['data'][0].sms_text, [Validators.required]],
          sms_id: [data['data'][0].sms_id],
          templateid: [data['data'][0].templateid],
          contentid: [data['data'][0].contentid],
          senderid: [data['data'][0].senderid],
          entityid: [data['data'][0].entityid],
          templatetype:[data['data'][0].templatetype],
          isgeneric : [data['data'][0].isgeneric]
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteSmsData(id).then(
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
