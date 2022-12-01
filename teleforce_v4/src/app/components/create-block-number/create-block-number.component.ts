import { Component, OnInit , Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-block-number',
  templateUrl: './create-block-number.component.html',
  styleUrls: ['./create-block-number.component.css']
})
export class CreateBlockNumberComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateBlockNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }


  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.adminid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.adminid = this.data
        this.editmode = true;
        this.addmode = false;
        this.getDetail(this.data);
      }
    }
    this.addForm = this.fb.group({
      number: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")], [Validators.composeAsync([this.checkValidMobile.bind(this)])]],
    });
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
      if (this.data != '' && this.data != null) {
        this.adminservice.updateBlockNumberData(data).then(
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
        this.adminservice.saveBlockNumberData(data).then(
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
 getDetail(id) {
   // console.log(id);
    
    this.adminservice.getBlockNumberDetail(id).then(
      data => {
        console.log(data);
        this.addForm = this.fb.group({
          numid : [data['data'].num_id],
          number: [data['data'].number, [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")], [Validators.composeAsync([this.checkValidMobile.bind(this)])]],   
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteBlockNumber(id).then(
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
  private checkValidMobile(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    //console.log(control)
    if (control.value == null) {
      console.log('control' + control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/admin/checkmobilenumber/', { check: control.value }).subscribe(data => {
          if (data['isexist']) {
            resolve({ 'number': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
  }
  invalidMobile() {
    return (this.addForm.controls.number.errors != null);
  }
}
