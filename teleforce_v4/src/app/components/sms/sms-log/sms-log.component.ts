import { Component, OnInit,  ViewChild,Injectable} from '@angular/core';
import { SmscampaignService } from '../../../smscampaign.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder,FormGroup } from '@angular/forms';
import { merge } from "rxjs";
import { tap } from 'rxjs/operators';
import { LogDataSource } from "./log.datasource";
import { ManagerService } from "../../../manager.service";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-sms-log',
  templateUrl: './sms-log.component.html',
  styleUrls: ['./sms-log.component.css']
})
export class SmsLogComponent implements OnInit {
  settings = {};

  displayedColumns: string[] = ['id', 'date','mobile','status','credit'];
  Length = 0;
  isLoading = false;
  totalcredit=0;
  public searchform: FormGroup;
  smstatus=[];  
  public dataSource: LogDataSource;
  sortcolumn = 'sentdate';
  sortdirection = 'DESC';

  constructor(private smsscampaignervice: SmscampaignService,private fb: FormBuilder,  
    public router: Router,
   private managerservice: ManagerService,
    ) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngOnInit() {
    this.dataSource = new LogDataSource(this.smsscampaignervice); // create new object
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      mobile: [null],
      status: [null],
    });
    this.accesssetting();
    this.getLog();
    this.getSMStatus();
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }

  async getLog() {
    //console.log(this.searchform);
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    await this.smsscampaignervice.getSMSLog(data).then(
      data => {       
        //this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
        this.gettotalcredit();
        //this.totalcredit = data['data'][0].totalcredit;
      },
      err => {
        console.log('error');
      }
    );
  }
  async gettotalcredit() {
    let data: any = Object.assign(this.searchform.value);
    await this.smsscampaignervice.getSMSTotalCredit(data).then(
      data => {
        this.totalcredit = data['data'][0].totalcredit;
      },
      err => {
        console.log('error');
      }
    );
  }
  
  async getSMStatus() {
    var userid = localStorage.getItem('access_id');
    await this.smsscampaignervice.getSMStatus(userid).then(
      data => {
        this.smstatus = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    merge(this.paginator.page)
      .pipe(
        tap(() => this.loadContactPage())

      )
      .subscribe();
  }


  loadContactPage() {
    let data: any = Object.assign(this.searchform.value);
    this.getLog();
    this.dataSource.loadContacts(data
      , this.sortcolumn, this.sortdirection,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }
  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [''],
      enddate: [''],
      mobile: [null],
      status: [null]
    });
    this.getLog()
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }
  searchData(){
    this.getLog();
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }
  
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('13')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '13') {
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

