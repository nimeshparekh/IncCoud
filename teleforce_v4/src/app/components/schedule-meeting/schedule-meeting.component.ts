import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.css']
})
export class ScheduleMeetingComponent implements OnInit {
  randomlink;
  public addForm: FormGroup;
  checked = [];
  isScheduled = false;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ScheduleMeetingComponent>,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log( this.data);
    var userid = localStorage.getItem("access_id");
    //console.log("test::"+userid);
    var contid = this.data.contid
    var leadid = this.data.leadid
    this.addForm = this.fb.group({
      agent_id: [userid],
      email: [null, [Validators.email]],
      customer_name: [null, [Validators.required]],
      meetlink: [null, [Validators.required]],
      startdate: [null, [Validators.required]],
      enddate: [null, [Validators.required]],
      event_type: [null, [Validators.required]],
      meet_type: [null, [Validators.required]],
      mobile: [this.data.callernumber],
      sharesms: [false],
      sharemail: [false],
      shareWhatsapp: [false],
      customer_id : [null],
      lead_id : [leadid],
      //template_id: [this.emailtempid]

    });
    this.generatelink(8);
    if(leadid > 0 ){
      this.getlmsdata(leadid);
    }
    console.log(contid)
    if(contid!=undefined){
      this.getcontactdata(contid);
    }
  }

  async checkmeetingtype(event){
    //console.log("event :"+ event);
    if(event == 'Scheuled Meeting'){
      this.isScheduled = true;  
    }else{
      this.isScheduled = false;  
    }
  }
  async getlmsdata(lead_id){
    var userid = localStorage.getItem('access_id');

    await this.userservice.getlmsdata(lead_id).then(data => {
      if(data){
          console.log("schedule meeting");
          this.addForm.controls['agent_id'].setValue(data['data'][0].agent_id);
          this.addForm.controls['email'].setValue(data['data'][0].email_id);
          this.addForm.controls['customer_name'].setValue(data['data'][0].lead_name);
          this.addForm.controls['mobile'].setValue(data['data'][0].mobile_no);
          this.addForm.controls['customer_id'].setValue(data['data'][0].name);
      }
    },
    err => {
      console.log('error');
    })
  }

  async getcontactdata(contid){
    var userid = localStorage.getItem('access_id');

    await this.userservice.getcontactdata(contid).then(data => {
      if(data){
          console.log("schedule meeting");
          var leadid = data[0]['lead_id']
          if(leadid>0){
            this.getlmsdata(leadid);
          }
      }
    },
    err => {
      console.log('error');
    })
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  generatelink(length) {
    // var result = '';
    // var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // var charactersLength = characters.length;
    // for (var i = 0; i < length; i++) {
    //   result += characters.charAt(Math.floor(Math.random() * charactersLength));
    // }
    // console.log("result :" + result);
    var digitsrandom = Math.floor(100000 + Math.random() * 900000);
    var link = "https://meet.cloudX.in/" + digitsrandom;
    this.addForm.controls['meetlink'].setValue(link);
    //this.randomlink = result;
  }



  submit() {
    let fdata: any = Object.assign(this.addForm.value);
    console.log(fdata);
    if (this.addForm.invalid == true) {
      return;
    } else {
      if (fdata.shareWhatsapp == true) {
        this.addForm.get('mobile').setValidators([Validators.required])
        this.addForm.get('mobile').updateValueAndValidity();
      }
      this.userservice.saveScheduleMeeting(fdata).then(
        data => {
          if (fdata.shareWhatsapp == true) {
            if (data['text']) {
              window.open("http://api.whatsapp.com/send?phone=+91" + fdata.mobile+ "&text=" + fdata.meetlink )
            }
          }

          this._snackBar.open(data['msg'], data['text'], {
            duration: 2000, verticalPosition: 'top'
          });

          this.dialogRef.close({ event: 'Add' });

        },
        err => {
          console.log('error');
        }
      );
    }
  }
}