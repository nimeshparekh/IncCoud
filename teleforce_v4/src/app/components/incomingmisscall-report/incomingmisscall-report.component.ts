import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { CampaignService } from '../../campaign.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";
@Component({
  selector: 'app-incomingmisscall-report',
  templateUrl: './incomingmisscall-report.component.html',
  styleUrls: ['./incomingmisscall-report.component.css']
})
export class IncomingmisscallReportComponent implements OnInit {

  isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'DID','AgentName','AgentNumber','Call_Time','Caller_Name', 'Caller_Number','TalkTime', 'Call_Type', 'AgentTalkTime', 'DisconnectedBy', 'callstatus','AgentStatus'];//'feedback'
  Length = 0; 
  isLoading = false;
  public searchform: FormGroup;
 
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(private reportservice: ReportService,
    private fb: FormBuilder,
    private userservice: UserService, 
         
    private router: Router,
    private campaignservice:CampaignService) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    var userid = localStorage.getItem('access_id'); 
    let date = new Date();
    this.searchform = this.fb.group({
      userid:[userid],
    
      startdate:[date],
      enddate:[date],
    }); 
  
   // this.searchData();
    
  }

  async searchData(){
    this. isLoading = true;
    this.isDisabled=true;
    let data: any = Object.assign(this.searchform.value);
    this.reportservice.incoming_misscall_reports(data).then(
      data => {
        //this.datalist = data['data'];
        
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
        this.isDisabled=false;      },
      err => {
        console.log('error');
      }
    );
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
 

}
