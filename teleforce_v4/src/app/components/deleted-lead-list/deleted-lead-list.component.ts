import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ErpService } from './../../erp.service';
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';
import { BaseComponent } from '../base/base.component';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { ShareWhatsappComponent } from '../share-whatsapp/share-whatsapp.component';
import { LeadSmsSendComponent, LeadEmailSendComponent } from '../lead-details/lead-details.component';
// import {CreateLeadErpComponent} from '../erp-module/erp-module.component'
import { environment } from '../../../environments/environment';
import { CopySendEmailComponent } from '../copy-send-email/copy-send-email.component';
import { Subscription, of, from } from 'rxjs';
import { FileListComponent } from '../file-list/file-list.component';
import { CreateLeadErpComponent } from '../erp-module/erp-module.component'
import { ImportLeadCsvComponent } from '../import-lead-csv/import-lead-csv.component';
import { ToastrService } from "ngx-toastr";
import { LeadDataSource } from "./lead.datasource";

@Component({
  selector: 'app-deleted-lead-list',
  templateUrl: './deleted-lead-list.component.html',
  styleUrls: ['./deleted-lead-list.component.css']
})
export class DeletedLeadListComponent implements OnInit {
  displayedColumns: string[] = [ 'position', 'creation', 'modifiedate', 'agent', 'mobile_no', 'lead_name', 'email_id', 'source', 'adname', 'status', 'action'];
  //public dataSource: MatTableDataSource<any>;
  isLoading = false;
  public searchform: FormGroup;
  public searchform2: FormGroup;
  agentarr = [];
  todaylead_count = '-';
  todaylostlead_count = '-';
  todaylost_need_analysis = '-';
  count_proposal_t: '-'
  count_negotiation_d: '-'
  count_won_d: '-'
  statusarr = [];
  sourcearr = [];
  store_status = []
  selected = -1;
  status;
  stage;
  source;
  isagent = false;
  progressivedialer;
  leadArr = [];
  isDisabled = false;
  isDisabled1 = false;
  isDisabled2 = false;
  sortcolumn = 'creation';
  sortdirection = 'DESC';
  Length = 0;
  public dataSource: LeadDataSource;
  adslist = []
  taglist = []
  managerid = 0;
  showdelete;
  constructor(
    public authService: ErpService,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    public AuthService: AuthService,
    public managerservice: ManagerService,
    private basecomponent: BaseComponent,
    private userservice: UserService,
    private _snackBar: MatSnackBar,

    private el: ElementRef,
  ) { }
  // @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;
  UserData;
  agentype = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent'
  selected_page_index
  showcreatedate = true;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  async ngOnInit() {
    //this.dataSource = new MatTableDataSource(); // create new object
    //this.getManagerDetail();
    await this.AuthService.getRole(localStorage.getItem('access_id')).then(
      data => {
        this.managerid = data['data']['created_by'];
        this.UserData = data['data']['account_type'];
        if (data['data']['account_type'] == '1') {
          this.isagent = true;
          this.accesssetting();
        }
        if (data['data']['account_type'] == '1' && this.managerid == 1790) {
          this.showcreatedate = false;
        }
        if (data['data']['account_type'] == '2'){
          this.showdelete=true;
        }
      }).catch(function (error) {
        console.log('fdsfdsfd=======')
        this.logout()
      });

    this.dataSource = new LeadDataSource(this.authService);
    var userid = localStorage.getItem('access_id');
    //this.change_view_card_data();
    this.get_lead_stage_status();
    this.get_lead_stage_source()
    this.getAgent(userid);
    this.get_module_access_generate_campaign();
    this.getAdsNameByUserid();
    this.getLeadTag();


    var userid = localStorage.getItem('access_id');
    var startdate = null;
    var enddate = null;
    var modifiedstartdate = null;
    var modifiedenddate = null;
    if (localStorage.getItem('startdatefilter') == 'current') {
      if (this.managerid == 1790) {
        startdate = null;
        enddate = null;
      } else {
        let dateObj = new Date();
        startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
        enddate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);

        localStorage.setItem('startdatefilter', startdate);
        localStorage.setItem('enddatefilter', enddate);
      }

    } else {
      //console.log(localStorage.getItem('startdatefilter'));
      if (localStorage.getItem('startdatefilter') || localStorage.getItem('startdatefilter') != 'null') {
        //let dateObj = new Date(localStorage.getItem('startdatefilter'));
        startdate = localStorage.getItem('startdatefilter');
      } else {
        startdate = null;
      }
      if (localStorage.getItem('enddatefilter') || localStorage.getItem('enddatefilter') != 'null') {
        //let dateObj = new Date(localStorage.getItem('startdatefilter'));
        enddate = localStorage.getItem('enddatefilter');
      } else {
        enddate = null;
      }
    }
    if (localStorage.getItem('modifiedstartdatefilter')) {
      //let dateObj = new Date(localStorage.getItem('startdatefilter'));
      modifiedstartdate = localStorage.getItem('modifiedstartdatefilter');
    } else {
      modifiedstartdate = null;
    }
    if (localStorage.getItem('modifiedenddatefilter')) {
      //let dateObj = new Date(localStorage.getItem('startdatefilter'));
      modifiedenddate = localStorage.getItem('modifiedenddatefilter');
    } else {
      modifiedenddate = null;
    }
    var leadnamefilter = '';
    if (localStorage.getItem('leadnamefilter') != 'null') {
      leadnamefilter = localStorage.getItem('leadnamefilter')
    }

