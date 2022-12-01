import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl,FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CampaignService } from '../../campaign.service';
import { TemplateService } from '../../template.service';


@Component({
  selector: 'app-create-conference-call',
  templateUrl: './create-conference-call.component.html',
  styleUrls: ['./create-conference-call.component.css']
})
export class CreateConferenceCallComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  scheduletime = false
  agents = [];
  agenttype = false;
  contacttype = false;
  customtype = false;
  csegments = [];
  smstemplate = false;
  smstemp = [];
  confdid = []
  constructor(
    public dialogRef: MatDialogRef<CreateConferenceCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private campaignservice: CampaignService,
    private templateservice: TemplateService,
  ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.getAgents(userid)
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.adminid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.adminid = this.data
        this.editmode = true;
        this.addmode = false;
        this.getCallDetail(this.data);
      }

    }
    /*let arr = [];
    for (let i = 0; i < 3; i++) {
      arr.push(this.BuildFormDynamic(i))
    }*/
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      userid: [userid],
      date: [null],
      type: [null, [Validators.required]],
      did: [null, [Validators.required]],
      start: [0],
      membertype: [0],
      member: [null],
      segment: [null],
      customDetails: this.fb.array([this.BuildFormDynamic()]),
      sendsms:[0],
      smstemplate:[null],
    });
    this.showMember(0);
    this.getsegments();
    this.getdid();
  }

  BuildFormDynamic() {
    return this.fb.group({
      membername: [''],
      contactno: ['']
    })
  }

  addNewRow(){
    //console.log('hello');
    const control = <FormArray>this.addForm.controls['customDetails'];
    control.push(this.BuildFormDynamic());
  }
  deleteRow(index){
    //console.log('hello');
    const control = <FormArray>this.addForm.controls['customDetails'];
    if(control!=null){
      var totalrow=control.value.length;
    }
    if(totalrow > 1){
      control.removeAt(index);
    }else{
      alert('One record is mandatory');
      return false;
    }
    //control.push(this.BuildFormDynamic());
  }

  async getAgents(userid) {
    await this.userservice.getAgents(userid).then(
      data => {
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      //console.log(this.addForm.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value);
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.userservice.updateConferenceCall(data).then(
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
        this.userservice.saveConferenceCall(data).then(
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
  getCallDetail(id) {
    this.userservice.getConferenceCallDetail(id).then(
      data => {
        //console.log(data['data']['conf_member']);
        var date = new Date(data['data']['conf_date']);
        this.addForm = this.fb.group({
          confid: [data['data']['conf_id']],
          userid: [data['data']['account_id']],
          name: [data['data']['conf_name'], [Validators.required]],
          date: [date, [Validators.required]],
          type: [data['data']['conf_type'], [Validators.required]],
          did:  [data['data']['conf_did'], [Validators.required]],
          start: [data['data']['conf_start']],
          membertype: [data['data']['conf_membertype']],
          member: [null],
          segment: [null],
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.userservice.deleteConferenceCall(id).then(
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
  showSchedule(value) {
    if (value == '0') {
      this.scheduletime = false
    } else {
      this.scheduletime = true
    }
  }
  showTemplate(value) {
    if (value == '1') {
      this.smstemplate = true
      this.getApproveSMSTemplate();
    } else {
      this.smstemplate = false
    }
  }
  showMember(value) {
    //console.log(value);
    if (value == '0') {
      this.agenttype = true;
      this.contacttype = false;
      this.customtype = false;
    } else if (value == '1') {
      this.contacttype = true;
      this.agenttype = false;
      this.customtype = false;
    } else if (value == '2') {
      this.customtype = true;
      this.agenttype = false;
      this.contacttype = false;
    } else {
      this.agenttype = false;
      this.contacttype = false;
      this.customtype = false;
    }
  }
  async getsegments() {
    let userid = localStorage.getItem('access_id');
    await this.campaignservice.getSegmentwithTotalContact(userid).then(data => {
      if (data) {
        this.csegments = (data['data']);
        //console.log(data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }
  async getApproveSMSTemplate() {
    let userid = localStorage.getItem('access_id');
    await this.userservice.getSmsCampaign().then(
      data => {
         this.smstemp = data['data'];
      },
      err => {
        console.log('error');
      }
    );
    // await this.templateservice.getApproveSMSList(userid).then(data => {
    //   if (data) {
    //     this.smstemp = (data['data']);
    //     //console.log(data['data']);
    //   }
    // },
    //   err => {
    //     console.log('error');
    //   })
  }

  async getdid() {
    await this.campaignservice.getConferenceDID().then(data => {
      if (data) {
        this.confdid = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
}
