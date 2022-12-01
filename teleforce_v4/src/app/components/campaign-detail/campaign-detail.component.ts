import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CampaignService } from "../../campaign.service";
import { ManagerService } from "../../manager.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudService } from '../../crud.service';
import { ContactDataSource } from "./campaign.datasource";
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { UserService } from '../../user.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit {
  scheduleid = null;
  campaignid = this.route.snapshot.paramMap.get('id');
  //campaignid = 164;
  campaignname = '';
  public summarydataSource: MatTableDataSource<any>;
  displayedSummaryColumns: string[] = ['id', 'status', 'count', 'action'];
  summaryLength = 0;
  // public logdataSource: MatTableDataSource<any>;
  public ratedataSource: MatTableDataSource<any>;
  rateColumns: string[] = ['id', 'status', 'count', 'rate'];
  rateLength = 0;
  public logdataSource2: MatTableDataSource<any>;

  displayedLogColumns2: string[] = ['id','CallStartTime',  'CallerName', 'CallerNumber'];
  logLength2 = 0;
  public logdataSource: ContactDataSource;

  displayedLogColumns: string[] = ['id', 'CallStartTime', 'CallerName', 'CallerNumber', 'CallStatus', 'CallDuration', 'CallTalkTime', 'DisconnectedBy', 'AgentName', 'AgentStatus', 'CallType', 'recording'];
  logLength = 0;
  public agentdataSource: MatTableDataSource<any>;
  displayedAgentColumns: string[] = ['id', 'name', 'mobile', 'username', 'status', 'action'];
  agentLength = 0;
  public channeldataSource: MatTableDataSource<any>;
  displayedChannelColumns: string[] = ['id', 'channel', 'status', 'action'];
  channelLength = 0;
  isLoading = true;
  liveagent = true;
  outboundcam = false;
  ivrcampaign = false;
  public searchform: FormGroup;
  public   addcallForm:FormGroup;
  public rsearchform: FormGroup;

  agents = [];
  callstatus = [];
  calltype = [];
  channellist = [];
  agentlist = [];
  public addConForm: FormGroup;
  public addAgentForm: FormGroup;
  sortcolumn = 'CallStartTime';
  sortdirection = 'DESC';
  extensions = [];
  campaigndetail;
  assigndid: [];
  ivrname = '';
  segments = [];
  rate = [];
  consumptions = []
  timezone = localStorage.getItem('timezone') ? localStorage.getItem('timezone') : '+5:30';
  public scheduleform: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userservicee: CrudService,
    private userservice: UserService,
    private router: Router
  ) { }

  @ViewChild('summarypaginator') summarypaginator: MatPaginator;
  @ViewChild('logpaginator') logpaginator: MatPaginator;
  @ViewChild('agentpaginator') agentpaginator: MatPaginator;
  @ViewChild('channelpaginator') channelpaginator: MatPaginator;
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  @ViewChild('ratepaginator') ratepaginator: MatPaginator;
  @ViewChild('contactpaginator2') contactpaginator2: MatPaginator;



  ngOnInit(): void {
    this.summarydataSource = new MatTableDataSource();
    this.ratedataSource = new MatTableDataSource();
    this.logdataSource2 = new MatTableDataSource();

    // this.logdataSource = new MatTableDataSource();
    this.logdataSource = new ContactDataSource(this.userservicee);
    var currentdate = new Date();
    this.logdataSource.loadContacts({ campaignid: [this.campaignid], startdate: [currentdate], enddate: [currentdate] }, this.sortcolumn, this.sortdirection, 0, 50);

    var userid = localStorage.getItem('access_id');

    this.agentdataSource = new MatTableDataSource();
    this.channeldataSource = new MatTableDataSource();

    this.getCampaignName(this.campaignid);
    //this.getCampaignCallLog(this.campaignid);
    this.getCampaignCallSummary(this.campaignid);
    this.getCampaignAgent(this.campaignid);
    this.getCampaignDID(this.campaignid);
    this.getCampaignSegment(this.campaignid);
    this.getcampaignscheduledata(this.campaignid)
    //console.log("campaignid",this.campaignid);

    var currentdate = new Date();
    this.searchform = this.fb.group({
      campaignid: [this.campaignid],
      startdate: [currentdate],
      enddate: [currentdate],
      status: [],
      agentid: [],
      callername: [],
      callerno: [],
      calltype: [],
      extension: [],
    });
   this.addcallForm = this.fb.group({
      campaignid: [this.campaignid],
      callratio :['']
     
    });
    this.rsearchform = this.fb.group({
      campaignid: [this.campaignid],
      startdate: [currentdate],
      enddate: [currentdate],
   
      callername: [],
      callerno: [],
   
    });
    this.searchData();/* show current date call log*/
    //assign channel list 
    this.unassignAgentList(userid)
  //  this.assignedChannelList(userid);
    this.getCallExtension(userid);
    this.addConForm = this.fb.group({
      userid: [userid],
      campaignid: [this.campaignid],
      channelForm: [null, [Validators.required]],
    });

    this.addAgentForm = this.fb.group({
      userid: [userid],
      campaignid: [this.campaignid],
      agentForm: [null, [Validators.required]],
    });
    //Assign Agent
    //this.assignAgentList(userid);
    this.scheduleform = this.fb.group({
      userid: [userid],

      all: [false],
      mon: [false],
      tue: [false],
      wed: [false],
      thu: [false],
      fri: [false],
      sat: [false],
      sun: [false],
      starttime: [null, [Validators.required]],
      endtime: [null, [Validators.required]],
      campaignid: [this.campaignid],
    });

  }
  loaddata() {
    this.getCampaignSegment(this.campaignid)
  }
  async updatecallratio(type) {
    let data: any = Object.assign(this.addcallForm.value);
    this.campaignservice.update_call_ratio(data).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        
      this.getCampaignName(this.campaignid);
      },
      err => {
        console.log('error');
      }
    );
  
  }
  async deleteRequest() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: { action: 'delete', id: this.campaignid }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        
      }
    });
  }
  async getCallExtension(userid) {
    await this.userservice.getExtension(userid).then(
      data => {
        this.extensions = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCampaignName(campaignid) {
    await this.campaignservice.getCampaignDetail(campaignid).then(
      data => {


        this.campaigndetail = data['data'][0];
        this.campaignname = data['data'][0]['cam_name'];
        this.addcallForm = this.fb.group({
          campaignid: [this.campaignid],
          callratio :[data['data'][0]['call_ratio']]
         
        });
        // console.log('data:::'+data['data'][0]['cam_method']);
        // if (data['data'][0]['cam_method'] == '0') {
        //   this.liveagent = true;
        // } else {
        //   this.liveagent = false;
        // }

        // if (data['data'][0]['cam_type'] == '1') {
        //   this.liveagent = true;
        // } else {
        //   this.liveagent = false;
        // }

        if (data['data'][0]['cam_type'] == '0' && data['data'][0]['cam_method'] == '1') {
          this.liveagent = false;
        } else {
          this.liveagent = true;
        }

        if (data['data'][0]['cam_type'] == '0') {
          this.outboundcam = true;
        } else {
          this.outboundcam = false;
        }
        if (data['data'][0]['cam_ivrid'] != null) {
          this.ivrcampaign = true
          this.getCampaignIVR(data['data'][0]['cam_ivrid']);
          this.getratedata(this.campaignid);
        }
        // if (data['data'][0]['dialer_type'] == "1") {
          this.unassignAgentList(localStorage.getItem('access_id'));
        // } else {
        //   this.assignAgentList(localStorage.getItem('access_id'));
        // }
      },
      err => {
        console.log('error');
      })
  }

  // async getCampaignCallLog(campaignid) {
  //   await this.campaignservice.getCampaignCallLog(campaignid).then(
  //     data => {
  //       // this.logdataSource.data = data['data'];
  //       this.logLength = data['data'].length;
  //       this.isLoading = false;
  //     },
  //     err => {
  //       console.log('error');
  //     })
  // }

  async getCampaignCallSummary(campaignid) {
    await this.campaignservice.getCampaignCallSummary(campaignid).then(
      data => {
        this.callstatus = data['data'];
        this.summarydataSource.data = data['data'];
        this.summaryLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  async getCampaignIVR(ivrid) {
    await this.userservice.getIVRDetail(ivrid).then(
      data => {
        this.ivrname = data['ivrdata']['IvrName'];
      },
      err => {
        console.log('error');
      })
  }

  async getCampaignAgent(campaignid) {
    await this.campaignservice.getCampaignAgent(campaignid).then(
      data => {
        this.agents = data['data'];
        this.agentdataSource.data = data['data'];
        this.agentLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  async getCampaignDID(campaignid) {
    await this.campaignservice.getCampaignDID(campaignid).then(
      data => {
        this.assigndid = data['data'];
        this.channeldataSource.data = data['data'];
        this.channelLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }

  async getratedata(campaignid) {
    await this.campaignservice.getratedate(campaignid).then(
      data => {
        this.consumptions = data['data'];
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  ngAfterViewInit() {
    // this.logdataSource.paginator = this.logpaginator;
    merge(this.contactpaginator.page)
      .pipe(
        tap(() => this.loadContactPage())
      )
      .subscribe();
    this.summarydataSource.paginator = this.summarypaginator;
    this.agentdataSource.paginator = this.agentpaginator;
    this.channeldataSource.paginator = this.channelpaginator;
    this.ratedataSource.paginator = this.ratepaginator;
    this.logdataSource2.paginator = this.contactpaginator2;


  }

  openrecording(id) {
    const dialogRef = this.dialog.open(RecordingCallComponent, {
      width: '640px', disableClose: true, data: id
    });
  }

  searchData() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.campaignservice.searchCampaignCallLog(data).then(
      data => {
        // this.logdataSource.data = data['data'];
        this.logLength = data['data'][0].total;
        // this.conLength = data['data'][0].total:;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  resetform() {
    this.searchform = this.fb.group({
      campaignid: [this.campaignid],
      startdate: [null],
      enddate: [null],
      status: [],
      agentid: [],
      callername: [],
      callerno: [],
      calltype: []
    });
    this.searchData();
    let data: any = Object.assign(this.searchform.value);
    // this.getContacts();
    this.logdataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }
  resetform2() {
    this.rsearchform = this.fb.group({
      campaignid: [this.campaignid],
      startdate: [null],
      enddate: [null],
    
      callername: [],
      callerno: [],
    });
    this.searchData2();
    // this.getContacts();
  }
  searchData2() {
    this.isLoading = true;
    let data: any = Object.assign(this.rsearchform.value);
    this.campaignservice.searchpendingdata(data).then(
      data => {
        
        this.logdataSource2.data = data['data'];
        this.logLength2 = data['data'].length;
        this.isLoading = false;
      
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
          this.getCampaignAgent(this.campaignid);
          var userid = localStorage.getItem('access_id');
         // this.assignAgentList(userid);
         this.unassignAgentList(userid)

        },
        err => {
          console.log('error');
        })
    }
  }
  deleteAssignDID(id) {
    if (confirm('Are you sure to delete this ?')) {
      this.campaignservice.deleteCampaignAssignDID(id).then(
        data => {
          this.getCampaignDID(this.campaignid);
          var userid = localStorage.getItem('access_id');
          this.assignedChannelList(userid);
        },
        err => {
          console.log('error');
        })
    }
  }

  channelsubmit() {
    let data: any = Object.assign(this.addConForm.value);
    this.campaignservice.saveCampaignDID(data).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.getCampaignDID(this.campaignid);
        var userid = localStorage.getItem('access_id');
        this.assignedChannelList(userid);
        this.addConForm = this.fb.group({
          userid: [userid],
          campaignid: [this.campaignid],
          channelForm: [null, [Validators.required]],
        });
      },
      err => {
        console.log('error');
      }
    );
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

  async assignAgentList(managerid) {
    let agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    if (agentrole == 'supervisor') {
      await this.campaignservice.getCampaigAssignSupervisorAgent(managerid).then(
        data => {
          this.agentlist = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    } else {
      await this.campaignservice.getCampaigAssignAgent(managerid).then(
        data => {
          this.agentlist = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  async unassignAgentList(managerid) {
    let agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    if (agentrole == "supervisor") {
      await this.campaignservice.getcampaigunassignsupervisoragent(managerid, this.campaignid).then(
        data => {
          this.agentlist = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    } else {
      await this.campaignservice.getcampaigunassignagent(managerid, this.campaignid).then(
        data => {
          this.agentlist = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    }
  }

  agentsubmit() {
    let data: any = Object.assign(this.addAgentForm.value);
    //console.log(data);
    this.campaignservice.saveCampaignAgent(data).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.getCampaignAgent(this.campaignid);
        var userid = localStorage.getItem('access_id');
        // this.assignAgentList(userid);
        this.unassignAgentList(userid)
        this.addAgentForm = this.fb.group({
          userid: [userid],
          campaignid: [this.campaignid],
          agentForm: [null, [Validators.required]],
        });
      },
      err => {
        console.log('error');
      }
    );
  }

  loadContactPage() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.logdataSource.loadContacts(data,
      this.sortcolumn, this.sortdirection,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize);

  }

  Filtercontact() {
    this.isLoading = true;

    let data: any = Object.assign(this.searchform.value);
    this.searchData();
    this.logdataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }

  sortData(event) {
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    this.sortcolumn = event['active'];
    this.sortdirection = event['direction'];
    this.logdataSource.loadContacts(data, event['active'], event['direction'], this.contactpaginator.pageIndex, this.contactpaginator.pageSize);
    //console.log(this.contactpaginator.pageIndex+'---'+this.contactpaginator.pageSize);
  }

  async createExcel() {
    this.isLoading = true
    let data: any = Object.assign(this.searchform.value);
    await this.campaignservice.searchCampaignCallLogexcel(data).then(
      data => {
        this.isLoading = false;
        var url = environment.apiUrl + '/' + data['data']
        window.open(url, '_blank');
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCampaignSegment(camid) {
    //console.log(camid);
    await this.campaignservice.getCampaignSegment(camid).then(
      data => {
        this.segments = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  ReGenerateCampaign() {
    let data: any = Object.assign(this.searchform.value);
    const dialogRef = this.dialog.open(ReGenerateCampaignComponent, {
      width: '50%', disableClose: true, data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.router.navigate(['/campaigns']);
      }
    });
  }
  savescheduledata() {
    let data: any = Object.assign(this.scheduleform.value);
    //console.log(this.scheduleid);
    if (this.scheduleid != '' && this.scheduleid != null) {
      this.campaignservice.updatescheduleform(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getcampaignscheduledata(this.campaignid);
        },
        err => {
          console.log('error');
        }
      );

    }
    else {
      this.campaignservice.savescheduleform(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getcampaignscheduledata(this.campaignid);
        },
        err => {
          console.log('error');
        }
      );
    }

  }
  getcampaignscheduledata(campaignid) {
    this.campaignservice.getcampaignscheduledata(campaignid).then(
      data => {
        if (data['data']) {
          this.scheduleid = data['data'].id;
          if (data['data'].Mon == '1' && data['data'].Tue == '1' && data['data'].Wed == '1' && data['data'].Thu == '1' &&
            data['data'].Fri == '1' && data['data'].Sat == '1' && data['data'].Sun == '1') {
            var all = true;
          } else {
            var all = false;
            if (data['data'].Mon == '1') {
              var mon = true;
            } else {
              var mon = false;
            }
            if (data['data'].Tue == '1') {
              var tue = true;
            } else {
              var tue = false;
            }
            if (data['data'].Wed == '1') {
              var wed = true;
            } else {
              var wed = false;
            }
            if (data['data'].Thu == '1') {
              var thu = true;
            } else {
              var thu = false;
            }
            if (data['data'].Fri == '1') {
              var fri = true;
            } else {
              var fri = false;
            }
            if (data['data'].Sat == '1') {
              var sat = true;
            } else {
              var sat = false;
            }
            if (data['data'].Sun == '1') {
              var sun = true;
            } else {
              var sun = false;
            }
          }
          this.scheduleform = this.fb.group({
            id: [data['data'].id],
            userid: [data['data'].account_id],
            all: [all],
            mon: [mon],
            tue: [tue],
            wed: [wed],
            thu: [thu],
            fri: [fri],
            sat: [sat],
            sun: [sun],
            starttime: [data['data'].OpenTime, [Validators.required]],
            endtime: [data['data'].CloseTime, [Validators.required]],
            campaignid: [data['data'].campaignid],
          });
        }

      },
      err => {
        console.log('error');
      }
    );

  }
}

@Component({
  selector: 'app-incoming-call',
  templateUrl: './recording-call.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class RecordingCallComponent implements OnInit {
  audioid = ''
  constructor(
    public dialogRef: MatDialogRef<RecordingCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      this.audioid = this.data;
      //console.log(this.audioid)
    }
  }

  cancelDialog(): void {
    this.dialog.closeAll();
  }
}

//
@Component({
  selector: 'app-incoming-call',
  templateUrl: './regenerate-campaign.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class ReGenerateCampaignComponent implements OnInit {
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
  userlimit = 0
  generatetype = 0
  campaignlist = []
  dialertype = 0;
  callratiomode = false;
  constructor(
    public dialogRef: MatDialogRef<ReGenerateCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private managerservice: ManagerService,
    private campaignservice: CampaignService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
    var userid = localStorage.getItem('access_id');
    this.addConForm = this.fb.group({
      generatetype: [0, [Validators.required]],
      campaignname: [null, [Validators.required]],
      customer_id: [userid],
      campaigntype: [null, [Validators.required]],
      agentgroup: [null],
      agents: [null],
      did: [null],
      campaignmethod: [null],
      ivr: [null],
      totalagent: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
      dialertype: [0],
      campaignchannel: [null],
      feedbackform: [null],
      retryunansweredcall: ['no'],
      retrytime: [null],
      maxretry: [3],
      callratio: []
    });
    var userid = localStorage.getItem('access_id');
    this.getManagerDetail(userid);
    this.getagentgroup();
    this.getdid();
    this.getivr();
    this.getCampaigns();
  }
  async getCampaigns() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getallvoipcampaign(userinfo).then(data => {
      if (data) {
        this.campaignlist = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async getagentgroup() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.gethuntgroup(userinfo).then(data => {
      if (data) {
        this.agent = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  async getdid() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getdidrouting(userinfo).then(data => {
      if (data) {
        this.did = (data['data']);
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

  cancelDialog(): void {
    this.dialog.closeAll();
  }
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }
  showcampaigntype(agcon: any) {
    this.typecam = agcon.value;
    if (agcon.value == '1') {
      this.showaudio = true;
      this.show = false;
      this.agentshow = true;
      this.ivvr = false
      this.dialershow = false;
    } else if (agcon.value == '0') {
      this.show = true;
      this.showaudio = false;
      this.dialershow = true;
      this.showivr(0);
      this.addConForm.get("campaignmethod").setValue(0);
    } else {
      this.showaudio = false;
      this.show = true;
      this.dialershow = false;

    }
  }

  showivr(agcon: any) {
    this.cam_method = agcon.value
    if (agcon.value == '1') {
      this.ivvr = true;
      this.agentshow = false
      this.dialershow = false;
    } else {
      this.ivvr = false;
      this.agentshow = true
      this.dialershow = true;
    }
  }

  change(event) {
    this.agentgroup = (event);
    this.getAgents()
  }
  change2(event) {
    this.agentlist = (event);
  }
  change5(event) {
    this.ivrlistdata = (event);
  }
  async getManagerDetail(userid) {
    await this.managerservice.getManagerDetail(userid).then(
      data => {
        //console.log(data['data']['services']);
        this.userlimit = data['data']['user_limit']
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

  getassignagents(value) {
    this.dialertype = value;
    if (value == "1") {
      this.callratiomode = true;
      this.addConForm.get('callratio').setValue('2');
    } else {
      this.callratiomode = false;
    }
    this.addConForm.get('agentgroup').setValue('');
    this.category = [];
    this.addConForm.get('agents').setValue('');
  }


  getAgents() {
    let userinfo = localStorage.getItem('access_id');
    if (this.dialertype == 0) {
      //console.log('progressive');
      this.http.get(environment.apiUrl + '/contacts/getgrouptoagent/' + userinfo + '/' + this.agentgroup).subscribe((data: any) => {
        var arrOfObjects = data['data'];
        const newArrOfObjects = arrOfObjects
          .map(
            obj =>
              Object.keys(obj).filter(e => obj[e] !== null)
                .reduce((o, e) => { o[e] = obj[e]; return o; }, {})
          )

        this.category = newArrOfObjects;
      });
    } else {
      //console.log('prodective');
      this.http.get(environment.apiUrl + '/contacts/getgrouptounassignagent/' + userinfo + '/' + this.agentgroup).subscribe((data: any) => {
        var arrOfObjects = data['data'];
        const newArrOfObjects = arrOfObjects
          .map(
            obj =>
              Object.keys(obj).filter(e => obj[e] !== null)
                .reduce((o, e) => { o[e] = obj[e]; return o; }, {})
          )

        this.category = newArrOfObjects;
      });
    }

  }

  selectgeneratetype(type: any) {
    this.generatetype = type.value
  }
  campaignsubmit() {
    let cdata: any = Object.assign(this.addConForm.value, this.data);
   // console.log(cdata)
    if (this.addConForm.invalid == true && cdata.generatetype == 1) {
      return;
    }
    else {
      this.campaignservice.ReGenerateCampaign(cdata).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
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
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./campaign-detail.component.css']

})
export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private erpservice: CampaignService,    private _snackBar: MatSnackBar,

    ) { }

  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      this.id = this.data.id


    }

  }
  async deleteleadsrestore(id) {

    await this.erpservice.delete_campagin_data(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        
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