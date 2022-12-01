import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../template.service';
import { AdminService } from '../../admin.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-email-sms-config',
  templateUrl: './email-sms-config.component.html',
  styleUrls: ['./email-sms-config.component.css']
})
export class EmailSmsConfigComponent implements OnInit {

  public addForm: FormGroup;
  smserver = [];
  emailserver = [];
  smstemp = [];
  emailtemp = [];

  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private templateservice: TemplateService,
    private adminservice: AdminService,
    private router: Router
  ) { }

  get configarr(): FormArray {
    return this.addForm.get('configDetail') as FormArray;
  }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.getApproveSMSTemplate();
    this.getEmailTemplateData();
    this.getSMSServer();
    this.getEmailServer();
    let arr = [];
    for (let i = 0; i < 9; i++) {
      arr.push(this.BuildFormDynamic(i))
    }
    this.addForm = this.fb.group({
      user_id: [userid],
      serverid: [null, [Validators.required]],
      emailserverid: [null, [Validators.required]],
      configDetail: this.fb.array(arr)
    });
    this.getSMSConfigDetail(userid);
  }
  BuildFormDynamic(product): FormGroup {
    if (product == 0) {
      var usein = 'renew before 7 days';
    }
    if (product == 1) {
      var usein = 'renew before 3 days';
    }
    if (product == 2) {
      var usein = 'renew before 1 day';
    }
    if (product == 3) {
      var usein = 'renew after 3 days';
    }
    if (product == 4) {
      var usein = 'renew after 1 day';
    }
    if (product == 5) {
      var usein = 'call audio';
    }
    if (product == 6) {
      var usein = 'signup';
    }
    if (product == 7) {
      var usein = 'sound upload';
    }
    if (product == 8) {
      var usein = 'sound approval';
    }
    return this.fb.group({
      smstempid: [''],
      event: [usein],
      emailtempid: [''],
    })
  }

  getSMSConfigDetail(id) {
    let userid = localStorage.getItem('access_id');
    this.adminservice.getEmailSMSConfigDetail(userid).then(
      data => {
        //console.log(data['data']);
        if (data['data'].length > 0) {
          this.addForm.get("serverid").setValue(data['data'][0].smsserver_id);
          this.addForm.get("emailserverid").setValue(data['data'][0].emailserver_id);
          var totalcnt = data['data'].length
          let arr = [];
          for (let i = 0; i < totalcnt; i++) {
            // this.changedigitaction(data['ivrext'][i].DestinationType, i)
            arr.push({ smstempid: data['data'][i].smstemp_id, event: data['data'][i].event, emailtempid: data['data'][i].emailtemp_id })
          }
          this.configarr.setValue(arr);
        }
      },
      err => {
        console.log('error');
      }
    );
  }


  openDialog(): void {
    //this.dialogRef.close({ event: 'Cancel' });
    this.router.navigate(['/sms-config']);
  }

  submit() {
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value);
      console.log(data);
      this.adminservice.saveEmailSMSConfig(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          //this.dialogRef.close({ event: 'Add' });
        },
        err => {
          console.log('error');
        }
      );
    }
  }

  async getApproveSMSTemplate() {
    await this.templateservice.getApproveSMSTemplate().then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.smstemp = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async getEmailTemplateData() {
    await this.adminservice.getEmailData().then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.emailtemp = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  async getSMSServer() {
    await this.adminservice.getSmsServerData().then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.smserver = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  

  async getEmailServer() {
    await this.adminservice.getEmailServerData().then(
      data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.emailserver = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

}
