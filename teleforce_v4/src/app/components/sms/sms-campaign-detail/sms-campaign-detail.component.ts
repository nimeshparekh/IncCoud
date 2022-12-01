import { Component, OnInit, ViewChild, Injectable, Inject } from '@angular/core';
import { SmscampaignService } from '../../../smscampaign.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { CampaginsDataSource } from "./campagins.datasource";
import { environment } from '../../../../environments/environment';
import { merge } from "rxjs";
import { tap } from 'rxjs/operators';
import { ManagerService } from "../../../manager.service";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-sms-campaign-detail',
  templateUrl: './sms-campaign-detail.component.html',
  styleUrls: ['./sms-campaign-detail.component.css']
})
export class SmsCampaignDetailComponent implements OnInit {
  campaignid = this.route.snapshot.paramMap.get('id');
  campaignname = '';
  date = '';
  count = '';
  isLoading = true;
  template = '';
  link = '';
  hit_count = '';
  cam_type = '';
  total = 0;
  searchform: FormGroup;
  smssent = 0;
  campaigntype = null;
  smsdeliver = 0;
  totalsms = 0;
  totalsmscredit = 0;
  totaldata = 0
  config: any;
  collection = { count: 0, data: [] };
  public contactdataSource: CampaginsDataSource;
  displayedColumns: string[] = ['id', 'date', 'name', 'mobile', 'status', 'credit'];
  Length = 0;
  sortcolumn = 'date';
  sortdirection = 'DESC';
  totalsmsfailed=0;
  totalsmsdelivered=0;
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,  public router: Router,
    private managerservice: ManagerService,
    private smscampaignservice: SmscampaignService) {
  }
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  ngOnInit() {
    this.contactdataSource = new CampaginsDataSource(this.smscampaignservice);
    this.searchform = this.fb.group({
      customer_id: [this.campaignid],
      name: [''],
      mobile: [''],
      startdate: [''],
      enddate: [''],
    });
    this.searchData()
    this.accesssetting();
    //   this.getpromsnalcamdetail();
    this.getcampaigndetail();
    this.gethitcount();
    //this.getsmssent();
    this.getsmsdeliver();
    let data: any = Object.assign(this.searchform.value);
    this.contactdataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }
  resetform() {
    this.searchform = this.fb.group({
      customer_id: [this.campaignid],
      name: [''],
      mobile: [''],
      startdate: [''],
      enddate: [''],
    });
    this.gethitcount();
    this.getcampaigndetail();
    //this.getsmssent();
    this.getsmsdeliver();
    this.getTotalSMSCreditUsage()
    let data: any = Object.assign(this.searchform.value);
    this.contactdataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
    this.searchData();
  }
  getsmsdeliver() {
    this.smscampaignservice.getsmsdeliver(this.campaignid).then(data => {
      if (data) {
        this.smsdeliver = data['data'][0]['deliver'];
      }
    },
      err => {
        console.log('error');
      })
  }
  /*getsmssent() {
    this.smscampaignservice.getsmssent(this.campaignid).then(data => {
      if (data) {
        this.smssent = data['data'][0]['smssent'];
      }
    },
      err => {
        console.log('error');
      })
  }*/
  getcampaigndetail() {
    this.smscampaignservice.getcampaigndetail(this.campaignid).then(data => {
      if (data) {
        //console.log(data['data']);
        this.template = data['data'][0]['sms_title'];
        this.link = data['data'][0]['sl_url'];
        this.campaignname = data['data'][0]['cam_name'];
        this.date = data['data'][0]['cam_date'];
        this.cam_type = data['data'][0]['cams_type'];
        this.campaigntype = data['data'][0]['cam_type'];
      }
    },
      err => {
        console.log('error');
      })

  }
  gethitcount() {
    this.smscampaignservice.gethitcount(this.campaignid).then(data => {
      if (data) {
        this.hit_count = data['data'][0]['count'];
        this.totaldata = data['data'][0]['total'];
      }
    },
      err => {
        console.log('error');
      })

  }
  countpercentage(linkclickcount,totalsms){
    return Math.round((linkclickcount*100)/totalsms);

  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    merge(this.contactpaginator.page)
      .pipe(
        tap(() => this.loadContactPage())

      )
      .subscribe();
  }
  Filtercontact() {
    let data: any = Object.assign(this.searchform.value);
    this.searchData();
    this.contactdataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }

  loadContactPage() {
    let data: any = Object.assign(this.searchform.value);
    this.searchData();
    this.contactdataSource.loadContacts(data
      , this.sortcolumn, this.sortdirection,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize);
  }

  searchData() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    data.campaignid = this.campaignid;
    this.smscampaignservice.searchsmscampaignumberlength(data).then(
      data => {
        if (data['data']) {
          this.Length = data['data'][0].length;
          this.totalsms = data['data'][0].length;          
          this.smssent = data['data'][0].length;          
        }
        this.isLoading = false;
        this.getTotalSMSCreditUsage()
      },
      err => {
        console.log('error');
      }
    );
  }
  getTotalSMSCreditUsage() {
    let data: any = Object.assign(this.searchform.value);
    data.campaignid = this.campaignid;
    this.smscampaignservice.getTotalSMSCreditUsage(data).then(
      data => {
        if (data['data']) {          
          if(data['data'][0].SMS_DELIVERED_CREDIT){
            this.totalsmscredit = data['data'][0].SMS_DELIVERED_CREDIT;
          }else{
            this.totalsmscredit = 0;
          } 
          this.totalsmsdelivered=  data['data'][0].SMS_DELIVERED;       
          this.totalsmsfailed=  data['data'][0].SMS_SENT_FAILED;       
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  
  exportcsv() {
    this.isLoading=true;
    let data: any = Object.assign(this.searchform.value);
    data.campaignid = this.campaignid;
    this.smscampaignservice.exportsmscampaignumberdatacsv(data).then(
      data => {
        if (data['data']) {
          var url = environment.apiUrl + '/' + data['data']
        window.open(url, '_blank');
          
        }
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
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

