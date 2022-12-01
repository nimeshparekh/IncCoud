import { Component, OnInit,  ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-package-callduration-report',
  templateUrl: './package-callduration-report.component.html',
  styleUrls: ['./package-callduration-report.component.css']
})
export class PackageCalldurationReportComponent implements OnInit {

  isLoading=true;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'packagedate', 'expdate', 'incoming','outgoing','dialer'];
  Length = 0;
  showtotal :any;
  used = 0;
  total_minuites=0;

  constructor(private reportservice: ReportService,
    private userservice: UserService,  
    private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 
    this.getData();
  }

  async getData(){
    this.isLoading = true;
    var userid = localStorage.getItem('access_id'); 
    this.reportservice.getPackageCallDurationData(userid).then(
      data => {
        //this.datalist = data['data'];
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
        this.showtotal = (data['data'][0]);
        this.total_minuites= Math.floor((this.showtotal.Plan_minuits+this.showtotal.free_minuites))
        //this.used = Math.floor((this.showtotal.incoming+this.showtotal.outgoing+this.showtotal.dialer)/60);
        this.used = Math.floor((this.showtotal.incoming+this.showtotal.outgoing+this.showtotal.dialer));
        //console.log(data['data'][0]);
      },
      err => {
        console.log('error');
      }
    );
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
