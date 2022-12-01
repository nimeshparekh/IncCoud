import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-packages',
  templateUrl: './create-packages.component.html',
  styleUrls: ['./create-packages.component.css']
})
export class CreatePackagesComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  incoming = false;
  outgoing = false;
  showminutes = false;

  constructor(
    public dialogRef: MatDialogRef<CreatePackagesComponent>,
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
        this.getPackageDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      validity: [null, [Validators.required]],
      userlimit: [null, [Validators.required]],
      channels: [null, [Validators.required]],
      type: [null, [Validators.required]],
      service: [null, [Validators.required]],
      packagetype: [0],
      minutes: [null],
      published_web:[0],
      description:[null]

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
      let data: any = Object.assign(this.addForm.value); console.log(data);
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.adminservice.updatePackage(data).then(
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
        this.adminservice.savePackage(data).then(
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
  getPackageDetail(id) {
    this.adminservice.getPackageDetail(id).then(
      data => {
        console.log(data['data']['minute_type']);
        var expirydate = new Date(data['data']['expiry_date']);
        this.addForm = this.fb.group({
          id: [data['data'].package_id],
          name: [data['data'].package_name, [Validators.required]],
          price: [data['data'].package_price, [Validators.required]],
          validity: [data['data'].package_validity, [Validators.required]],
          userlimit: [data['data']['package_userlimit']],
          channels: [data['data']['package_channels'], [Validators.required]],
          type: [data['data']['package_type'], [Validators.required]],
          service: [JSON.parse(data['data']['package_service'])],
          packagetype: [data['data']['minute_type']],
          minutes: [data['data']['minutes']],
          published_web: [data['data']['published_web']],
          description:[data['data']['package_description']]
        });
        this.showService(data['data']['package_type']);
        this.showMinuteDiv(data['data']['minute_type']);
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deletePackage(id).then(
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
  showService(value) {
    if (value == '0') {
      this.incoming = true;
      this.outgoing = false;
    } else if (value == '1') {
      this.outgoing = true;
      this.incoming = false;
    } else if (value == '2') {
      this.outgoing = true;
      this.incoming = true;
    }

  }

  showMinuteDiv(value) {
    if (value == '1') {
      this.showminutes = true;
    } else  {
      this.showminutes = false;
    }

  }

}
