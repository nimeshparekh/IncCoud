import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../template.service';
import { Router } from "@angular/router";
import { CampaignService } from '../../campaign.service';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-schedule-sms',
  templateUrl: './schedule-sms.component.html',
  styleUrls: ['./schedule-sms.component.css']
})
export class ScheduleSmsComponent implements OnInit {
  public addForm: FormGroup;
  agentgroup = [];
  segments = [];
  configdata = {}
  emailtemplate = []
  smstemplate = []
  smscampaign = []

  isautosms = false
  isautoemail = false

  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private templateservice: TemplateService,
    private router: Router,
    private campaignservice: CampaignService,
    private crudservice: CrudService,
  ) { }

  ngOnInit(): void {

    let userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      user_id: [userid],
      category: [null],
      group: [null],
      autoemail: [null],
      scheduledemailtemplate: [null],
      linkshareemailtemplate: [null],
      autosms: [null],
      smscampaignid: [null],
      sharelinksmscampaignid: [null],
      autostarttime: [null],
      autoendtime: [null],
    });
    this.getconfiguration()
    this.getEmailTemplate()
    this.getScheduleSmsTemplate()
    this.getSmsTemplate()
  }

  async getEmailTemplate() {
    let userid = localStorage.getItem('access_id');
    await this.userservice.getScheduleEmailData(userid).then(
      data => {
        //console.log(data['data']);
        this.emailtemplate = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getScheduleSmsTemplate() {
    let userid = localStorage.getItem('access_id');
    await this.userservice.getScheduleSmsData(userid).then(
      data => {
        //console.log(data['data']);
        this.smstemplate = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getSmsTemplate() {
    let userid = localStorage.getItem('access_id');
    await this.userservice.getSmsCampaign().then(
      data => {
        this.smscampaign = data['data'];
      },
      err => {
        console.log('error');
      }
    );

  }


  async getconfiguration() {
    let userid = localStorage.getItem('access_id');
    this.userservice.getCalenderConfiguration(userid).then(
      data => {
        var dataArr = data['data']
        dataArr.forEach(element => {
          this.configdata[element.metakey] = element.metavalue
        });
        console.log(this.configdata)
        this.addForm = this.fb.group({
          user_id: [userid],
          autoemail: [this.configdata['autoemail']],
          scheduledemailtemplate: [Number(this.configdata['scheduledemailtemplate'])],
          linkshareemailtemplate: [Number(this.configdata['linkshareemailtemplate'])],
          autosms: [this.configdata['autosms']],
          smscampaignid: [Number(this.configdata['smscampaignid'])],
          sharelinksmscampaignid: [Number(this.configdata['sharelinksmscampaignid'])],
          autostarttime: [this.configdata['autostarttime']],
          autoendtime: [this.configdata['autoendtime']],
        });

        if (this.configdata['autoemail'] == 'yes') {
          this.isautoemail = true
        }
        if (this.configdata['autosms'] == 'yes') {
          this.isautosms = true
        }
      },
      err => {
        console.log('error');
      }
    );
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
      this.userservice.saveCalenderConfiguration(data).then(
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


  checkautosms(event: any) {
    console.log(event)
    if (event.value == 'yes') {
      this.isautosms = true
    } else {
      this.isautosms = false
    }
  }

  checkautoemail(event: any) {
    console.log(event)
    if (event.value == 'yes') {
      this.isautoemail = true
    } else {
      this.isautoemail = false
    }
  }


}
