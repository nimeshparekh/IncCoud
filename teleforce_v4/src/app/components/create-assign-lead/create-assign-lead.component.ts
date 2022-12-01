import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { CampaignService } from '../../campaign.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-assign-lead',
  templateUrl: './create-assign-lead.component.html',
  styleUrls: ['./create-assign-lead.component.css']
})
export class CreateAssignLeadComponent implements OnInit {

  public addForm: FormGroup;
  csegments = [];
  campaigns = [];
  agents = [];
  logidArr = this.data;
  constructor(
    public dialogRef: MatDialogRef<CreateAssignLeadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private campaignservice: CampaignService,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      segmentid : [null,Validators.required],
      campaignid : [null,Validators.required],
      agentid : [null,Validators.required],
      userid: [userid],
    });
    this.getsegments();
    this.getCampaigns();
    this.getAgents(userid);
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async getsegments() {
    let userid = localStorage.getItem('access_id');
    await this.campaignservice.getSegmentwithTotalContact(userid).then(data => {
      if (data) {
        this.csegments = (data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }

  async getCampaigns() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getallcampaign(userinfo).then(data => {
      this.campaigns = data['data'];
    },
      err => {
        console.log('error');
      })
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



  submit(){
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value); 
      //console.log(data);
      data.logidArr = this.logidArr;

        this.campaignservice.saveCampaignContact(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            let userid = localStorage.getItem('access_id');
            this.addForm = this.fb.group({
              segmentid : [null,Validators.required],
              campaignid : [null,Validators.required],
              agentid : [null,Validators.required],
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
