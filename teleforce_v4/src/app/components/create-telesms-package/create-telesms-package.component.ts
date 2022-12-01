import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-telesms-package',
  templateUrl: './create-telesms-package.component.html',
  styleUrls: ['./create-telesms-package.component.css']
})
export class CreateTelesmsPackageComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  incoming = false;
  outgoing = false;
  packagevalue=0;

  constructor(
    public dialogRef: MatDialogRef<CreateTelesmsPackageComponent>,
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
        this.getTeleSMSPackageDetail(this.data);
      }

    }

    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      transrate: [0, [Validators.required]],
      transno: [0, [Validators.required]],
      pr_rate: [0, [Validators.required]],
      pr_no: [0, [Validators.required]],
      otp_rate: [0, [Validators.required]],
      otp_no: [0, [Validators.required]],
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
        this.adminservice.updateTeleSMSPackageData(data).then(
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
        this.adminservice.saveTeleSMSPackageData(data).then(
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
  getTeleSMSPackageDetail(id) {
    this.adminservice.getTeleSMSPackageDetail(id).then(
      data => {
        this.addForm = this.fb.group({
          SMS_ID: [data['data'][0].SMS_ID],
          name: [data['data'][0].SMS_Plan, [Validators.required]],
          transrate: [data['data'][0].SMS_TR_Rate, [Validators.required]],
          transno: [data['data'][0].SMS_TR_No, [Validators.required]],
          pr_rate: [data['data'][0].SMS_Pr_Rate, [Validators.required]],
          pr_no: [data['data'][0].SMS_Pr_No, [Validators.required]],
          otp_rate: [data['data'][0].SMS_otp_Rate, [Validators.required]],
          otp_no: [data['data'][0].SMS_otp_No, [Validators.required]],
        });
        this.countPackageValue();
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteTeleSMSPackageData(id).then(
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
  countPackageValue(){
    let data: any = Object.assign(this.addForm.value); 
    //console.log(data);
    var trans_rate = data.transrate;
    var trans_no = data.transno;
    var pr_rate = data.pr_rate;
    var pr_no = data.pr_no;
    var otp_rate = data.otp_rate;
    var otp_no = data.otp_no;
    console.log(((trans_rate*trans_no)+(pr_rate*pr_no)+(otp_rate*otp_no)));
    this.packagevalue = ((trans_rate*trans_no)+(pr_rate*pr_no)+(otp_rate*otp_no));
  }

}
