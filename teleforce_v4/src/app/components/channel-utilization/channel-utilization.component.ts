import { Component, OnInit , ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
@Component({
  selector: 'app-channel-utilization',
  templateUrl: './channel-utilization.component.html',
  styleUrls: ['./channel-utilization.component.css']
})
export class ChannelUtilizationComponent implements OnInit {

  isLoading=true;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'client', 'assignchannel'];
  Length = 0;
  showtotal;

  constructor(private reportservice: ReportService,) { }

  @ViewChild('paginator') paginator: MatPaginator; 

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    this.getChannelUtilizationData();
  }
  async getChannelUtilizationData(){
    this.isLoading = true;
    this.reportservice.getChannelUtilizationData().then(
      data => {
        //this.datalist = data['data'];
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
        this.showtotal = (data['data'][0]);
        console.log(data['data'][0]);
      },
      err => {
        console.log('error');
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
