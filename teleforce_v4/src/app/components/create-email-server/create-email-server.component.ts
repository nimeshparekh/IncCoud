import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-email-server',
  templateUrl: './create-email-server.component.html',
  styleUrls: ['./create-email-server.component.css']
})
export class CreateEmailServerComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateEmailServerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit():void{
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
        this.getEmailServerDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      smtp_server: [null, [Validators.required]],
      smtp_port: [null, [Validators.required]],
      smtp_username	: [null, [Validators.required]],
      smtp_password: [null, [Validators.required]],
      perday_limit: [null, [Validators.required]],
      attachment_size: [null, [Validators.required]],
      account_id: [userid]
    });
 
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  invalidUserName() {
    return (this.submitted && this.addForm.controls.smtp_server.errors != null);
  }
  getEmailServerDetail(id){
    this.adminservice.getEmailServerDetail(id).then(
      data => {
        console.log(data);
        this.addForm = this.fb.group({
          server_id: [data['data'][0].server_id],
          account_id: [data['data'][0].account_id],
          smtp_server: [data['data'][0].smtp_server, [Validators.required]],
          smtp_port: [data['data'][0].smtp_port, [Validators.required]],
          smtp_username	: [data['data'][0].smtp_username, [Validators.required]],
          smtp_password: [data['data'][0].smtp_password, [Validators.required]],
          perday_limit: [data['data'][0].perday_limit, [Validators.required]],
          attachment_size: [data['data'][0].attachment_size, [Validators.required]]     
        });
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
      let data: any = Object.assign(this.addForm.value); console.log(data);
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.adminservice.updateEmsilserverData(data).then(
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
        this.adminservice.saveEmsilServerData(data).then(
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
    await this.adminservice.deleteEmailServerData(id).then(
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
