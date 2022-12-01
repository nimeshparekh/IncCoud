import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sms-server',
  templateUrl: './sms-server.component.html',
  styleUrls: ['./sms-server.component.css']
})
export class SmsServerComponent implements OnInit {
  addmode = true;
  editmode = false;
  deletemode = false;
  aid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<SmsServerComponent>,
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
        this.aid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.aid = this.data
        this.editmode = true;
        this.addmode = false;
        this.getsmsserverDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      server_name: [null, [Validators.required]],
      servertype : [null, [Validators.required]],
      sms_url:[null,[Validators.required]],
      customer_id: [userid]
    });     
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  invalidUserName() {
    return (this.submitted && this.addForm.controls.sms_text.errors != null);
  }
  getsmsserverDetail(id){
    this.adminservice.getsmsserverDetail(id).then(
      data => {
       console.log(data);
        this.addForm = this.fb.group({
          customer_id: [data['data'][0].customer_id],
          server_name: [data['data'][0].server_name, [Validators.required]],
          sms_url:[data['data'][0].server_url, [Validators.required]],
          servertype: [data['data'][0].server_type, [Validators.required]], 
          sid:   [data['data'][0].sid]     
        });
  });
}
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
    
      return;
    }
    else {
      
      let data: any = Object.assign(this.addForm.value);   
      if (this.data != '' && this.data != null) {
        this.adminservice.updatesmsServerData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
            this.submitted=false;
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.adminservice.saveSmsServerData(data).then(
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

  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteSmsServerData(id).then(
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
