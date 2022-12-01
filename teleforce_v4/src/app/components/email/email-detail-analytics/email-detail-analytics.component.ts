import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { EmailService } from '../../../email.service';
import { ManagerService } from "../../../manager.service";
@Component({
  selector: 'app-email-detail-analytics',
  templateUrl: './email-detail-analytics.component.html',
  styleUrls: ['./email-detail-analytics.component.css']
})
export class EmailDetailAnalyticsComponent implements OnInit {
  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Send' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Receive' },
    { data: [22, 41, 49, 13, 68, 23, 92], label: 'Total' }
  ];

  public chartLabels: Array<any> = ['1 jun', '2 jun', '3 jun', '4 jun', '5 jun', '6 jun', '8 jun'];

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
    },
    {
      backgroundColor: 'rgba(111, 152, 76, .2)',
      borderColor: 'rgba(111, 152, 70, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }



  // 2

  public chartTypeA: string = 'pie';

  public chartDatasetsA: Array<any> = [
    { data: [50, 300, 100, 120], label: 'My First dataset' }
  ];

  public chartLabelsA: Array<any> = ['Send Mail', 'Receice Mail', 'Failed Mail', 'Total Mail'];

  public chartColorsA: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5'],
      borderWidth: 2,
    }
  ];

  public chartOptionsA: any = {
    responsive: true
  };
  public chartClickedA(e: any): void { }
  public chartHoveredA(e: any): void { }


  // 3

  public chartTypeB: string = 'bar';

  public chartDatasetsB: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55], label: 'Openers' }
  ];

  public chartLabelsB: Array<any> = ['Delivered', 'Openers'];

  public chartColorsB: Array<any> = [
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

  public chartOptionsB: any = {
    responsive: true
  };
  public chartClickedB(e: any): void { }
  public chartHoveredB(e: any): void { }


  // 4

  public chartTypeC: string = 'horizontalBar';

  public chartDatasetsC: Array<any> = [
    { data: [ 59, 80, 81], label: 'Campaign Summary' }
  ];

  public chartLabelsC: Array<any> = [['Sent',0], ['Delivered',0],['Open',0],['Click',0],['Bounce',0]];

  public chartColorsC: Array<any> = [
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255,99,132,1)',
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsC: any = {
    responsive: true
  };
  public chartClickedC(e: any): void { }
  public chartHoveredC(e: any): void { }


  // 5

  public chartTypeD: string = 'line';

  public chartDatasetsD: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Call Input' },
  ];

  public chartLabelsD: Array<any> = ['9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

  public chartColorsD: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
  ];

  public chartOptionsD: any = {
    responsive: true
  };
  public chartClickedD(e: any): void { }
  public chartHoveredD(e: any): void { }


  // 6

  public chartTypeE: string = 'line';

  public chartDatasetsE: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Login' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Logout' }
  ];

  public chartLabelsE: Array<any> = ['9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];

  public chartColorsE: Array<any> = [
    {
      backgroundColor: 'rgba(111, 152, 76, .2)',
      borderColor: 'rgba(111, 152, 70, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  public chartOptionsE: any = {
    responsive: true
  };
  public chartClickedE(e: any): void { }
  public chartHoveredE(e: any): void { }


  // 7

  public chartTypeF: string = 'polarArea';

  public chartDatasetsF: Array<any> = [
    { data: [65, 59, 80, 81], label: 'Missed Call' }
  ];

  public chartLabelsF: Array<any> = ['Missed', 'Dialer', 'Waiting', 'Break',];

  public chartColorsF: Array<any> = [
    {
      backgroundColor: [
        'rgba(219, 0, 0, 0.1)',
        'rgba(0, 165, 2, 0.1)',
        'rgba(255, 195, 15, 0.2)',
        'rgba(55, 59, 66, 0.1)',
      ],
      hoverBackgroundColor: [
        'rgba(219, 0, 0, 0.2)',
        'rgba(0, 165, 2, 0.2)',
        'rgba(255, 195, 15, 0.3)',
        'rgba(55, 59, 66, 0.1)',
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsF: any = {
    responsive: true
  };
  public chartClickedF(e: any): void { }
  public chartHoveredF(e: any): void { }

  // 8

  public chartTypeG: string = 'bar';

  public chartDatasetsG: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
  ];

  public chartLabelsG: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  public chartColorsG: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsG: any = {
    responsive: true
  };
  public chartClickedG(e: any): void { }
  public chartHoveredG(e: any): void { }

  // 9

  public chartTypeH: string = 'line';

  public chartDatasetsH: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
  ];

  public chartLabelsH: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public chartColorsH: Array<any> = [
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

  public chartOptionsH: any = {
    responsive: true
  };
  public chartClickedH(e: any): void { }
  public chartHoveredH(e: any): void { }
  campaignid = this.route.snapshot.paramMap.get('id');
  constructor(
    private route: ActivatedRoute,
    private emailservice: EmailService,public router: Router, private managerservice: ManagerService,
  ) { }

  ngOnInit(): void {
    this.getcampaignsummary();
    this.accesssetting();

  }

  getcampaignsummary(){
    this.emailservice.getcampaignsummary(this.campaignid).then(data => {
      if (data) {
        var sdata = data['data']
        console.log(data['data']);
        
        this.chartDatasetsC = [
          { data: [ sdata[0]['Sent'], sdata[0]['Delivered'],sdata[0]['Email_Read'],sdata[0]['Click'],sdata[0]['Bounce']], label: '' }
        ];
        this.chartLabelsC =[['Sent', sdata[0]['Sent']], ['Delivered',sdata[0]['Delivered']],['Open',sdata[0]['Email_Read']],['Click',sdata[0]['Click']],['Bounce',sdata[0]['Bounce']]];

        this.chartDatasetsB = [
          { data: [sdata[0]['Delivered'], sdata[0]['Email_Read']], label: '' }
        ];
      }
    },
      err => {
        console.log('error');
      })
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('14')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '14') {
        //       console.log("yes");
              
        //     }else{

        //       this.router.navigate(['/dashboard']);

        //     }
        //   }
        // }


       
      },
      err => {
        console.log('error');
      })
  }
}
