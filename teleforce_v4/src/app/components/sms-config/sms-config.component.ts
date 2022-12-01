import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../template.service';
import {Router} from "@angular/router";


@Component({
  selector: 'app-sms-config',
  templateUrl: './sms-config.component.html',
  styleUrls: ['./sms-config.component.css']
})
export class SmsConfigComponent implements OnInit {


  public addForm: FormGroup;
  smserver = [];
  smstemp = [];
  constructor(
    //public dialogRef: MatDialogRef<CreateIvrComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private templateservice: TemplateService,
    private router: Router
  ) { }
  get configarr(): FormArray {
    return this.addForm.get('configDetail') as FormArray;
  }
  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.getApproveSMSTemplate(userid);
    this.getTransactionalSMSServer();
    let arr = [];
    for (let i = 0; i < 2; i++) {
      arr.push(this.BuildFormDynamic(i))
    }
    this.addForm = this.fb.group({
      user_id: [userid],
      serverid: [null, [Validators.required]],
      configDetail: this.fb.array(arr)
    });
    this.getSMSConfigDetail(userid);
  }

  BuildFormDynamic(product): FormGroup {
    if(product==0){
      var usein = 'incoming';
    }
    if(product==1){
      var usein = 'hungup';
    }
    return this.fb.group({
      agent_smstemp: [''],
      event: [usein],
      caller_smstemp: [''],
    })
  }

  getSMSConfigDetail(id) {
    let userid = localStorage.getItem('access_id');
    this.userservice.getSMSConfigDetail(userid).then(
      data => {
        //console.log(data['data']);
        if(data['data'].length>0){
          this.addForm.get("serverid").setValue(data['data'][0].smsserver_id);
          var totalcnt = data['data'].length
          let arr = [];
          for (let i = 0; i < totalcnt; i++) {
            // this.changedigitaction(data['ivrext'][i].DestinationType, i)
            arr.push({ agent_smstemp: data['data'][i].agent_smstemp_id, event: data['data'][i].event, caller_smstemp: data['data'][i].caller_smstemp_id })
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
      this.userservice.saveSMSConfig(data).then(
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

  async getApproveSMSTemplate(userid) {
    await this.templateservice.getApproveSMSList(userid).then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.smstemp = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  async getTransactionalSMSServer() {
    await this.templateservice.getTransactionalSMSserver().then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.smserver = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
}
