import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { CampaignService } from '../../campaign.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-common-agent-performance-report',
  templateUrl: './common-agent-performance-report.component.html',
  styleUrls: ['./common-agent-performance-report.component.css']
})
export class CommonAgentPerformanceReportComponent implements OnInit {
  agents=[];
  isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'report_date','agent_name','total_calls','answered_calls','dialer_calls', 'incoming_calls','outgoing_calls', 'total_duration', 'dialer_duration', 'incoming_duration','outgoing_duration','total_connected_calls','dialer_connected_calls','incoming_connected_calls','outgoing_connected_calls','total_connected_duration','average_talktime','total_leads','converted_leads','opportunity_ammount','total_calls_lead','total_sms_lead','total_email_lead','total_whatsapp_lead'];//'feedback'
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
      agentid:[],
      startdate:[date],
      // enddate:[date],
    }); 
   // this.searchData();
    this.getagent();
  }
async getagent(){
  var userid = localStorage.getItem('access_id'); 

  await this.reportservice.getAgents(userid).then(
    data => {
      this.agents = data['data'];
    },
    err => {
      console.log('error');
    }
  );
}
  async searchData(){
    this. isLoading = true;
    this.isDisabled=true;
    let data: any = Object.assign(this.searchform.value);
    this.reportservice.getcommonagentperformnace(data).then(
      data => {
  console.log(data['data']);
          
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
  downloadpdf(){
    const dashboard = document.getElementById('dashboard');
    const dashboardHeight = dashboard.clientHeight;
    const dashboardWidth = dashboard.clientWidth;
    const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

    domtoimage.toPng(dashboard, options).then((imgData) => {
      const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('GeneratePDF.pdf');
   console.log("hello");
   
    });
  }

}