    var mobilefilter = '';
    if (localStorage.getItem('mobilefilter') != 'null') {
      mobilefilter = localStorage.getItem('mobilefilter')
    }
    var agentfilter = '';
    if (localStorage.getItem('agentfilter') != '') {
      agentfilter = JSON.parse(localStorage.getItem('agentfilter'));
    } else {
      agentfilter = localStorage.getItem('agentfilter')
    }
    var statusfilter = '';
    if (localStorage.getItem('statusfilter') != '') {
      statusfilter = JSON.parse(localStorage.getItem('statusfilter'));
    } else {
      statusfilter = localStorage.getItem('statusfilter')
    }
    var sourcefilter = '';
    if (localStorage.getItem('sourcefilter') != '') {
      sourcefilter = JSON.parse(localStorage.getItem('sourcefilter'));
    } else {
      sourcefilter = localStorage.getItem('sourcefilter')
    }
    var adsnamefilter = '';
    if (localStorage.getItem('adsnamefilter') != '') {
      adsnamefilter = JSON.parse(localStorage.getItem('adsnamefilter'));
    } else {
      adsnamefilter = localStorage.getItem('adsnamefilter')
    }
    var tagfilter = '';
    if (localStorage.getItem('tagfilter') != '') {
      tagfilter = JSON.parse(localStorage.getItem('tagfilter'));
    } else {
      tagfilter = localStorage.getItem('tagfilter')
    }
    var agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent'
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [startdate],
      enddate: [enddate],
      agent: [agentfilter],
      status: [statusfilter],
      mobileno: [mobilefilter],
      source: [sourcefilter],
      lead_name: [leadnamefilter],
      ads_name: [adsnamefilter],
      tag_id: [tagfilter],
      modifiedstartdate: [modifiedstartdate],
      modifiedenddate: [modifiedenddate],
      agentrole: [agentrole]
    });


    //console.log(this.searchform);
    this.searchData();
    this.searchform2 = this.fb.group({
      startdate: [],
      enddate: []
    });
    //this.get_lead();
  }


  savePage(index) {
    console.log(index)
    this.selected_page_index = index;
  }

  createfiledialog(): void {
    const dialogRef = this.dialog.open(FileListComponent, {
      width: '640px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
      }
    });
  }
  createimportdialog() {
    const dialogRef = this.dialog.open(ImportLeadCsvComponent, {
      width: '640px', disableClose: false, data: { agentarr: this.agentarr }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
      }
    });
  }
  onUploadCsv() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        // this.name = file.name;
        var userid = localStorage.getItem('access_id');
        let fdata = new FormData();
        fdata.append('user_id', userid);
        fdata.append('agent_id', this.selected_page_index);
        fdata.append('attach_file', file);
        this.authService.uploadcsv(fdata).then(
          (data) => {
            //this.pdf_name = tdata['data']
            this.el.nativeElement.querySelector('#fileUpload').value = '';
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
          });
      }
      //this.uploadFiles();
      //this.loading = true
    };
    fileUpload.click();


  }
  async get_module_access_generate_campaign() {
    await this.authService.get_module_access_generate_campaign().then(
      data => {
        // console.log(data['data']);

        var services = JSON.parse(data['data'][0]['services']);
        console.log("services", services);
        if (services.length > 0) {
          for (var i = 0; i < services.length; i++) {
            if (services[i] == '6') {
              this.progressivedialer = true;
            }
            // else if (services[i] == '1') {
            //   this.misscall = true;;
            // } else if (services[i] == '2') {
            //   this.conference = true;
            // } else if (services[i] == '3') {
            //   this.dialer = true;
            // } else if (services[i] == '4') {
            //   this.clicktocall = true;
            // } else if (services[i] == '5') {
            //   this.campaign = true;
            // } else if (services[i] == '7') {
            //   this.bulksms = true;
            // } else if (services[i] == '10') {
            //   this.zoho = true;
            // } else if (services[i] == '11') {
            //   this.lms = true;
            // }
          }

        }

      },
      err => {
        console.log('error');
      }
    );
  }

  async get_lead_stage_status() {
    await this.authService.get_lead_stage_status().then(
      data => {
        if (data['data'].length > 0) {
          this.status = data['data']
        } else {
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_lead_stage_source() {
    await this.authService.get_lead_stage_source().then(
      data => {
        if (data['data'].length > 0) {
          this.source = data['data']
        } else {
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async getAdsNameByUserid() {
    await this.authService.getAdsNameByUserid(localStorage.getItem("access_id")).then(
      data => {
        this.adslist = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  async getLeadTag() {
    await this.authService.getLeadTag(localStorage.getItem("access_id")).then(
      data => {
        this.taglist = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }


  async change_view_card_data() {
    await this.authService.change_view_card_data().then(
      data => {
        if (data['data'].length > 0) {
          console.log(data['data'])
          this.stage = data['data']
        }
        else {
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  onChange(event, status, index) {
    if (event.checked == true) {
      this.store_status.push(event.source.value)
    }
    else (
      this.store_status.splice(this.store_status.indexOf(event.source.value), 1)
    )
    console.log(this.store_status)
  }

  getAgent(userid) {
    this.authService.getAgents(userid).then(
      data => {
        console.log(data['data'])
        this.agentarr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');
    await this.userservice.accesssetting(userid).then(
      data => {
        if (data["data"][22]["setting_value"] == '1') {
          this.showdelete = true;
        }
      },
      err => {
        console.log('error');
      }
    );
  }


  resetform() {
    var currentdate = new Date();
    var userid = localStorage.getItem('access_id');
    var agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent'
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      agent: [],
      status: [],
      mobileno: [],
      source: [],
      lead_name: [],
      ads_name: [],
      modifiedstartdate: [],
      modifiedenddate: [],
      agentrole: [agentrole]
    });
    localStorage.setItem('startdatefilter', '');
    localStorage.setItem('enddatefilter', '');
    localStorage.setItem('statusfilter', '');
    localStorage.setItem('sourcefilter', '');
    localStorage.setItem('agentfilter', '');
    localStorage.setItem('leadnamefilter', '');
    localStorage.setItem('adsnamefilter', '');
    localStorage.setItem('tagfilter', '');
    localStorage.setItem('mobilefilter', '');
    localStorage.setItem('modifiedstartdatefilter', '');
    localStorage.setItem('modifiedenddatefilter', '');
    this.searchData();
  }

  resetform2() {
    this.store_status = []
    var currentdate = new Date();
    this.searchform2 = this.fb.group({
      startdate: [new Date()],
      enddate: [new Date()]
    });
    this.change_view_card_data()
  }


  openDialogLeadSmsSend(mobileno, leadid): void {
    const dialogRef = this.dialog.open(LeadSmsSendComponent, {
      width: '650px', data: { mobileno: mobileno, leadid: leadid }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  async searchData() {
    this.isDisabled = true;
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    var startdate = '';
    var enddate = '';
    var modifiedenddate = '';
    var modifiedstartdate = '';
    //console.log(data.agent);
    if (data.agent) {
      var newagentArr = [];
      data.agent.forEach(element => {
        newagentArr.push(element);
      });
      localStorage.setItem('agentfilter', JSON.stringify(newagentArr));
    } else {
      localStorage.setItem('agentfilter', '');
    }
    if (data.tag_id) {
      var newtagArr = [];
      data.tag_id.forEach(element => {
        newtagArr.push(element);
      });
      localStorage.setItem('tagfilter', JSON.stringify(newtagArr));
    } else {
      localStorage.setItem('tagfilter', '');
    }
    if (data.status) {
      var newstatusArr = [];
      data.status.forEach(element => {
        newstatusArr.push(element);
      });
      localStorage.setItem('statusfilter', JSON.stringify(newstatusArr));
    } else {
      localStorage.setItem('statusfilter', '');
    }
    if (data.source) {
      var newsourceArr = [];
      data.source.forEach(element => {
        newsourceArr.push(element);
      });
      localStorage.setItem('sourcefilter', JSON.stringify(newsourceArr));
    } else {
      localStorage.setItem('sourcefilter', '');
    }
    /*
    if (data.source) {
      localStorage.setItem('sourcefilter', data.source);
    }*/
    if (data.mobileno != '') {
      localStorage.setItem('mobilefilter', data.mobileno);
    } else {
      localStorage.setItem('mobilefilter', '');
    }
    if (data.lead_name != '') {
      localStorage.setItem('leadnamefilter', data.lead_name);
    } else {
      localStorage.setItem('leadnamefilter', '');
    }
    if (data.ads_name) {
      var newadsnameArr = [];
      data.ads_name.forEach(element => {
        newadsnameArr.push(element);
      });
      localStorage.setItem('adsnamefilter', JSON.stringify(newadsnameArr));
    } else {
      localStorage.setItem('adsnamefilter', '');
    }
    //console.log(data.startdate);
    if (data.startdate != 'null') {
      console.log("not null");
      console.log(data.startdate);
    } else {
      console.log("null");
    }
    if (data.startdate) {
      let dateObj = new Date(data.startdate);
      startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    }
    if (data.enddate && data.enddate != 'null') {
      let dateObj = new Date(data.enddate);
      enddate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    }
    if (data.modifiedstartdate) {
      let dateObj = new Date(data.modifiedstartdate);
      modifiedstartdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    }
    if (data.modifiedenddate) {
      let dateObj = new Date(data.modifiedenddate);
      modifiedenddate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    }
    //console.log(startdate);
    localStorage.setItem('startdatefilter', startdate);
    localStorage.setItem('enddatefilter', enddate);
    localStorage.setItem('modifiedstartdatefilter', modifiedstartdate);
    localStorage.setItem('modifiedenddatefilter', modifiedenddate);
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
    await this.authService.getleaddatalength_isdelete(data).then(
      data => {
        // console.log(data['data']);
        //this.dataSource.data = data['data'];
        if (data['data']) {
          this.Length = data['data'][0].totallead;
        }
        this.isLoading = false;
        this.isDisabled = false;
      },
      err => {
        console.log('error');
      }
    );
   
  }

  async createExcel() {
    this.isLoading = true
    this.isDisabled2 = true
    let data: any = Object.assign(this.searchform.value);
    console.log(data)
    await this.authService.get_lead_excel(data).then(
      data => {
        this.isLoading = false
        this.isDisabled2 = false;
        if (data['data']) {
          var url = environment.apiUrl + '/' + data['data']
          window.open(url, '_blank');
        } else {
          this._snackBar.open(data['msg'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.isDisabled2 = false;

        }
      },
      err => {
        console.log('error');
      }
    );
  }
  statuschange(event) {
    var Arr = [];
    //console.log(segmentArr.length);
    if (event.length >= 2) {
      event.forEach(element => {
        if (element != '') {
          Arr.push(element);
        }
      });
    } else {
      Arr = event;
    }
    this.searchform.get("status").setValue(Arr);
  }
  sourcechange(event) {
    var Arr = [];
    //console.log(segmentArr.length);
    if (event.length >= 2) {
      event.forEach(element => {
        if (element != '') {
          Arr.push(element);
        }
      });
    } else {
      Arr = event;
    }
    this.searchform.get("source").setValue(Arr);
  }
  agentchange(event) {
    var Arr = [];
    //console.log(segmentArr.length);
    if (event.length >= 2) {
      event.forEach(element => {
        if (element != '') {
          Arr.push(element);
        }
      });
    } else {
      Arr = event;
    }
    this.searchform.get("agent").setValue(Arr);
  }
  adschange(event) {
    var Arr = [];
    //console.log(segmentArr.length);
    if (event.length >= 2) {
      event.forEach(element => {
        if (element != '') {
          Arr.push(element);
        }
      });
    } else {
      Arr = event;
    }
    this.searchform.get("ads_name").setValue(Arr);
  }
  tagchange(event) {
    var Arr = [];
    //console.log(segmentArr.length);
    if (event.length >= 2) {
      event.forEach(element => {
        if (element != '') {
          Arr.push(element);
        }
      });
    } else {
      Arr = event;
    }
    this.searchform.get("tag_id").setValue(Arr);
  }






  async createTimelineExcel() {
    this.isLoading = true
    this.isDisabled1 = true
    let data: any = Object.assign(this.searchform.value);
    //console.log(data)
    await this.authService.get_lead_timeline_excel(data).then(
      data => {
        this.isLoading = false
        this.isDisabled1 = false
        var url = environment.apiUrl + '/' + data['data']
        window.open(url, '_blank');
      },
      err => {
        console.log('error');
      }
    );
  }

  async deleteRequest(id) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        let data: any = Object.assign(this.searchform.value);
        this.dataSource.loadContacts(data,
          this.sortcolumn, this.sortdirection,
          this.paginator.pageIndex,
          this.paginator.pageSize);
        this.searchData()
      }
    });
  }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        tap(() => this.loadContactPage())
      )
      .subscribe()

  }

  loadContactPage() {
    this.isDisabled = false;
    this.isLoading = false;
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data,
      this.sortcolumn, this.sortdirection,
      this.paginator.pageIndex,
      this.paginator.pageSize);

  }

  openDialogLeadMailSend(row): void {
    const dialogRef = this.dialog.open(LeadEmailSendComponent, {
      data: this.dataSource['Contacts'].value[row],
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editlead(data) {
    console.log(data);
    const dialogRef = this.dialog.open(CreateLeadErpComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  

  leaddetailpage(id) {
    this.router.navigateByUrl('/lead-details/' + id);
  }
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


  

 
  Addleadid(leadid) {
    if (this.leadArr.length > 0) {
      var check = this.leadArr.includes(leadid);
      if (check == true) {
        for (var i = 0; i < this.leadArr.length; i++) {
          if (this.leadArr[i] == leadid) {
            this.leadArr.splice(i, 1);
          }
        }
      } else {
        this.leadArr.push(leadid);
      }
    } else {
      this.leadArr.push(leadid);
    }
  }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./deleted-lead-list.component.css']

})
export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private erpservice: ErpService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      this.id = this.data.id


    }

  }
  async deleteleadsrestore(id) {

    await this.erpservice.delete_leads_restore_data(id).then(
      data => {
        this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}