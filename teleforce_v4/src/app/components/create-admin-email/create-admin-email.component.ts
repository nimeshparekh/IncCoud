import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-create-admin-email',
  templateUrl: './create-admin-email.component.html',
  styleUrls: ['./create-admin-email.component.css']
})
export class CreateAdminEmailComponent implements OnInit {
 
  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateAdminEmailComponent>,
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
        this.getEmailDetail(this.data);
      }
    }
    this.addForm = this.fb.group({
      email_title: [null, [Validators.required]],
      email_subject: [null, [Validators.required]],
      email_description: [null, [Validators.required]],
      account_id: [userid]
    });
  }

  invalidUserName() {
    return (this.submitted && this.addForm.controls.name.errors != null);
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
      let data: any = Object.assign(this.addForm.value); 
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.adminservice.updateEmailData(data).then(
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
        this.adminservice.saveEmailData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            
            this.dialogRef.close({ event: 'Add' });
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }
  getEmailDetail(id) {
    this.adminservice.getEmailDetail(id).then(
      data => {
       
        this.addForm = this.fb.group({
          email_title: [data['data'][0].email_title, [Validators.required]],
          email_subject: [data['data'][0].email_subject, [Validators.required]],
          email_description: [data['data'][0].email_description, [Validators.required]],
          account_id: [data['data'][0].account_id],
          email_id:[data['data'][0].email_id]
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteEmailData(id).then(
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
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    
  };

}
