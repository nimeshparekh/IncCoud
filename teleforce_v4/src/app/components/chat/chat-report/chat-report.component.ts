import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-report',
  templateUrl: './chat-report.component.html',
  styleUrls: ['./chat-report.component.css']
})
export class ChatReportComponent implements OnInit {


            // 1
            public chartType: string = 'line';

            public chartDatasets: Array<any> = [
              { data: [65], label: 'Total Leads Cont' },
              { data: [22], label: 'Leads Created Cont' },
              { data: [10], label: 'Leads Failed' },
              { data: [28], label: 'Leads Converted' },
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
              },
              {
                backgroundColor: 'rgba(114, 162, 86, .2)',
                borderColor: 'rgba(114, 162, 50, .7)',
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
              { data: [50, 300, 100, 120, 150], label: 'Call durations' }
            ];
      
            public chartLabelsA: Array<any> = ['Total', 'Converted', 'Failed', 'Created', 'Pending'];
      
            public chartColorsA: Array<any> = [
              {
                backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#32a871'],
                hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#32a871'],
                borderWidth: 2,
              }
            ];
      
            public chartOptionsA: any = {
              responsive: true
            };
            public chartClickedA(e: any): void { }
            public chartHoveredA(e: any): void { }
      
            
            // 3
          public chartTypeB: string = 'line';
      
          public chartDatasetsB: Array<any> = [
            { data: [65], label: 'Total Lead' },
            { data: [22], label: 'Todays Lead' },
            { data: [10], label: 'Pendig Lead' },
            { data: [28], label: 'Converted Lead' },
          ];
      
          public chartLabelsB: Array<any> = ['1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '8 PM'];
      
          public chartColorsB: Array<any> = [
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
      
          public chartOptionsB: any = {
            responsive: true
          };
          public chartClickedB(e: any): void { }
          public chartHoveredB(e: any): void { }
      
          // 4
      
          public chartTypeC: string = 'pie';
      
          public chartDatasetsC: Array<any> = [
            { data: [50, 300, 100, 120, 150], label: 'Call durations' }
          ];
      
          public chartLabelsC: Array<any> = ['Total', 'Created', 'Failed', 'Converted', 'Pending'];
      
          public chartColorsC: Array<any> = [
            {
              backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#32a871'],
              hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#32a871'],
              borderWidth: 2,
            }
          ];
      
          public chartOptionsC: any = {
            responsive: true
          };
          public chartClickedC(e: any): void { }
          public chartHoveredC(e: any): void { }
  
          // 5
      
          public chartTypeD: string = 'pie';
      
          public chartDatasetsD: Array<any> = [
            { data: [50, 300, 100, 120, 150], label: 'Call durations' }
          ];
      
          public chartLabelsD: Array<any> = ['Total', 'Created', 'Failed', 'Converted', 'Pending'];
      
          public chartColorsD: Array<any> = [
            {
              backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#32a871'],
              hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#32a871'],
              borderWidth: 2,
            }
          ];
      
          public chartOptionsD: any = {
            responsive: true
          };
          public chartClickedD(e: any): void { }
          public chartHoveredD(e: any): void { }
      



  constructor() { }

  ngOnInit(): void {
  }

}
