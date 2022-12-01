import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.css']
})
export class CreateVendorComponent implements OnInit {


  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private managerservice: ManagerService,
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
        this.getVenderByid(this.data);
      }

    }
    this.addForm = this.fb.group({
      ven_name: [null, [Validators.required]],
      ven_email: [null, [Validators.required]],
      ven_mobile	: [null, [Validators.required]],
      ven_city: [null, [Validators.required]],
      ven_pincode: [null, [Validators.required]],
      ven_state: [null, [Validators.required]],
      ven_address:[null,[Validators.required]],
      ven_status:['active',[Validators.required]],
      account_id: [userid]
    });
 
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  invalidUserName() {
    return (this.submitted && this.addForm.controls.smtp_server.errors != null);
  }
  getVenderByid(id){
    this.managerservice.getVenderByid(id).then(
      data => {
        this.addForm = this.fb.group({
          ven_id : [data['data'][0].ven_id],
          account_id: [data['data'][0].account_id],
          ven_name: [data['data'][0].ven_name, [Validators.required]],
          ven_email: [data['data'][0].ven_email, [Validators.required]],
          ven_mobile	: [data['data'][0].ven_mobile, [Validators.required]],
          ven_city: [data['data'][0].ven_city, [Validators.required]],
          ven_pincode: [data['data'][0].ven_pincode, [Validators.required]],
          ven_state: [data['data'][0].ven_state, [Validators.required]],     
          ven_address	: [data['data'][0].ven_address, [Validators.required]],     
          ven_status: [data['data'][0].ven_status, [Validators.required]] ,    

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
     
      let data: any = Object.assign(this.addForm.value);
    
      if (this.data != '' && this.data != null) {
        this.managerservice.updateVenderData(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
           
            this.dialogRef.close({ event: 'Update' });
            this.submitted=false;
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.managerservice.saveVendorData(data).then(
          data => {
              this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
           
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
    await this.managerservice.deleteVendorData(id).then(
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

