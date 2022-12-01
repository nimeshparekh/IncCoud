import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { ManagerService } from '../../manager.service';
import { ErpService } from '../../erp.service';
import { TemplateService } from '../../template.service';
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateSupportIssueComponent } from '../ticket-list/ticket-list.component';
import { BaseComponent } from '../base/base.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  timeline = []
  ticketdetail;
  ticketid = this.route.snapshot.paramMap.get('id');
  apiUrl: string;
  baseUrl: string;
  public commentForm: FormGroup;
  commentform: boolean = false;
  managerid = 0;
  constructor(
    private userservice: UserService,
    private authService: AuthService,
    private managerservice: ManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private basecomponent: BaseComponent,
  ) {
    this.apiUrl = environment.apiUrl;
    this.baseUrl = window.location.origin;
  }

  async ngOnInit() {
    await this.getManagerDetail();

    if (this.ticketid) {
      this.getTicketTimeline(this.ticketid);
      this.getTicketDetail(this.ticketid);
      this.commentForm = this.fb.group({
        //title: [null, [Validators.required]],
        note: [null, [Validators.required]],
        ticket_id: [this.ticketid],
      })
    } else {
      this.router.navigateByUrl('/ticket-list/');
    }

  }

  getTicketTimeline(ticketid) {
    this.userservice.getTicketTimeline(ticketid).then(
      data => {
        this.timeline = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  getTicketDetail(ticketid) {
    this.userservice.getTicketDetail(ticketid).then(
      data => {
        if (data['data'].length > 0) {
          this.ticketdetail = data['data'][0]
        }

      },
      err => {
        console.log('error');
      }
    );
  }
  refresh() {
    this.getTicketDetail(this.ticketid);
    this.getTicketTimeline(this.ticketid)
  }
  NoteForm() {
    this.commentform = true;
  }
  closeTab() {
    this.commentform = false;
  }
  commentsubmit() {
    if (this.commentForm.invalid == true) {
      //console.log(this.noteAddForm.value);
      return;
    }
    else {
      let data: any = Object.assign(this.commentForm.value);
      data['comment_by'] = localStorage.getItem('access_id');
      data['account_id'] = this.ticketdetail['account_id'];
      data['agent_id'] = this.ticketdetail['agent_id'];
      data['assign_to'] = this.ticketdetail['assign_to'];
      data['status'] = this.ticketdetail['status'];
      // console.log("comment data");
      // console.log(JSON.stringify(data));
      this.userservice.addTicketNote(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.commentform = false;
          this.getTicketTimeline(this.ticketid);
          this.commentForm.reset()
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  updatedialog(): void {
    const dialogRef = this.dialog.open(CreateSupportIssueComponent, {
      "width": "600px", disableClose: true, data: this.ticketdetail
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getTicketTimeline(this.ticketid);
        this.getTicketDetail(this.ticketid);
      }
    });
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
  clicktocall(mobile) {
    mobile = mobile.substr(-10)
    var agentid = localStorage.getItem('access_id')
    if (this.ticketdetail['assign_to']) {
      if (confirm("Are you sure to call ?")) {
        var voipstatus = localStorage.getItem('voipstatus')
        if (voipstatus == 'true') {
          this.basecomponent.voipcall(mobile)
        } else {
          this.userservice.agentOutgoingCall(this.ticketdetail['assign_to'], mobile).then(
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
  smsSend(): void {
    const dialogRef = this.dialog.open(SmsSendComponent, {
      width: '650px', data: { mobileno: this.ticketdetail['contact_no'], ticketid: this.ticketid }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getTicketDetail(this.ticketid);
        this.getTicketDetail(this.ticketid);
      }
    });
  }
  emailSend(): void {
    const dialogRef = this.dialog.open(EmailSendComponent, {
      data: this.ticketdetail,
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getTicketDetail(this.ticketid);
        this.getTicketDetail(this.ticketid);
      }
    });
  }
  sendwhatsapp(): void {
    //console.log(id)
    const dialogRef = this.dialog.open(TicketShareWhatsappComponent, {
      disableClose: true, data: { callernumber: this.ticketdetail['contact_no'], ticket_id: this.ticketdetail['ticket_id'] }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getTicketDetail(this.ticketid);
        this.getTicketDetail(this.ticketid);
      }
    });
  }
  assignagent(): void {
    const dialogRef = this.dialog.open(TicketAssignAgentComponent, {
      disableClose: true, data: this.ticketdetail['ticket_id']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getTicketTimeline(this.ticketid);
        this.getTicketDetail(this.ticketid);
      }
    });
  }
}

@Component({
  selector: 'ticket-sms-send',
  templateUrl: 'sms-send.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class SmsSendComponent {
  smslist = [];
  public smsForm: FormGroup;
  smsdetail;
  formname;
  linkname;
  isDisabled = false;
  constructor(
    public dialogRef: MatDialogRef<SmsSendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TicketDetailComponent,
    private fb: FormBuilder,
    public userservice: UserService,
    public erpservice: ErpService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.getSMSList();
    this.smsForm = this.fb.group({
      smstemp: [null, [Validators.required]],
      ticketid: [this.data['ticketid']],
      mobileno: [this.data['mobileno']],
      message: [null, [Validators.required]],
    });

  }

  async getSMSList() {
    let userid = localStorage.getItem('access_id');
    await this.erpservice.getsmstemplate(userid).then(data => {
      if (data) {
        this.smslist = (data['data']);
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
        this.getTicketAssignAgentDetail(this.data['ticketid']);
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
  getTicketAssignAgentDetail(id) {
    this.userservice.getTicketAssignAgentDetail(id).then(
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
      this.isDisabled = true;
      let data: any = Object.assign(this.smsForm.value);
      this.userservice.sendSMSToCustomer(data).then(data => {
        if (data) {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.isDisabled = false;
          this.dialogRef.close({ event: 'Add' });

        }
      },
        err => {
          console.log('error');
        })

    }
  }

}


@Component({
  selector: 'ticket-email-send',
  templateUrl: 'email-send.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class EmailSendComponent {
  pdf_name
  isDisable = false;
  htmldoc = false;
  imgdoc = false;
  constructor(
    public dialogRef: MatDialogRef<EmailSendComponent>, private _snackBar: MatSnackBar, public userservice: UserService,
    @Inject(MAT_DIALOG_DATA) public data: TicketDetailComponent, private fb: FormBuilder, public erpservice: ErpService,
  ) { }
  public addForm: FormGroup;
  maillist = [];
  emailtext;
  emailtempattachment;
  ngOnInit(): void {
    this.getemailtemplate();
    this.addForm = this.fb.group({
      agentid: [this.data['assign_to']],
      to: [this.data['email'], Validators.required],
      cc: [null],
      bcc: [null],
      subject: [null],
      template: [null],
      email_description: [null],
      ticket_id: [this.data['ticket_id']],
      thumbnailfile: [''],
    });

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
    this.userservice.sendticketmail(data).then(
      data1 => {
        this.isDisable = true;
        this._snackBar.open(data1['msg'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.dialogRef.close({ event: 'Add' });
      },
      err => {
        console.log('error');
      }
    );

  }


  data_send(element) {
    const file: File = element.target.files[0];
    let fdata = new FormData();
    fdata.append('file', element.target.files[0]);
    this.userservice.uploadticketemailpdf(fdata).then(
      (tdata) => {
        console.log(tdata['data']);
        this.pdf_name = tdata['data']
      });

  }


}

@Component({
  selector: 'ticket-share-whatsapp',
  templateUrl: 'share-whatsapp.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketShareWhatsappComponent {
  public wpform: FormGroup;
  whatsapptemplate = [];
  show_no_id = this.data.show_no_id;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TicketShareWhatsappComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private authService: ErpService,
    private tempService: TemplateService
  ) { }

  ngOnInit(): void {
    var mobile = this.data.callernumber;
    mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
    // mobile = (mobile.length == 11 || mobile.length == 12) ? mobile : mobile
    mobile = mobile.substr(-10)
    if (localStorage.getItem('access_id') == "2656") {
      mobile = mobile
    } else {
      mobile = '+91' + mobile
    }
    this.wpform = this.fb.group({
      mobile: [mobile],
      message: [null],
      email_tempid: [null]
    });
    this.getTempData(localStorage.getItem('access_id'));
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  sendtowhatsapp() {
    this.authService.getAccessSettingByName(localStorage.getItem('access_id'), 'sent_whatsupmsg_by').then(
      data => {
        if (data['data']) {
          if (data['data']['setting_value'] == '1') {
            let formdata: any = Object.assign(this.wpform.value);
            //if(this.data.lead_id){
            formdata.lead_id = this.data.lead_id
            //} 
            //if(this.data.cdrid){
            formdata.cdrid = this.data.cdrid
            // }             

            this.authService.sentMsgByWhatsupAPI(formdata).then(
              data => {
                this.dialogRef.close({ event: 'Add' });
                this._snackBar.open(data['msg'], '', {
                  duration: 2000, verticalPosition: 'top'
                });
              }
            )
          } else {
            let data: any = Object.assign(this.wpform.value);
            window.open("http://api.whatsapp.com/send?phone=" + data.mobile + "&text=" + data.message)
            //if(this.data.lead_id){
            data.ticket_id = this.data.ticket_id
            //}                  
            data.mobile = this.data.callernumber
            this.userservice.saveTicketWhatsapp(data).then(
              data => {
                this.dialogRef.close({ event: 'Add' });
                this._snackBar.open(data['msg'], '', {
                  duration: 2000, verticalPosition: 'top'
                });
              },
              err => {
                console.log('error');
              }
            );
          }
        } else {
          let data: any = Object.assign(this.wpform.value);
          window.open("http://api.whatsapp.com/send?phone=" + data.mobile + "&text=" + data.message)
          //if(this.data.lead_id){
          data.ticket_id = this.data.ticket_id
          data.mobile = this.data.callernumber
          this.userservice.saveTicketWhatsapp(data).then(
            data => {
              this.dialogRef.close({ event: 'Add' });
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
            },
            err => {
              console.log('error');
            }
          );
        }
      },
      err => {
        console.log('error');
      }
    );

    // console.log(data);

  }
  async getTempData(id) {//console.log("HII");
    await this.tempService.getWhatsappTemplateData(id).then(
      data => {
        //console.log('email::'+JSON.stringify(data['data']));
        this.whatsapptemplate = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getTemplateDetail(id) {
    this.tempService.getWhatsappTemplate(id).then(
      data => {
        var regex = /(&nbsp;|<([^>]+)>)/ig;
        var body = data['data'][0].wtemp_description;
        var result = body.replace(regex, "");
        this.wpform.get('message').setValue(result);
      },
      err => {

      }
    );
  }

}

@Component({
  selector: 'ticket-assign-agent',
  templateUrl: 'assign-agent.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketAssignAgentComponent {
  public wpform: FormGroup;
  agents = [];
  ticket_id = this.data;
  tickets=[];
  isDisabled = false;
  ticketselection = false;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TicketAssignAgentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private authService: ErpService,
    private tempService: TemplateService
  ) { }

  ngOnInit(): void {

    this.wpform = this.fb.group({
      ticket_id: [this.ticket_id],
      assign_agent: [null],
    });
    this.getGroupAgent();
    if(this.ticket_id==0){
      this.ticketselection=true;
      this.getTickets();
    }
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  getGroupAgent() {
    this.userservice.getActiveSalesGroupAgents().then(
      data => {
        this.agents = data['data']
      },
      err => {

      }
    );
  }
  getTickets() {
    this.userservice.getNotAssignedTicket().then(
      data => {
        this.tickets = data['data']
      },
      err => {

      }
    );
  }

  submit() {
    if (this.wpform.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      this.isDisabled = true;
      let data: any = Object.assign(this.wpform.value);
      this.userservice.changeTicketAssignAgent(data).then(data => {
        if (data) {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.isDisabled = false;
          this.dialogRef.close({ event: 'Add' });

        }
      },
        err => {
          console.log('error');
        })

    }

  }

}



