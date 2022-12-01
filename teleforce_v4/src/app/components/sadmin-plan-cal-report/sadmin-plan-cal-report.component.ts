import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-sadmin-plan-cal-report',
  templateUrl: './sadmin-plan-cal-report.component.html',
  styleUrls: ['./sadmin-plan-cal-report.component.css']
})
export class SadminPlanCalReportComponent implements OnInit {
  public searchform: FormGroup;
  managerlist = [];
  config: any;
  collection = { count: 0, data: [] };
  
  public contactdataSource: MatTableDataSource<any>;
  displayedColumns = ["id", "account_name", "Tele_Plan_Minuites","totalpulse","Tele_Plan_Available","Tele_Startdate","Tele_Expire"];
  contactLength = 0;
  isLoadingcon = true;
  isLoading =true;
  Length = 0;
  constructor(private fb: FormBuilder, private reportservice: ReportService) {
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.count
    };
  }

  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      managerid: [null]
    });
    //this.getManager();
    this.contactdataSource = new MatTableDataSource(); // create new object
    this.getData();
  }

  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }

  async getManager() {
    let userinfo = localStorage.getItem('access_id');
    await this.reportservice.getManager(userinfo).then(data => {
      console.log("Data");
      console.log(JSON.stringify(data));
      if (data) {
        this.managerlist = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  async searchData() {

  }

  async getData(){
    this.isLoading = true;
    var userid = localStorage.getItem('access_id'); 
    this.reportservice.getPackageManager(userid).then(
      data => {
        
        
        for(var i=0;i<data['data'].length;i++){
          var used = Math.floor((data['data'][i]['Tele_Plan_Minuites']- data['data'][i]['totalpulse']));
          data['data'][i]['Tele_Plan_Available'] = used;
        }
         this.contactdataSource.data = data['data'];
         this.contactLength = data['data'].length;
         this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }

}
