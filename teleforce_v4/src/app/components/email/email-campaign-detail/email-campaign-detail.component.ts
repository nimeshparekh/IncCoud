import { Component, OnInit, ViewChild, Inject,Injectable } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from '../../../email.service';
import { MatSort } from '@angular/material/sort';
import {CampaginsDataSource} from "./campagins.datasource";
import { merge } from "rxjs";
import { tap } from 'rxjs/operators';
import { ManagerService } from "../../../manager.service";

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-email-campaign-detail',
  templateUrl: './email-campaign-detail.component.html',
  styleUrls: ['./email-campaign-detail.component.css']
})
export class EmailCampaignDetailComponent implements OnInit {
  campaignid = this.route.snapshot.paramMap.get('id');
  campaignname = '';
  segment = ''
  date = '';
  count = '';
  isLoading = true;
  template = '';
  emailserver = '';
  link = '';
  hit_count = 0;
  cam_type = '';
  total = 0;
  searchform: FormGroup;
  emailsent = 0;
  campaigntype = null;
  status = null;
  emaildeliver = 0;
  public logdataSource: CampaginsDataSource;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'emailid', 'date', 'delivery_date','open_date', 'status','action'];
  Length = 0;
  sortcolumn='date';
  sortdirection='DESC';

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private emailservice: EmailService    ,public router: Router, private managerservice: ManagerService,

  ) { }

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;
  ngOnInit() {
    this.dataSource = new MatTableDataSource(); // create new object
    this.searchform = this.fb.group({
      campaignid: [this.campaignid],
      name: [''],
      email:[''],
      status: [''],
      startdate: [''],
      enddate: [''],
    });
   this.accesssetting();
    this.getcampaigndetail();
    this.totalData()
    this.logdataSource = new CampaginsDataSource(this.emailservice);
    var currentdate = new Date();
    let data: any = Object.assign(this.searchform.value);
    this.logdataSource.loadContacts(data,this.sortcolumn,this.sortdirection, 0, 50);
  }refresh() {
    this.getcampaigndetail();
  }
  Filtercontact() {
    let data: any = Object.assign(this.searchform.value);
    this.totalData();
    this.logdataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }
  resetform() {
    this.searchform = this.fb.group({
      campaignid: [this.campaignid],
      name: [''],
      email:[''],
      status: [''],
      startdate: [''],
      enddate: [''],
    });
    this.getcampaigndetail();
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('14')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '14') {
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
  getcampaigndetail() {
    this.emailservice.getcampaigndetail(this.campaignid).then(data => {
      if (data) {
        this.campaignname = data['data'][0]['cam_name'];
        this.template = data['data'][0]['email_title'];
        this.emailserver = data['data'][0]['smtp_server'];
        this.link = data['data'][0]['sl_url'];
        this.segment = data['data'][0]['name'];
        this.date = data['data'][0]['cam_date'];
      }
    },
      err => {
        console.log('error');
      })

  }
  

  ngAfterViewInit() {
      merge(this.paginator.page)
      .pipe(
          tap(() => this.loadContactPage())
      )
      .subscribe();  
  }
  
  loadContactPage(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.logdataSource.loadContacts(data,
      this.sortcolumn,this.sortdirection,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }
  sortData(event) {
    let data: any = Object.assign(this.searchform.value);
    this.sortcolumn=event['active'];
    this.sortdirection=event['direction'];
    this.logdataSource.loadContacts(data,event['active'],event['direction'], this.paginator.pageIndex, this.paginator.pageSize);
  }
  totalData() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.emailservice.searchCampaignEmailLog(data).then(
      data => {
        this.Length = data['data'][0].total;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }
  directlogin(username) {
    this.emailservice.redirect_email_to_lms(username).then(
      data => {
        console.log("leads",data['data'].l_id);
        var id = data['data'].l_id
        const path = '/lead-details/'+id;
        this.router.navigate([path]);
        window.location.href = '/lead-details/'+id;
      },
      err => {
        console.log('error');
      }
    );
    // this.managerservice.supervisiordirectLogin({managername:username,isadmin:true}).then(
    //   data => {
    //     console.log(data);
    //     this._snackBar.open('Login Successful !!', '', {
    //       duration: 2000,
    //     });
    //     const path = '/dashboard/';
    //     this.router.navigate([path]);
    //     window.location.href = '/dashboard/';
    //   },
    //   err => {
    //     console.log('error');
    //     this._snackBar.open('Authentication Failed !!', '', {
    //       duration: 2000,
    //     });
    //     localStorage.removeItem('access_token');
    //     localStorage.clear();

    //   });
  }
  regenerateemailcampaign(): void {
    let data: any = Object.assign(this.searchform.value);
    const dialogRef = this.dialog.open(RegenerateEmailCampaignComponent, {
      width:"700px",
      disableClose: true,data:{filterdata:data}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getlist();
      }
    });
  }
  
}

@Component({
  selector: 'app-regenerate-email-campaign',
  templateUrl: './regenerate-email-campaign.component.html',
  styleUrls: ['./email-campaign-detail.component.css']
})
export class RegenerateEmailCampaignComponent implements OnInit {
  value = 5;
  load = false
  list = [];
  templist = [];
  emailserver = [];
  public addConForm: FormGroup;
  public bulkForm: FormGroup;
  charcount = 0;
  lenth = 0;
  formdata = [];
  smsserver = [];
  msgcharcnt = 0
  msgcredit = 1;
  msgunicode = false;
  credit = 0;
  chartxt = 'characters.'
  segment = [];
  attachfile = '';
  isLoading = true;
  stagelist = []
  statuslist = []
  

  constructor(
    public dialogRef: MatDialogRef<RegenerateEmailCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private emailservice: EmailService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  public ngOnInit(): void {
    let userinfo = localStorage.getItem('access_id');
    this.bulkForm = this.fb.group({
      cam_name: [null, [Validators.required]],
      sendername: [null, [Validators.required]],
      senderaddress: [null, [Validators.required]],
      replyname: [null, [Validators.required]],
      replyaddress: [null, [Validators.required]],
      template: [null, [Validators.required]],
      startdate: [null, [Validators.required]],
    });
    this.getTemplateList();
    this.getStagesList()
  }  
 
  async getTemplateList() {
    await this.emailservice.getemailtemplatedata().then(data => {
      if (data) {
        this.templist = (data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }
  async getStagesList() {
    var userid = localStorage.getItem('access_id');  
    await this.emailservice.getStagesList(userid).then(data => {
      if (data) {
        console.log(data['data']);
        this.stagelist = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSendername(event){
    //console.log(event)
    this.bulkForm.get('senderaddress').setValue(event.toLowerCase());
  }

  bulksubmit() {
    let data: any = Object.assign(this.bulkForm.value);
    data.filterdata = this.data.filterdata;
    if (this.bulkForm.invalid == true) {
      console.log("Error");
      return
    }
    else {
      this.load = true
      this.emailservice.regenerateemailcampagin(data).then(
        data => {
            this.load = false
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
        },
        err => {
          this.load = false
          console.log('error');
        }
      );
    }
  }

}



