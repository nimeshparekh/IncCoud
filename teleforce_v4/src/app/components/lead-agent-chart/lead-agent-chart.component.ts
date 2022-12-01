import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ReportService } from '../../report.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-lead-agent-chart',
  templateUrl: './lead-agent-chart.component.html',
  styleUrls: ['./lead-agent-chart.component.css']
})
export class LeadAgentChartComponent implements OnInit {

  UserData = { role: '' }
  public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4','Sales Q5','Sales Q6','Sales Q7'];
  public pieChartData = [1,2,3,4,5,6,7];
  public pieChartType = 'pie';  
  todaycall=0;
  lead = this.route.snapshot.paramMap.get('lead');
  startdate = this.route.snapshot.paramMap.get('sdate');
  enddate = this.route.snapshot.paramMap.get('edate');

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
      if(this.lead=='0'){
        this.todayCallLeadAgent(localStorage.getItem('access_id'),'interested',this.startdate,this.enddate);
      }else if(this.lead=='1'){
        this.todayCallLeadAgent(localStorage.getItem('access_id'),'not interested',this.startdate,this.enddate);
      }else if(this.lead=='2'){
        this.todayCallLeadAgent(localStorage.getItem('access_id'),'schedule',this.startdate,this.enddate);
      } 
  }
  async todayCallLeadAgent(id,lead,sdate,edate) {
    //console.log(id);   
    await this.reportservice.todayCallLeadAgent(id,lead,sdate,edate).then(
      data => {
        //console.log(data['data']);
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
