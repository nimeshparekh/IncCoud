import { Component, OnInit, ViewChild, Inject,ElementRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditDidConfigComponent } from '../edit-did-config/edit-did-config.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-live-call',
  templateUrl: './live-call.component.html',
  styleUrls: ['./live-call.component.css']
})
export class LiveCallComponent implements OnInit {
  subscription: Subscription;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'did', 'agentname', 'agentno','calltime', 'number', 'duration', 'status', 'calltype','recording'];
  Length = 0;
  isLoading = true
  public searchform: FormGroup;
  callstatus=[];
  didarr=[];
  agents=[];
  callername=[];
  calltype=[];
  kyc;
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(
    private userservice: UserService,
    public dialog: MatDialog,    
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    //this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    //this.getCallLog(userid) /* show all call log*/
    //this.getCallStatus(userid);
    //this.getCallDID(userid);
    //this.getAgents(userid);
    //this.getCallType(userid);
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [currentdate],
      enddate: [currentdate],
      status:[],
      did:[],
      agentid:[],
      agentno:[],
      callerno:[],
      calltype:[],
    });
    this.searchData();/* show current date call log*/
    // const source = interval(10000);
    // this.subscription = source.subscribe(val => this.searchData());
    // setTimeout(
    //   function(){ 
    //   location.reload(); 
    //   }, 10000);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  openrecording(id){
    const dialogRef = this.dialog.open(RecordingCallComponent, {
      width: '640px', disableClose: true, data: id
    });
  }
  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    this.userservice.searchLiveCall(data).then(
      data => {
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  async getCallStatus(userid) {
    await this.userservice.getCallStatus(userid).then(
      data => {
        this.callstatus = data['data'];       
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCallDID(userid) {
    await this.userservice.getCallDID(userid).then(
      data => {
        this.didarr = data['data'];       
      },
      err => {
        console.log('error');
      }
    );
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

  async getCallType(userid) {
    await this.userservice.getCallType(userid).then(
      data => {
        this.calltype = data['data'];       
      },
      err => {
        console.log('error');
      }
    );
  }

  resetform(){
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [null],
      enddate: [null],
      status:[],
      did:[],
      agentid:[],
      agentno:[],
      callerno:[],
      calltype:[]
    });
    this.searchData();
  }

  //Call Monitor
  callmonitor(uniqueid,type){
    var voipstatus = localStorage.getItem('voipstatus')
    if (voipstatus == 'true') {
      var userid = localStorage.getItem('access_id');
      if(confirm("Are you sure to Monitor Call?")) {
        this.userservice.callmonitor({uniqueid:uniqueid,userid:userid,type:type}).then(
          data => {
            console.log(data['msg']);
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
          },
          err => {
            console.log('error');
          }
        );
      }
    }else{
      const dialogRef = this.dialog.open(MonitorCallComponent, {
        width: '640px', disableClose: true, data: {uniqueid:uniqueid,type:type}
      });  
    }
    // var userid = localStorage.getItem('access_id');
    // if(confirm("Are you sure to Monitor Call?")) {
    //   this.userservice.callmonitor({uniqueid:uniqueid,userid:userid,type:type}).then(
    //     data => {
    //       console.log(data['msg']);
    //       this._snackBar.open(data['msg'], '', {
    //         duration: 2000, verticalPosition: 'top'
    //       });
    //     },
    //     err => {
    //       console.log('error');
    //     }
    //   );
    // }
  }

  async checkkyc(id){
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
        }else{
          this.router.navigate(['/kyc-document-upload']);
        }        
      },
      err => {
        console.log('error');
      }
    );
  }
  calldisconnect(callid){
    console.log(callid)
    if(confirm("Are you sure to Hangup Call?")) {
      this.userservice.calldisconnect(callid).then(
        data => {
          console.log(data['msg']);
          this._snackBar.open(data['msg'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.searchData()
        },
        err => {
          console.log('error');
        }
      );
    }
  }
}

// Recording Pop Up
@Component({
  selector: 'app-live-call',
  templateUrl: './recording-call.component.html',
  styleUrls: ['./live-call.component.css']
})
export class RecordingCallComponent implements OnInit {
  audioid = ''
  constructor(
    public dialogRef: MatDialogRef<RecordingCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private adminservice:UserService,
  ) { }

  ngOnInit(): void {
    if(this.data!='' && this.data!=null){
      this.audioid = this.data
      console.log(this.audioid)

    }
  }
  cancelDialog(): void {
      this.dialog.closeAll();
  }
 
}

// Call Monitor Pop Up
@Component({
  selector: 'app-live-call',
  templateUrl: './monitor-call.component.html',
  styleUrls: ['./live-call.component.css']
})
export class MonitorCallComponent implements OnInit {
  type = ''
  uniqueid = ''
  public addForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<RecordingCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private userservice:UserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }
  @ViewChild('monitormobile') monitormobile: ElementRef;
  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    if(this.data!='' && this.data!=null){
      this.type = this.data.type
      this.uniqueid = this.data.uniqueid
      console.log(this.uniqueid)
      this.addForm = this.fb.group({
        mobile: [null, [Validators.required]],
        uniqueid: [this.uniqueid],
        type : this.type,
        userid:[userid]
      });
  
    }
  }
  callmonitorsubmit(){
    var callernumber =this.monitormobile.nativeElement.value
    //console.log(callernumber);
    this.addForm.get("mobile").setValue(callernumber);
    if (this.addForm.invalid == true) {
       //console.log(this.addForm.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); 
      console.log(data);
      this.userservice.callmonitor(data).then(
           data => {
             console.log(data['msg']);
             this._snackBar.open(data['msg'], '', {
               duration: 2000, verticalPosition: 'top'
             });
           },
          err => {
            console.log('error');
          }
      );
    }
  }
  
  cancelDialog(): void {
      this.dialog.closeAll();
  }
 
}