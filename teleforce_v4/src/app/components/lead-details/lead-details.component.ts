import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ErpService } from './../../erp.service';
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { element } from 'protractor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { BaseComponent } from '../base/base.component';
import { CreateLeadErpComponent } from '../erp-module/erp-module.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ShareWhatsappComponent } from '../share-whatsapp/share-whatsapp.component';
import { RecordingCallComponent } from '../call-log/call-log.component'
import { CallRecordingListComponent } from '../call-recording-list/call-recording-list.component'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ScheduleMeetingComponent } from '../schedule-meeting/schedule-meeting.component';
import { environment } from '../../../environments/environment';
import { clear } from 'console';
import { Subscription } from 'rxjs/Subscription';
import { DealDoneComponent } from '../deal-done/deal-done.component';

export interface PeriodicElement {
  position: number;
  name: string;
  store_name: string;
  role: string;
  channels: string;
  monumber: number;
  email: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Test', store_name: 'Hydrogen', role: '', channels: '', monumber: 1.0079, email: 'H', action: '' },
];
@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.css']
})
export class LeadDetailsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'itemcount', 'quantity', 'amount', 'action'];
  public dataSource: MatTableDataSource<any>;
  isLoading = true;
  leadid = this.route.snapshot.paramMap.get('id');
  noteform: boolean = false;
  notenodata: boolean = true;
  commentform: boolean = false;
  commentnodata: boolean = true;
  lead;
  erp_lead_id;
  lead_owner;
  isagent = false
  public noteAddForm: FormGroup;
  public commentAddForm: FormGroup;
  public searchform: FormGroup;
  leadtimeline = [];
  leadtimeline_whatsapp = [];
  leadtimeline_email = [];
  leadtimeline_status = [];
  leadtimeline_feedback = [];
  leadtimeline_appointment = [];
  commentList = [];
  contactmetadata = [];
  quotation_db;
  dealdonestatus = false;
  segmentname;
  leadstagename;
  timelinetab = true;
  showcreateddate = true;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: ErpService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userservice: UserService,
    public AuthService: AuthService,
    private basecomponent: BaseComponent,
  ) { }

  apiUrl = environment.apiUrl;


  @ViewChild('paginator') paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit(): void {
    this.AuthService.getRole(localStorage.getItem('access_id')).then(
      data => {
        if (data['data']['account_type'] == '1') {
          this.isagent = true
        }
      }).catch(function (error) {
        console.log('fdsfdsfd=======')
        this.logout()
      });
    this.route.paramMap.subscribe(params => {
      this.leadid = params.get("id")
      this.getlead();
      this.getleadcomments();
      this.getleadcontacts();
      //this.checkdealdonestatus();
      this.getSegmentName();
    })
    this.dataSource = new MatTableDataSource(); // create new object

    // this.getlead();
    // this.getleadcomments();
    // this.getleadcontacts();
    this.noteAddForm = this.fb.group({
      title: [null],
      content: [null],
    })


    this.commentAddForm = this.fb.group({
      //title: [null, [Validators.required]],
      note: [null, [Validators.required]],
      lead_id: [this.leadid],
      name: [null],
      comment_by: [null]
    })
    // this.getquotation_db()
  }
  changedValue(event, metaid) {
    var value = event.target.value;
    if (value != '') {
      var data = { value: value, meta_id: metaid }
      this.authService.updateOtherDetail(data).then(
        data => {
          this.getleadcontacts();
        },
        err => {
          console.log('error');
        }
      );
    }

  }

  refresh() {
    this.getlead();
    this.getleadcomments();
    this.getleadcontacts();
  }

  NoteForm1(data) {
    console.log(data)
    var data1 = environment.apiUrl + '/pdf/' + data
    window.open(data1)
  }

  NoteForm() {
    this.commentform = !this.commentform;
    this.commentnodata = !this.commentnodata
  }

  openSchedule(index): void {
    console.log("here index ::" + index);
    console.log("index ::" + index);
    const dialogRef = this.dialog.open(ScheduleMeetingComponent, { width: '400px', data: { leadid: index } });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  commentsubmit() {
    if (this.commentAddForm.invalid == true) {
      //console.log(this.noteAddForm.value);
      return;
    }
    else {
      console.log("456");
      let data: any = Object.assign(this.commentAddForm.value);
      data['name'] = this.erp_lead_id;
      data['comment_by'] = this.lead_owner;
      // console.log("comment data");
      // console.log(JSON.stringify(data));
      data['lead_id'] = this.leadid
      this.authService.commentLeadNote(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.commentform = false;
          this.commentnodata = true;
          this.getleadcomments();
          this.commentAddForm.reset()
        },
        err => {
          console.log('error');
        }
      );
    }
  }

  openrecording(id, path) {
    const dialogRef = this.dialog.open(CallRecordingListComponent, {
      width: '640px', disableClose: true, data: { id: id, recpath: path }
    });
  }
  feedbackform(id, cdrid) {
    const dialogRef = this.dialog.open(LeadFeedbackFormComponent, {
      width: '640px', disableClose: true, data: { formid: id, cdrid: cdrid }
    });
  }

  whatsappdialog(number, id, show_no_id): void {
    //console.log(id)
    const dialogRef = this.dialog.open(ShareWhatsappComponent, {
      disableClose: true, data: { callernumber: number, lead_id: id, show_no_id: show_no_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
      }
    });
  }

  closeTab() {
    this.commentform = false;
    this.commentnodata = true;
  }

  getlead() {
    this.authService.getLeadDetail(this.leadid).then(
      data => {
        //console.log(data['data']);
        //console.log(data['data'][0]);
        if (data['data'].length > 0) {
          this.lead = data['data'][0];
          this.erp_lead_id = data['data'][0]['name'];
          this.lead_owner = data['data'][0]['owner'];
          this.getleadquotation();
          this.getLeadStageNameByStatus(data['data'][0]['status']);

        } else {
          this.router.navigate(['/lms/']);
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  getleadcomments() {
    this.authService.getLeadComments(this.leadid).then(
      data => {
        console.log("data here");
        console.log(JSON.stringify(data));
        if (data['data'].length > 0) {
          this.commentList = data['data'];
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  getleadcontacts() {
    this.authService.getLeadContacts(this.leadid).then(
      data => {
        if (data['data'].length > 0) {
          this.contactmetadata = data['data'];
          console.log(this.contactmetadata)
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  checkdealdonestatus() {
    this.authService.getdealdonedatabyleadid(this.leadid).then(
      data => {
        if (data['data'].length > 0) {
          this.dealdonestatus = false;
        } else {
          this.dealdonestatus = true;
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  getSegmentName() {
    this.authService.getSegmentNameByLeadId(this.leadid).then(
      data => {
        //console.log();
        if (data['data'].length > 0)
          this.segmentname = data['data'][0].name;
      },
      err => {
        console.log('error');
      }
    );
  }



  editlead(data) {
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {
      data: data

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getlead();
    });
  }
  openSaleOrderDialog() {
    //this.router.navigate(['/create-support-issue']);
    const dialogRef = this.dialog.open(CreateSaleorderComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getpromsnalcam();
      }
    });
  }

  saveNote() {
    if (this.noteAddForm.invalid == true) {
      //console.log(this.noteAddForm.value);
      return;
    }
    else {
      let data: any = Object.assign(this.noteAddForm.value);
      this.authService.saveLeadNote(this.leadid).then(
        data => {
          //console.log('data::'+JSON.stringify(data['DATA']))
          console.log(data['data']);
          if (data['data'].length > 0) {
            this.lead = data['data'][0];
          }
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],

  };
  openDialogLeadMailSend(mail, id): void {
    mail.quotationid = id;
    const dialogRef = this.dialog.open(LeadEmailSendComponent, {
      data: mail,
      width: '650px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openDialogpdf(id) {
    this.router.navigateByUrl('/print/' + id);
  }
  openDialogLeadSmsSend(mobileno, leadid): void {
    const dialogRef = this.dialog.open(LeadSmsSendComponent, {
      width: '650px', data: { mobileno: mobileno, leadid: leadid }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  QuotationForm() {
    const dialogRef = this.dialog.open(LeadQuoatationComponent, {
      data: this.lead
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getleadquotation();
    });
  }
  //Calling Module
  clicktocall(mobile) {
    mobile = mobile.substr(-10)
    var agentid = localStorage.getItem('access_id')
    if (this.isagent) {
      if (confirm("Are you sure to call ?")) {
        var voipstatus = localStorage.getItem('voipstatus')
        if (voipstatus == 'true') {
          this.basecomponent.voipcall(mobile)
        } else {
          this.userservice.agentOutgoingCall(agentid, mobile).then(
            data => {
              if (data['err'] == false) {
                this._snackBar.open(data['msg'], '', {
                  duration: 2000, verticalPosition: 'top'
                });
              }
            },
            err => {
              console.log('error');
            }
          );
        }
      }
    } else {
      this._snackBar.open('Not allow from manager!', '', {
        duration: 2000, verticalPosition: 'top'
      });
    }
  }

  clicktoemail(email) {
    this._snackBar.open('Coming soon!', '', {
      duration: 2000, verticalPosition: 'top'
    });
  }

  clicktosms(mobile) {
    this._snackBar.open('Coming soon!', '', {
      duration: 2000, verticalPosition: 'top'
    });
  }

  /*getleadtimeline(lid) {
    console.log(lid)
    this.authService.getLeadTimeline(lid).then(
      data => {
        console.log(data['data']);
        if (data['data'].length > 0) {
          this.leadtimeline = data['data'];
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  getLeadTimeline_whatsapp(lid) {
    console.log(lid)
    this.authService.getLeadTimeline_whatsapp(lid).then(
      data => {
        console.log(data['data']);
        if (data['data'].length > 0) {
          this.leadtimeline_whatsapp = data['data'];
        }
      },
      err => {
        console.log('error');
      }
    );
  }*/
  getLeadTimeline_appointment(lid) {
    console.log("lid ::" + lid)
    this.authService.getLeadTimeline_appointment(lid).then(
      data => {
        //console.log(' leadtimeline_appointment data::::::::::::::::::::::');
        //console.log(JSON.stringify(data['data']));
        this.leadtimeline_appointment = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  getLeadTimeline_email(lid) {
    console.log(lid)
    this.authService.getLeadTimeline_email(lid).then(
      data => {
        console.log('data::::::::::::::::::::::');
        console.log(data['data']);
        this.leadtimeline_email = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  getLeadTimeline_status(lid) {
    console.log(lid)
    this.authService.getLeadTimeline_status(lid).then(
      data => {
        console.log('data::::::::::::::::::::::');
        console.log(data['data']);
        this.leadtimeline_status = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  getLeadTimeline_feedback(lid) {
    //console.log(lid)
    this.authService.getLeadTimeline_feedback(lid).then(
      data => {
        // console.log('data::::::::::::::::::::::');
        // console.log(data['data']);
        this.leadtimeline_feedback = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async tabClick(tab) {
    console.log(tab)
    var tabtype = tab.tab.textLabel
    if (tabtype == 'Notes') {
      console.log(this.leadid)
    }
    if (tabtype == 'Quotation') {
      console.log(this.leadid)
    }
    if (tabtype == 'Timeline') {
      console.log(this.leadid)
      // this.getleadtimeline(this.leadid)
      // this.getLeadTimeline_whatsapp(this.leadid)
      this.getLeadTimeline_status(this.leadid);
      this.getLeadTimeline_feedback(this.leadid);
    }
    if (tabtype == 'Email') {
      this.getLeadTimeline_email(this.leadid);
    }

    if (tabtype == 'Appointment') {
      this.getLeadTimeline_appointment(this.leadid);
    }

    if (tabtype == 'Files') {

    }
  }

  async getLeadStageNameByStatus(status) {
    //console.log(this.lead.l_id);
    await this.authService.getLeadStageNameByStatus(status).then(
      data => {
        //console.log(data['data'][0]);
        this.leadstagename = data['data'][0].stage_name;
        if (this.isagent && this.leadstagename == 'Fresh' && this.lead.User_id == 1790) {
          this.timelinetab = false;
        } else {
          this.timelinetab = true;
        }
        if (this.isagent && this.lead.User_id == 1790) {
          this.showcreateddate = false;
        }else{
          this.showcreateddate = true;
        }
        // this.quotation_db = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async getleadquotation() {
    //console.log(this.lead.l_id);
    await this.authService.getleadquotation(this.lead.l_id).then(
      data => {
        //console.log(data['data'])
        this.dataSource.data = data['data'];
        this.isLoading = false;
        // this.quotation_db = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  QuotationForm_edit(id, lead) {
    var data_list = { 'quotation_id': id }
    console.log(data_list)
    const dialogRef = this.dialog.open(LeadQuoatationComponent, {
      data: data_list

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getleadquotation();
    });
  }

  openDialogDealdone(leadid): void {
    const dialogRef = this.dialog.open(DealDoneComponent, {
      width: '900px', data: { leadid: leadid }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  nextlead(leadid) {
    var agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent'

    this.searchform = this.fb.group({
      lead_id: [leadid],
      userid: [localStorage.getItem('access_id')],
      startdate: [localStorage.getItem('startdatefilter')],
      enddate: [localStorage.getItem('enddatefilter')],
      status: [localStorage.getItem('statusfilter')],
      source: [localStorage.getItem('sourcefilter')],
      agent: [localStorage.getItem('agentfilter')],
      lead_name: [localStorage.getItem('leadnamefilter')],
      ads_name: [localStorage.getItem('adsnamefilter')],
      tag_id: [localStorage.getItem('tagfilter')],
      mobileno: [localStorage.getItem('mobilefilter')],
      modifiedstartdate: [localStorage.getItem('modifiedstartdatefilter')],
      modifiedenddate: [localStorage.getItem('modifiedenddatefilter')],
      agentrole: [agentrole]
    });
    let data: any = Object.assign(this.searchform.value);
    this.authService.getNextLeadDetail(data).then(
      data => {
        console.log(data['data']);
        if (data['data']) {
          this.router.navigate(['lead-details/' + data['data'][0].l_id])
        }

      },
      err => {
        console.log('error');
      }
    );
  }
}



@Component({
  selector: 'create-saleorder',
  templateUrl: 'create-saleorder.component.html',
  styleUrls: ['./lead-details.component.css']

})
export class CreateSaleorderComponent {

  public addForm: FormGroup;
  customerlist = [];
  issuelist = [];
  projectlist = [];
  companylist = [];
  contactlist = [];
  leadlist = [];
  serviceagreementlist = [];
  emailaccountlist = [];
  issuetypelist = [];
  customer = [];
  currency = [];
  warehouse = [];
  shippingrules = [];
  taxesandcharges = [];
  couponcode = [];
  paymentermstemplate = [];
  termscondition = [];
  purchaseorder = [];
  leadsource = [];
  project = [];
  campaign = [];
  letterhead = [];
  printheading = [];
  salespartner = [];
  autorepeat = [];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "12rem",
    minHeight: "5rem",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    sanitize: true,
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<CreateSaleorderComponent>,
    private fb: FormBuilder,
    public erpservice: ErpService,
  ) { }
  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      created_by: [userid],
      status: [null],
      subject: [null],
      priority: [null],
      customer: [null],
      issue_type: [null],
      raised_by: [null],
      description: [null],
      company: [null],
      opening_date: [null],
      opening_time: [null],
      via_customer_portal: [false],
      first_responded_on: [null],
      lead: [null],
      project: [null],
      contact: [null],
      email_account: [null],
      service_level_agreement: [null],
      resolution_date: [null],
      content_type: [null],
      attachment: [null],
      mins_to_first_response: [0]
    });
    this.get_Company();
    this.get_Currency();
    this.get_PriceList();
    this.get_customer_list();
    this.get_Warehouse();
    this.get_ShippingRule();
    this.get_salestaxesandchargestemplate();
    this.get_couponcode();
    this.get_paymentermstemplate();
    this.get_termsconditions();
    this.get_purchaseorder();
    this.get_leadsource();
    this.get_project();
    this.get_campaign();
    this.get_letterhead();
    this.get_printheading();
    this.get_salespartner();
    this.get_autorepeat();


  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async get_Company() {
    await this.erpservice.get_Company().then(
      data => {
        this.companylist = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_customer_list() {
    await this.erpservice.get_customer_list().then(
      data => {
        this.customer = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_Currency() {
    await this.erpservice.get_Currency().then(
      data => {
        this.currency = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_PriceList() {
    await this.erpservice.get_PriceList().then(
      data => {
        this.currency = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  async get_Warehouse() {
    await this.erpservice.get_Warehouse().then(
      data => {
        this.warehouse = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_ShippingRule() {
    await this.erpservice.get_SellingShippingRule().then(
      data => {
        this.shippingrules = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_salestaxesandchargestemplate() {
    await this.erpservice.get_salestaxesandchargestemplate().then(
      data => {
        this.taxesandcharges = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_couponcode() {
    await this.erpservice.get_couponcode().then(
      data => {
        this.couponcode = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_paymentermstemplate() {
    await this.erpservice.get_paymentermstemplate().then(
      data => {
        this.paymentermstemplate = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_termsconditions() {
    await this.erpservice.get_termsconditions().then(
      data => {
        this.termscondition = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_purchaseorder() {
    await this.erpservice.get_purchaseorder().then(
      data => {
        this.purchaseorder = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_leadsource() {
    await this.erpservice.get_leadsource().then(
      data => {
        this.leadsource = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_project() {
    await this.erpservice.get_projects().then(
      data => {
        this.project = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_campaign() {
    await this.erpservice.get_Campaign().then(
      data => {
        this.campaign = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_letterhead() {
    await this.erpservice.get_letterhead().then(
      data => {
        this.letterhead = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_printheading() {
    await this.erpservice.get_printheading().then(
      data => {
        this.printheading = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_salespartner() {
    await this.erpservice.get_salespartner().then(
      data => {
        this.salespartner = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_autorepeat() {
    await this.erpservice.get_autorepeat().then(
      data => {
        this.autorepeat = data['data'];
        //console.log("ware::"+ this.warehouse);
      },
      err => {
        console.log('error');
      }
    );
  }


  createsaleorder() {

  }



}

@Component({
  selector: 'lead-email-send',
  templateUrl: 'lead-email-send.component.html',
  styleUrls: ['./lead-details.component.css']
})
export class LeadEmailSendComponent {
  pdf_name
  isDisable = false;
  htmldoc = false;
  imgdoc = false;
  constructor(
    public dialogRef: MatDialogRef<LeadEmailSendComponent>, private _snackBar: MatSnackBar, public userservice: UserService,
    @Inject(MAT_DIALOG_DATA) public data: LeadDetailsComponent, private fb: FormBuilder, public erpservice: ErpService,
  ) { }
  public addForm: FormGroup;
  maillist = [];
  emailtext;
  emailtempattachment;
  headerimg;
  footerimg;
  ngOnInit(): void {
    this.getemailtemplate();
    this.addForm = this.fb.group({
      agentid: [this.data['agent_id']],
      to: [this.data['email_id'], Validators.required],
      cc: [null],
      bcc: [null],
      subject: [null],
      template: [null],
      email_description: [null],
      lead_name: [this.data['l_id']],
      thumbnailfile: [''],
    });
    this.getHeaderFooterSetting();
    this.createPDF();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],

  };

  async getemailtemplate() {
    let userid = localStorage.getItem('access_id');
    await this.erpservice.getemailtemplate(userid).then(data => {
      if (data) {
        this.maillist = (data['data']);
        console.log("smslisr" + this.maillist);
      }
    },
      err => {
        console.log('error');
      })
  }

  async getTemplateDetail(id) {
    //console.log(id);
    await this.erpservice.getEmailTemplateDetail(id).then(data => {
      if (data) {
        //this.maillist = (data['data']);
        this.emailtext = data['data'][0].email_html;
        this.emailtempattachment = data['data'][0].attach_file;
        this.addForm.get("email_description").setValue(data['data'][0].email_html);
        console.log(data['data']);
      }
    },
      err => {
        console.log('error');
      })
  }
  sendmail() {
    this.isDisable = true;
    let data: any = Object.assign(this.addForm.value);
    data.thumbnailfile = this.pdf_name;
    data.emailtempattachment = this.emailtempattachment;
    if (this.data['quotationid']) {
      this.erpservice.send_quotationmail(data).then(
        data1 => {
          this.isDisable = true;
          this._snackBar.open(data1['msg'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close();
        },
        err => {
          console.log('error');
        }
      );
    } else {
      this.erpservice.send_mail(data).then(
        data1 => {
          this.isDisable = true;
          this._snackBar.open(data1['msg'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close();
        },
        err => {
          console.log('error');
        }
      );
    }

  }


  data_send(element) {
    const file: File = element.target.files[0];
    let fdata = new FormData();
    fdata.append('file', element.target.files[0]);
    this.erpservice.uploadpdf(fdata).then(
      (tdata) => {
        this.pdf_name = tdata['data']
      });

  }

  createPDF() {
    var quotationhtml = '';
    //var data = { 'name': this.data['quotationame'] };
    this.erpservice.getleadquotationdetail(this.data['quotationid']).then(
      data => {
        quotationhtml += '<table>';
        if (this.imgdoc) {
          quotationhtml += '<tr >';
          quotationhtml += '<td colspan="4" width="100%">';
          quotationhtml += '<img src="https://erp.cloudX.in/files/Leter1.jpg" style="width: 100%;height:100%" *ngIf="!headerimg">';
          quotationhtml += '<img src="api/header-footer/' + this.headerimg + '" style="width: 100%;" >';
          quotationhtml += ' </td>';
          quotationhtml += '</tr>';
        }
        if (this.htmldoc) {
          quotationhtml += '<tr  width="100%">';
          quotationhtml += '<td colspan="4">' + this.headerimg + '</td>';
          quotationhtml += '</tr>';
        }

        quotationhtml += '<tr>';
        quotationhtml += '<td colspan="3" width="75%">&nbsp;</td>';
        quotationhtml += '<td width="25%">';
        quotationhtml += ' <h1>QUOTATION</h1>';
        quotationhtml += ' <h3>' + data['data'][0].quotation_name + '</h3>';
        quotationhtml += '</td>';
        quotationhtml += ' </tr>';
        quotationhtml += '<tr>';
        quotationhtml += '<td colspan="4" width="100%">';
        quotationhtml += ' <hr>';
        quotationhtml += '</td>';
        quotationhtml += '</tr>';
        quotationhtml += '<tr>';
        quotationhtml += '<td width="25%"><b>Customer Name</b></td>';
        quotationhtml += '<td width="25%" style="text-align:left">' + data['data'][0].lead_name + '</td>';
        quotationhtml += '<td width="25%"><b>Date</b></td>';
        var startdateObj = new Date(data['data'][0].created_date);
        var date =  ('0' + startdateObj.getDate()).slice(-2)+ '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + startdateObj.getFullYear();

        quotationhtml += '<td width="25%" style="text-align:left">' + date + '</td>';
        quotationhtml += '</tr>';
        quotationhtml += '<tr>';
        quotationhtml += '<td width="25%"><b>Mobile No</b></td>';
        quotationhtml += '<td width="25%" style="text-align:left">' + data['data'][0].mobile_no + '</td>';
        quotationhtml += ' <td width="50%" colspan="2">&nbsp;</td>';
        quotationhtml += ' </tr>';
        quotationhtml += ' <tr>';
        quotationhtml += '<td width="100%" colspan="4">';
        quotationhtml += '<table width="100%" style="border:1px solid" cellspacing="0" cellpadding="0">';
        quotationhtml += '<tr>';
        quotationhtml += ' <td width="10%" style="border-bottom:1px solid;border-right:1px solid">Sr</td>';
        quotationhtml += '<td width="20%" style="border-bottom:1px solid;border-right:1px solid">Item Code</td>';
        quotationhtml += '<td width="30%" style="border-bottom:1px solid;border-right:1px solid">Description</td>';
        quotationhtml += '<td width="10%" style="border-bottom:1px solid;border-right:1px solid">Quantity</td>';
        quotationhtml += '<td width="10%" style="border-bottom:1px solid;border-right:1px solid">Discount Amount</td>';
        quotationhtml += '<td width="10%" style="border-bottom:1px solid;border-right:1px solid">Rate</td>';
        quotationhtml += '<td width="10%" style="border-bottom:1px solid;border-right:1px solid">GST</td>';
        quotationhtml += '<td width="10%" style="border-bottom:1px solid;">Amount</td>';
        quotationhtml += '</tr>';
        var items = (data['data'][0]['items'])
        var count = 1;
        items.forEach(element => {
          if (count < data['data'][0]['items'].length) {
            quotationhtml += "<tr><td width='10%' style='border-right:1px solid;border-bottom:1px solid'>" + count + "</td><td width='10%' style='border-right:1px solid;border-bottom:1px solid'>" + element.product_name + "</td><td width='10%' style='border-right:1px solid;border-bottom:1px solid'>" + element.description + "</td><td width='10%' style='border-right:1px solid;border-bottom:1px solid'>" + element.quantity + "</td><td width='10%' style='border-right:1px solid;border-bottom:1px solid'>₹" + element.discount + "</td><td width='10%' style='border-right:1px solid;border-bottom:1px solid'>₹" + element.product_price + "</td><td width='10%' style='border-bottom:1px solid'>₹" + element.product_amount + "</td></tr>"
          } else {
            quotationhtml += "<tr><td width='10%' style='border-right:1px solid'>" + count + "</td><td width='10%' style='border-right:1px solid'>" + element.product_name + "</td><td width='10%' style='border-right:1px solid'>" + element.description + "</td><td width='10%' style='border-right:1px solid'>" + element.quantity + "</td><td width='10%' style='border-right:1px solid'>₹" + element.discount + "</td><td width='10%' style='border-right:1px solid'>₹" + element.product_price + "</td><td width='10%' style='border-right:1px solid'>₹" + element.gst_amount + " ("+element.gst+"%)</td><td width='10%' >₹" + element.product_amount + "</td></tr>"
          }

          count++;
        });
        quotationhtml += ' </table>';
        quotationhtml += '</td>';
        quotationhtml += '</tr>';


        quotationhtml += '<tr>';
        quotationhtml += '<td colspan="3" width="75%" style="text-align:right;"><b> Total Quantity</b></td>';
        quotationhtml += '<td width="25%" style="text-align:right;"> ' + data['data'][0].total_quantity + '</td>';
        quotationhtml += '</tr>';
        quotationhtml += '<tr>';
        quotationhtml += '<td colspan="3" width="75%" style="text-align:right;"><b>Total Discount</b></td>';
        quotationhtml += '<td width="25%" style="text-align:right;">₹ ' + data['data'][0].total_discount + '</td>';
        quotationhtml += '</tr>';
        quotationhtml += '<tr>';
        quotationhtml += '<td colspan="3" width="75%" style="text-align:right;"><b>Total Amount</b></td>';
        quotationhtml += '<td width="25%" style="text-align:right;">₹ ' + data['data'][0].total_amount + '</td>';
        quotationhtml += '</tr>';
        quotationhtml += '<tr>';
        quotationhtml += '<td colspan="3" width="75%" style="text-align:right;"><b>Total GST Amount</b></td>';
        quotationhtml += '<td width="25%" style="text-align:right;">₹ ' + data['data'][0].total_gstamount + '</td>';
        quotationhtml += '</tr>';
        quotationhtml += '<tr>';
        quotationhtml += '<td colspan="3" width="75%" style="text-align:right;"><b>Grand Total</b></td>';
        quotationhtml += '<td width="25%" style="text-align:right;">₹ ' + data['data'][0].grand_total + '</td>';
        quotationhtml += '</tr>';
        quotationhtml += '<tr>';
        quotationhtml += ' <td colspan="3" width="75%" style="text-align:right;"><b>In Words</b></td>';
        quotationhtml += '<td width="25%" style="text-align:right;">' + data['data'][0].grand_total_inword + '</td>';
        quotationhtml += '</tr>';
        if (this.imgdoc) {
          quotationhtml += '<tr  width="100%">';
          quotationhtml += '<td colspan="4" width="100%">';
          quotationhtml += ' <img src="https://erp.cloudX.in/files/Leter2.jpg" style="width: 100%;" *ngIf="!footerimg">';
          quotationhtml += ' <img src="api/header-footer/' + this.footerimg + '" style="width: 100%;" *ngIf="footerimg">';
          quotationhtml += ' </td>';
          quotationhtml += '</tr>';
        }
        if (this.htmldoc) {
          quotationhtml += '<tr  width="100%">';
          quotationhtml += ' <td colspan="4">' + this.footerimg + '</td>';
          quotationhtml += '</tr>';
        }

        quotationhtml += '</table>';
        //console.log(quotationhtml);
        this.erpservice.geerateHtmltoPDF(quotationhtml).then(
          data1 => {
            this.isDisable = true;
            this._snackBar.open(data1['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close();
          },
          err => {
            console.log('error');
          }
        );
      },
      err => {
        console.log('error');
      }
    );
  }

  getHeaderFooterSetting() {
    var userid = localStorage.getItem('access_id');
    this.userservice.getHeaderFooterSetting(userid).then(
      data => {
        if (data['data']) {
          if (data['data']['letter_head'] == 'html') {
            this.htmldoc = true;
            this.imgdoc = false;
            this.headerimg = data['data'].header_html;
            this.footerimg = data['data'].footer_html;
          }
          if (data['data']['letter_head'] == 'image') {
            this.imgdoc = true;
            this.htmldoc = false;
            this.headerimg = data['data'].header_image;
            this.footerimg = data['data'].footer_image;
          }
        }

      },
      err => {
        console.log('error');
      }
    );
  }


}

@Component({
  selector: 'lead-sms-send',
  templateUrl: 'lead-sms-send.component.html',
  styleUrls: ['./lead-details.component.css']
})
export class LeadSmsSendComponent {
  smslist = [];
  public smsForm: FormGroup;
  smsdetail;
  formname;
  linkname;
  constructor(
    public dialogRef: MatDialogRef<LeadSmsSendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeadDetailsComponent,
    public erpservice: ErpService,
    private fb: FormBuilder,
    public userservice: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.getSMSList();
    this.smsForm = this.fb.group({
      smstemp: [null, [Validators.required]],
      leadid: [this.data['leadid']],
      mobileno: [this.data['mobileno']],
      message: [null, [Validators.required]],
    });

  }

  async getSMSList() {
    let userid = localStorage.getItem('access_id');
    await this.erpservice.getsmstemplate(userid).then(data => {
      if (data) {
        this.smslist = (data['data']);
        console.log("smslisr" + this.smslist);
      }
    },
      err => {
        console.log('error');
      })
  }
  onNoClick1(): void {
    this.dialogRef.close();
  }
  getsmsDetail(id) {
    //console.log(id);
    this.userservice.getsmsDetail(id).then(
      data => {
        console.log(data['data'][0]);
        this.smsdetail = (data['data'][0]);
        this.smsForm.get('message').setValue(data['data'][0].sms_text);
        this.getsmsformlinkDetail(id);
        this.getLeadAgentDetail(this.data['leadid']);
        //sms_text: 
      },
      err => {
        console.log('error');
      }
    );
  }

  getsmsformlinkDetail(id) {
    //console.log(id);
    this.erpservice.getSMSTemplateDetail(id).then(
      data => {
        //console.log(data['data']);
        this.formname = "https://sms.cloudX.in/lead-form/" + (data['data'][0].FromName);
        this.linkname = (data['data'][0].LinkName);
        //sms_text: 
      },
      err => {
        console.log('error');
      }
    );
  }
  getLeadAgentDetail(id) {
    this.erpservice.getLeadAgentDetail(id).then(
      data => {
        console.log(data['data']);
        let smsdata: any = Object.assign(this.smsForm.value);
        var msg = smsdata.message;
        if (msg.includes("{#var1#}")) {
          console.log("if");
          if (this.smsdetail['var1'] == "agentname") {
            msg = msg.replace("{#var1#}", data['data'][0].account_name);
          }
          if (this.smsdetail['var1'] == "agentmobile") {
            msg = msg.replace("{#var1#}", data['data'][0].mobile);
          }
          if (this.smsdetail['var1'] == "agentemail") {
            msg = msg.replace("{#var1#}", data['data'][0].email);
          }
          if (this.smsdetail['var1'] == "custom") {
            msg = msg.replace("{#var1#}", this.smsdetail['customvar1']);
          }
          if (this.smsdetail['var1'] == "form") {
            msg = msg.replace("{#var1#}", this.formname);
          }
          if (this.smsdetail['var1'] == "link") {
            msg = msg.replace("{#var1#}", this.linkname);
          }
        }
        if (msg.includes("{#var2#}")) {
          if (this.smsdetail['var2'] == "agentname") {
            msg = msg.replace("{#var2#}", data['data'][0].account_name);
          }
          if (this.smsdetail['var2'] == "agentmobile") {
            msg = msg.replace("{#var2#}", data['data'][0].mobile);
          }
          if (this.smsdetail['var2'] == "agentemail") {
            msg = msg.replace("{#var2#}", data['data'][0].email);
          }
          if (this.smsdetail['var2'] == "custom") {
            msg = msg.replace("{#var2#}", this.smsdetail['customvar2']);
          }
          if (this.smsdetail['var2'] == "form") {
            msg = msg.replace("{#var2#}", this.formname);
          }
          if (this.smsdetail['var2'] == "link") {
            msg = msg.replace("{#var2#}", this.linkname);
          }
        }
        if (msg.includes("{#var3#}")) {
          if (this.smsdetail['var3'] == "agentname") {
            msg = msg.replace("{#var3#}", data['data'][0].account_name);
          }
          if (this.smsdetail['var3'] == "agentmobile") {
            msg = msg.replace("{#var3#}", data['data'][0].mobile);
          }
          if (this.smsdetail['var3'] == "agentemail") {
            msg = msg.replace("{#var3#}", data['data'][0].email);
          }
          if (this.smsdetail['var3'] == "custom") {
            msg = msg.replace("{#var3#}", this.smsdetail['customvar3']);
          }
          if (this.smsdetail['var3'] == "form") {
            msg = msg.replace("{#var3#}", this.formname);
          }
          if (this.smsdetail['var3'] == "link") {
            msg = msg.replace("{#var3#}", this.linkname);
          }
        }
        if (msg.includes("{#var4#}")) {
          if (this.smsdetail['var4'] == "agentname") {
            msg = msg.replace("{#var4#}", data['data'][0].account_name);
          }
          if (this.smsdetail['var4'] == "agentmobile") {
            msg = msg.replace("{#var4#}", data['data'][0].mobile);
          }
          if (this.smsdetail['var4'] == "agentemail") {
            msg = msg.replace("{#var4#}", data['data'][0].email);
          }
          if (this.smsdetail['var4'] == "custom") {
            msg = msg.replace("{#var4#}", this.smsdetail['customvar4']);
          }
          if (this.smsdetail['var4'] == "form") {
            msg = msg.replace("{#var4#}", this.formname);
          }
          if (this.smsdetail['var4'] == "link") {
            msg = msg.replace("{#var4#}", this.linkname);
          }
        }
        if (msg.includes("{#var5#}")) {
          if (this.smsdetail['var5'] == "agentname") {
            msg = msg.replace("{#var5#}", data['data'][0].account_name);
          }
          if (this.smsdetail['var5'] == "agentmobile") {
            msg = msg.replace("{#var5#}", data['data'][0].mobile);
          }
          if (this.smsdetail['var5'] == "agentemail") {
            msg = msg.replace("{#var5#}", data['data'][0].email);
          }
          if (this.smsdetail['var5'] == "custom") {
            msg = msg.replace("{#var5#}", this.smsdetail['customvar5']);
          }
          if (this.smsdetail['var5'] == "form") {
            msg = msg.replace("{#var5#}", this.formname);
          }
          if (this.smsdetail['var5'] == "link") {
            msg = msg.replace("{#var5#}", this.linkname);
          }
        }
        //console.log(this.linkname+"::"+msg);
        this.smsForm.get('message').setValue(msg);
        //sms_text: 
      },
      err => {
        console.log('error');
      }
    );
  }

  send() {
    if (this.smsForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      let data: any = Object.assign(this.smsForm.value);
      this.erpservice.sendSMSToAgent(data).then(data => {
        if (data) {
          this._snackBar.open('Message sent successfully!!', '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.dialogRef.close();

        }
      },
        err => {
          console.log('error');
        })

    }
  }

}

@Component({
  selector: 'lead-feedback-form',
  templateUrl: 'lead-feedback-form.component.html',
  styleUrls: ['./lead-details.component.css']
})
export class LeadFeedbackFormComponent {
  smslist = [];
  public smsForm: FormGroup;
  feedback;
  formname = '';

  constructor(
    public dialogRef: MatDialogRef<LeadFeedbackFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeadDetailsComponent,
    public erpservice: ErpService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.getLeadFeedback();

  }

  async getLeadFeedback() {
    // let userid = localStorage.getItem('access_id');
    await this.erpservice.getLeadFeedback(this.data['formid'], this.data['cdrid']).then(data => {
      if (data) {
        this.formname = data['data'][0].form_name;
        this.feedback = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  onNoClick1(): void {
    this.dialogRef.close();
  }

}



@Component({
  selector: 'lead-quotation',
  templateUrl: 'lead-quotation.component.html',
  styleUrls: ['./lead-details.component.css']
})

export class LeadQuoatationComponent {
  table_rows = [{ docstatus: "0", stock_uom: "Nos", parentfield: "items", idx: "", qty: "", discount_amount: "", stock_qty: "", rate: "", amount: "", item_code: "", description: "" }];
  table_rows2 = [];
  count: number = 0;
  count2: number = 0;
  count3: number = 0;
  item_doctype = "Quotation Item"
  edit = false
  public addForm: FormGroup;
  items: FormArray;
  name_form = 'Quotation'
  constructor(
    public dialogRef: MatDialogRef<LeadQuoatationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public authService: ErpService, private fb: FormBuilder,

    private _snackBar: MatSnackBar, ) { }

  onNoClick2(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    // this.addConForm = this.fb.group({
    //   itemcode: [null],
    // })
    if (this.data['quotation_id']) {
      this.edit = true
      this.authService.getleadquotationdetail(this.data['quotation_id']).then(
        data => {
          this.addForm = this.fb.group({
            quotation_id: [data['data'][0].quotation_id],
            lead_id: [data['data'][0].lead_id],
            account_id: [localStorage.getItem('access_id')],
            items: this.fb.array([]),
            totalquantity: [data['data'][0].total_quantity],
            total: [data['data'][0].total_amount],
            validity: [data['data'][0].validity],
            totaldiscount: [data['data'][0].total_discount],
            totalgstamount: [data['data'][0].total_gstamount],
            grandtotal: [data['data'][0].grand_total]
          });
          if (data['data'][0]['items'].length > 0) {
            data['data'][0]['items'].forEach(element => {
              this.items = this.addForm.get('items') as FormArray;
              this.items.push(this.fb.group({
                product_id: [element.product_id],
                quantity: [element.quantity],
                discount: [element.discount],
                rate: [element.product_price],
                gst: [element.gst],
                gstamount: [element.gst_amount],
                amount: [element.product_amount],
              }));
            });
          }
        }
      )
    }
    this.get_Item()
    // this.loadScript('./assets/js/addrow.js');
    this.addForm = this.fb.group({
      lead_id: [this.data.l_id],
      account_id: [localStorage.getItem('access_id')],
      items: this.fb.array([this.BuildFormDynamic()]),
      validity:[0],
      totalquantity: [],
      total: [],
      totalgstamount: [],
      totaldiscount: [],
      grandtotal: []
    });
  }

  item;
  taxes;
  txlenth = null
  taxes_cat;
  data_is = false
  total_data;
  total_item;
  grand_total;
  total_taxes;
  grand_total_tax;
  data1;

  BuildFormDynamic() {
    return this.fb.group({
      product_id: [''],
      quantity: [''],
      discount: [''],
      rate: [''],
      gst: [''],
      gstamount: [''],
      amount: ['']
    })
  }
  addItem() {
    //console.log('hello');
    const control = <FormArray>this.addForm.controls['items'];
    //console.log(this.addForm.controls['items']);
    control.push(this.BuildFormDynamic());
  }


  deleteRow(index) {
    //console.log('hello');
    const control = <FormArray>this.addForm.controls['items'];
    if (control != null) {
      var totalrow = control.value.length;
    }
    if (totalrow > 1) {
      control.removeAt(index);
    } else {
      alert('One record is mandatory');
      return false;
    }
    this.getTotal();
    //control.push(this.BuildFormDynamic());
  }

  getTotal() {
    var itemlength = this.addForm.get('items')['controls'].length;
    var totalamount = 0;
    var quantity = 0;
    var totaldiscount=0;
    var totalgstamount=0;
    for (var i = 0; i < itemlength; i++) {
      //console.log((quantity) + (this.addForm.get('items')['controls'][i].value.quantity));
      totalamount = (totalamount) + (this.addForm.get('items')['controls'][i].value.amount);
      totaldiscount = Number(totaldiscount) + Number(this.addForm.get('items')['controls'][i].value.discount);
      totalgstamount = (totalgstamount) + (this.addForm.get('items')['controls'][i].value.gstamount);
      quantity = (quantity) + Number(this.addForm.get('items')['controls'][i].value.quantity);
    }
      var grandtotal=(totalamount)+(totalgstamount);
    this.addForm.get('total').setValue(totalamount);
    this.addForm.get('totaldiscount').setValue(totaldiscount);
    this.addForm.get('totalgstamount').setValue(totalgstamount);
    this.addForm.get('grandtotal').setValue(grandtotal);
    this.addForm.get('totalquantity').setValue(quantity);
  }

  myFunction(index, productid) {
    if(this.data['quotation_id']){
      var data = this.addForm.get('items')['controls'][index].value;
      var discount = data.discount;
    }else{
      var discount = 0;
    }
    
    this.authService.getProductDetail(productid).then(
      data => {
        //console.log(data['data']);
        var gstamount = Math.round((data['data'].amount*data['data'].gst)/100);
        var abc = this.fb.group({
          product_id: [productid],
          quantity: [data['data'].actual_qty],
          discount: [discount],
          rate: [data['data'].price],
          gst: [data['data'].gst],
          gstamount: [gstamount],
          amount: [data['data'].amount]
        })
        this.addForm.controls['items'].value[index].product_id = productid;
        this.addForm.controls['items'].value[index].quantity = data['data'].actual_qty;
        this.addForm.controls['items'].value[index].discount = 0;
        this.addForm.controls['items'].value[index].rate = data['data'].price;
        this.addForm.controls['items'].value[index].gst = data['data'].gst;
        this.addForm.controls['items'].value[index].gstamount = gstamount;
        this.addForm.controls['items'].value[index].amount = data['data'].amount;
        this.addForm.get('items')['controls'][index] = abc;
        this.getTotal();


      },
      err => {
        console.log('error');
      }
    );

  }

  myFunction2(index, value) {

    var data = this.addForm.get('items')['controls'][index].value;
    //console.log(data);
    var amount = (((value) * (data.rate)) - (data.discount));
    var gstamount = Math.round((amount*data.gst)/100);

    var abc = this.fb.group({
      product_id: [data.product_id],
      quantity: [value],
      discount: [data.discount],
      rate: [data.rate],
      gst: [data.gst],
      gstamount: [gstamount],
      amount: [amount]
    })
    this.addForm.controls['items'].value[index].product_id = data.product_id;
    this.addForm.controls['items'].value[index].quantity = value;
    this.addForm.controls['items'].value[index].discount = data.discount;
    this.addForm.controls['items'].value[index].rate = data.rate;
    this.addForm.controls['items'].value[index].gst = data.gst;
    this.addForm.controls['items'].value[index].gstamount = gstamount;
    this.addForm.controls['items'].value[index].amount = amount;
    this.addForm.get('items')['controls'][index] = abc;
    this.getTotal();

  }

  myFunction3(index, value) {
    var data = this.addForm.get('items')['controls'][index].value;
    //console.log(data); 
    var amount = (((data.quantity) * (value)) - (data.discount));      
    var gstamount = Math.round((amount*data.gst)/100);
    var abc = this.fb.group({
      product_id: [data.product_id],
      quantity: [data.quantity],
      discount: [data.discount],
      rate: [value],
      gst: [data.gst],
      gstamount: [gstamount],
      amount: [amount]
    })
    this.addForm.controls['items'].value[index].product_id = data.product_id;
    this.addForm.controls['items'].value[index].quantity = data.quantity;
    this.addForm.controls['items'].value[index].discount = data.discount;
    this.addForm.controls['items'].value[index].rate = value;
    this.addForm.controls['items'].value[index].gst = data.gst;
    this.addForm.controls['items'].value[index].gstamount = gstamount;
    this.addForm.controls['items'].value[index].amount = amount;
    this.addForm.get('items')['controls'][index] = abc;
    this.getTotal();
  }

  myFunction32(index, value) {
    var data = this.addForm.get('items')['controls'][index].value;
    //console.log(data);
    var amount = (((data.quantity) * (data.rate)) - (value));
    var gstamount = Math.round((amount*data.gst)/100);
    var abc = this.fb.group({
      product_id: [data.product_id],
      quantity: [data.quantity],
      discount: [value],
      rate: [data.rate],
      gst: [data.gst],
      gstamount: [gstamount],
      amount: [amount]
    })
    this.addForm.controls['items'].value[index].product_id = data.product_id;
    this.addForm.controls['items'].value[index].quantity = data.quantity;
    this.addForm.controls['items'].value[index].discount = value;
    this.addForm.controls['items'].value[index].rate = data.rate;
    this.addForm.controls['items'].value[index].gst = data.gst;
    this.addForm.controls['items'].value[index].gstamount = gstamount;
    this.addForm.controls['items'].value[index].amount = amount;
    this.addForm.get('items')['controls'][index] = abc;
    this.getTotal();
  }


  async get_Item() {
    await this.authService.getActiveProduct().then(
      data => {
        this.item = data['data'];
        // this.Length = data['data'].length;

      },
      err => {
        console.log('error');
      }
    );
  }
  submit_data() {
    //console.log("submitquotaion");
    if (this.edit == true) {
      let data: any = Object.assign(this.addForm.value);
      this.authService.updateLeadQuotation(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Cancel' });
        },
        err => {
          console.log('error');
        })
    } else {
      let data: any = Object.assign(this.addForm.value);
      this.authService.saveLeadQuotation(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Cancel' });
        },
        err => {
          console.log('error');
        })
    }


  }




  // create_customer(index){
  //   var data = {'customer_name':this.getQuotation[index].customer_name , 'lead_name':this.getQuotation[index].party_name}
  //   console.log(data)
  //   this.authService.create_Customer(data).then(
  //   data => {
  //     console.log(data)
  //     this.get_Customer_list_api();


  //   },
  //   err => {
  //     console.log('error');
  //   }
  //   );

  // }



}
