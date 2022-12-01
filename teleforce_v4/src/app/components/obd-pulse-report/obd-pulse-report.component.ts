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
  selector: 'app-obd-pulse-report',
  templateUrl: './obd-pulse-report.component.html',
  styleUrls: ['./obd-pulse-report.component.css']
})
export class ObdPulseReportComponent implements OnInit {

  isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'pulses','Pressed1','Pressed2','Pressed3','Pressed4', 'Pressed5','Pressed6', 'Pressed7', 'Pressed8', 'Pressed9'];//'feedback'
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
    
      startdate:[date],
      enddate:[date],
    }); 
   // this.searchData();
    
  }

  async searchData(){
    this. isLoading = true;
    this.isDisabled=true;
    let data: any = Object.assign(this.searchform.value);
    this.reportservice.getobdpulsereport(data).then(
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
