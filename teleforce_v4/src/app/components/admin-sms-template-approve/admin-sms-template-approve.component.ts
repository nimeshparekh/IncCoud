import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-sms-template-approve',
  templateUrl: './admin-sms-template-approve.component.html',
  styleUrls: ['./admin-sms-template-approve.component.css']
})
export class AdminSmsTemplateApproveComponent implements OnInit {

  adminid = '';
  form: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<AdminSmsTemplateApproveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    var username = localStorage.getItem('username');

    this.getapprovestatus(this.data);

    this.form = this.fb.group({
      sms_id: this.data,
      approved_by: [userid],
      approve_status: ['', [Validators.required]],
      templateid: ['', [Validators.required]],
      contentid: ['', [Validators.required]],
      senderid: ['', [Validators.required]],
      note: [''],
      entityid:[null, [Validators.required]],
      templatetype:['',[Validators.required]]
    })

  }
  getapprovestatus(id) {
    var userid = localStorage.getItem('access_id');
    this.adminservice.getsmsapprovestatus(id).then(
      data => {

        this.form = this.fb.group({
          sms_id: this.data,
          approved_by: [userid],
          approve_status: [data['data'][0].approve_status, [Validators.required]],
          note: [data['data'][0].note],
          templateid: [data['data'][0].templateid, [Validators.required]],
          contentid: [data['data'][0].contentid, [Validators.required]],
          senderid: [data['data'][0].senderid, [Validators.required]],
          entityid: [data['data'][0].entityid, [Validators.required]],
          templatetype:[data['data'][0].templatetype,[Validators.required]]

        })
      },
      err => {
        console.log('error');
      }
    );
  }
  approve() {
    let udata: any = Object.assign(this.form.value);
    console.log(udata);
    

    this.adminservice.approvesms(udata).then(
      data => {
        //console.log(data['data']);
        this._snackBar.open(data['data'], '', {
          duration: 3000, verticalPosition: 'top'
        })
        this.dialogRef.close({ event: 'Update' });
      },
      err => {
        console.log('error');
      })

  }
  invalidUserName() {
    return (this.submitted && this.form.controls.approve_status.errors != null);
  }


}
