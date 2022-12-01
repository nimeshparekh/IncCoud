import { Component, OnInit, VERSION, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CampaignService } from '../../campaign.service';
import { ManagerService } from '../../manager.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-voipcampaign',
  templateUrl: './create-voipcampaign.component.html',
  styleUrls: ['./create-voipcampaign.component.css']
})
export class CreateVoipcampaignComponent implements OnInit {
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
  agentgroup;
  agentlist;
  contactlist;
  didlist;
  cam_method;
  typecam;
  ivrlistdata;
  managerdata;
  delagentid = '';
  delagentname = '';
  manager =[];
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


  constructor(
    public dialogRef: MatDialogRef<CreateVoipcampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
  ) { }

  ngOnInit(): void {
    this.getagentgroup();
    this.getsegments();
    this.getdid();
    this.getivr();
    this.getmanger();
    var userid = localStorage.getItem('access_id');
    this.getManagerDetail(userid);


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
      dialertype:['0'],
      campaignchannel:[null],
      pulse:[null],
      pulserate:[null],
      manager:[null]
     
    });
  }


  campaignsubmit() {
    if (this.addConForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.addConForm.value);
      console.log(data);
      
      this.submitted = true;
      this.campaignservice.savevoipCampaign(data).then(
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

  openDialog(): void {
    console.log(this.wasFormChanged);
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
    await this.campaignservice.getSegmentwithTotalContact(userid).then(data => {
      if (data) {
        this.csegments = (data['data']);
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

  async getmanger() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getmanager(userinfo).then(data => {
      if (data) {
        this.manager = (data['data']);
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
    this.click1 = event;
    this.getsegments();
  }

  showaudiofile(agcon: any) {
    this.typecam = agcon.value;
    if (agcon.value == '1') {
      this.showaudio = true;
      this.show = false;
      this.agentshow = true;
      this.ivvr = false
    } else if (agcon.value == '0') {
      this.show = true;
      this.showaudio = false;

    } else {
      this.showaudio = false;
      this.show = true;

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
change6(event){
  this.managerdata = (event);
}
  async getManagerDetail(userid){
    await this.managerservice.getManagerDetail(userid).then(
      data => {
        console.log(data['data']['services']);
        if (data['data']['services'].length > 1) {
        //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for(var i=0;i<data['data']['services'].length;i++ ){            
            if(serviceArr[i]=='6'){
              this.progressivedialer = true;
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


}
