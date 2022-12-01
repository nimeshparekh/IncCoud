import { Component, OnInit, VERSION, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CampaignService } from '../../campaign.service';
import { ManagerService } from '../../manager.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { CrudService } from '../../crud.service';


@Component({
  selector: 'app-create-voip-campaign',
  templateUrl: './create-voip-campaign.component.html',
  styleUrls: ['./create-voip-campaign.component.css']
})
export class CreateVoipCampaignComponent implements OnInit {
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
  showdid = false;
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
  dialertype=0;
  callratiomode=false;
  isDisabled=false;
  isLoading=false;
  segmentotalcontacts=0;
  constructor(
    public dialogRef: MatDialogRef<CreateVoipCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
    private userservice: UserService,
    private crudservice:CrudService
  ) { }

  public ngOnInit(): void {
    this.getagentgroup();
    this.getsegments();
    this.getdid();
    this.getivr();
    var userid = localStorage.getItem('access_id');
    this.getManagerDetail(userid);
    this.getFormsData()

    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    

    this.addConForm = this.fb.group({
      startdate: [null,[Validators.required]],
      campaignname: [null,[Validators.required]],
      customer_id: [userid],
      campaigntype: [null,[Validators.required]],
      agentgroup: [null],
      agents: [null],
      segments: [null,[Validators.required]],
      did: [null],
      campaignmethod: [null],
      ivr: [null],
      totalagent:[0],
      dialertype:['0'],
      campaignchannel:[null],
      feedbackform:[null],
      retryunansweredcall:['no'],
      retrytime:[null],
      maxretry:[3],
      callratio:[],
    });
  }

  async getFormsData() {
    await this.userservice.getFormsData().then(
      data => {
       this.feedbackforms = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  campaignsubmit() {
    let data: any = Object.assign(this.addConForm.value);
    //this.isDisabled=true;
    this.isLoading=true;
    if (this.addConForm.invalid == true) {
      this.isDisabled=false;
      this.isLoading=false;
      this.dialogRef.close({ event: 'Add' });
    
      return;
    }
    else {
      this.submitted = true;
      //console.log(data.campaignmethod)
      data.agentrole=localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
      console.log(data);
      if(data.campaigntype==0 && data.campaignmethod==null){
        this._snackBar.open('Please select campaign method', '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.isDisabled=false;
        // this.isLoading=false;
        return
      }else{
        this.campaignservice.saveCampaign(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
            this.isDisabled=false;
            this.isLoading=false;
          },
          err => {
            console.log('error');
          }
        );
      }
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

  getContactCategory() {
    let userinfo = localStorage.getItem('access_id');
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'';
    //console.log(this.dialertype);
    if(agentrole=="supervisor"){
      if(this.dialertype==0){
        //console.log('progressive');
        this.http.get(environment.apiUrl + '/contacts/getgrouptosupervisoragent/' + userinfo + '/' + this.agentgroup).subscribe((data: any) => {
          var arrOfObjects = data['data'];
          const newArrOfObjects = arrOfObjects
            .map(
              obj =>
                Object.keys(obj).filter(e => obj[e] !== null)
                  .reduce((o, e) => { o[e] = obj[e]; return o; }, {})
            )
    
          this.category = newArrOfObjects;
        });
      }else{
        //console.log('prodective');
        this.http.get(environment.apiUrl + '/contacts/getgrouptounassignsupervisoragent/' + userinfo + '/' + this.agentgroup).subscribe((data: any) => {
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
    }else{
      // if(this.dialertype==0){
      //   //console.log('progressive');
      //   this.http.get(environment.apiUrl + '/contacts/getgrouptoagent/' + userinfo + '/' + this.agentgroup).subscribe((data: any) => {
      //     var arrOfObjects = data['data'];
      //     const newArrOfObjects = arrOfObjects
      //       .map(
      //         obj =>
      //           Object.keys(obj).filter(e => obj[e] !== null)
      //             .reduce((o, e) => { o[e] = obj[e]; return o; }, {})
      //       )
    
      //     this.category = newArrOfObjects;
      //   });
      // }else{
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
     // }
    }
    
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

  async getsegments() {
    let userid = localStorage.getItem('access_id');
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
      await this.campaignservice.getSupervisorSegmentwithTotalContact(userid).then(data => {
        if (data) {
          this.csegments = (data['data']);
        }
      },
        err => {
          console.log('error');
        })
    }else{
      await this.campaignservice.getSegmentwithTotalContact(userid).then(data => {
        if (data) {
          this.csegments = (data['data']);
        }
      },
        err => {
          console.log('error');
        })
    }
    
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


  chang(event) {
    var segmentArr = event;
    this.click1 = event;
    let data: any = Object.assign(this.addConForm.value);
    //console.log(data.segments);
    //this.getsegments();
    //$$("#mylist option[selected]")[0].selected = false;
    //console.log(this.addConForm.get("segment").value());
    var segmentArrLength = event.length
     this.campaignservice.getSegmentTotalContact(segmentArr).then(data => {
      if (data['data']) {
        //console.log(data['segmentarr']);
        this.segmentotalcontacts = data['data'];
        this._snackBar.open(data['data'], '', {
          duration: 3000, verticalPosition: 'top'
        });
        this.addConForm.get("segments").setValue(data['segmentarr']);
      }
    },
      err => {
        console.log('error');
      })

  }

  showaudiofile(agcon: any) {
    this.typecam = agcon.value;
    if (agcon.value == '1') {
      this.showaudio = true;
      this.showdid = false;
      this.agentshow = true;
      this.ivvr = false;
      this.dialershow=false;
      this.addConForm.get("campaignmethod").setValue(null);
    } else if (agcon.value == '0') {
      this.showdid = true;
      this.showaudio = false;
      this.dialershow=true;
     this.addConForm.get("campaignmethod").setValue(0);
     this.showivr(0);
    } else {
      this.showaudio = false;
      //this.show = true;
      this.dialershow=false;
    }
  }

  showivr(agcon: any) {
    this.cam_method = agcon.value
    if (agcon.value == '1') {
      this.ivvr = true;
      this.agentshow = false
      this.dialershow = false;
     
    }else if (agcon.value == '2') {
      this.ivvr = false;
      this.agentshow = true
      this.dialershow = false;
     
    } else {
      this.ivvr = false;
      this.agentshow = true
      this.dialershow = true;
      
    }
  }

  change(event) {
    this.agentgroup = (event);
    this.getContactCategory();
  }

  change2(event) {
    this.agentlist = (event);
  }

  change4(event) {
    this.didlist = (event);
  }

  change5(event) {
    this.ivrlistdata = (event);
  }
  getassignagents(value){
    this.dialertype=value;
    if(value=="1"){
      this.callratiomode=true;
      this.addConForm.get('callratio').setValue('2');
    }else{
      this.callratiomode=false;
    }
    this.addConForm.get('agentgroup').setValue('');
    this.category=[];
    this.addConForm.get('agents').setValue('');
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
        //console.log('error');
      }
    );
  }
}
