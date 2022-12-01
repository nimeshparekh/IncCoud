import { Component, OnInit , ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { MatDialog } from '@angular/material/dialog';
import { ManagerAgentListComponent } from '../manager-agent-list/manager-agent-list.component';

@Component({
  selector: 'app-manager-user-report',
  templateUrl: './manager-user-report.component.html',
  styleUrls: ['./manager-user-report.component.css']
})
export class ManagerUserReportComponent implements OnInit {

  isLoading = true;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'client', 'userlimit', 'currentuser', 'expirydate'];
  Length = 0;
  showtotal;

  constructor(
      private reportservice: ReportService,      
       public dialog: MatDialog,    ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    this.getManagerUserData();
  }

  async getManagerUserData() {
    this.isLoading = true;
    this.reportservice.getManagerUserData().then(
      data => {
        //this.datalist = data['data'];
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  showAgents(id): void {
    const dialogRef = this.dialog.open(ManagerAgentListComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Cancel'){
        this.getManagerUserData();
      }
    });
  }

  
}
