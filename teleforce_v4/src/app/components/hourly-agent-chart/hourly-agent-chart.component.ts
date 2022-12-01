import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ReportService } from '../../report.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-hourly-agent-chart',
  templateUrl: './hourly-agent-chart.component.html',
  styleUrls: ['./hourly-agent-chart.component.css']
})
export class HourlyAgentChartComponent implements OnInit {

  date = this.route.snapshot.paramMap.get('date');
  index1 = this.route.snapshot.paramMap.get('index1');
  index2 = this.route.snapshot.paramMap.get('index2');
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
      if(this.index1=='0'){
        this.hourlyCallLeadAgent(localStorage.getItem('access_id'), this.date,'interested',this.index2);
      }else if(this.index1=='1'){
        this.hourlyCallLeadAgent(localStorage.getItem('access_id'), this.date,'not interested',this.index2);
      }else if(this.index1=='2'){
        this.hourlyCallLeadAgent(localStorage.getItem('access_id'), this.date,'schedule',this.index2);
      }
    
  }
  async hourlyCallLeadAgent(id,date,index1,index2) {
    //console.log(id);   
    var data = {userid:id,date:date,index1:index1,index2:index2}
    await this.reportservice.hourlyCallLeadAgent(data).then(
      data => {
        console.log(data['data']);
         //this.todaycall = (data['data'][0].)+(data['data'][0].notinterestedcnt)+(data['data'][0].schedulecnt)+(data['data'][0].contactedcnt)+(data['data'][0].notcontactedcnt)+(data['data'][0].convertedcnt)+(data['data'][0].closedcnt);
         let statusArr = [];
        let statusvalue = [];
        for (var i = 0; i < data['data'].length; i++) {
          statusArr.push(data['data'][i]['AgentName'] + '(' + data['data'][i]['cnt'] + ')');
          statusvalue.push(data['data'][i]['cnt']);
          this.todaycall = (this.todaycall) + (data['data'][i]['cnt']);
        }
        //for pie chart
        this.pieChartLabels = statusArr;
        this.pieChartData = statusvalue;
      },
      err => {
        console.log('error');
      }
    );
  }
  
  

}
