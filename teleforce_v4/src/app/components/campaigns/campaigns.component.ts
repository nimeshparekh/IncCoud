import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateVoipCampaignComponent } from '../create-voip-campaign/create-voip-campaign.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ThrowStmt } from '@angular/compiler';
import { CampaignService } from '../../campaign.service';
import { ManagerService } from '../../manager.service';
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../user.service';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { AssignAgentCampaginComponent } from '../assign-agent-campagin/assign-agent-campagin.component';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  collection = { count: 0, data: [] };
  public dataSource: MatTableDataSource<any>;
  displayedColumns = ["id", "date", "camid", "name", "type", "method", "dailertype", "status", "action"];
  contactLength = 0;
  isLoadingcon = true;
  isLoading = false;
  public runningdataSource: MatTableDataSource<any>;
  runningdisplayedColumns = ["id", "date", "camid", "name", "type", "method", "dailertype", "status", "action"];
  runnigisLoading = true;
  runnigLength = 0;

  public complatedataSource: MatTableDataSource<any>;
  complatedisplayedColumns = ["id", "date", "camid", "name", "type", "method", "dailertype", "status", "action"];
  complateisLoading = true;
  compalteLength = 0;

  campaigns = [];
  progressivedialer = false;
  kyc;
  isDisabled = false;
  currentab = 'Schedule';
  lms_delete_agent_camp='';
  public searchform: FormGroup;

  constructor(public dialog: MatDialog, private http: HttpClient,
    private toastr: ToastrService,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private userservice: UserService,
    private router: Router,
    private fb: FormBuilder,

  ) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('runnigpaginator') runnigpaginator: MatPaginator;
  @ViewChild('complatepaginator') complatepaginator: MatPaginator;


  async ngOnInit() {
    var currentdate = new Date();
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    //this.getCampaigns();
    // this.getrunningCampaign();
    // this.getcompaleteCampaign();
    this.dataSource = new MatTableDataSource();
    this.runningdataSource = new MatTableDataSource();
    this.complatedataSource = new MatTableDataSource();
    this.delete_agent_camp()

    this.getManagerDetail(userid);
    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [],
      enddate: [],
      cam_method: [''],
      cam_type: [''],
      cam_status: [''],
    });
    this.searchData();
  }
  onTabClick(event) {
    //console.log(event);
    var userid = localStorage.getItem('access_id');
    this.currentab = event.tab.textLabel;

    this.searchData();

  }
  async delete_agent_camp() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.delete_agent_camp(userinfo).then(data => {
      if (data) {
        this.lms_delete_agent_camp=data['data']
        console.log("lms_delete_agent_camp",this.lms_delete_agent_camp);
        
      }
    },
      err => {
        console.log('error');
      })
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateVoipCampaignComponent, {
      width: '840px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.searchData()
        //this.getCampaigns();
        //this.getrunningCampaign();
        //this.getcompaleteCampaign();
      }
    });

  }

  /*async getCampaigns() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getallcampaign(userinfo).then(data => {
      if (data) {
        this.collection.count = data['count'];
        this.collection.data = data['data'];
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }*/

  async getcompaleteCampaign() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getcompaleteCampaign(userinfo).then(data => {
      if (data) {

        this.complatedataSource.data = data['data'];
        this.compalteLength = data['data'].length;
        this.complateisLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }
  async getrunningCampaign() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getrunningCampaign(userinfo).then(data => {
      if (data) {
        this.runningdataSource.data = data['data'];
        this.runnigLength = data['data'].length;
        this.runnigisLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.runningdataSource.paginator = this.runnigpaginator;
    this.complatedataSource.paginator = this.complatepaginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  changeaction(camid, action) {
    if (confirm("Are you sure to perform action ?")) {
      let formData = { camid: camid, action: action };
      this.http.post(environment.apiUrl + "/contacts/changeaction", formData)
        .subscribe(res => {
          this._snackBar.open('Campaign action updated succesfully.', '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.searchData()
          // this.getrunningCampaign();
          // this.getcompaleteCampaign();
        });
    }
  }

  stopcampaign(camid, action) {
    if (confirm("Are you sure to perform action ?")) {
      let formData = { camid: camid, action: action };
      this.http.post(environment.apiUrl + "/contacts/stopcampaign", formData)
        .subscribe(res => {
          this._snackBar.open('Campaign action updated succesfully.', '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.searchData()
          // this.getrunningCampaign();
          // this.getcompaleteCampaign();
        });
    }
  }

  async deleteagentdialog(id) {
    //console.log(id);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.searchData()
        // this.getrunningCampaign();
        // this.getcompaleteCampaign();
      }
    });
  }

  async getManagerDetail(userid) {
    await this.managerservice.getManagerDetail(userid).then(
      data => {
        if (data['data']['services'].length > 1) {
          //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for (var i = 0; i < data['data']['services'].length; i++) {
            if (serviceArr[i] == '6') {
              this.progressivedialer = true;
            }
          }
        } else {
          var service = data['data']['services'];
          if (service == '6') {
            this.progressivedialer = true;
          }
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

        } else {
          this.router.navigate(['/kyc-document-upload']);
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  async Assignagent(id) {
    //console.log(id);
    const dialogRef = this.dialog.open(AssignAgentCampaginComponent, {
      width: '640px', disableClose: true, data: { action: 'Update', id: id }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        //this.getCampaigns();
        this.searchData();
        // this.getrunningCampaign();
        // this.getcompaleteCampaign();
      }
    });
  }
  searchData() {
    this.isDisabled = true;
    this.isLoading = true;
//console.log(this.currentab);
    let data: any = Object.assign(this.searchform.value);
    if (this.currentab == "Running") {
      this.searchrunnigschedule();
    } else if (this.currentab == "Schedule") {
      this.searchschedule();
    } else {
      this.searchcomplate();
    }

  }
  searchschedule() {
    let data: any = Object.assign(this.searchform.value);
    data.agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    data.cam_statustab = 0;
    this.userservice.serachcampagindata(data).then(
      data => {
        console.log("dfcg",data['data']);
        
        this.collection.count = data['count'];
        this.collection.data = data['data'];
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
        this.isDisabled = false;
      },
      err => {
        console.log('error');
      }
    );

  }
  searchcomplate() {
    let data: any = Object.assign(this.searchform.value);
    data.agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    data.cam_statustab = 2;
    this.userservice.serachcampagindata(data).then(
      data => {
        this.complatedataSource.data = data['data'];
        this.compalteLength = data['data'].length;
        this.complateisLoading = false;
        this.isDisabled = false;
      },
      err => {
        console.log('error');
      }
    );

  }
  searchrunnigschedule() {
    let data: any = Object.assign(this.searchform.value);
    data.agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    data.cam_statustab = 1;
    this.userservice.serachcampagindata(data).then(
      data => {
        //console.log("DATA::"+JSON.stringify(data['data']));
        this.runningdataSource.data = data['data'];
        this.runnigLength = data['data'].length;
        this.runnigisLoading = false;
        this.isDisabled = false;
      },
      err => {
        console.log('error');
      }
    );

  }
  resetform() {
    var currentdate = new Date();

    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [],
      enddate: [],
      cam_method: [''],
      cam_type: [''],
      cam_status: [''],

    });
    this.searchData();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./campaigns.component.css']

})
export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private campaignservice: CampaignService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      this.id = this.data.id


    }

  }
  async deleteRequest(id) {

    await this.campaignservice.deletecampaingnreq(id).then(
      data => {
        this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
