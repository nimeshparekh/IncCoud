import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { CampaignService } from '../../campaign.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-ivr-input-report',
  templateUrl: './ivr-input-report.component.html',
  styleUrls: ['./ivr-input-report.component.css']
})
export class IvrInputReportComponent implements OnInit {
isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'DID','IvrName','extension','campaigname','AgentName', 'CallStartTime','CallerName', 'CallerNumber', 'CallTalkTime', 'CallStatus', 'CallType','recording'];//'feedback'
  Length = 0; 
  isLoading = false;
  public searchform: FormGroup;
  ivrlist=[];
  ivrextension=[];
  campaignArr=[];
  campaignmode=false;
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(private reportservice: ReportService,
    private fb: FormBuilder,
    private userservice: UserService, 
    public dialog: MatDialog,     
    private router: Router,
    private campaignservice:CampaignService) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    var userid = localStorage.getItem('access_id'); 
    let date = new Date();
    this.searchform = this.fb.group({
      userid:[userid],
      ivrid:[null],
      extensionid:[null],
      startdate:[date],
      enddate:[date],
      campaignid:[''],
    }); 
    this.getIvr();
   // this.searchData();
    
  }

  async searchData(){
    this. isLoading = true;
    this.isDisabled=true;
    let data: any = Object.assign(this.searchform.value);
    this.reportservice.getManagerIVRInputs(data).then(
      data => {
        //this.datalist = data['data'];
        
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
        this.isDisabled=false;

        //this.totalcancel = (data['data'][0]['cnt']);
      },
      err => {
        console.log('error');
      }
    );
  }

  async getIvr() {
    let userinfo = localStorage.getItem('access_id');
    await this.userservice.getIVR(userinfo).then(data => {
      if (data) {        
        this.ivrlist = data['data'];
        
      }
    },
      err => {
        console.log('error');
      })
  }

  async getIVRExtension(ivrid) {
     //ivrid=80;
    await this.reportservice.getIVRExtension(ivrid).then(data => {
      if (data) {        
        this.ivrextension = data['data'];
       // this.campaignmode=true;
         // this.getCampaigns();
      }
    },
      err => {
        console.log('error');
      })
      await this.reportservice.getIVRCampaign(ivrid).then(data => {
        if (data) {        
          this.campaignArr = data['data'];
          this.campaignmode=true;
        }
      },
        err => {
          console.log('error');
        })
   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
  openrecording(id){
    const dialogRef = this.dialog.open(RecordingCallComponent, {
      width: '640px', disableClose: true, data: id
    });
  }
  

}
@Component({
  selector: 'app-ivr-input-report',
  templateUrl: './recording-call.component.html',
  styleUrls: ['./ivr-input-report.component.css']
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