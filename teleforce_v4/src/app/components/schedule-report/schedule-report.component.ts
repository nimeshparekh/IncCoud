import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateScheduleReportComponent } from '../create-schedule-report/create-schedule-report.component';
import {Router} from "@angular/router";
@Component({
  selector: 'app-schedule-report',
  templateUrl: './schedule-report.component.html',
  styleUrls: ['./schedule-report.component.css']
})
export class ScheduleReportComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'report_name','email','frequency'];
  Length = 0;
  isLoading = true;
  kyc;
  constructor(private userservice: UserService,
    public dialog: MatDialog,private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getSechudelData(userid);
  }
  async getSechudelData(id){
    await this.userservice.getSechudelreportData(id).then(
      data => {
       // console.log(data['data']);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );

  }

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateScheduleReportComponent, {
      width: '340px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getSechudelData(userid);
      }
    });
  }






  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async checkkyc(id){
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
        }else{
          this.router.navigate(['/kyc-document-upload']);
        }        
      },
      err => {
        console.log('error');
      }
    );
  }

}
