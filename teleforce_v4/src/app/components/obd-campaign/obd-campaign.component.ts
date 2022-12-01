import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { CampaignService } from '../../campaign.service';
import { ManagerService } from '../../manager.service';
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../user.service';
import { ErpService } from '../../erp.service';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-obd-campaign',
  templateUrl: './obd-campaign.component.html',
  styleUrls: ['./obd-campaign.component.css']
})
export class ObdCampaignComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns = ["id", "date", "camid", "name", "status", "action"];
  contactLength = 0;
  public runningdataSource: MatTableDataSource<any>;
  displayedrunningColumns = ["id", "date", "camid", "name", "status", "action"];
  runningLength = 0;
  public completedataSource: MatTableDataSource<any>;
  displayedcompleteColumns = ["id", "date", "camid", "name", "status", "action"];
  completeLength = 0;
  obdbalance=0;
  isLoadingcon = true;
  isLoading = true;
  campaigns = [];
  progressivedialer = false;
  kyc;
  currentab = 'Schedule';
  isDisabled = false;
  channellist =[];
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
  @ViewChild('runningpaginator') runningpaginator: MatPaginator;
  @ViewChild('completepaginator') completepaginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource();
    this.runningdataSource = new MatTableDataSource();
    this.completedataSource = new MatTableDataSource();
    this.getManagerDetail(userid);
    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [],
      enddate: [],
    });
    this.getCampaigns();
    this.getdid()
    this.assignedChannelList(userid)
  }
  onTabClick(event) {
    //console.log(event);
    var userid = localStorage.getItem('access_id');
    this.currentab = event.tab.textLabel;
    this.searchData();
  }
  searchData() {
    this.isDisabled = true;
    this.isLoading = true;
    //console.log(this.currentab);

    this.getCampaigns();
  }
  async assignedChannelList(managerid) {
    await this.campaignservice.getCampaigAssignChannel(managerid).then(
      data => {
        this.channellist = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateOBDCampaignComponent, {
      width: '840px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getCampaigns();
      }
    });
  }

  async getCampaigns() {
    let data: any = Object.assign(this.searchform.value);
    if (this.currentab == "Running") {
      data.cam_status = "1";
      await this.campaignservice.getOBDcampaign(data).then(data => {
        if (data) {
          //console.log(data['data']);
          this.runningdataSource.data = data['data'];
          this.runningLength = data['data'].length;
          this.isLoadingcon = false;
          this.isLoading = false;
          this.isDisabled = false;
        }
      },
        err => {
          console.log('error');
        })
    } else if (this.currentab == "Schedule") {
      data.cam_status = "0";
      await this.campaignservice.getOBDcampaign(data).then(data => {
        if (data) {
          //console.log(data['data']);
          this.dataSource.data = data['data'];
          this.contactLength = data['data'].length;
          this.isLoadingcon = false;
          this.isLoading = false;
          this.isDisabled = false;
        }
      },
        err => {
          console.log('error');
        })
    } else {
      data.cam_status = "2";
      await this.campaignservice.getOBDcampaign(data).then(data => {
        if (data) {
          //console.log(data['data']);
          this.completedataSource.data = data['data'];
          this.completeLength = data['data'].length;
          this.isLoadingcon = false;
          this.isLoading = false;
          this.isDisabled = false;
        }
      },
        err => {
          console.log('error');
        })
    }

  }
  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id: [userid],
      startdate: [],
      enddate: []
    });
    this.getCampaigns();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.runningdataSource.paginator = this.runningpaginator;
    this.dataSource.sort = this.sort;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
 
  changeaction(camid, action) {
    if (confirm("Are you sure to perform action ?")) {
      let formData = { camid: camid, action: action };
      this.campaignservice.changecampaignaction(formData).then(
        data => {
          if (data['data']) {
            if (action == 1) {
              this._snackBar.open('Campaign start successfully!!', '', {
                duration: 2000, verticalPosition: 'top'
              });
            }
            if (action == 2) {
              this._snackBar.open('Campaign stop successfully!!', '', {
                duration: 2000, verticalPosition: 'top'
              });
            }
          } else {
            this._snackBar.open('Something went wrong', '', {
              duration: 2000, verticalPosition: 'top'
            });
          }

          this.getCampaigns();
        },
        err => {
          console.log('error');
        }
      );
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
        this.obdbalance = data['data']['obdbalance']; 
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
  async getdid() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getdidrouting(userinfo).then(data => {
      if (data) {
        console.log("did",data['data'])
       // this.did = (data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }

}


@Component({
  selector: 'app-create-obd-campaign',
  templateUrl: './create-obd-campaign.component.html',
  styleUrls: ['./obd-campaign.component.css']
})
export class CreateOBDCampaignComponent implements OnInit {
  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  category = [];
  agent = [];
  segments = [];
  csegments = [];
  did = [];
  ivr = [];
  click1 = [];
  feedbackforms = []
  agentgroup;
  agentlist;
  contactlist;
  didlist;
  cam_method;
  typecam;
  ivrlistdata;
  delagentid = '';
  delagentname = '';
  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addConForm: FormGroup;
  showaudio = false;
  show = false;
  dialershow = false;
  ivvr = false;
  agentshow = true
  regForm;
  wasFormChanged = false;
  private debouncedTimeout;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  progressivedialer = false;
  isliveagent = false;
  isobd = false;
  smslist = []
  smstemplatemode=false;
  retryunanswer = false
  constructor(
    public dialogRef: MatDialogRef<CreateOBDCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ObdCampaignComponent,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
    private erpservice: ErpService,
  ) { }

  public ngOnInit(): void {
    this.getsegments();
    this.getivr();
    var userid = localStorage.getItem('access_id');
    this.getManagerDetail(userid);
    //this.getFormsData()
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
    this.getdid()

    this.addConForm = this.fb.group({
      startdate: [null, [Validators.required]],
      campaignname: [null, [Validators.required]],
      customer_id: [userid],
      segments: [null, [Validators.required]],
      ivr: [null],
      campaigntype: [0],
      campaignmethod: [1],
      agentgroup: [null],
      agents: [null],
     did: [null],
      retryunansweredcall: ['no'],
      retrystatus1: ['NOANSWER'],
      retrytime1: ['1'],
      retrystatus2: ['BUSY'],
      retrytime2: ['1'],
      retrystatus3: ['TEMPORARY_FAILUR'],
      retrytime3: ['1'],
      maxretry: [3],
      smscallanswered: [0],
      smstemplateid: ['']
    });
  }


  campaignsubmit() {
    let data: any = Object.assign(this.addConForm.value);
    //console.log(data)
    if (this.addConForm.invalid == true) {
      return;
    }
    else {
      this.submitted = true;
      // console.log(data.campaignmethod)
      this.campaignservice.saveOBDCampaign(data).then(
        data => {
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

  changeretry(value){
    if(value=='yes'){
      this.retryunanswer = true
    }else{
      this.retryunanswer = false
    }
  }

  openDialog(): void {
    //console.log(this.wasFormChanged);
    this.dialogRef.close({ event: 'Cancel' });
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  formChanged() {
    this.wasFormChanged = true;
  }

  async getdid() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getdidrouting(userinfo).then(data => {
      if (data) {
        console.log("did",data['data'])
        this.did = (data['data']);
      }
    },
      err => {
        console.log('error');
      })
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

  async getivr() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getivrlist(userinfo).then(data => {
      if (data) {
        this.ivr = (data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }

  async getManagerDetail(userid) {
    await this.managerservice.getManagerDetail(userid).then(
      data => {
        //console.log(data['data']['services']);
        if (data['data']['services'].length > 1) {
          //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for (var i = 0; i < data['data']['services'].length; i++) {
            if (serviceArr[i] == '6') {
              this.progressivedialer = true;
            }

            if (serviceArr[i] == '9') {
              this.isobd = true;
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
  async getSMSList() {
    let userid = localStorage.getItem('access_id');
    await this.erpservice.getsmstemplate(userid).then(data => {
      if (data) {
        this.smslist = (data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }
  showSMSTemplate(value) {
    if (value == '1') {
      this.smstemplatemode=true;
      this.getSMSList();
    }else{
      this.smstemplatemode=false;
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./obd-campaign.component.css']

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

    await this.campaignservice.deleteOBDcampaingn(id).then(
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
