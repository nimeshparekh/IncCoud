import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../template.service';
import {Router} from "@angular/router";
import { CampaignService } from '../../campaign.service';
import { CrudService } from '../../crud.service';

@Component({
  selector: 'app-lead-config',
  templateUrl: './lead-config.component.html',
  styleUrls: ['./lead-config.component.css']
})
export class LeadConfigComponent implements OnInit {

  public addForm: FormGroup;
  agentgroup = [];
  segments = [];
  configdata = {}
  emailtemplate = []
  smscampaign = []
  isautocall = false
  isautosms = false
  isautoemail = false
  constructor(
    //public dialogRef: MatDialogRef<CreateIvrComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.getagentgroup()
    this.getContactCategory()
    let userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      user_id: [userid],
      category: [null],
      group: [null],
      autocall: [null],
      autocallstarttime: [null],
      autocallendtime: [null],
      autoemail: [null],
      emailtemplate: [null],
      autosms: [null],
      smscampaignid: [null],
    });
    this.getconfiguration()
    this.getEmailTemplate()
    this.getSmsTemplate()
  }

  async getEmailTemplate() {
    let userid = localStorage.getItem('access_id');
    await this.userservice.getEmailData(userid).then(
      data => {
        //console.log(data['data']);
        this.emailtemplate = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getSmsTemplate(){
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

  async getContactCategory() {
    let userinfo = localStorage.getItem('access_id');
    await this.crudservice.getCategorylist(userinfo).then(data => {
      if(data){
        this.segments = data['data'];
      }
    },
    err => {
      console.log('error'+err);
    })
  }
  async getagentgroup() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.gethuntgroup(userinfo).then(data => {
      if (data) {
        this.agentgroup = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  async getconfiguration(){
    let userid = localStorage.getItem('access_id');
    this.userservice.getConfiguration(userid).then(
      data => {
        var dataArr = data['data']
        dataArr.forEach(element => {
          this.configdata[element.metakey] = element.metavalue
        });
        console.log(this.configdata)
        this.addForm = this.fb.group({
          user_id: [userid],
          category: [this.configdata['category']],
          group: [Number(this.configdata['group'])],
          autocall: [this.configdata['autocall']],
          autocallstarttime: [this.configdata['autocallstarttime']],
          autocallendtime: [this.configdata['autocallendtime']],
          autoemail: [this.configdata['autoemail']],
          emailtemplate: [Number(this.configdata['emailtemplate'])],
          autosms: [this.configdata['autosms']],
          smscampaignid: [Number(this.configdata['smscampaignid'])],
        });
        if(this.configdata['autocall']=='yes'){
          this.isautocall = true
        }
        if(this.configdata['autoemail']=='yes'){
          this.isautoemail = true
        }
        if(this.configdata['autosms']=='yes'){
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
      this.userservice.saveConfiguration(data).then(
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

  checkautocall(event: any){
    console.log(event)
    if (event.value == 'yes') {
      this.isautocall = true
    }else{
      this.isautocall = false
    }
  }

  checkautosms(event: any){
    console.log(event)
    if (event.value == 'yes') {
      this.isautosms = true
    }else{
      this.isautosms = false
    }
  }

  checkautoemail(event: any){
    console.log(event)
    if (event.value == 'yes') {
      this.isautoemail = true
    }else{
      this.isautoemail = false
    }
  }
}
