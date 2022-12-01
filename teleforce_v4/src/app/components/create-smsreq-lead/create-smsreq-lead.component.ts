import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { CampaignService } from '../../campaign.service';
import { AdminService } from '../../admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-smsreq-lead',
  templateUrl: './create-smsreq-lead.component.html',
  styleUrls: ['./create-smsreq-lead.component.css']
})
export class CreateSmsreqLeadComponent implements OnInit {

  public addForm: FormGroup;
  csegments = [];
  campaigns = [];
  agents = [];
  id = this.data;
  constructor(
    public dialogRef: MatDialogRef<CreateSmsreqLeadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private campaignservice: CampaignService,
    private userservice: UserService,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    let userid = 48; //sales manager id
    this.addForm = this.fb.group({
      //segmentid : [null,Validators.required],
      //campaignid : [null,Validators.required],
      agentid: [null, Validators.required],
      userid: [userid],
    });
    //this.getsegments();
    //this.getCampaigns();
    this.getAgents();
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  //get segment for sales manager 
  async getsegments() {
    let userid = 48;
    await this.campaignservice.getSegmentwithTotalContact(userid).then(data => {
      if (data) {
        this.csegments = (data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }

  //get segment for sales manager
  async getCampaigns() {
    let userinfo = 48;
    await this.campaignservice.getallcampaign(userinfo).then(data => {
      this.campaigns = data['data'];
    },
      err => {
        console.log('error');
      })
  }

  //get segment for sales manager
  async getAgents() {
    await this.userservice.getAgents(48).then(
      data => {
        this.agents = data['data'];
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
      let data: any = Object.assign(this.addForm.value);
      //console.log(data);
      data.id = this.id;
      this.adminservice.saveAssignLeadSms(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          let userid = localStorage.getItem('access_id');
          this.addForm = this.fb.group({
            segmentid: [null, Validators.required],
            campaignid: [null, Validators.required],
            agentid: [null, Validators.required],
            userid: [userid],
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

