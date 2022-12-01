import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ReportService } from '../../report.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-hourly-lead-chart',
  templateUrl: './hourly-lead-chart.component.html',
  styleUrls: ['./hourly-lead-chart.component.css']
})
export class HourlyLeadChartComponent implements OnInit {

  date = this.route.snapshot.paramMap.get('date');
  index = this.route.snapshot.paramMap.get('index');
  UserData = { role: '' }
  public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4', 'Sales Q5', 'Sales Q6', 'Sales Q7'];
  public pieChartData = [1, 2, 3, 4, 5, 6, 7];
  public pieChartType = 'pie';
  todaycall = 0;

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
    this.todayAnswerCallLead(localStorage.getItem('access_id'), this.date,this.index);
  }
  async todayAnswerCallLead(id,date,index) {
    //console.log(id);   
    var data = {userid:id,date:date,index:index};
    await this.reportservice.hourlyAnswerCallLead(data).then(
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
      this.router.navigate(['/hourly-agent-chart/0/'+this.index+'/'+this.date]); //0:interested
    }else if(event['active'][0]._index==1){
      this.router.navigate(['/hourly-agent-chart/1/'+this.index+'/'+this.date]); //1:not interested
    }else if(event['active'][0]._index==2){
      this.router.navigate(['/hourly-agent-chart/2/'+this.index+'/'+this.date]); //2:schedule
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
