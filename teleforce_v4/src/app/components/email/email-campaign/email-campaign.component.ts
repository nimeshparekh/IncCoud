import { Component, OnInit, Inject, ViewChild, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmailService } from '../../../email.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { ManagerService } from "../../../manager.service";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-email-campaign',
  templateUrl: './email-campaign.component.html',
  styleUrls: ['./email-campaign.component.css']
})
export class EmailCampaignComponent implements OnInit {


  public chartTypeFunnel2: string = 'line';

  public chartDatasetsFunnel2: Array<any> = [
    { data: [0,0,0,0,0,0], label:'EMAIL Count'}
  ];

  public chartLabelsFunnel2: Array<any> = [['SENT',0],['DELIVERD',0],['Open',0],['CLICK',0],['BOUNCE',0]]; 

  public chartColorsFunnel2: Array<any> = [
    // {
    //   backgroundColor: [
    //     'rgba(255, 99, 132, 0.2)',
    //     'rgba(54, 162, 235, 0.2)',
    //     'rgba(255, 206, 86, 0.2)',
    //     'rgba(75, 192, 192, 0.2)',
    //     'rgba(153, 102, 255, 0.2)',
    //   ],
    //   borderColor: [
    //     'rgba(255,99,132,1)',
    //     'rgba(54, 162, 235, 1)',
    //     'rgba(255, 206, 86, 1)',
    //     'rgba(75, 192, 192, 1)',
    //     'rgba(153, 102, 255, 1)',
    //   ],
    //   borderWidth: 2,
    // }
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(111, 152, 76, .2)',
      borderColor: 'rgba(111, 152, 70, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(237, 190, 40, .2)',
      borderColor: 'rgba(246, 216, 123, .8)',
      borderWidth: 2,
    }
  
  ];

  public chartOptionsFunnel2: any = {
    responsive: true
  };
  public chartClickedFunnel2(e: any): void { }
  public chartHoveredFunnel2(e: any): void { }
  emaildata :any='';
  registered = false;
  submitted = false;
  importExcelForm: FormGroup;
  serviceErrors: any = {};
  config: any;
  campaigns = [];
  groups = [];
  state = [];
  category = [];
  fileUrl;
  public contactdataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'cam_name', 'sms_title', 'total', 'cam_date', 'action'];
  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  isLoading = true;
  kyc;
  public searchform: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private sanitizer: DomSanitizer, public dialog: MatDialog, private emailservice: EmailService
    ,public router: Router, private managerservice: ManagerService,
    ) {
   

  }
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  ngOnInit() {
    var userid = localStorage.getItem('access_id');
    this.contactdataSource = new MatTableDataSource(); // create new object
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [''],
      enddate: [''],
    });
    this.getlist();
    this.searchemailcountgraph();
    this.accesssetting();
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);

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
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateEmailCampaignComponent, {
      width:"600px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getlist();
      }
    });
  }
  async updateagentdialog(cont_id) {
    const dialogRef = this.dialog.open(CreateEmailCampaignComponent, {
      disableClose: true, data: cont_id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        this.getlist();
      }
    });

  }

  deleteagentdialog(data): void {
    const dialogRef = this.dialog.open(CreateEmailCampaignComponent, {
      width: "400px", disableClose: true, data: { action: 'delete', sl_id: data.sl_id, username: data.sl_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getlist();
      }
    });
  }
  async getlist() {
    let data: any = Object.assign(this.searchform.value);
    data = 
    await this.emailservice.getEmailCampaignsData(data).then(data => {
      if (data) {
        this.contactdataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }
  public doFilter = (value: string) => {
    this.contactdataSource.filter = value.trim().toLocaleLowerCase();
  }
  resetform(){
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [''],
      enddate: [''],
    });
    this.getlist();
  }
  searchData(){
    this.getlist();
    this.searchemailcountgraph();
  }
  async searchemailcountgraph() {
    let data: any = Object.assign(this.searchform.value);
    if(data.startdate =='' && data.enddate == ''){
      data.startdate = new Date();
      data.enddate =new Date();
    }
    await this.emailservice.searchemailcountgraph(data).then(data => {
      if (data) {
  console.log(data['data']);
  
       var EMAIL_SENT =data['data']['Sent'];
       var EMAIL_DELIVERED =data['data']['Delivered'];
       var EMAIL_READ = data ['data']['Email_Read'];
       var Click =data['data']['Click'];
       var Bounce = data['data']['Bounce'];
       this.chartDatasetsFunnel2 = [
        {data:[EMAIL_SENT,EMAIL_DELIVERED,EMAIL_READ,Click,Bounce], label: 'EMAIL Count'}
      ]; 
     this.chartLabelsFunnel2 =[['SENT',EMAIL_SENT],['DELIVERD',EMAIL_DELIVERED],['Open',EMAIL_READ],['CLICK',Click],['BOUNCE',Bounce]]; 
    }
      
    },
      err => {
        console.log('error');
      })
  }
}

@Component({
  selector: 'app-create-email-campaign',
  templateUrl: './create-email-campaign.component.html',
  styleUrls: ['./email-campaign.component.css']
})
export class CreateEmailCampaignComponent implements OnInit {
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
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
    public dialogRef: MatDialogRef<CreateEmailCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private http: HttpClient,
    private emailservice: EmailService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  public ngOnInit(): void {
    let userinfo = localStorage.getItem('access_id');
    this.bulkForm = this.fb.group({
      cam_name: [null, [Validators.required]],
      lead_status: [null, [Validators.required]],
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
    if (this.bulkForm.invalid == true) {
      console.log("Error");
      return
    }
    else {
      this.load = true
      this.emailservice.saveemailcampagin(data).then(
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



