import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ErpService } from '../../erp.service';
import { AuthService } from '../../auth.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { BaseComponent } from '../base/base.component';
import { TicketShareWhatsappComponent } from '../ticket-detail/ticket-detail.component';
import { SmsSendComponent } from '../ticket-detail/ticket-detail.component';
import { EmailSendComponent } from '../ticket-detail/ticket-detail.component';
import { TicketAssignAgentComponent } from '../ticket-detail/ticket-detail.component';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'date', 'manager', 'agent', 'assignagent','contactno','email','subject', 'status', 'priority', 'issuetype', 'action'];
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;
  managerid = 0;
  showagentname = false;
  showmanagername = false;
  agents = [];
  managers = [];
  opencount = 0;
  workingcount = 0;
  closedcount = 0;
  isDisabled = false;
  notassigntickets=0;
  constructor(
    private userservice: UserService,
    private router: Router,
    private erpservice: ErpService,
    private managerservice: ManagerService,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private basecomponent: BaseComponent,
    private el: ElementRef) { }
  @ViewChild('paginator') paginator: MatPaginator;

  async ngOnInit() {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    await this.getManagerDetail();
    await this.authService.getRole(localStorage.getItem('access_id')).then(
      data => {

        //if(data['data']['account_type']==2 || (data['data']['account_type']==1 && (data['data']['account_id']==48||data['data']['created_by']==48))){

        // }
        console.log(this.managerid );
        if (data['data']['account_type'] == 2) {
          this.showagentname = true;
          if (this.managerid == 48) {
            this.getManagers();
            this.showmanagername = true;
          
            this.getNotAssignedTicket();
            console.log(this.managerid);
          }
          if (this.managerid != 48) {
            this.getAgents(this.managerid);
          }

        }
        if (data['data']['account_type'] == 1 && this.managerid == 48) {
          this.getManagers();
          this.showmanagername = true;
          this.showagentname = true;
        }

      }).catch(function (error) {

      });

    if (this.managerid == 48) {
      userid = '';
    } else {
      userid = userid;
    }
    this.searchform = this.fb.group({
      userid: [localStorage.getItem('access_id')],
      account_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      priority: [''],
      agent: [''],
    });
    //console.log(this.searchform);
    await this.getTickets();
    await this.getTicketPriorityCount();
  }
  async getManagerDetail() {
    await this.managerservice.getManagerDetail(localStorage.getItem('access_id')).then(data => {
      if (data) {
        this.managerid = data['data'].account_id;
      }
    },
      err => {
        console.log('error');
      })
  }
  async getTickets() {
    let data: any = Object.assign(this.searchform.value);
    await this.userservice.getTickets(data).then(
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
    const dialogRef = this.dialog.open(CreateSupportIssueComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getTickets();
      }
    });
  }

  async updatedialog(id) {
    await this.userservice.geticketdetail(id).then(data => {
      if (data) {
        const dialogRef = this.dialog.open(CreateSupportIssueComponent, {
          disableClose: true, data: data['data'],
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            var userid = localStorage.getItem('access_id');
            this.getTickets();
          }
        });
      }
    },
      err => {
        console.log('error');
      })
  }
  async getManagers() {
    await this.erpservice.getManagers().then(data => {
      if (data) {
        console.log(data['data']);
        this.managers = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  async getAgents(id) {
    await this.userservice.getActiveAgents(id).then(data => {
      if (data) {
        this.agents = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async getTicketPriorityCount() {
    let data: any = Object.assign(this.searchform.value);
    await this.userservice.getTicketStatusCount(data).then(data => {
      if (data) {
        let priority = data['data']
        priority.forEach(element => {
          if (element.status == 'Open') {
            this.opencount = element.count;
          }
          if (element.status == 'Working') {
            this.workingcount = element.count;
          }
          if (element.status == 'Closed') {
            this.closedcount = element.count;
          }
        });
      }
    },
      err => {
        console.log('error');
      })
  }

  searchData() {
    this.getTickets();
    this.getTicketPriorityCount();
  }
  prioritychange(event) {
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
    this.searchform.get("priority").setValue(Arr);
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
  resetform() {
    var userid = localStorage.getItem('access_id');
    if (this.managerid == 48) {
      userid = '';
    } else {
      userid = userid;
    }
    this.searchform = this.fb.group({
      userid: [localStorage.getItem('access_id')],
      account_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      priority: [''],
      agent: [''],
    });
    this.searchData();
  }
  ticketdetail(id) {
    console.log(id);
    this.router.navigateByUrl('/ticket-detail/' + id);
  }
  clicktocall(mobile,assignagent) {
    mobile = mobile.substr(-10)
    var agentid = localStorage.getItem('access_id')
    if (assignagent) {
      if (confirm("Are you sure to call ?")) {
        var voipstatus = localStorage.getItem('voipstatus')
        if (voipstatus == 'true') {
          this.basecomponent.voipcall(mobile)
        } else {
          this.userservice.agentOutgoingCall(assignagent, mobile).then(
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
      this._snackBar.open('Call not allow !', '', {
        duration: 2000, verticalPosition: 'top'
      });
    }
  }
  smsSend(contactno,ticketid): void {
    const dialogRef = this.dialog.open(SmsSendComponent, {
      width: '650px', data: { mobileno: contactno, ticketid: ticketid }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTickets();
    });
  }
  emailSend(ticketdetail): void {
    const dialogRef = this.dialog.open(EmailSendComponent, {
      data:ticketdetail,
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTickets();
    });
  }
  sendwhatsapp(contactno,ticketid): void {
    //console.log(id)
    const dialogRef = this.dialog.open(TicketShareWhatsappComponent, {
      disableClose: true, data: { callernumber:contactno, ticket_id: ticketid }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTickets();
    });
  }
  assignagent(): void {
    const dialogRef = this.dialog.open(TicketAssignAgentComponent, {
      disableClose: true, data: 0
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getTickets();
      }
    });
  }
  getNotAssignedTicket() {
    this.userservice.getNotAssignedTicket().then(
      data => {
        console.log(data['data']);
        this.notassigntickets = data['data'].length;
      },
      err => {

      }
    );
  }
}

@Component({
  selector: 'app-ticket-list',
  templateUrl: './create-support-issue.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class CreateSupportIssueComponent implements OnInit {
  @ViewChild('parent') parent: ElementRef;
  public addForm: FormGroup;
  issuetypelist = [];
  editmode = false;
  addmode = true;
  image = '';
  progressbar = false;
  apiUrl: string;
  baseUrl: string;
  managerid = 0;
  managers = [];
  agents = [];
  ticketlaststatus=[];



  constructor(
    public dialogRef: MatDialogRef<CreateSupportIssueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public userservice: UserService,
    public erpservice: ErpService,
    public managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
    public authService: AuthService
  ) {
    this.apiUrl = environment.apiUrl;
    this.baseUrl = window.location.origin;
  }

  async ngOnInit() {
    console.log(this.data);
    var userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      ticket_id: [this.data['ticket_id']],
      account_id: [this.data['account_id']],
      agent_id: [this.data['agent_id']],
      assign_to: [this.data['assign_to']],
      status: [null, [Validators.required]],
      description: [null],
    });
    this.get_ticketlaststatus();
    
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  createissue() {
    if (this.addForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value);
      data.ticket_image=this.image;
      if (this.data) {
        this.userservice.updateticket(data).then(data => {
          if (data) {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
          }
        },
          err => {
            console.log('error');
          })
      } 
    }
  }
  onUploadHeaderImage() {
    const fileUpload = document.getElementById('fileupload') as HTMLInputElement;
    fileUpload.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          formData.append('ticketimg', headerinputEl.files.item(0));
          let data: any = Object.assign(this.addForm.value);
          this.userservice.uploadticketfile(formData).then(
            (tdata) => {
              this.progressbar = false;
              //data.thimage = tdata['data'];
              this.image = tdata['data'];
            });

        }
      }

    };

    fileUpload.click();
  }
  removeimage() {
    if (confirm('Are your sure to delete image?')) {
      this.image = '';
      let data: any = Object.assign(this.addForm.value);
      data.ticket_image = null;
    }
  }
  async get_ticketlaststatus() {
    await this.erpservice.getTicketLastStatus(this.data['ticket_id']).then(
      data => {
        console.log(data['data'])
        if(data['data'].length>0){
          this.image = data['data'][0].ticket_image;
          this.addForm.get('status').setValue(data['data'][0].current_status);
          this.addForm.get('description').setValue(data['data'][0].ticket_description);
        }
        
        //console.log(this.emailaccountlist);
      },
      err => {
        console.log('error');
      }
    );
  }

  

}


