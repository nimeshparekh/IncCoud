import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sms-balance-report',
  templateUrl: './sms-balance-report.component.html',
  styleUrls: ['./sms-balance-report.component.css']
})
export class SmsBalanceReportComponent implements OnInit {

  showtotal :any;
  used = 0;

  constructor(
    private reportservice: ReportService,
    private userservice: UserService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
    var userid = localStorage.getItem('access_id'); 
    this.reportservice.getUserSMSBalance(userid).then(
      data => {       
        this.showtotal = (data['data'][0]);
        //this.used = Math.floor((this.showtotal.incoming+this.showtotal.outgoing+this.showtotal.dialer)/60);
        //console.log(data['data'][0]);
      },
      err => {
        console.log('error');
      }
    );
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
