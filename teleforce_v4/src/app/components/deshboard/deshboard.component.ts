import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../auth.service';
import { Router } from "@angular/router";
import { UserService } from '../../user.service';
import { ReportService } from '../../report.service';
import { ManagerService } from '../../manager.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Rx';
import { multi } from './data';
import * as moment from 'moment';
import { CampaignService } from '../../campaign.service';
import { DigitalService } from '../../digital.service';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.css']
})
export class DeshboardComponent implements OnInit {

  public chartType: string = 'line';

  public chartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
  ];

  public chartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }


  isUser = true;
  UserData = { username: '', role: '' }
  livecall = 0;
  ivrcall = 0;
  didnumbers = 0;
  kyc;
  misscall = 0;
  todaycall = 0;
  todayincomingcall = 0;
  todayoutgoingcall = 0;
  todaymissedcall = 0;
  userrole = '';






  public scheduledataSource: MatTableDataSource<any>;
  scheduleColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type', 'status', 'agent', 'feedback', 'note', 'scheduledate'];
  scheduleLength = 0;
  isLoading = true;
  public hourlypieChartLabels = ['10 AM-11 AM', '11 AM-12 PM', '12 PM-1 PM', '2 PM-3 PM', '3 PM-4 PM', '4 PM-5 PM', '5 PM-6 PM'];
  public hourlypieChartData = [1, 2, 3, 4, 5, 6, 7];
  // public planpieChartLabels = ['Total Minutes', 'Used Minutes', 'Available Minutes'];
  //public planpieChartData = [0, 0, 0];
  public campaignpieChartLabels = ['ANSWER', 'NO ANSWER'];
  public campaignpieChartData = [0, 0];
  public planexppieChartLabels = ['PURCHASE DAYS', 'RENEW DAYS'];
  public planexppieChartData = [0, 0];
  public pieChartLabels = ['ANSWER', 'NO ANSWER'];
  public pieChartData = [0, 0];
  public pieChartType = 'pie';
  public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public doughnutChartData = [120, 150, 180, 90];
  public doughnutChartType = 'doughnut';
  public searchform: FormGroup;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['Today Call Lead Summary'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [65], label: 'INTERESTED' },
    { data: [28], label: 'NOT INTERESTED' },
    { data: [30], label: 'SCHEDULE' },
  ];
  date = new Date();
  statusnext = false;
  hourlystatusnext = false;
  totalcallstatus = 0;
  totalhourlycall = 0;
  hourlycalldate = new Date();
  showplanminute = false;
  campaigns = [];
  totalcampaigncall = 0;
  public addForm: FormGroup;
  public statusearchform: FormGroup;
  public hourlysearchform: FormGroup;
  planvalidity = '';
  planexpirydate = '';
  plantotalmin = '';
  totalagents = 0;
  startdate;
  enddate;
  msg1 = '';
  startdate2;
  enddate2;
  msg2 = '';
  startdate3;
  enddate3;
  msg3 = '';
  expiremode = false;
  usedmin = 0;
  availablemin = 0;
  monthtotalmin = 0;
  totalcalls = 0;
  totalagentslist = []
  totalanswercalls = 0;
  totalunreachablecalls = 0;
  totalagentcalls = 0;
  totalincomingcall = 0;
  totaloutgoingcall = 0;
  totaldialercall = 0;
  count1 = 0;
  count2 = 0;
  count3 = 0;
  count4 = 0;
  count5 = 0;
  count6 = 0;
  count7 = 0;
  count8 = 0;
  count9 = 0;
  count10 = 0;
  count11 = 0;
  count12 = 0;
  count13 = 0;
  count14 = 0;
  count15 = 0;
  count16 = 0;
  count17 = 0;
  count18 = 0;
  count19 = 0;
  count20 = 0;
  count21 = 0;
  count22 = 0;
  count23 = 0;
  count24 = 0;
  totalhourlycalls = 0;
  mostanswertiming;
  agentloginhours;
  agentperformance;
  convertedcalldata: any;
  mostconvertedcalltiming;
  campaigname = null;
  ivrname = null;
  clock: Observable<any>;
  timezone = localStorage.getItem('timezone') ? localStorage.getItem('timezone') : '+5:30'
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
  selectedgroup = 0
  newcallers = 0;
  oldcallers = 0;
  totalcaller = 0;
  totalincomingcaller = 0;
  totaloutgoingcaller = 0;
  totaldailercaller = 0;
  totalmissedcaller = 0;
  totalaswerdcaller = 0;
  totalqueuecalls = 0;
  brand_names: any
  filterstartdate;
  constructor(
    public authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private userservice: UserService,
    private reportservice: ReportService,
    private fb: FormBuilder,
    private campaignservice: CampaignService,
    private digitalService: DigitalService,
    private managerservice:ManagerService
  ) {
    Object.assign(this, { multi });
  }
  @ViewChild('schedulepaginator') schedulepaginator: MatPaginator;

  ngOnInit(): void {

    var userid = localStorage.getItem('access_id');
    this.selectedgroup = localStorage.getItem('agentgroup') ? Number(localStorage.getItem('agentgroup')) : 0
    if (userid === 'undefined' || userid === null) {
      this.isUser = false;
      window.location.href = '/signin';
    }
    this.scheduledataSource = new MatTableDataSource();
    this.authService.getRole(localStorage.getItem('access_id')).then(
      data => {
        this.timezone = localStorage.getItem('timezone')
        this.UserData.role = data['data']['account_type'];
        this.userrole = data['data']['account_type'];
        this.checkkyc(userid);
        if (this.userrole == '2') {
          this.getBrandAll();
          //this.getTotalCalls(userid);
          this.getQueueCalls(userid);
          this.calltrafficreport()
          //this.hourlyCallData(userid);
          //this.countLoginHours(userid);
          //this.countAgentPerformance(userid);
          //this.getMostConvertedCallTime(userid);
          //this.getCampaignPerformance(userid);
          this.getAgents();
          this.getagentgroup();
        }
        if (this.userrole == '1') {
          this.getNextcallSchedule(userid, 'schedule');

        }
      }).catch(function (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('access_id');
        localStorage.removeItem('username');
        localStorage.removeItem('secret');
        window.location.href = '/signin';
      });
    var myDate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [myDate, Validators.required],
      enddate: [myDate, Validators.required]
    });

    this.statusearchform = this.fb.group({
      userid: [userid],
      startdate: [myDate, Validators.required],
      enddate: [myDate, Validators.required]
    });
    this.hourlysearchform = this.fb.group({
      userid: [userid],
      startdate: [myDate, Validators.required],
    });



    this.addForm = this.fb.group({
      camid: [null],
      userid: [userid],
      startdate: [myDate, Validators.required],
      enddate: [myDate, Validators.required]
    })

    this.livestatusForm = this.fb.group({
      agentgroup: [this.selectedgroup],
    });
    this.http.get("https://(wrong)sbc2.cloudX.in/ip.php").subscribe((res: any) => {
      console.log(res.ip)
      this.authService.setliveip(res.ip);
    });

    // this.getHoldCallingReason(userid);
      
    let startdate = 'current';
    localStorage.setItem('startdatefilter', startdate);
    localStorage.setItem('enddatefilter', startdate);
    localStorage.setItem('statusfilter', '');
    localStorage.setItem('sourcefilter', '');
    localStorage.setItem('agentfilter', '');
    localStorage.setItem('leadnamefilter', '');
    localStorage.setItem('adsnamefilter', '');
    localStorage.setItem('mobilefilter', '');
    localStorage.setItem('tagfilter', '');
    localStorage.setItem('modifiedstartdatefilter', '');
    localStorage.setItem('modifiedenddatefilter', '');
    localStorage.setItem('leadperstatusfilter', '10');
    //this.getLinkdinAndTwiterPost();
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  async calltrafficreport() {
    var userid = localStorage.getItem('access_id');

    await this.reportservice.calltrafficreport(userid).then(
      rdata => {
        if(rdata['data'].length>0){
          var string = rdata['data'][0][0]['out_str']

        var array = string.split(',');

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

      }}}
    ,
      err => {
        console.log('error');
      });

  }
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  async getagentgroup() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.gethuntgroup(userinfo).then(data => {
      if (data) {
        this.agentgroup = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  filterlivestatus() {
    localStorage.setItem('agentgroup', this.livestatusForm.get('agentgroup').value);
    this.getAgents();
  }

  async getHoldCallingReason(userid) {
    await this.userservice.getReasonData(userid).then(
      data => {
        // console.log(data);
        this.reasondata = data['data'];

      },
      err => {
        console.log('error');
      }
    );
  }


  async getManagerCampaigns(userid) {
    await this.reportservice.getManagerCampaigns(userid).then(
      data => {
        // console.log(data);
        this.campaigns = data['data'];
        if (data['data'].length > 0) {
          this.addForm.get('camid').setValue(data['data'][0].camid);
          this.getCampaignCallData();
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  getCampaignCallData() {
    let data: any = Object.assign(this.addForm.value);
    //console.log(data); 
    //var currentime = new Date("2020-11-11 08:59 PM");

    var currentime = new Date();
    this.startdate3 = new Date(data.startdate);
    this.enddate3 = new Date(data.enddate)
    var daydiff = (this.enddate3.getTime() - this.startdate3.getTime()) / 1000 / 60 / 60 / 24;
    if (daydiff <= 1) {
      this.msg3 = "";
      this.reportservice.getCampaignCallCount(data).then(
        data => {
          //console.log(data['data']);
          if (data['data'].length > 0) {
            this.totalcampaigncall = (data['data'][0].answercnt) + (data['data'][0].noanswercnt);
            this.campaignpieChartLabels = ['ANSWER(' + data['data'][0].answercnt + ')', 'NO ANSWER(' + data['data'][0].noanswercnt + ')'];
            this.campaignpieChartData = [data['data'][0].answercnt, data['data'][0].noanswercnt];
          } else {
            this.totalcampaigncall = 0;
            this.campaignpieChartLabels = ['ANSWER(0)', 'NO ANSWER(0)'];
            this.campaignpieChartData = [0, 0];
          }
        },
        err => {
          console.log('error');
        }
      );
    } else {
      this.msg3 = "Please select search date difference below 1 day";
      this.totalcampaigncall = 0;
      this.campaignpieChartLabels = ['ANSWER(0)', 'NO ANSWER(0)'];
      this.campaignpieChartData = [0, 0];
    }
  }


  async getNextcallSchedule(userid, feedback) {

    await this.userservice.getNextcallSchedule(userid, feedback).then(
      data => {
        // console.log(data);

        this.scheduledataSource.data = data['data'];
        this.scheduleLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  /*getPlanExpiryData(userid) {
    this.reportservice.getPlanExpiryData(userid).then(
      data => {
        //console.log(data['data']);
        this.planexpirydate = data['data'][0].expiry_date;
        var expiry_date = new Date(data['data'][0].expiry_date);
        var currentdate = new Date();
        if (expiry_date < currentdate) {
          this.expiremode = true;
        }
        if (data['data'][0].package_validity != null) {
          if (data['data'][0].package_validity == 0) {
            this.planvalidity = 'Monthly';
            var expirydate = new Date(data['data'][0].expiry_date);
            var create_date = new Date(data['data'][0].create_date);
            var currentdate = new Date();
            var plandate = expirydate.setMonth(expirydate.getMonth() - 1);
            //if (expirydate > currentdate) {
            const date1 = new Date();
            const date2 = new Date(data['data'][0].expiry_date);
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var renewdays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
            // }
            if (create_date < currentdate) {
              const date2 = new Date();
              const date1 = new Date(data['data'][0].create_date);
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              if (purchasedays < 0) {
                const date2 = new Date();
                const date1 = new Date(plandate);
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              }
            }
          }
          if (data['data'][0].package_validity == 1) {
            this.planvalidity = 'Yearly';
            var expirydate = new Date(data['data'][0].expiry_date);
            var create_date = new Date(data['data'][0].create_date);
            var currentdate = new Date();
            var plandate = expirydate.setMonth(expirydate.getMonth() - 12);
            //if (expirydate > currentdate) {
            const date1 = new Date();
            const date2 = new Date(data['data'][0].expiry_date);
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var renewdays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
            // }
            if (create_date < currentdate) {
              const date2 = new Date();
              const date1 = new Date(plandate);
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              if (purchasedays < 0) {
                const date2 = new Date();
                const date1 = new Date(plandate);
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              }
            }
          }
          if (data['data'][0].package_validity == 2) {
            this.planvalidity = 'Quarterly';
            var expirydate = new Date(data['data'][0].expiry_date);
            var create_date = new Date(data['data'][0].create_date);
            var currentdate = new Date();
            var plandate = expirydate.setMonth(expirydate.getMonth() - 3);
            //if (expirydate > currentdate) {
            const date1 = new Date();
            const date2 = new Date(data['data'][0].expiry_date);
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var renewdays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
            // }
            if (create_date < currentdate) {
              const date2 = new Date();
              const date1 = new Date(plandate);
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              if (purchasedays < 0) {
                const date2 = new Date();
                const date1 = new Date(plandate);
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              }
            }
          }
          if (data['data'][0].package_validity == 3) {
            this.planvalidity = 'Half Yearly';
            var expirydate = new Date(data['data'][0].expiry_date);
            var create_date = new Date(data['data'][0].create_date);
            var currentdate = new Date();
            var plandate = expirydate.setMonth(expirydate.getMonth() - 6);
            //if (expirydate > currentdate) {
            const date1 = new Date();
            const date2 = new Date(data['data'][0].expiry_date);
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var renewdays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
            // }
            if (create_date < currentdate) {
              const date2 = new Date();
              const date1 = new Date(plandate);
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              if (purchasedays < 0) {
                const date2 = new Date();
                const date1 = new Date(plandate);
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
              }
            }
          }
          this.planexppieChartLabels = ['PURCHASE DAYS(' + purchasedays + ')', 'RENEW DAYS(' + renewdays + ')'];
          this.planexppieChartData = [purchasedays, renewdays];
        } else {
          this.planvalidity = null;
          //var expirydate = new Date(data['data'][0].expiry_date);
          var create_date = new Date(data['data'][0].create_date);
          var currentdate = new Date();
          // var plandate = expirydate.setMonth(expirydate.getMonth() - 1);
          //if (expirydate > currentdate) {
          const date1 = new Date();
          const date2 = new Date(data['data'][0].expiry_date);
          var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          var renewdays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
          // }
          if (create_date < currentdate) {
            const date2 = new Date();
            const date1 = new Date(data['data'][0].create_date);
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
            if (purchasedays < 0) {
              const date2 = new Date();
              const date1 = new Date(plandate);
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              var purchasedays = Math.round((date2.getTime() - date1.getTime()) / (oneDay));
            }
          }
          this.planexppieChartLabels = ['PURCHASE DAYS(' + purchasedays + ')', 'RENEW DAYS(' + renewdays + ')'];
          this.planexppieChartData = [purchasedays, renewdays];
        }
      },
      err => {
        console.log('error');
      }
    );
  }*/

  ngAfterViewInit() {
    this.scheduledataSource.paginator = this.schedulepaginator;
  }
  // async totalLiveCall(id) {
  //   // console.log(id);   
  //   await this.userservice.totalLiveCall(id).then(
  //     data => {
  //       if(data['data'].length>0){
  //         this.livecall = data['data'][0]['total'];
  //       }else{
  //         this.livecall =0;
  //       }       
  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }

  // async totalIVRCall(id) {
  //   //console.log(id);   
  //   await this.userservice.totalIVRCall(id).then(
  //     data => {
  //       if(data['data'].length>0){
  //         this.ivrcall = data['data'][0]['total'];
  //       }else{
  //         this.ivrcall = 0;
  //       }

  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }

  // async totalDIDNumber(id) {
  //   //console.log(id);   
  //   await this.userservice.totalDidNumbers(id).then(
  //     data => {
  //       if(data['data'].length>0){
  //         this.didnumbers = data['data'][0]['total'];
  //       }else{
  //         this.didnumbers = 0;
  //       }

  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }
  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  // async totalMissCall(id) {
  //   //console.log(id);   
  //   await this.userservice.totalMissCall(id).then(
  //     data => {
  //       if(data['data'].length>0){
  //         this.misscall = data['data'][0]['total'];
  //       }else{
  //         this.misscall = 0;
  //       }

  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }
  clicktocall(agentid, mobile) {
    if (confirm("Are you sure to call ?")) {
      this.userservice.agentOutgoingCall(agentid, mobile).then(
        data => {
          if (data['err'] == false) {
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
          }
        },
        err => {
          console.log('error');
        }
      );
    }
  }


  //  https://medium.com/codingthesmartway-com-blog/angular-chart-js-with-ng2-charts-e21c8262777f

  /*async todayCallStatus(id) {
    //console.log(id);   
    await this.userservice.todayCallStatus(id).then(
      data => {
        // console.log(data['data']);
        let statusArr = [];
        let statusvalue = [];
        for (var i = 0; i < data['data'].length; i++) {
          statusArr.push(data['data'][i]['CallStatus'] + '(' + data['data'][i]['totalcnt'] + ')');
          statusvalue.push(data['data'][i]['totalcnt']);
        }
        //for pie chart
        this.pieChartLabels = statusArr;
        this.pieChartData = statusvalue;
      },
      err => {
        console.log('error');
      }
    );
  }*/



  async checkkyc(id) {
    // console.log(this.userrole);   
    if (this.userrole == '2') {
      await this.userservice.getKYCStatus(id).then(
        data => {
          if (data['data'].length > 0) {
            if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

            } else {
              this.router.navigate(['/kyc-document-upload']);
            }
          } else {
            this.router.navigate(['/kyc-document-upload']);
          }

        },
        err => {
          console.log('error');
        }
      );
    }
  }

  /* public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
   public doughnutChartData = [120, 150, 180, 90];
   public doughnutChartType = 'doughnut';*/
  showTodayCall(type) {
    //console.log(type);
  }


  hourlyChartClicked(event) {
    if (event['active'].length > 0) {
      let data: any = Object.assign(this.hourlysearchform.value);
      if (event['active'][0]._index == '0') {
        this.router.navigate(['/hourly-lead/0/' + data.startdate]);
      }
      if (event['active'][0]._index == '1') {
        this.router.navigate(['/hourly-lead/1/' + data.startdate]);
      }
      if (event['active'][0]._index == '2') {
        this.router.navigate(['/hourly-lead/2/' + data.startdate]);
      }
      if (event['active'][0]._index == '3') {
        this.router.navigate(['/hourly-lead/3/' + data.startdate]);
      }
      if (event['active'][0]._index == '4') {
        this.router.navigate(['/hourly-lead/4/' + data.startdate]);
      }
      if (event['active'][0]._index == '5') {
        this.router.navigate(['/hourly-lead/5/' + data.startdate]);
      }
      if (event['active'][0]._index == '6') {
        this.router.navigate(['/hourly-lead/6/' + data.startdate]);
      }
    }

  }
  campaignChartClicked(event) {
    if (event['active'][0]._index == '0') {
      var camid = this.addForm.get('camid').value;
      var startdate = this.addForm.get('startdate').value;
      var enddate = this.addForm.get('enddate').value;
      this.router.navigate(['/campaign-lead/' + camid + '/' + startdate + '/' + enddate]);
    }
  }
  async createStatusExcel() {
    let data: any = Object.assign(this.statusearchform.value);
    await this.reportservice.downloadStatusExcel(data).then(
      data => {
        //console.log(data['data']);
        this.isLoading = false
        // this.dataSource.data = data['data'];
        //this.Length = data['data'].length;
        // this.isLoading = false
        var url = environment.apiUrl + '/' + data['data']
        window.open(url, '_blank');
      },
      err => {
        console.log('error');
      }
    );
  }


  async getAgents() {
    this.isAgentLoading = true
    var group = this.livestatusForm.get('agentgroup').value;
    await this.userservice.getAgentLiveStatus(group).then(
      data => {
        this.totalagents = data['data'].length;
        this.totalagentslist = data['data'];
        this.isAgentLoading = false;
        this.breakagents = [];
        this.holdagents = [];
        this.callagents = [];
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
        this.totalbreakagents = this.breakagents.length;
        this.totalholdagents = this.holdagents.length;
        this.totalcallagents = this.callagents.length;
      },
      err => {
        console.log('error');
      }
    );
  }
  logout() {
    this.authService.doLogout()
    window.location.href = '/login-page';
  }
  //get total manager call count



  // async countLoginHours(userid) {
  //   var currendate = new Date();
  //   var startdate = new Date(currendate.getTime() - (7 * 24 * 60 * 60 * 1000));
  //   let data: any = { startdate: startdate, enddate: currendate, userid: userid };
  //   //console.log("data::"+JSON.stringify(data));
  //   this.reportservice.agentLoginLogoutData(data).then(
  //     data => {
  //       //console.log(JSON.stringify(data));
  //       var totalseconds = 0
  //       for (var i = 0; i < data['data'].length; i++) {
  //         console.log(i);
  //         var dt1: any = new Date(data['data'][i].logintime);
  //         var dt2: any = new Date(data['data'][i].logout_time);
  //         var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  //         totalseconds += diff;
  //         //diff /= (60);
  //         //diff /= (60 * 60 * 60);

  //         //return timeString;
  //       }
  //       if (totalseconds > 0) {
  //         var date = new Date(0);
  //         date.setSeconds(totalseconds); // specify value for SECONDS here

  //         var timeString = date.toISOString().substr(11, 5);
  //         this.agentloginhours = timeString;
  //       } else {
  //         this.agentloginhours = '00:00';
  //       }


  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }
  // async countAgentPerformance(userid) {
  //   let data: any = { startdate: new Date(), enddate: new Date(), userid: userid }
  //   await this.reportservice.agentPerformanceData(data).then(
  //     data => {
  //       //console.log('data::'+JSON.stringify(data));
  //       if(data['data'].length>0){
  //         var totalperformance = 0;
  //         for (var i = 0; i < data['data'].length; i++) {
  //           var breaktime = data['data'][i].breaktime;
  //           if(breaktime==null){
  //             breaktime = 0;
  //           }
  //           var wraptime:any = (data['data'][i].wrapuptime*60*data['data'][i].totalcalls);
  //           if(wraptime==null){
  //             wraptime = 0;
  //           }
  //           var talktime = data['data'][i].talktime;
  //           if(talktime==null){
  //             talktime = 0;
  //           }

  //           var date1 = data['data'][i].date;
  //           var date2 = data['data'][i].logout_time;
  //           var dt1: any = new Date(date1);
  //           var dt2: any = new Date(date2);
  //           var loggedtime = (dt2.getTime() - dt1.getTime()) / 1000;
  //           var idealtime = (parseInt(talktime) + parseInt(wraptime) * 100) / parseInt(loggedtime.toString())
  //           //console.log(idealtime)
  //           totalperformance += idealtime>0?Math.round(idealtime):0
  //         }
  //         this.agentperformance = totalperformance>0?Math.round(totalperformance / data['data'].length):0;
  //       }else{
  //         this.agentperformance =0;
  //       }

  //     },
  //     err => {
  //       console.log('error');
  //     });
  // }



  async getQueueCalls(id) {
    var data = { id: id };
    //console.log("utc_date ::"+data);
    await this.reportservice.getQueueCalls(data).then(
      data => {
        //console.log(data['data']);
        if (data['data'].length > 0) {
          if (data['data'][0].queuecalls > 0) {
            this.totalqueuecalls = data['data'][0].queuecalls;
          }
        } else {
          this.totalqueuecalls = 0;
        }
      },
      err => {
        console.log('error');
      }
    );
    //}
  }

  async getduration(date) {
    var callstartDate = moment(date, 'YYYY-MM-DD HH:mm:ss')
    var callendDate = moment(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    var callDuration = callendDate.diff(callstartDate, 'seconds')
    //console.log(callDuration)
    return callDuration
  }
  refresh() {
    var userid = localStorage.getItem('access_id');
    this.getAgents();
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


  getBrandAll() {
    let data = { 'user_id': localStorage.getItem('access_id') }
    this.digitalService.get_brands(data).then(
      data => {
        if (data['data'].length > 0) {
          this.brand_names = data['data'];
          if (localStorage.getItem('current_brand_id') == null) {
            localStorage.setItem("current_brand_name", this.brand_names[0].brand_name);
            localStorage.setItem("current_brand_id", this.brand_names[0].brand_id);
          }
        }
        //this.current_brand = localStorage.getItem('current_brand_name');
        // console.log('brandid:: '+localStorage.getItem("current_brand_id"));
      }
    )
  }
  getLinkdinAndTwiterPost() {
    this.digitalService.getLinkdinAndTwiterPost().then(
      data => {
        //this.brand_names = data['data'];


      }
    )
  }

}
