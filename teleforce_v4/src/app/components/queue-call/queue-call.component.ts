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
  selector: 'app-queue-call',
  templateUrl: './queue-call.component.html',
  styleUrls: ['./queue-call.component.css']
})
export class QueueCallComponent implements OnInit {
  subscription: Subscription;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'did','callerid','name', 'number','agentname','calltime',  'duration', 'status', 'calltype'];
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
  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    this.userservice.searchQueueCall(data).then(
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
  async hangup(){
    if(confirm('Are you sure to hungup call?')){
      await this.userservice.hangupqueuecall().then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.searchData();  
        },
        err => {
          console.log('error');
        }
      );
    }

  }
}
