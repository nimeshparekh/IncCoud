import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-teledigital-package',
  templateUrl: './create-teledigital-package.component.html',
  styleUrls: ['./create-teledigital-package.component.css']
})
export class CreateTeledigitalPackageComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  isbrand = false;
  ischannel = false;
  isads = false;
  public addForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateTeledigitalPackageComponent>,
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
        this.getTeleDigitalPackageDetail(this.data);
      }

    }

    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      brandno: [1],
      channelno: [4],
      memberno: [0],
      groupno:[0],
      monitorno:[0],
      hashtagno:[0],
      messanger:[0],
      user:[1],
      bot:[0],
      validity: [null,[Validators.required]],
      value: [null,[Validators.required]],
      mediaspace:[5],
      Created_By: [userid]
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
        this.adminservice.updateTeleDigitalPackageData(data).then(
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
        this.adminservice.saveTeleDigitalPackageData(data).then(
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
  getTeleDigitalPackageDetail(id) {
    this.adminservice.getTeleDigitalPackageDetail(id).then(
      data => {
        
        this.addForm = this.fb.group({
          Digital_ID: [data['data'][0].Digital_ID],
          name: [data['data'][0].Digital_Plan, [Validators.required]],
          brandno: [data['data'][0].brand_no],
          channelno: [data['data'][0].channel_no],
          memberno: [data['data'][0].member_no],
          groupno:[data['data'][0].group_no],
          monitorno:[data['data'][0].monitor_no],
          hashtagno:[data['data'][0].hashtag_no],
          messanger:[data['data'][0].messanger],
          user:[data['data'][0].user],
          bot:[data['data'][0].bot],
          validity: [data['data'][0].Package_Validity,[Validators.required]],
          value: [data['data'][0].Package_Value,[Validators.required]],
          mediaspace:[data['data'][0].mediaspace                ],
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteTeleDigitalPackageData(id).then(
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
  checkchannel(value) {
    if (value == true) {
      this.ischannel = true;
    } else {
      this.ischannel = false;
    }
  }
  checkbrand(value) {
    if (value == true) {
      this.isbrand = true;
    } else {
      this.isbrand = false;
    }
  }
  checkads(value) {
    if (value == true) {
      this.isads = true;
    } else {
      this.isads = false;
    }
  }
  countBrandValue(){
    let data: any = Object.assign(this.addForm.value); 
    //console.log(data);
    var brandno = data.brandno;
    var brandrate = data.brandrate;
    this.addForm.get('brandvalue').setValue(brandno*brandrate);
    var total = (data.channelvalue)+(brandno*brandrate)+data.adsvalue
    this.addForm.get('total').setValue(total);
  }
  countChannelValue(){
    let data: any = Object.assign(this.addForm.value); 
    //console.log(data);
    var channelno = data.channelno;
    var channelrate = data.channelrate;
    this.addForm.get('channelvalue').setValue(channelno*channelrate);
    var total = (data.brandvalue)+(channelno*channelrate)+data.adsvalue
    this.addForm.get('total').setValue(total);
  }
  countTotalValue(){
    let data: any = Object.assign(this.addForm.value);    
    var total = (data.channelvalue)+(data.brandvalue)+data.adsvalue
    this.addForm.get('total').setValue(total);
  }



}
