import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';

import { UserService } from '../../user.service';

import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-kyc-aprovel',
  templateUrl: './kyc-aprovel.component.html',
  styleUrls: ['./kyc-aprovel.component.css']
})
export class KycAprovelComponent implements OnInit {
  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  form:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<KycAprovelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    var username=localStorage.getItem('username');
   
    this.getkycapprovestatus(this.data);
    this.form =this.fb.group({
      kyc_id:this.data,
      approved_by:[userid],
      status: ['', [Validators.required]],
      note:['']
    })
    
  }
  getkycapprovestatus(id){
    var userid = localStorage.getItem('access_id');
    this.userservice.getkycapprovestatus(id).then(
      data => { 
        //console.log( data );
        
        this.form =this.fb.group({
          kyc_id:this.data,
          approved_by:[userid],
          status:[data['data'][0].status, [Validators.required]],
          note:[data['data'][0].note]
        })
      },
      err => {
        console.log('error');
      }
    );
  }
  approve(){
    let udata:any = Object.assign(this.form.value);
   
    
    this.userservice.approvekyc(udata).then(
      data => {
        //console.log(data['data']);
        this._snackBar.open(data['data'], '', {
          duration: 3000, verticalPosition: 'top'
        })
        this.dialogRef.close({ event: 'Update' });
        
      },
        err=> {
          console.log('error');
      })

  }
  invalidUserName() {
    return (this.submitted && this.form.controls.name.errors != null);
  }

}
