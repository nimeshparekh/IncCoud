import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ReportService } from '../../report.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-answer-lead-chart',
  templateUrl: './answer-lead-chart.component.html',
  styleUrls: ['./answer-lead-chart.component.css']
})
export class AnswerLeadChartComponent implements OnInit {

  startdate = this.route.snapshot.paramMap.get('sdate');
  enddate = this.route.snapshot.paramMap.get('edate');
  UserData = { role: '' }
  public pieChartLabels = ['INTERESTED', 'NOT INTERESTED', 'SCHEDULE'];
  public pieChartData = [0,0,0];
  public pieChartType = 'pie';  
  todaycall=0;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public reportservice: ReportService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.getRole(localStorage.getItem('access_id')).then(
      data => {
        this.UserData.role = data['data'][0]['account_type'];        
      });
      this.todayAnswerCallLead(localStorage.getItem('access_id'),this.startdate,this.enddate);
  }
  async todayAnswerCallLead(id,sdate,edate) {
    //console.log(id);   
    await this.reportservice.todayAnswerCallLead(id,sdate,edate).then(
      data => {
        console.log(data['data']);
        if(data['data'][0].interestedcnt>0 || data['data'][0].notinterestedcnt>0 || data['data'][0].schedulecnt>0){
          this.todaycall = (data['data'][0].interestedcnt)+(data['data'][0].notinterestedcnt)+(data['data'][0].schedulecnt);
          //this.pieChartLabels = ['INTERESTED('+data['data'][0].interestedcnt+')','NOT INTERESTED('+data['data'][0].notinterestedcnt+')','SCHEDULE('+data['data'][0].schedulecnt+')','CONTACTED('+data['data'][0].contactedcnt+')','NOT CONTACTED('+data['data'][0].notcontactedcnt+')','CONVERTED('+data['data'][0].convertedcnt+')','CLOSED('+data['data'][0].closedcnt+')'];
          this.pieChartLabels = ['INTERESTED('+data['data'][0].interestedcnt+')','NOT INTERESTED('+data['data'][0].notinterestedcnt+')','SCHEDULE('+data['data'][0].schedulecnt+')'];
          this.pieChartData = [data['data'][0].interestedcnt,data['data'][0].notinterestedcnt,data['data'][0].schedulecnt];
        }else{
          this.todaycall = 0;
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  chartClicked(event){
    if(event['active'][0]._index==0){
      this.router.navigate(['/lead-agent-chart/0/'+this.startdate+'/'+this.enddate]); //0:interested
    }else if(event['active'][0]._index==1){
      this.router.navigate(['/lead-agent-chart/1/'+this.startdate+'/'+this.enddate]); //1:not interested
    }else if(event['active'][0]._index==2){
      this.router.navigate(['/lead-agent-chart/2/'+this.startdate+'/'+this.enddate]); //2:schedule
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
