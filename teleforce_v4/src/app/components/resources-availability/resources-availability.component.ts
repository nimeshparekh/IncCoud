import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-resources-availability',
  templateUrl: './resources-availability.component.html',
  styleUrls: ['./resources-availability.component.css']
})
export class ResourcesAvailabilityComponent implements OnInit {

  isLoading = true;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'client', 'allocateddid', 'useddid', 'allocatedutilization'];
  Length = 0;
  showtotal;

  constructor(private reportservice: ReportService, ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    this.getResourceAvailability();

  }

  async getResourceAvailability() {
    this.isLoading = true;
    this.reportservice.getResourceAvailability().then(
      data => {
        //this.datalist = data['data'];
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
        this.showtotal = (data['data'][0]);
        //console.log(data['data'][0]);
      },
      err => {
        console.log('error');
      }
    );
  }
  roundedPercentage(myValue, totalValue) {
    var result = ((myValue / totalValue) * 100)
    return Math.round(result);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
