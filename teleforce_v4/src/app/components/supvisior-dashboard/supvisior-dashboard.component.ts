import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { CampaignService } from '../../campaign.service';
import { ReportService } from '../../report.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from "../../manager.service";
import { id } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-supvisior-dashboard',
  templateUrl: './supvisior-dashboard.component.html',
  styleUrls: ['./supvisior-dashboard.component.css']
})
export class SupvisiorDashboardComponent implements OnInit {


  constructor(
    private userservice: UserService,
    private reportservice: ReportService,
    private campaignservice: CampaignService,
    private fb: FormBuilder,
    private ManagerService: ManagerService) { }
  public chartTypetraffic: string = 'pie';

  public chartDatasetstraffic: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'My First dataset' }
  ];

  public chartLabelstraffic: Array<any> = ['Total Calls', 'Incoming Calls', 'Outgoing Calls', 'Dailer', 'Missed call', 'Answered Calls'];

  public chartColorstraffic: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#32a871', '#FF9F33', '#33A5FF', '#FC33FF'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#32a871', '#d57477', '#b7d5e4', '#f9bcf8'],
      borderWidth: 2,
    }
  ];

  public chartOptionstraffic: any = {
    responsive: true
  };
  public chartClickedtraffic(e: any): void { }
  public chartHoveredtraffic(e: any): void { }



  public chartTypehourly: string = 'line';

  public chartDatasetshourly: Array<any> = [
    { data: [0], label: 'Total Calls' },
    { data: [0], label: 'Incoming Calls' },
    { data: [0], label: 'Outgoing Calls' },
    { data: [0], label: 'Dailer' },
    { data: [0], label: 'Answered Calls' },
    { data: [0], label: 'Missed Calls' }
  ];

  public chartLabelshourly: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

  public chartColorshourly: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(111, 152, 76, .2)',
      borderColor: 'rgba(111, 152, 70, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(237, 190, 40, .2)',
      borderColor: 'rgba(246, 216, 123, .8)',
      borderWidth: 2,
    }
  ];

  public chartOptionshourly: any = {
    responsive: true
  };
  public chartClickedhourly(e: any): void { }
  public chartHoveredhourly(e: any): void { }

  public chartTypeFunnel: string = 'bar';

  public chartDatasetsFunnel: Array<any> = [
    { data: [0, 10, 20, 40, 70], label: 'Sales Funnal' }
  ];

  public chartLabelsFunnel: Array<any> = [];

  public chartColorsFunnel: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsFunnel: any = {
    responsive: true
  };
  public chartClickedFunnel(e: any): void { }
  public chartHoveredFunnel(e: any): void { }

  public chartTypeSource: string = 'horizontalBar';

  public chartDatasetsSource: Array<any> = [
    { data: [0, 10, 20, 90, 20], label: 'Lead Sorce' }
  ];

  public chartLabelsSource: Array<any> = [];

  public chartColorsSource: Array<any> = [
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [

        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255,99,132,1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsSource: any = {
    responsive: true
  };
  public chartClickedSource(e: any): void { }
  public chartHoveredSource(e: any): void { }


  calltraffic = 0;
  totalcaller = 0;
  totalincomingcaller = 0;
  totaloutgoingcaller = 0;
  totaldailercaller = 0;
  totalmissedcaller = 0;
  totalaswerdcaller = 0;
  newcallers = 0;
  oldcallers = 0;
  ivr = false;
  clicktocall = false;
  conference = false;
  campaign = false;
  misscall = false;
  dialer = false;
  bulksms = false;
  zoho = false;
  lms = false;
  voicemail = false;
  totalagents = 0;

  isAgentLoading = false;
  reasondata = [];
  breakagents = [];
  holdagents = [];
  callagents = [];
  totalcallagents = 0;
  totalholdagents = 0;
  totalbreakagents = 0;
  public livestatusForm: FormGroup;
  agentgroup = []
  totalagentslist = [];


  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    // this.getleadsourcereport();
    this.getsalesfunnelreport();
    this.callsupiviosertrafficreport();
    this.hourlysupiviorcallreportgraph();
    // this.getManagerDetail(userid);
    this.getsupervisioragentlivestatus(userid);
  }
  async getsupervisioragentlivestatus(id) {
    this.isAgentLoading = true
    await this.reportservice.getAgentLiveStatus(id).then(
      data => {
        this.totalagents = data['data'].length;
        this.totalagentslist = data['data'];
        this.isAgentLoading = false;

        for (let index = 0; index < this.totalagentslist.length; index++) {
          const element = this.totalagentslist[index];
          if (element.break != null) {
            //console.log(element.account_name);
            this.breakagents.push(element.account_name);
          }
          if (element.callhold != null) {
            this.holdagents.push(element.account_name);
          }
          if (element.cdrdata && !element.cdrdata['lastdate']) {
            this.callagents.push(element.account_name);
          }
        }
        //console.log(this.holdagents);

      },
      err => {
        console.log('error');
      }
    );
  }
  async callsupiviosertrafficreport() {
    var userid = localStorage.getItem('access_id');

    await this.reportservice.callsupiviosertrafficreport(userid).then(
      rdata => {

        var string = rdata['data'][0][0]['out_str']

        var array = string.split(',');
        this.calltraffic = array.length;
        var totalcall = null;
        var total_incoming = null;
        var total_outgoing = null;
        var total_dailer = null;
        var misscalls = null;
        var answer_calls = null;
        var total_talktime = null;
        var average_call_duration = null;

        for (var i = 0; i < array.length; i++) {
          totalcall = array[0];
          total_incoming = array[1];
          total_outgoing = array[2];
          total_dailer = array[3];
          misscalls = array[4];
          answer_calls = array[5];
          this.totalcaller = array[0];
          this.totalincomingcaller = array[1];
          this.totaloutgoingcaller = array[2];
          this.totaldailercaller = array[3];
          this.totalmissedcaller = array[4];
          this.totalaswerdcaller = array[5];
          this.newcallers = array[6];
          this.oldcallers = array[7];
          if (totalcall == null) {
            totalcall = 0;
            this.totalcaller = 0;
          }
          if (total_incoming == null) {
            total_incoming = 0;
            this.totalincomingcaller = 0;

          }
          if (total_outgoing == null) {
            total_outgoing = 0;
            this.totaloutgoingcaller = 0;
          }
          if (total_dailer == null) {
            total_dailer = 0;
            this.totaldailercaller = 0;
          }
          if (misscalls == null) {
            misscalls = 0;
            this.totalmissedcaller = 0
          }
          if (answer_calls == null) {
            answer_calls = 0;
            this.totalaswerdcaller = 0;
          }

        }
        if (this.calltraffic > 0) {
          this.chartDatasetstraffic = [
            { data: [totalcall, total_incoming, total_outgoing, total_dailer, misscalls, answer_calls], label: 'Call Traffic Report' }
          ];
        } else {
          this.chartDatasetstraffic = [
            { data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'Call Traffic Report' }
          ];
        }
        this.chartLabelstraffic = ['Total Calls', 'Incoming Calls', 'Outgoing Calls', 'Total Dailer', 'Missed call', 'Answered Calls'];


      },
      err => {
        console.log('error');
      });

  }


  async hourlysupiviorcallreportgraph() {
    var userid = localStorage.getItem('access_id');

    await this.reportservice.hourlysupiviorcallreportgraph(userid).then(
      rdata => {

        var stringtotal = rdata['data'][0][0]['out_str'];
        var stringincoming = rdata['data'][1][0]['out_str_in'];
        var stringoutgoing = rdata['data'][2][0]['out_str_out'];
        var stringdailer = rdata['data'][3][0]['out_str_dial'];
        var stringanswer = rdata['data'][4][0]['out_str_ans'];

        var stringmisscall = rdata['data'][5][0]['out_str_miss'];

        var arraytotal = stringtotal.split(',');
        var arrayincoming = stringincoming.split(',');
        var arrayoutgoing = stringoutgoing.split(',');
        var arraydailer = stringdailer.split(',');
        var arrayanswer = stringanswer.split(',');
        var arraymisscall = stringmisscall.split(',');
        this.chartDatasetshourly = [
          { data: arraytotal, label: 'Total Calls' },
          { data: arrayincoming, label: 'Incoming Calls' },
          { data: arrayoutgoing, label: 'Outgoing Calls' },
          { data: arraydailer, label: 'Dailer' },
          { data: arrayanswer, label: 'Answered Calls' },
          { data: arraymisscall, label: 'Missed Calls' }

        ];

        this.chartLabelshourly = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

      },
      err => {
        console.log('error');
      });

  }
  async getsalesfunnelreport() {
    var userid = localStorage.getItem('access_id');

    await this.reportservice.getsupervisiorsalesfunnelreport(userid).then(
      rdata => {
        var array = rdata['data'];

        var countArr = [];
        var agentArr = [];
        for (var i = 0; i < array.length; i++) {
          countArr.push(array[i].count);
          agentArr.push(array[i].stage_name);


        }
        this.chartDatasetsFunnel = [
          { data: countArr, label: 'Sales Funnel' }
        ];
        this.chartLabelsFunnel = agentArr;
      },
      err => {
        console.log('error');
      });

  }


  async getleadsourcereport() {
    var userid = localStorage.getItem('access_id');

    await this.reportservice.getleadsourcereport(userid).then(
      rdata => {
        var array = rdata['data'];

        var countArr = [];
        var agentArr = [];
        for (var i = 0; i < array.length; i++) {
          countArr.push(array[i].lead_count);
          agentArr.push(array[i].lead_source);


        }
        this.chartDatasetsSource = [
          { data: countArr, label: 'Lead Sorce' }
        ];
        this.chartLabelsSource = agentArr;
      },
      err => {
        console.log('error');
      });

  }
  async getManagerDetail(managerid) {
    this.ManagerService.getManagerDetail(managerid).then(
      data => {
        var services = JSON.parse(data['data']['services']);
        localStorage.setItem('timezone', data['data']['timezone']);

        // console.log("feedback_vales");
        // console.log(data['data']['feedback_vales']);




        if (services.length > 0) {
          for (var i = 0; i < services.length; i++) {
            if (services[i] == '0') {
              this.ivr = true;
            } else if (services[i] == '1') {
              this.misscall = true;;
            } else if (services[i] == '2') {
              this.conference = true;
            } else if (services[i] == '3') {
              this.dialer = true;
            } else if (services[i] == '4') {
              this.clicktocall = true;
            } else if (services[i] == '5') {
              this.campaign = true;
            } else if (services[i] == '7') {
              this.bulksms = true;
            } else if (services[i] == '10') {
              this.zoho = true;
            } else if (services[i] == '11') {
              this.lms = true;
            } else if (services[i] == '12') {
              this.voicemail = true;
            }


          }

        }



      },
      err => {
        console.log('error');
      })

  }
  countduration(breaktime) {
    var dt1: any = new Date(breaktime);
    var dt2: any = new Date();
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    //console.log(diff/60)
    //diff /= (60);
    //diff /= (60 * 60 * 60);
    var date = new Date(0);
    date.setSeconds(diff); // specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);
    return diff;
  }
  refresh() {
    var userid = localStorage.getItem('access_id');
    this.getsupervisioragentlivestatus(userid);
  }
}
