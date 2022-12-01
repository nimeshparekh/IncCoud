import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SingleDataSet, Label } from 'ng2-charts';


export interface PeriodicElement {
  name: string; 
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-conference-details',
  templateUrl: './conference-details.component.html',
  styleUrls: ['./conference-details.component.css']
})
export class ConferenceDetailsComponent implements OnInit {

  public pieChartLabels = [] ;
  public pieChartData = [] ;
  public pieChartType = 'pie';

  public pieChartColors: Array < any > = [{
    backgroundColor: ['#00bfff', '#800000','#008000','#008080'], //, '#fdf57d'
    borderColor: ['#00bfff', '#800000','#008000','#008080'] //, 'rgba(241, 107, 119, 0.2)'
  }];

  name = '';
  date = '';
  membertype = '';
  did = '';
  members = [];
  Length = 0;
  confid = this.route.snapshot.paramMap.get('id');
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['member_id','member_name', 'member_name', 'sendsms_status', 'callstatus'];

  @ViewChild('paginator') paginator: MatPaginator;
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private userservice: UserService) { }

  ngOnInit(): void {
    this.getConferenceCallDetail(this.confid);
    this.getConferenceMembers(this.confid);
    this.findconferencechart(this.confid);
  }

  async findconferencechart(id) {
    await this.userservice.findconferencechart(id).then(
      data => {
       this.pieChartLabels.push('Total Members');
       this.pieChartLabels.push('Joined Members');
       this.pieChartLabels.push('Unjoined Members');
       this.pieChartLabels.push('Left Members');
       var total = (data['data']['joined']) + (data['data']['unjoined']) + (data['data']['leftp']);
       //var total = (2) + (3) + (1);
       this.pieChartData.push(total);
       this.pieChartData.push(data['data']['joined']);
       this.pieChartData.push(data['data']['unjoined']);
       this.pieChartData.push(data['data']['leftp']);
      },
      err => {
        console.log('error');
      }
    );
  }

  async getConferenceCallDetail(id) {
    await this.userservice.getConferenceCallDetail(id).then(
      data => {
        this.name = data['data'].conf_name;
        this.date = data['data'].conf_date;
        this.did = data['data'].conf_did;
        this.membertype = data['data'].conf_membertype;
      },
      err => {
        console.log('error');
      }
    );
  }

  async getConferenceMembers(id) {
    await this.userservice.getConferenceMembers(id).then(
      data => {
        this.dataSource = data['data'];
        this.Length = data['data'].length;
      },
      err => {
        console.log('error');
      }
    );
  }


}
