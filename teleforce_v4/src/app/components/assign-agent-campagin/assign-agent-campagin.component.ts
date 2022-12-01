import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CampaignService } from "../../campaign.service";
import { ManagerService } from "../../manager.service";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-assign-agent-campagin',
  templateUrl: './assign-agent-campagin.component.html',
  styleUrls: ['./assign-agent-campagin.component.css']
})
export class AssignAgentCampaginComponent implements OnInit {
  camid =0;
  liveagent = true;
  agentlist=[];
  public addAgentForm: FormGroup;
  agents = [];
  isLoading = false;

  public agentdataSource: MatTableDataSource<any>;
  displayedAgentColumns: string[] = ['id', 'name', 'mobile', 'username', 'status', 'action'];
  agentLength = 0;
  constructor(
    public dialogRef: MatDialogRef<AssignAgentCampaginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
  ) { }
  @ViewChild('agentpaginator') agentpaginator: MatPaginator;


  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'Update') {
        
       this.camid =this.data.id;
      
      }
      

    }
    this.addAgentForm = this.fb.group({
      userid: [userid],
      campaignid: [this.camid],
      agentForm: [null, [Validators.required]],
    });
    this.unassignAgentList(userid)
    this.getCampaignAgent(this.camid);
    this.assignAgentList(userid);
  }
  async getCampaignAgent(campaignid) {
    await this.campaignservice.getCampaignAgent(campaignid).then(
      data => {
        
        this.agents = data['data'];
        this.agentdataSource = data['data'];
        this.agentLength = data['data'].length;
        this.isLoading = false;
        console.log(this.agentdataSource);

      },
      err => {
        console.log('error');
      })
  }
  async unassignAgentList(managerid) {
    await this.campaignservice.getcampaigunassignagent(managerid,this.camid).then(
      data => {
        this.agentlist = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  agentsubmit() {
    let data: any = Object.assign(this.addAgentForm.value);
    //console.log(data);
    this.campaignservice.saveCampaignAgent(data).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.getCampaignAgent(this.camid);
        var userid = localStorage.getItem('access_id');
        this.assignAgentList(userid);
        this.addAgentForm = this.fb.group({
          userid: [userid],
          campaignid: [this.camid],
          agentForm: [null,[Validators.required]],
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async assignAgentList(managerid) {
    await this.campaignservice.getCampaigAssignAgent(managerid).then(
      data => {
        this.agentlist = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  deleteAgent(id) {
    if (confirm('Are you sure to delete this ?')) {
      this.campaignservice.deleteCampaignAgent(id).then(
        data => {
          this.getCampaignAgent(this.camid);
          var userid = localStorage.getItem('access_id');
          this.assignAgentList(userid);
        },
        err => {
          console.log('error');
        })
    }
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
