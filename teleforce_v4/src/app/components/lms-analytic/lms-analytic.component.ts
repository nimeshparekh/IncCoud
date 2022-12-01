import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { CampaignService } from '../../campaign.service';
import { ReportService } from '../../report.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from "../../manager.service";
import { LmsreportService } from '../../lmsreport.service';
import * as Chart from 'chart.js';
import { logWithIn } from '@syncfusion/ej2-angular-charts';
import { ErpService } from './../../erp.service';


@Component({
  selector: 'app-lms-analytic',
  templateUrl: './lms-analytic.component.html',
  styleUrls: ['./lms-analytic.component.css']
})
export class LmsAnalyticComponent implements OnInit {

  public chartTypeads: string = 'bar';

  public chartDatasetsads: Array<any> = [
    { data: [0,0,0,0,0], label: 'Agent ROI' }
  ];
  public chartLabelsads: Array<any> = [['Lead Cost',0],['Revenue',0]];

  //public chartLabelstraffic: Array<any> = [['CONVERSION COST',0], ['CONVERTED LEADS',0], ['PER LEAD COST',0],['SPEND',0], ['TOTAL LEADS',0]];

  public chartColorsads: Array<any> = [
    {
      
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(222, 98, 136, 0.2)',
          'rgba(51, 165, 238, 0.2)',
          'rgba(215, 216, 89, 0.2)',
          'rgba(70, 190, 190, 0.2)',
          'rgba(152, 108, 255, 0.2)',
          'rgba(172, 118, 255, 0.2)',

        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(222, 98, 136, 1)',
          'rgba(51, 165, 238, 1)',
          'rgba(215, 216, 89, 1)',
          'rgba(70, 190, 190, 1)',
          'rgba(152, 108, 255, 1)',
          'rgba(172, 118, 255, 1)',

        ],
        borderWidth: 2,
      }
    
  ];

  public chartOptionsads: any = {
    responsive: true
  };
  public chartClickedads(e: any): void { }
  public chartHoveredads(e: any): void { }

  public chartTypetraffic: string = 'bar';

  public chartDatasetstraffic: Array<any> = [
    { data: [0,0,0,0,0], label: 'ADS Cost' }
  ];
  public chartLabelstraffic: Array<any> = [['TOTAL LEADS',0],['CONVERTED LEADS',0],['SPEND',0], ['PER LEAD COST',0],['CONVERSION COST',0]];

  //public chartLabelstraffic: Array<any> = [['CONVERSION COST',0], ['CONVERTED LEADS',0], ['PER LEAD COST',0],['SPEND',0], ['TOTAL LEADS',0]];

  public chartColorstraffic: Array<any> = [
    {
      
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(222, 98, 136, 0.2)',
          'rgba(51, 165, 238, 0.2)',
          'rgba(215, 216, 89, 0.2)',
          'rgba(70, 190, 190, 0.2)',
          'rgba(152, 108, 255, 0.2)',
          'rgba(172, 118, 255, 0.2)',

        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(222, 98, 136, 1)',
          'rgba(51, 165, 238, 1)',
          'rgba(215, 216, 89, 1)',
          'rgba(70, 190, 190, 1)',
          'rgba(152, 108, 255, 1)',
          'rgba(172, 118, 255, 1)',

        ],
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
    { data: [0], label: 'Answered Calls'},
    { data: [0], label: 'Missed Calls'}
  ];

  public chartLabelshourly: Array<any> = ['1', '2', '3', '4', '5', '6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];

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
    { data: [0,10,20,40,70], label:'Stage Leads Converts The Most' }
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
        'rgba(244, 98, 136, 0.2)',
        'rgba(51, 165, 238, 0.2)',
        'rgba(215, 216, 89, 0.2)',
        'rgba(70, 190, 190, 0.2)',
        'rgba(152, 108, 255, 0.2)',
        'rgba(88,112,255,0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(244, 98, 136, 1)',
        'rgba(51, 165, 238, 1)',
        'rgba(215, 216, 89, 1)',
        'rgba(70, 190, 190, 1)',
        'rgba(152, 108, 255, 1)',
        'rgba(88,112,255,1)'

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
    { data: [0,10,20,90,20], label: 'Stage Wise Drop Off' }
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
        'rgba(251, 98, 136, 0.2)',
        'rgba(51, 165, 238, 0.2)',
        'rgba(205, 216, 89, 0.2)',
        'rgba(70, 190, 190, 0.2)',
        'rgba(152, 108, 255, 0.2)',
      ],
      borderColor: [

        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255,99,132,1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(251, 98, 136, 1)',
        'rgba(51, 165, 238, 1)',
        'rgba(205, 216, 89, 1)',
        'rgba(70, 190, 190, 1)',
        'rgba(152, 108, 255, 1)',
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsSource: any = {
    responsive: true
  };
  public chartClickedSource(e: any): void { }
  public chartHoveredSource(e: any): void { }

  public chartTypeFunnel2: string = 'bar';

  public chartDatasetsFunnel2: Array<any> = [
    { data: [0,10,20,40,70], label:'STAGE WISE OPPORTUNITY AMOUNT' }
  ];

  public chartLabelsFunnel2: Array<any> = [];

  public chartColorsFunnel2: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(251, 98, 136, 0.2)',
        'rgba(51, 165, 238, 0.2)',
        'rgba(205, 216, 89, 0.2)',
        'rgba(70, 190, 190, 0.2)',
        'rgba(152, 108, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(251, 98, 136, 1)',
        'rgba(51, 165, 238, 1)',
        'rgba(205, 216, 89, 1)',
        'rgba(70, 190, 190, 1)',
        'rgba(152, 108, 255, 1)',
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsFunnel2: any = {
    responsive: true
  };
  public chartClickedFunnel2(e: any): void { }
  public chartHoveredFunnel2(e: any): void { }

  public livestatusForm: FormGroup;
  adslist=[];
  public adsstatusForm: FormGroup;
  agentlist =[];
  agentadslist=[];
  constructor(
    public authService: ErpService,
    private fb: FormBuilder,
    private LmsService :LmsreportService ) { }



  ngOnInit(): void {
    
    this.livestatusForm = this.fb.group({
      adsname: ['',Validators.required],
    });
    this.adsstatusForm = this.fb.group({
      agentname: ['',Validators.required],
      agent_adsname:['',Validators.required]
    });
    this.stage_leads_converts_the();
    this.Stage_Wise_Drop_Off();
    this.get_ads_id();
    this.stage_wise_oppurtunity_amount();
    this.getAgent(localStorage.getItem("access_id"));
  }
  async stage_leads_converts_the() {
    var userid = localStorage.getItem('access_id');

        await this.LmsService.stage_leads_converts_the(userid).then(
          rdata => {
            var array =rdata['data'];
           
            var countArr = [];
            var agentArr = [];
            for(var i=0;i< array.length;i++){
         countArr.push(array[i].CONVERTED_LEADS);
         agentArr.push(array[i].STAGE_NAME);
           

          } 
          this.chartDatasetsFunnel = [
            { data: countArr, label: 'Stage Leads Converts The Most' }
          ]; 
          this.chartLabelsFunnel = agentArr;      
          },
          err => {
            console.log('error');
          });

  }
  async Stage_Wise_Drop_Off() {
    var userid = localStorage.getItem('access_id');

        await this.LmsService.stage_wise_drop_off(userid).then(
          rdata => {
            var array =rdata['data'];
           
            var countArr = [];
            var agentArr = [];
            for(var i=0;i< array.length;i++){
         countArr.push(array[i].LEADS_LOST);
         agentArr.push(array[i].STAGE_NAME);
           

          } 
          this.chartDatasetsSource = [
            { data: countArr, label: 'Stage Wise Drop Off' }
          ]; 
          this.chartLabelsSource = agentArr;      
          },
          err => {
            console.log('error');
          });

}

filterlivestatus(data){
  var data = Object.assign(this.livestatusForm.value)
  this.LmsService.get_ads_cost_graph(data).then(
    rdata => {
    var data =rdata["data"][0];
    
    var CONVERSION_COST= data["CONVERSION_COST"];
    var CONVERTED_LEADS =data["CONVERTED_LEADS"];
    var PER_LEAD_COST= data["PER_LEAD_COST"];
    var SPEND = data["ROUND(SPEND)"];
    var TOTAL_LEADS=data["TOTAL_LEADS"];
    this.chartDatasetstraffic = [
      {data:[TOTAL_LEADS,CONVERTED_LEADS,SPEND,PER_LEAD_COST,CONVERSION_COST], label: 'ADS Cost'}
    ];
    this.chartLabelstraffic=[['TOTAL LEADS',TOTAL_LEADS],['CONVERTED LEADS',CONVERTED_LEADS],['SPEND',SPEND], ['PER LEAD COST',PER_LEAD_COST],['CONVERSION COST',CONVERSION_COST]];

      
    },
    err => {
      console.log('error');
    });
}

get_ads_id(){
  let userid = localStorage.getItem('access_id');
  this.LmsService.get_ads_id(userid).then(
    rdata => {
      this.adslist=rdata["data"];
  
    },
    err => {
      console.log('error');
    });
}
async stage_wise_oppurtunity_amount() {
  var userid = localStorage.getItem('access_id');

      await this.LmsService.stage_wise_oppurtunity_amount(userid).then(
        rdata => {
          var array =rdata['data'];
         
          var countArr = [];
          var agentArr = [];
          
          for(var i=0;i< array.length;i++){
       countArr.push(array[i].OPPORTUNITY_AMOUNT);
       agentArr.push(array[i].STAGE_NAME);
         

        } 
        
        this.chartDatasetsFunnel2 = [
          { data: countArr, label: 'STAGE WISE OPPORTUNITY AMOUNT' }
        ]; 
        this.chartLabelsFunnel2 = agentArr;      
        },
        err => {
          console.log('error');
        });

}
getAgent(userid) {
  this.authService.getAgents(userid).then(
    data => {
      console.log(data['data'])
      this.agentlist = data['data'];
    },
    err => {
      console.log('error');
    }
  );
}
filterads(data){
  var data = Object.assign(this.adsstatusForm.value);
  
  this.LmsService.get_adslist_by_agent(data).then(
    rdata => {
      console.log(rdata["data"]);
      console.log(rdata["data"][0]);

      var datas =rdata["data"][0];
      console.log(datas);
      
      var Lead_Cost = datas["LEADS_COST_AGENT"];
      var Revenue = datas["REVENUE"];
      console.log(Lead_Cost,Revenue);
      
      this.chartDatasetsads = [
        {data:[Lead_Cost,Revenue], label: 'Agent ROI'}
      ];
      this.chartLabelsads=[['Lead_Cost',Lead_Cost],['Revenue',Revenue]];
    
    },
    err => {
      console.log('error');
    });

}
// filteradslist(data){
//   var data = Object.assign(this.adsstatusForm.value)

//   this.LmsService.get_ads_roi_by_agent(data).then(
//     rdata => {
//   var datas =rdata["data"][0];
//   console.log(datas);
  
//   var Lead_Cost = datas["LEADS_COST_AGENT"];
//   var Revenue = datas["Revenue"];
//   console.log(Lead_Cost,Revenue);
  
//   this.chartDatasetsads = [
//     {data:[Lead_Cost,Revenue], label: 'Agent ROI'}
//   ];
//   this.chartLabelsads=[['Lead_Cost',Lead_Cost],['Revenue',Revenue]];

    
  
//     },
//     err => {
//       console.log('error');
//     });
// }
}
