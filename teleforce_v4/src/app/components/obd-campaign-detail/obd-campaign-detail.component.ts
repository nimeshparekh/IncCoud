import { Component, OnInit , Inject,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CampaignService } from "../../campaign.service";
import { ManagerService } from "../../manager.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ContactDataSource} from "./campaign.datasource";
import {merge, fromEvent} from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { UserService } from '../../user.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-obd-campaign-detail',
  templateUrl: './obd-campaign-detail.component.html',
  styleUrls: ['./obd-campaign-detail.component.css']
})
export class ObdCampaignDetailComponent implements OnInit {

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
  public logdataSource: ContactDataSource;

  displayedLogColumns: string[] = ['id','CallStartTime', 'CallerName', 'CallerNumber', 'CallStatus',  'CallDuration', 'CallTalkTime','DisconnectedBy', 'AgentName','AgentStatus', 'CallType', 'recording'];
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
  agents = [];
  callstatus = [];
  calltype = [];
  channellist = [];
  agentlist = [];
  public addConForm: FormGroup;
  public addAgentForm: FormGroup;
  sortcolumn='CallStartTime';
  sortdirection='DESC';
  extensions=[];
  campaigndetail;
  assigndid:[];
  ivrname='';
  segments=[];
  rate = [];
  consumptions = []
  disposition=[]
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private campaignservice: CampaignService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userservice: UserService,
    private router: Router
  ) { }

  @ViewChild('summarypaginator') summarypaginator: MatPaginator;
  @ViewChild('logpaginator') logpaginator: MatPaginator;
  @ViewChild('agentpaginator') agentpaginator: MatPaginator;
  @ViewChild('channelpaginator') channelpaginator: MatPaginator;
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  @ViewChild('ratepaginator') ratepaginator: MatPaginator;

  ngOnInit(): void {
    this.summarydataSource = new MatTableDataSource();
    this.ratedataSource = new MatTableDataSource();

    // this.logdataSource = new MatTableDataSource();
    this.logdataSource = new ContactDataSource(this.campaignservice);
    var currentdate = new Date();
    this.logdataSource.loadContacts({campaignid: [this.campaignid],startdate: [currentdate],enddate: [currentdate]},this.sortcolumn,this.sortdirection, 0, 50);

    var userid = localStorage.getItem('access_id');
   
    this.agentdataSource = new MatTableDataSource();
    this.channeldataSource = new MatTableDataSource();
    this.getCampaignDID(this.campaignid);
    this.assignedChannelList(userid)
    this.getCampaignName(this.campaignid);
    //this.getCampaignCallLog(this.campaignid);
    this.getCampaignCallSummary(this.campaignid);
    this.getCampaignAgent(this.campaignid);
    this.getCampaignSegment(this.campaignid);
    //console.log("campaignid",this.campaignid);
    this.getratedata(this.campaignid)
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
      extension:[],
      disposition:[]
    });
    this.searchData();/* show current date call log*/
    //assign channel list 
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

  async getCallExtension(userid) {
    await this.userservice.getExtension(userid).then(
      data => {
        //console.log(data['data ']);
        this.extensions = data['data'];       
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCampaignName(campaignid) {
    await this.campaignservice.getOBDCampaignDetail(campaignid).then(
      data => {
       // console.log("data");
        // console.log(JSON.stringify(data['data'][0]));

        // console.log(data['data'][0]['cam_name']);

        this.campaigndetail = data['data'][0];
        this.campaignname = data['data'][0]['cam_name'];
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
        if(data['data'][0]['cam_ivrid']!=null){
          this.ivrcampaign = true
          this.getCampaignIVR(data['data'][0]['cam_ivrid']);
          this.getratedata(this.campaignid);
        }        
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
    await this.campaignservice.getOBDCampaignCallSummary(campaignid).then(
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
    await this.campaignservice.getOBDCampaignAgent(campaignid).then(
      data => {
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      })
  }
  
  
  

  async getratedata(campaignid) {
    await this.campaignservice.getobdcampaignratedate(campaignid).then(
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

  }

  openrecording(id) {
    const dialogRef = this.dialog.open(RecordingCallComponent, {
      width: '640px', disableClose: true, data: id
    });
  }

  ReGenerateCampaign() {
    let data: any = Object.assign(this.searchform.value);
    const dialogRef = this.dialog.open(ReGenerateOBDCampaignComponent, {
      width: '50%', disableClose: true, data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.router.navigate(['/obd-campaigns']);
      }
    });
  }

  searchData() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.campaignservice.OBDCampaignCallLogLength(data).then(
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
      calltype: [],
      disposition:[]
    });
    this.searchData();
    let data: any = Object.assign(this.searchform.value);
    // this.getContacts();
    this.logdataSource.loadContacts(data,this.sortcolumn,this.sortdirection,0, 50);
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
  loadContactPage(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.logdataSource.loadContacts(data,
      this.sortcolumn,this.sortdirection,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize);
      
  }

  Filtercontact(){
    this.isLoading = true;

    let data: any = Object.assign(this.searchform.value);
    this.searchData();
    this.logdataSource.loadContacts(data,this.sortcolumn,this.sortdirection,0, 50);
  }

  sortData(event) {
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    this.sortcolumn=event['active'];
    this.sortdirection=event['direction'];
    this.logdataSource.loadContacts(data,event['active'],event['direction'], this.contactpaginator.pageIndex, this.contactpaginator.pageSize);
    //console.log(this.contactpaginator.pageIndex+'---'+this.contactpaginator.pageSize);
  }

  async createExcel(){
    this.isLoading = true
    let data: any = Object.assign(this.searchform.value);
    await this.campaignservice.searchOBDCampaignCallLogexcel(data).then(
      data => {
        this.isLoading = false;
       var url = environment.apiUrl+'/'+data['data']
       window.open(url, '_blank');
      },
      err => {
        console.log('error');
      }
    );
  }
  loaddata() {
    this.getCampaignSegment(this.campaignid)
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
  

}

@Component({
  selector: 'app-incoming-call',
  templateUrl: './recording-call.component.html',
  styleUrls: ['./obd-campaign-detail.component.css']
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

@Component({
  selector: 'app-incoming-call',
  templateUrl: './regenerate-campaign.component.html',
  styleUrls: ['./obd-campaign-detail.component.css']
})
export class ReGenerateOBDCampaignComponent implements OnInit {
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
  progressivedialer=false;
  isliveagent = false;
  isobd = false;
  userlimit = 0
  generatetype = 0
  campaignlist = []
  constructor(
    public dialogRef: MatDialogRef<ReGenerateOBDCampaignComponent>,
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
      generatetype: [0,[Validators.required]],
      campaignname: [null,[Validators.required]],
      customer_id: [userid],
      campaigntype: [0],
      agentgroup: [null],
      agents: [null],
      did: [null],
      campaignmethod: [1],
      ivr: [null],
      totalagent:[0],
      dialertype:[0],
      campaignchannel:[null],
      feedbackform:[null],
      retryunansweredcall:['no'],
      retrytime:[null],
      maxretry:[3],
    });
    var userid = localStorage.getItem('access_id');
    this.getManagerDetail(userid);
    this.getivr();
    this.getCampaigns();
    this.getdid()
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

  async getCampaigns() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getAllOBDcampaign(userinfo).then(data => {
      if (data) {
        this.campaignlist = data['data'];
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
  async getManagerDetail(userid){
    await this.managerservice.getManagerDetail(userid).then(
      data => {
        //console.log(data['data']['services']);
        this.userlimit = data['data']['user_limit']
        if (data['data']['services'].length > 1) {
        //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for(var i=0;i<data['data']['services'].length;i++ ){            
            if(serviceArr[i]=='6'){
              this.progressivedialer = true;
            }

            if(serviceArr[i]=='9'){
              this.isobd = true;
            }
          }
        }else{
          var service = data['data']['services'];
          if(service=='6'){
            this.progressivedialer = true;
          }
        }  
      },
      err => {
        console.log('error');
      }
    );
  }

  selectgeneratetype(type: any){
    this.generatetype = type.value
  }
  campaignsubmit(){
    let cdata: any = Object.assign(this.addConForm.value,this.data);
    //console.log(cdata)
    if (this.addConForm.invalid == true && cdata.generatetype==1) {
      return;
    }
    else {
      this.campaignservice.ReGenerateOBDCampaign(cdata).then(
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
