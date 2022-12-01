import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-create-telemail-package',
  templateUrl: './create-telemail-package.component.html',
  styleUrls: ['./create-telemail-package.component.css']
})
export class CreateTelemailPackageComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  incoming = false;
  outgoing = false;
  hostingmode = false;
  bulkmode = false;
  constructor(
    public dialogRef: MatDialogRef<CreateTelemailPackageComponent>,
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
        this.getTeleMailPackageDetail(this.data);
      }

    }

    this.addForm = this.fb.group({
      bulkemail: [false],
      hostingservice: [false],
      name: [null, [Validators.required]],
      rate: [null],
      mailno: [null],
      value: [null],
      gb: [null],
      validity: [null],
      Created_By: [userid],
      bulk_emailno: [null],
      bulk_prate: [null],
      bulk_pvalue: [null],
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
        this.adminservice.updateTeleMailPackageData(data).then(
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
        this.adminservice.saveTeleMailPackageData(data).then(
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
  getTeleMailPackageDetail(id) {
    this.adminservice.getTeleMailPackageDetail(id).then(
      data => {
        if (data['data'][0].hosting_service == 1) {
          var hosting = true;
          this.hostingmode = true;
        } else {
          var hosting = false;
          this.hostingmode = false;
        }
        if (data['data'][0].bulk_email == 1) {
          var bulkemail = true;
          this.bulkmode = true
        } else {
          var bulkemail = false;
          this.bulkmode = false;
        }
        this.addForm = this.fb.group({
          bulkemail: [bulkemail],
          hostingservice: [hosting],
          Mail_ID: [data['data'][0].Mail_ID],
          name: [data['data'][0].Mail_Plan, [Validators.required]],
          rate: [data['data'][0].Mail_Rate],
          mailno: [data['data'][0].Max_User_No],
          value: [data['data'][0].Mail_Plan_Value],
          gb: [data['data'][0].Mail_Gb],
          validity: [data['data'][0].package_validity],
          bulk_emailno: [data['data'][0].Bulk_Mail_No],
          bulk_prate: [data['data'][0].Bulk_Mail_Rate],
          bulk_pvalue: [data['data'][0].Bulk_Mail_Value],
        });
        
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteTeleMailPackageData(id).then(
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

  countPackageValue() {
    let data: any = Object.assign(this.addForm.value);
    //console.log(data);
    var rate = data.bulk_prate;
    var emailno = data.bulk_emailno;
    var packagevalue = (rate * emailno);
    this.addForm.get('bulk_pvalue').setValue(packagevalue);
  }
  checkhostingservice(event) {
    if (event.checked == true) {
      this.hostingmode = true;
    } else {
      this.hostingmode = false;
    }
  }
  checkbulk(event) {
    if (event.checked == true) {
      this.bulkmode = true;
    } else {
      this.bulkmode = false;
    }
  }

}
