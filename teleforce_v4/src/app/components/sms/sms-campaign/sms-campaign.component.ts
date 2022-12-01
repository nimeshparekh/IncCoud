import { Component, OnInit, Inject, ViewChild, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmscampaignService } from '../../../smscampaign.service';
import { CrudService } from '../../../crud.service';
import { UserService } from '../../../user.service';
import { AuthService } from '../../../auth.service';
import { TemplateService } from '../../../template.service';
import { setValue } from '@syncfusion/ej2-base';
import { ManagerService } from "../../../manager.service";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-sms-campaign',
  templateUrl: './sms-campaign.component.html',
  styleUrls: ['./sms-campaign.component.css']
})
export class SmsCampaignComponent implements OnInit {

  public chartTypeFunnel2: string = 'bar';

  public chartDatasetsFunnel2: Array<any> = [
    { data: [0, 0, 0, 0, 0], label: 'SMS Count' }
  ];

  public chartLabelsFunnel2: Array<any> = [['Sent', 0], ['SUBMIT ACCEPTED', 0], ['SUBMIT FAILED', 0], ['DELIVERY SUCCESS', 0], ['DELIVERY FAILED', 0]];

  public chartColorsFunnel2: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsFunnel2: any = {
    responsive: true
  };
  public chartClickedFunnel2(e: any): void { }
  public chartHoveredFunnel2(e: any): void { }

