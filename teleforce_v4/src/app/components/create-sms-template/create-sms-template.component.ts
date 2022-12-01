import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-create-sms-template',
  templateUrl: './create-sms-template.component.html',
  styleUrls: ['./create-sms-template.component.css']
})
export class CreateSmsTemplateComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;  
  msgcharcnt = 0
  msgcredit = 1;
  msgunicode = false
  chartxt = 'characters.'
  constructor(
    public dialogRef: MatDialogRef<CreateSmsTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
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
        this.getsmsDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      sms_title: [null, [Validators.required]],
      sms_text: ['', [Validators.required]],
      sms_credits:[0],
      account_id: [userid],
      isschedulemeeting: [null],
    });
 
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  invalidUserName() {
    return (this.submitted && this.addForm.controls.sms_text.errors != null);
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
      data.msg_length = this.msgcharcnt;
      if(this.msgunicode==true){
        data.msg_limit = 70;
      }else{
        data.msg_limit = 160;
      }
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.userservice.updatesmsData(data).then(
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
        this.userservice.saveSmsData(data).then(
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
 getsmsDetail(id) {
    this.userservice.getsmsDetail(id).then(
      data => {
       // console.log(data);
        this.addForm = this.fb.group({
          account_id: [data['data'][0].account_id],
          sms_title: [data['data'][0].sms_title, [Validators.required]],
          sms_text: [data['data'][0].sms_text, [Validators.required]],
           sms_id:   [data['data'][0].sms_id]  ,   
           sms_credits:   [data['data'][0].sms_credits],
           isschedulemeeting: [data['data'][0].isschedulemeeting],     
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.userservice.deleteSmsData(id).then(
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
  countcharacter(){
   // console.log(this.containsNonLatinCodepoints(this.addForm.value.sms_text))
    var msg = this.addForm.value.sms_text;
    msg = new String(msg) ;
   // console.log(msg.length);    
   this.msgcharcnt = msg.length
    if(this.containsNonLatinCodepoints(msg)){
      this.msgunicode = true
      this.chartxt = "unicode characters."
      if(this.msgcharcnt>70 && this.msgcharcnt<135){
        this.msgcredit = 2
      }
      if(this.msgcharcnt>134 && this.msgcharcnt<202){
        this.msgcredit = 3
      }
      if(this.msgcharcnt>201){
        this.msgcredit = 4
      }
      if(this.msgcharcnt<71){
        this.msgcredit = 1
      }  
    }else{
      this.msgunicode = false
      this.chartxt = "characters."
      if(this.msgcharcnt>160 && this.msgcharcnt<307){
        this.msgcredit = 2
      }
      if(this.msgcharcnt>306 && this.msgcharcnt<460){
        this.msgcredit = 3
      }
      if(this.msgcharcnt<161){
        this.msgcredit = 1
      }  
    }
    this.addForm.get('sms_credits').setValue(this.msgcredit);
  }
  containsNonLatinCodepoints(s) {
    return /[^\u0000-\u00ff]/.test(s);
  }

}
