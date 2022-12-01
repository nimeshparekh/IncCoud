import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-telemeet-package',
  templateUrl: './create-telemeet-package.component.html',
  styleUrls: ['./create-telemeet-package.component.css']
})
export class CreateTelemeetPackageComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  incoming = false;
  outgoing = false;

  constructor(
    public dialogRef: MatDialogRef<CreateTelemeetPackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
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
        this.getTeleMeetPackageDetail(this.data);
      }

    }

    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      maxuser: [null, [Validators.required]],
      value: [null, [Validators.required]],
      validity: [null, [Validators.required]],
      gb: [null],
      Created_By : [userid]
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
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); 
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.adminservice.updateTeleMeetPackageData(data).then(
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
        this.adminservice.saveTeleMeetPackageData(data).then(
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
  getTeleMeetPackageDetail(id) {
    this.adminservice.getTeleMeetPackageDetail(id).then(
      data => {
        this.addForm = this.fb.group({
          Meet_ID	: [data['data'][0].Meet_ID	],
          name: [data['data'][0].Meet_Plan, [Validators.required]],
          rate: [data['data'][0].Meet_Rate, [Validators.required]],
          maxuser: [data['data'][0].Max_User_No, [Validators.required]],
          value: [data['data'][0].Meet_Plan_Value, [Validators.required]],
          validity: [data['data'][0].package_validity, [Validators.required]],
          gb: [data['data'][0].Meet_Gb],
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteTeleMeetPackageData(id).then(
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
