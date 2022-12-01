import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-admin-user',
  templateUrl: './create-admin-user.component.html',
  styleUrls: ['./create-admin-user.component.css']
})
export class CreateAdminUserComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  passwordmode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  public passwordForm:FormGroup;
  private debouncedTimeout;
  codeGenerated = ''; // for 10 digit code

  constructor(
    public dialogRef: MatDialogRef<CreateAdminUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'password') {
        this.adminid = this.data.id;
        this.passwordmode = true;
        this.deletemode = false;
        this.addmode = false;
        this.editmode = false;
        this.passwordForm = this.fb.group({
          newpassword: [null, [Validators.required]],
          adminid: [this.adminid],
        });

      }
      else  if (this.data.action == 'delete') {
        this.adminid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.adminid = this.data
        this.editmode = true;
        this.addmode = false;
        this.getAdminDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(12)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: [null, [Validators.required]],
      created_by: [userid]
    });
  }

  randomString() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    const stringLength = 10;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    this.codeGenerated = randomstring;
    if (this.passwordmode) {
      this.passwordForm.controls.newpassword.setValue(randomstring);
    } else {
      this.addForm.controls.password.setValue(randomstring);
    }
    return 0;
  }

  private checkUsernameValid(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    //console.log(control)
    if (control.value == null) {
      console.log('control' + control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/signin/checkusername/', { check: control.value }).subscribe(data => {
          if (data['isexist']) {
            resolve({ 'name': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
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
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); console.log(data);
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.adminservice.updateAdminUser(data).then(
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
        this.adminservice.saveAdminUser(data).then(
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
  getAdminDetail(id) {
    this.adminservice.getAdminDatail(id).then(
      data => {
        console.log(data['data'].account_name);
        this.addForm = this.fb.group({
          adminid: [data['data'].account_id],
          name: [data['data'].account_name, [Validators.required]],
          email: [data['data'].email, [Validators.required, Validators.email]],
          mobile: [data['data'].mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          created_by: [data['data']['created_by']]
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteAdminUser(id).then(
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
  changepassword() {
    this.submitted = true;
    if (this.passwordForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.passwordForm.value);
      this.adminservice.adminChangePassword(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Password' });
        },
        err => {
          console.log('error');
        }
      );

    }
  }

}