  balance_sms = 0;
  sms_credit = 0;
  sms_used = 0;
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
  displayedColumns: string[] = ['id', 'cam_name', 'type', 'sms_title', 'total', 'cam_date', 'cam_status', 'action'];
  contactLength = 0;
  isLoadingcon = true;
  isLoading = true;
  public searchform: FormGroup;
  public approvedataSource: MatTableDataSource<any>;
  approveColumns: string[] = ['id', 'cam_name', 'type', 'sms_title', 'total', 'cam_date', 'action'];
  approveLength = 0;
  public completedataSource: MatTableDataSource<any>;
  completeColumns: string[] = ['id', 'cam_name', 'type', 'sms_title', 'total', 'cam_date', 'action'];
  completeLength = 0;
  public notapprovedataSource: MatTableDataSource<any>;
  notapproveColumns: string[] = ['id', 'cam_name', 'type', 'sms_title', 'total', 'cam_date', 'action'];
  notapproveLength = 0;
  public declinedataSource: MatTableDataSource<any>;
  declineColumns: string[] = ['id', 'cam_name', 'type', 'sms_title', 'total', 'cam_date', 'action'];
  declineLength = 0;
  usertype;
  tablabel = 'Approve';
  whatsapp_api = 0;
  settings = []
  constructor(public router: Router,
    private managerservice: ManagerService,
    private authservice: AuthService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder, private http: HttpClient, private sanitizer: DomSanitizer, public dialog: MatDialog, private smscampaignservice: SmscampaignService) {

  }
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  @ViewChild('approvepaginator') approvepaginator: MatPaginator;
  @ViewChild('notapprovepaginator') notapprovepaginator: MatPaginator;
  @ViewChild('completepaginator') completepaginator: MatPaginator;
  @ViewChild('declinepaginator') declinepaginator: MatPaginator;
  ngOnInit() {
    var userid = localStorage.getItem('access_id');
    this.contactdataSource = new MatTableDataSource(); // create new object
    this.approvedataSource = new MatTableDataSource(); // create new object
    this.notapprovedataSource = new MatTableDataSource(); // create new object
    this.completedataSource = new MatTableDataSource(); // create new object
    this.declinedataSource = new MatTableDataSource(); // create new object
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/contact.xlsx');
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [''],
      enddate: [''],
    });
    //this.getlist();
    this.searchsmsbalancedata();
    this.totalcountsmsgraph();
    this.getRole();
  }


  async getRole() {
    this.authservice.getRole(localStorage.getItem('access_id')).then(
      data => {
        //console.log(data['data']);    
        this.usertype = data['data'].account_type;
        if (this.usertype == 2) {
          if (this.tablabel == 'Approve') {
            this.getManagerApproveSMSCampaignList(0);
          }
          if (this.tablabel == 'Not Approve') {
            this.getManagerNotApproveSMSCampaignList(2);
          }
          if (this.tablabel == 'Complete') {
            this.getManagerCompleteSMSCampaignList(1);
          }
          if (this.tablabel == 'Decline') {
            this.getManagerDeclineSMSCampaignList(3);
          }
          //this.getManagerSMSCampaignList(2);
        }
        if (this.usertype == 1) {
          this.getlist();
        }
      },
      err => {
        console.log('error');
      })
  }

  onTabClick(event) {
    console.log(event.tab.textLabel);
    this.tablabel = event.tab.textLabel;
    if (event.tab.textLabel == 'Approve') {
      this.getManagerApproveSMSCampaignList(0);
    }
    if (event.tab.textLabel == 'Not Approved') {
      this.getManagerNotApproveSMSCampaignList(2);
    }
    if (event.tab.textLabel == 'Completed') {
      this.getManagerCompleteSMSCampaignList(1);
    }
    if (event.tab.textLabel == 'Declined') {
      this.getManagerDeclineSMSCampaignList(3);
    }
  }
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
    this.approvedataSource.paginator = this.approvepaginator;
    this.notapprovedataSource.paginator = this.notapprovepaginator;
    this.completedataSource.paginator = this.completepaginator;
    this.declinedataSource.paginator = this.declinepaginator;
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateSmsCampaignComponent, {
      width: "600px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getRole();
      }
    });
  }
  async updateagentdialog(cont_id) {
    const dialogRef = this.dialog.open(CreateSmsCampaignComponent, {
      disableClose: true, data: cont_id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        this.getRole();
      }
    });

  }

  deleteagentdialog(data): void {
    const dialogRef = this.dialog.open(CreateSmsCampaignComponent, {
      width: "400px", disableClose: true, data: { action: 'delete', sl_id: data.sl_id, username: data.sl_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getRole();
      }
    });
  }
  async getlist() {
    let data: any = Object.assign(this.searchform.value);
    await this.smscampaignservice.getSMSCampaignsData(data).then(data => {
      if (data) {
        // console.log(data['data']);
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
  async getManagerApproveSMSCampaignList(camstatus) {
    let data: any = Object.assign(this.searchform.value);
    data.camstatus = camstatus;
    //console.log(data);    
    await this.smscampaignservice.getManagerSMSCampaignList(data).then(data => {
      if (data) {
        //console.log(data['data']);
        this.approvedataSource.data = data['data'];
        this.approveLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }

  async getManagerNotApproveSMSCampaignList(camstatus) {
    let data: any = Object.assign(this.searchform.value);
    data.camstatus = camstatus;
    await this.smscampaignservice.getManagerSMSCampaignList(data).then(data => {
      if (data) {
        //console.log(data['data']);
        this.notapprovedataSource.data = data['data'];
        this.notapproveLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }

  async getManagerCompleteSMSCampaignList(camstatus) {
    let data: any = Object.assign(this.searchform.value);
    data.camstatus = camstatus;
    //console.log(data);    
    await this.smscampaignservice.getManagerSMSCampaignList(data).then(data => {
      if (data) {
        //console.log(data['data']);
        this.completedataSource.data = data['data'];
        this.completeLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }
  async getManagerDeclineSMSCampaignList(camstatus) {
    let data: any = Object.assign(this.searchform.value);
    data.camstatus = camstatus;
    //console.log(data);    
    await this.smscampaignservice.getManagerSMSCampaignList(data).then(data => {
      if (data) {
        console.log(data['data']);
        this.declinedataSource.data = data['data'];
        this.declineLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }



  async searchsmsbalancedata() {
    var userid = localStorage.getItem('access_id');
    await this.smscampaignservice.searchsmsbalancedata(userid).then(data => {
      if (data) {
        //console.log(data['data']);
        this.sms_credit = data['data']['sms_credit'];
        this.balance_sms = data['data']['balance_sms'];
        this.sms_used = data['data']['sms_used'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async totalcountsmsgraph() {
    let data: any = Object.assign(this.searchform.value);
    await this.smscampaignservice.totalcountsmsgraph(data).then(data => {
      if (data) {
        //console.log(data['data']);
        var DELIVERY_FAILED = data['data']['DELIVERY_FAILED'];
        var DELIVERY_SUCCESS = data['data']['DELIVERY_SUCCESS'];
        var SUBMIT_ACCEPTED = data['data']['SUBMIT_ACCEPTED'];
        var SUBMIT_FAILED = data['data']['SUBMIT_FAILED'];
        var TOTAL_SMS_SENT = data['data']['TOTAL_SMS_SENT'];

        this.chartDatasetsFunnel2 = [
          { data: [TOTAL_SMS_SENT, SUBMIT_ACCEPTED, SUBMIT_FAILED, DELIVERY_SUCCESS, DELIVERY_FAILED], label: 'SMS Count' }
        ];
        this.chartLabelsFunnel2 = [['Sent', TOTAL_SMS_SENT], ['SUBMIT ACCEPTED', SUBMIT_ACCEPTED], ['SUBMIT FAILED', SUBMIT_FAILED], ['DELIVERY SUCCESS', DELIVERY_SUCCESS], ['DELIVERY FAILED', DELIVERY_FAILED]];
      }
    },
      err => {
        console.log('error');
      })
  }
  searchData() {
    this.getRole();
    this.totalcountsmsgraph();
  }

  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [''],
      enddate: [''],
    });
    this.getlist();
  }
  async approvecampaign(camid) {
    if (confirm("Are you sure to approve this campaign?")) {
      await this.smscampaignservice.approvesmscampaign(camid).then(data => {
        if (data) {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getManagerApproveSMSCampaignList(0);
          this.getManagerNotApproveSMSCampaignList(2);
        }
      },
        err => {
          console.log('error');
        })
    }
  }
  async rejectcampaign(camid) {
    if (confirm("Are you sure to reject this campaign?")) {
      await this.smscampaignservice.rejectsmscampaign(camid).then(data => {
        if (data) {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getManagerApproveSMSCampaignList(0);
          this.getManagerNotApproveSMSCampaignList(2);
        }
      },
        err => {
          console.log('error');
        })
    }
  }
}

@Component({
  selector: 'app-create-sms-campaign',
  templateUrl: './create-sms-campaign.component.html',
  styleUrls: ['./sms-campaign.component.css']
})
export class CreateSmsCampaignComponent implements OnInit {

  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  sl_id = '';
  segment = [];
  formsdata = [];
  leadstatus = [];
  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public bulkForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;
  msgcharcnt = 0
  msgcredit = 1;
  msgunicode = false
  chartxt = 'characters.'
  charcount = 0;
  lenth = 0;
  credit = 0;
  smslinks = []
  smstemplist = []
  whatsapptemplist = []
  msgmode = false;
  promontionalmode = false;
  transactionalmode = false;
  var1 = false;
  var2 = false;
  var3 = false;
  var4 = false;
  var5 = false;
  customvar1 = false;
  customvar2 = false;
  customvar3 = false;
  customvar4 = false;
  customvar5 = false;
  originalmsg = '';
  textmode = false;
  whatsappmode = false;
  public searchform: FormGroup;
  usertype=2;
  access=0;
  msg ='';
  access_whatsapp =0;
  isDisabled=false;
  constructor(
    public dialogRef: MatDialogRef<CreateSmsCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private smscampaignservice: SmscampaignService,
    private crudservice: CrudService,
    private userservice: UserService,
    private templateservice: TemplateService,
    private authservice: AuthService
  ) { }

  public ngOnInit(): void {
    this.getRole();
    let userinfo = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      this.addmode = false
      if (this.data.action == 'delete') {
        this.deletemode = true
        this.sl_id = this.data.sl_id
      } else {
        this.editmode = true
        this.bulkForm = this.fb.group({
          name: [this.data.sl_name, [Validators.required]],
          url: [this.data.sl_url, [Validators.required]],
          sl_id: [this.data.sl_id],
        })
      }
    } else {
      this.bulkForm = this.fb.group({
        campaigntype: ["1"],
        segments: [null],
        leadstatus: [null],
        cam_name: [null, [Validators.required]],
        formdata: [null],
        smstype: ["text"],
        smstemp: [null],
        message: [null],
        link: [null],
        startdate: [null, [Validators.required]],
        var1: [null],
        var2: [null],
        var3: [null],
        var4: [null],
        var5: [null],
        sms_credits: [null],
        customvar1: [null],
        customvar2: [null],
        customvar3: [null],
        customvar4: [null],
        customvar5: [null],
      });
      this.chechsmstype("text");
      this.changecampaigntype(1);
      this.var1 = false;
      this.var2 = false;
      this.var3 = false;
      this.var4 = false;
      this.var5 = false;
    }
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code  
    this.link_list();
    this.getFormsData();
    this.getSmsData(localStorage.getItem("access_id"));
    this.getallsegments();
    this.getleadstatus();
    this.accesssetting()
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

       await this.userservice.accesssetting(userid).then(
         data => {
          this.access_whatsapp =data['data'][19]['setting_value']
          
          console.log("accesss",this.access_whatsapp);
          
          
         },
         err => {
           console.log('error');
         }
       );
     }
  async getRole() {
    this.authservice.getRole(localStorage.getItem('access_id')).then(
      data => {
        //console.log(data['data']);    
        this.usertype = data['data'].account_type;
        if (this.usertype == 2) {
          this.bulkForm = this.fb.group({
            campaigntype: ["1"],
            segments: [null],
            leadstatus: [null],
            cam_name: [null, [Validators.required]],
            formdata: [null],
            smstype: ["text"],
            smstemp: [null],
            message: [null],
            link: [null],
            startdate: [null, [Validators.required]],
            var1: [null],
            var2: [null],
            var3: [null],
            var4: [null],
            var5: [null],
            sms_credits: [null],
            customvar1: [null],
            customvar2: [null],
            customvar3: [null],
            customvar4: [null],
            customvar5: [null],
          });
        }
        if (this.usertype == 1) {
          this.transactionalmode = true;
          this.promontionalmode = false;
          this.bulkForm = this.fb.group({
            campaigntype: ["0"],
            segments: [null],
            leadstatus: [null],
            cam_name: [null, [Validators.required]],
            formdata: [null],
            smstype: ["text"],
            smstemp: [null],
            message: [null],
            link: [null],
            startdate: [null, [Validators.required]],
            var1: [null],
            var2: [null],
            var3: [null],
            var4: [null],
            var5: [null],
            sms_credits: [null],
            customvar1: [null],
            customvar2: [null],
            customvar3: [null],
            customvar4: [null],
            customvar5: [null],
          });
        }

      },
      err => {
        console.log('error');
      })
  }

  onNoClick(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  formChanged() {
    this.wasFormChanged = true;
  }
  bulksubmit() {
    this.submitted = true;

    if (this.bulkForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.bulkForm.value);
      this.isDisabled = true;

      this.smscampaignservice.saveSMSCampaign(data).then(
        data => {
          if (data['data'] == "servernotfound") {
            if (this.transactionalmode) {
              this._snackBar.open('Transctional sms server not assigned.Please contact admin.', '', {
                duration: 2000, verticalPosition: 'top'
              });
              this.isDisabled = false;

            }
            if (this.promontionalmode) {
              this._snackBar.open('Promotional sms server not assigned.Please contact admin.', '', {
                duration: 2000, verticalPosition: 'top'
              });
              this.isDisabled = false;

            }
          } else {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.isDisabled = false;

          }
          // this.toastr.success(data['data']);
          this.dialogRef.close({ event: 'Add' });

        },
        err => {
          console.log('error');
        }
      );
    }

  }
  async contactdelete(id) {
    await this.smscampaignservice.deleteSMSLink(id).then(data => {
      if (data) {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
      }
    },
      err => {
        console.log('error' + err);
      })
  }
  async getallsegments() {
    let userid = localStorage.getItem('access_id');
    await this.crudservice.getallsegments(userid).then(
      data => {
        this.segment = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getleadstatus() {
    var userid = localStorage.getItem('access_id');
    await this.smscampaignservice.getStatuswithContactCount(userid).then(
      data => {
        if (data['data'].length > 0) {
          this.leadstatus = data['data']
        } else {
        }
      },
      err => {
        console.log('error');
      }
    );
  }


  async getFormsData() {
    await this.userservice.getFormsData().then(
      data => {
        console.log(data['data']);
        this.formsdata = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  async link_list() {
    await this.smscampaignservice.getSMSLinkList(localStorage.getItem("access_id")).then(data => {
      if (data) {
        this.smslinks = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  searchlink(value) {
    this.smscampaignservice.getSMSLinkDetail(value).then(data => {
      if (data) {
        var msg = data['data'].sl_url;
        this.bulkForm.get('cloudurl').setValue(msg);
      }
    },
      err => {
        console.log('error');
      })

  }
  async getSmsData(id) {
    await this.templateservice.getApproveSMSList(id).then(
      data => {
        // console.log(data['data']);
        this.smstemplist = data['data'];
      },
      err => {
        console.log('error');
      }
    );

  }



  countcharacter() {
    // console.log(this.containsNonLatinCodepoints(this.addForm.value.sms_text))
    //var msg = this.bulkForm.value.message;
    var msg = this.bulkForm.value.message;

    msg = new String(msg);

    this.msgcharcnt = msg.length
    if (this.containsNonLatinCodepoints(msg)) {
      this.msgunicode = true
      this.chartxt = "unicode characters."
      if (this.msgcharcnt > 70 && this.msgcharcnt < 135) {
        this.msgcredit = 2
      }
      if (this.msgcharcnt > 134 && this.msgcharcnt < 202) {
        this.msgcredit = 3
      }
      if (this.msgcharcnt > 201) {
        this.msgcredit = 4
      }
      if (this.msgcharcnt < 71) {
        this.msgcredit = 1
      }
    } else {
      this.msgunicode = false
      this.chartxt = "characters."
      if (this.msgcharcnt > 160 && this.msgcharcnt < 307) {
        this.msgcredit = 2
      }
      if (this.msgcharcnt > 306 && this.msgcharcnt < 460) {
        this.msgcredit = 3
      }
      if (this.msgcharcnt < 161) {
        this.msgcredit = 1
      }
    }
    this.credit = this.msgcredit;
    this.bulkForm.get('sms_credits').setValue(this.msgcredit);
  }
  containsNonLatinCodepoints(s) {
    return /[^\u0000-\u00ff]/.test(s);
  }
  async getwhatsapptemplate() {
    var id = localStorage.getItem("access_id");
    await this.templateservice.getWhatsappTemplateData(id).then(
      data => {
        // console.log(data['data']);
        this.whatsapptemplist = data['data'];
      },
      err => {
        console.log('error');
      }
    );

  }

  searchtemp(id) {
    if(id>0){
      this.userservice.getsmsDetail(id).then(
        data => {
          console.log(data['data']);
          this.msgcredit = data['data'][0].sms_credits;
          this.msgcharcnt = data['data'][0].text_length;
          //this.list = (data['data']);
          var msg = data['data'][0].sms_text;
          this.originalmsg = (msg);
          this.bulkForm.get('message').setValue(msg);
          this.bulkForm.get('sms_credits').setValue(this.msgcredit);
          this.var1 = msg.includes("{#var1#}");
          this.var2 = msg.includes("{#var2#}");
          this.var3 = msg.includes("{#var3#}");
          this.var4 = msg.includes("{#var4#}");
          this.var5 = msg.includes("{#var5#}");
        },
        err => {
          console.log('error');
        }
      );
    }
    
  }
  searchwhatsapptemp(id) {
    if(id>0){
      this.templateservice.getWhatsappTemplateData(id).then(
        data => {
          //console.log(data['data']);
          // this.msgcredit = data['data'][0].sms_credits;
          //this.msgcharcnt = data['data'][0].text_length;
          //this.list = (data['data']);
          var msg = data['data'][0].wtemp_description;
          this.originalmsg = (msg);
          this.bulkForm.get('message').setValue(msg);
          //this.bulkForm.get('sms_credits').setValue(this.msgcredit);
          this.var1 = msg.includes("{#var1#}");
          this.var2 = msg.includes("{#var2#}");
          this.var3 = msg.includes("{#var3#}");
          this.var4 = msg.includes("{#var4#}");
          this.var5 = msg.includes("{#var5#}");
          this.countcharacter()
        },
        err => {
          console.log('error');
        }
      );
    }
    
  }

  chechsmstype(type) {
    console.log(type);
    if (type == "whatsapp") {
      if(this.access_whatsapp !=0){
         this.bulkForm.get('smstemp').setValue('');
      this.getwhatsapptemplate();
      this.msgmode = false;
      this.whatsappmode = true;
      this.textmode = false;
      this.var1 = false;
      this.var2 = false;
      this.var3 = false;
      this.var4 = false;
      this.var5 = false;
      }else{
        this.msg ="Please integrated Whatsapp API !!!!"
        this.isDisabled =true;
      }

    } else if (type == "text") {
      this.bulkForm.get('smstemp').setValue('');
      this.msgmode = false;
      this.textmode = true;
      this.whatsappmode = false;
      this.var1 = false;
      this.var2 = false;
      this.var3 = false;
      this.var4 = false;
      this.var5 = false;
    } else {
      this.msgmode = true;
      this.textmode = false;
      this.whatsappmode = false;
      this.var1 = true;
      this.var2 = true;
      this.var3 = true;
      this.var4 = true;
      this.var5 = true;
    }
    this.bulkForm.get("message").setValue('');
    this.msgcharcnt = 0;
    this.msgcredit = 0;

  }
  changecampaigntype(type) {
    if (type == 0) {
      this.transactionalmode = true;
      this.promontionalmode = false;
    }
    if (type == 1) {
      this.transactionalmode = false;
      this.promontionalmode = true;
    }
  }
  replacevar1(value) {
    var msg = this.originalmsg;
    msg = msg.replace("{#var1#}", value);
    if (this.bulkForm.value.var2) {
      msg = msg.replace("{#var2#}", this.bulkForm.value.var2);
    }
    if (this.bulkForm.value.var3) {
      msg = msg.replace("{#var3#}", this.bulkForm.value.var3);
    }
    if (this.bulkForm.value.var4) {
      msg = msg.replace("{#var4#}", this.bulkForm.value.var4);
    }
    if (this.bulkForm.value.var5) {
      msg = msg.replace("{#var5#}", this.bulkForm.value.var5);
    }
    this.bulkForm.get("message").setValue(msg);
    this.countcharacter();
  }
  replacevar2(value) {
    var msg = this.originalmsg;
    if (this.bulkForm.value.var1) {
      msg = msg.replace("{#var1#}", this.bulkForm.value.var1);
    }
    msg = msg.replace("{#var2#}", value);
    if (this.bulkForm.value.var3) {
      msg = msg.replace("{#var3#}", this.bulkForm.value.var3);
    }
    if (this.bulkForm.value.var4) {
      msg = msg.replace("{#var4#}", this.bulkForm.value.var4);
    }
    if (this.bulkForm.value.var5) {
      msg = msg.replace("{#var5#}", this.bulkForm.value.var5);
    }
    this.bulkForm.get("message").setValue(msg);
    this.countcharacter();
  }
  replacevar3(value) {
    var msg = this.originalmsg;
    if (this.bulkForm.value.var1) {
      msg = msg.replace("{#var1#}", this.bulkForm.value.var1);
    }
    if (this.bulkForm.value.var2) {
      msg = msg.replace("{#var2#}", this.bulkForm.value.var2);
    }
    msg = msg.replace("{#var3#}", value);
    if (this.bulkForm.value.var4) {
      msg = msg.replace("{#var4#}", this.bulkForm.value.var4);
    }
    if (this.bulkForm.value.var5) {
      msg = msg.replace("{#var5#}", this.bulkForm.value.var5);
    }
    this.bulkForm.get("message").setValue(msg);
    this.countcharacter();
  }
  replacevar4(value) {
    var msg = this.originalmsg;
    if (this.bulkForm.value.var1) {
      msg = msg.replace("{#var1#}", this.bulkForm.value.var1);
    }
    if (this.bulkForm.value.var2) {
      msg = msg.replace("{#var2#}", this.bulkForm.value.var2);
    }
    if (this.bulkForm.value.var3) {
      msg = msg.replace("{#var3#}", this.bulkForm.value.var3);
    }
    msg = msg.replace("{#var4#}", value);
    if (this.bulkForm.value.var5) {
      msg = msg.replace("{#var5#}", this.bulkForm.value.var5);
    }
    this.bulkForm.get("message").setValue(msg);
    this.countcharacter();
  }
  replacevar5(value) {
    var msg = this.originalmsg;
    if (this.bulkForm.value.var1) {
      msg = msg.replace("{#var1#}", this.bulkForm.value.var1);
    }
    if (this.bulkForm.value.var2) {
      msg = msg.replace("{#var2#}", this.bulkForm.value.var2);
    }
    if (this.bulkForm.value.var3) {
      msg = msg.replace("{#var3#}", this.bulkForm.value.var3);
    }
    if (this.bulkForm.value.var4) {
      msg = msg.replace("{#var4#}", this.bulkForm.value.var4);
    }
    msg = msg.replace("{#var5#}", value);

    this.bulkForm.get("message").setValue(msg);
    this.countcharacter();
  }

  changevar1(value) {
    if (value == 'custom') {
      this.customvar1 = true;
    } else {
      this.customvar1 = false;
      this.bulkForm.get("customvar1").setValue("");
    }
  }
  changevar2(value) {
    if (value == 'custom') {
      this.customvar2 = true;
    } else {
      this.customvar2 = false;
      this.bulkForm.get("customvar2").setValue("");
    }
  }
  changevar3(value) {
    if (value == 'custom') {
      this.customvar3 = true;
    } else {
      this.customvar3 = false;
      this.bulkForm.get("customvar3").setValue("");
    }
  }
  changevar4(value) {
    if (value == 'custom') {
      this.customvar4 = true;
    } else {
      this.customvar4 = false;
      this.bulkForm.get("customvar4").setValue("");
    }
  }
  changevar5(value) {
    if (value == 'custom') {
      this.customvar5 = true;
    } else {
      this.customvar5 = false;
      this.bulkForm.get("customvar5").setValue("");
    }
  }
}





