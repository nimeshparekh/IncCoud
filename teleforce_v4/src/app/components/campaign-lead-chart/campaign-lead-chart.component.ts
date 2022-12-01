import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ReportService } from '../../report.service';
import { CampaignService } from '../../campaign.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-campaign-lead-chart',
  templateUrl: './campaign-lead-chart.component.html',
  styleUrls: ['./campaign-lead-chart.component.css']
})
export class CampaignLeadChartComponent implements OnInit {

  camid = this.route.snapshot.paramMap.get('camid');
  startdate = this.route.snapshot.paramMap.get('sdate');
  enddate = this.route.snapshot.paramMap.get('edate');
  UserData = { role: '' }
  public pieChartLabels = ['INTERESTED', 'NOT INTERESTED', 'SCHEDULE'];
  public pieChartData = [0,0,0];
  public pieChartType = 'pie';
  todaycall = 0;
  camname='';

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public reportservice: ReportService,
    public campaignservice : CampaignService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.getRole(localStorage.getItem('access_id')).then(
      data => {
        this.UserData.role = data['data'][0]['account_type'];
      });
    this.campaignAnswerCallLead(localStorage.getItem('access_id'), this.camid);
    this.getCampaignDetail(this.camid);
  }
  async getCampaignDetail(camid) {
    //console.log(id); 
    await this.campaignservice.getCampaignDetail(camid).then(
      data => {
       this.camname = data['data'][0].cam_name;
      },
      err => {
        console.log('error');
      }
    );
  }
  
  async campaignAnswerCallLead(id,camid) {
    //console.log(id);   
    var data = {userid:id,camid:camid,startdate:this.startdate,enddate:this.enddate};
    await this.reportservice.campaignAnswerCallLead(data).then(
      data => {
         this.todaycall = (data['data'][0].interestedcnt)+(data['data'][0].notinterestedcnt)+(data['data'][0].schedulecnt);
         this.pieChartLabels = ['INTERESTED('+data['data'][0].interestedcnt+')','NOT INTERESTED('+data['data'][0].notinterestedcnt+')','SCHEDULE('+data['data'][0].schedulecnt+')'];
         this.pieChartData = [data['data'][0].interestedcnt,data['data'][0].notinterestedcnt,data['data'][0].schedulecnt];
      },
      err => {
        console.log('error');
      }
    );
  }
  chartClicked(event){
    if(event['active'][0]._index==0){
      this.router.navigate(['/campaign-agent-chart/0/'+this.camid+'/'+this.startdate+'/'+this.enddate]); //0:interested
    }else if(event['active'][0]._index==1){
      this.router.navigate(['/campaign-agent-chart/1/'+this.camid+'/'+this.startdate+'/'+this.enddate]); //1:not interested
    }else if(event['active'][0]._index==2){
      this.router.navigate(['/campaign-agent-chart/2/'+this.camid+'/'+this.startdate+'/'+this.enddate]); //2:schedule
    /*}else if(event['active'][0]._index==3){
      this.router.navigate(['/lead-agent-chart/3/'+this.date]); //3:contacted
    }else if(event['active'][0]._index==4){
      this.router.navigate(['/lead-agent-chart/4']); //4:not contacted
    }else if(event['active'][0]._index==5){
      this.router.navigate(['/lead-agent-chart/5']); //5:converted
    }else if(event['active'][0]._index==6){
      this.router.navigate(['/lead-agent-chart/6']); //6:closed*/
    }

  }



}
