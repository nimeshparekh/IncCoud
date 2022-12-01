import { element } from 'protractor';
import { async } from '@angular/core/testing';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { ProductsService } from '../../products.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { interval, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SocketioService } from '../../socketio.service';
//import { DialerDialogComponent } from '../dialer-dialog/dialer-dialog.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CallQueueComponent } from '../call-queue/call-queue.component'
import { UA, Socket, WebSocketInterface } from 'jssip'
import { environment } from '../../../environments/environment';
import { Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser'
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-agent-dialer',
  templateUrl: './agent-dialer.component.html',
  styleUrls: ['./agent-dialer.component.css']
})
export class AgentDialerComponent implements OnInit {
  subscription: Subscription;
  agentid = '';
  managerid = '';
  public iscurrentcall = false;
  transferarea = false
  feedbackform: FormGroup;
  dialerform: FormGroup;
  holdform: FormGroup
  voipform: FormGroup
  autoform: FormGroup
  currentcall = [];
  schedule = false;
  recentcall = [];
  agentlead = [];
  agentlist = [];
  callanalytics = []
  iszohoagent = false;
  queuecall = 0;
  products = [];
  //groupname='';
  //transferext='';

  apiUrl: string;
  baseUrl: string;

  isLoading = true;
  dialpad = true;
  isvoipsupport = false
  isvoipenable = false
  groupArr = [];
  breakmode = false
  public scheduledataSource: MatTableDataSource<any>;
  scheduleColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type', 'status', 'agent', 'feedback', 'note'];
  scheduleLength = 0;
  tfPhone: any
  monitoragent = 0;
  reasonArr = [];
  selected_reason = false;
  showid = false
  whatsupaccess = false;
  isDisabled1 = false;
  isagent = false;
  isAutocall = false;
  isHoldcall = false;
  isSoftphone = false;
  isVoip = false;
  @ViewChild("dialernumber") dialernumber: ElementRef;
  @ViewChild('voipaudio') remoteAudio: ElementRef;
  public audioObj = new Audio();
  timezone = localStorage.getItem('timezone') ? localStorage.getItem('timezone') : '+5:30'
  settings = { "show_voip_button": '1' }
  agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
  issupervisor = false;
  constructor(
    private _snackBar: MatSnackBar,
    private userservice: UserService,
    private formBuilder: FormBuilder,
    private socketService: SocketioService,
    private managerservice: ManagerService,
    public dialog: MatDialog,
    private router: Router,
    private basecomponent: BaseComponent
  ) {
    this.apiUrl = environment.apiUrl;
    this.baseUrl = window.location.origin;
  }
  @ViewChild('schedulepaginator') schedulepaginator: MatPaginator;
  ngOnInit(): void {
    console.log(localStorage.getItem("agent_role"));
    if (this.agentrole == 'agent') {
      // this.userrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
      this.isagent = true;
    }
    else {
      this.issupervisor = true

    }
    this.timezone = localStorage.getItem('timezone') ? localStorage.getItem('timezone') : '+5:30'
    this.socketService.customObservable.subscribe((res) => {
      this.queuecall = res.totalcall
    });
    this.scheduledataSource = new MatTableDataSource(); // create new object
    this.loadScript('assets/js/dialer.js');
    this.agentid = localStorage.getItem('access_id');
    //this.getAgentCurrentCall(this.agentid);
    this.getAgentRecentCall(this.agentid);
    this.getAgentProducts(this.agentid);
    this.getAgentLead();
    this.getAgentStartBreakTime()
    //const source = interval(5000);
    //this.subscription = source.subscribe(val => this.getAgentCurrentCall(this.agentid));
    this.feedbackform = this.formBuilder.group({
      feedback: ['', Validators.required],
      scheduledate: [''],
      note: [''],
      starttime: [''],
      id: [''],
    });
    this.dialerform = this.formBuilder.group({
      number: ['', Validators.required],
    });
    this.holdform = this.formBuilder.group({
      holdcall: [''],
      holdreason: ['', Validators.required]
    });
    var voipstatus = localStorage.getItem('voipstatus')
    if (voipstatus == 'true') {
      this.isvoipenable = true
      this.voipform = this.formBuilder.group({
        voip: [voipstatus],
      });
    } else {
      this.voipform = this.formBuilder.group({
        voip: [''],
      });
    }
    var autoanswerstatus = localStorage.getItem('autoanswer')
    if (autoanswerstatus == 'true') {
      this.autoform = this.formBuilder.group({
        autoans: [autoanswerstatus],
      });
    } else {
      this.autoform = this.formBuilder.group({
        autoans: [''],
      });
    }
    this.getAgentGroupwithPackage(this.agentid);
    this.CheckZohoAgent(this.agentid);
    //this.socketService.setupSocketConnection();
    this.getAgentDetail(this.agentid);
    this.getAgentAnalytics();
    this.getCallStopTime();
    this.getReasonData(this.agentid);
    this.accesssetting();
    //
  }

  async accesssetting() {
    var userid = localStorage.getItem('access_id');
  
    await this.userservice.accesssetting(userid).then(
      data => {
        console.log("Setthing", data["data"]);
        if (data["data"][16]["setting_value"] == 1) {
          this.isAutocall = true;
        }
        if (data["data"][7]["setting_value"] == 1) {
          this.isHoldcall = true;
        }
        if (data["data"][9]["setting_value"] == 1) {
          this.isSoftphone = true;
        }
        if (data["data"][17]["setting_value"] == 1) {
          this.isVoip = true;
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  EnableACWHold() {
    let value = { 'holdcall': true, 'holdreason': '17' }
    this.userservice.startAgentHoldTime(value).then(
      data => {
        console.log('Start')
        this.holdform.get('holdcall').setValue('true')
        this.holdform.get('holdreason').setValue('17')
      },
      err => {
        console.log('error');
      }
    );
  }
  DisableACWHold() {
    let value = { 'holdcall': false, 'holdreason': '17' }
    this.userservice.startAgentHoldTime(value).then(
      data => {
        console.log('Stop')
        this.holdform.get('holdcall').setValue('false')
        this.holdform.get('holdreason').setValue('17')
      },
      err => {
        console.log('error');
      }
    );
  }
  async getReasonData(id) {
    await this.userservice.getReasonData(id).then(
      data => {
        this.reasonArr = data['data'];
      },
      err => {
        console.log('error');
      }
    );

  }

  selectedReason(value) {
    if (value) {
      this.selected_reason = false;
      //this.segselect = value
    } else {
      this.selected_reason = true;
    }
  }


  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }
  // opendialerdilog(): void {
  //   const dialogRef = this.dialog.open(DialerDialogComponent, {
  //      disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result.event == 'Add') {
  //     }
  //   });
  // }
  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
  async getAgentAnalytics() {
    this.isDisabled1 = true;

    await this.userservice.getAgentAnalytics().then(
      data => {
        this.isDisabled1 = false;

        this.callanalytics = data['data'][0]
      },
      err => {
        this.isDisabled1 = false;

        console.log('error');
      }
    );
  }
  getCallStopTime() {
    this.isDisabled1 = true

    this.userservice.getCallStopTime().then(
      data => {
        console.log('callhold', data['data'])
        if (data['data'].length > 0) { //console.log(data['data']);
          this.selected_reason = false;
          this.holdform.get('holdreason').setValue(data['data'][0].reason_id)
          this.holdform.get('holdcall').setValue('true')
          this.isDisabled1 = false;
        } else {
          this.selected_reason = true;
          this.holdform.get('holdreason').setValue('');
          this.holdform.get('holdcall').setValue('')
          this.isDisabled1 = false;
        }
        this.isDisabled1 = false;

      },
      err => {
        console.log('error');
        this.isDisabled1 = false;

      }
    );
  }
  onToggle(event) {
    let data: any = Object.assign(this.holdform.value);
    if (!data.holdreason) {
      this.selected_reason = false;
      this._snackBar.open('Please select hold calling reason!!', '', {
        duration: 2000, verticalPosition: 'top'
      });
      console.log(data);
    } else {
      if (event.checked) {
        if (confirm('Are you sure to hold calling?')) {
          let data: any = Object.assign(this.holdform.value);
          //console.log(data)
          this.userservice.startAgentHoldTime(data).then(
            data => {
              this._snackBar.open(data['data'], '', {
                duration: 2000, verticalPosition: 'top'
              });

            },
            err => {
              console.log('error');
            }
          );
        }
      } else {
        let data: any = Object.assign(this.holdform.value);
        console.log(data)
        this.userservice.startAgentHoldTime(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.holdform.get('holdreason').setValue('');
            this.selected_reason = true;
          },
          err => {
            console.log('error');
          }
        );
      }
    }

  }
  onToggleVoip(event) {
    //console.log(event.checked)
    if (event.checked) {
      if (confirm('Are you sure to enable voip?')) {
        let data: any = Object.assign(this.voipform.value);
        console.log(data)
        localStorage.setItem('voipstatus', 'true');
        this.isvoipenable = true
        location.reload();
      }
    } else {
      let data: any = Object.assign(this.voipform.value);
      console.log(data)
      localStorage.setItem('voipstatus', 'false');
      this.isvoipenable = false
      location.reload();
    }
  }
  onToggleAuto(event) {
    //console.log(event.checked)
    if (event.checked) {
      if (confirm('Are you sure to enable auto answer?')) {
        let data: any = Object.assign(this.autoform.value);
        console.log(data)
        localStorage.setItem('autoanswer', 'true');
        location.reload();
      }
    } else {
      let data: any = Object.assign(this.autoform.value);
      console.log(data)
      localStorage.setItem('autoanswer', 'false');
      location.reload();
    }
  }
  clicktocall() {
    var number = this.dialernumber.nativeElement.value;
    var data = number.toString();
    // var callernumber = data.trim()
    var callernumber = data.replaceAll(" ", "");

    var agentid = localStorage.getItem('access_id');
    if (callernumber.length == 11 || callernumber.length == 10 || callernumber.length == 12) {
      if (confirm("Are you sure to call ?")) {
        var voipstatus = localStorage.getItem('voipstatus')
        if (voipstatus == 'true') {
          this.basecomponent.voipcall(callernumber)
        } else {
          this.userservice.agentOutgoingCall(agentid, callernumber).then(
            data => {
              if (data['err'] == false) {
                this._snackBar.open(data['msg'], '', {
                  duration: 2000, verticalPosition: 'top'
                });
                this.dialernumber.nativeElement.value = "";
              } else {
                this._snackBar.open(data['msg'], '', {
                  duration: 2000, verticalPosition: 'top'
                });
                this.dialernumber.nativeElement.value = "";
              }
            },
            err => {
              console.log('error');
            }
          );
        }
      }
    } else {
      this._snackBar.open('Please enter valid  number', '', {
        duration: 3000, verticalPosition: 'top'
      });
    }
  }
  clicktocallvoip() {
    var callernumber = this.dialernumber.nativeElement.value;
    var agentid = localStorage.getItem('access_id');
    if (callernumber.length == 10) {
      if (confirm("Are you sure to call ?")) {
        // Register callbacks to desired call events
        var eventHandlers = {
          'progress': function (e) {
            console.log('call is in progress');
            this.setcallanswer()
          },
          'failed': function (e) {
            console.log('call failed with cause: ' + e.data);
            this.setcallend()
          },
          'ended': function (e) {
            console.log('call ended with cause: ' + e.data);
            this.setcallend()
          },
          'confirmed': function (e) {
            console.log('call confirmed');
          },
          'addstream': function (e) {
            console.log('call addstream');
          }
        };
        var options = {
          //'eventHandlers'    : eventHandlers,
          'mediaConstraints': { 'audio': true }
        };

        var session = this.tfPhone.call('sip:' + callernumber + '@192.168.1.26', options);
      }
    } else {
      this._snackBar.open('Please enter 10 digit mobile number', '', {
        duration: 3000, verticalPosition: 'top'
      });
    }
  }
  public setcallanswer() {
    this.iscurrentcall = true
  }
  public setcallend() {
    this.iscurrentcall = false
  }
  async getAgentDetail(agentid) {
    await this.userservice.getAgentDatail(agentid).then(
      data => {
        console.log('data::' + JSON.stringify(data['data']));
        if (data['data']['voip_status'] == 0) {
          this.isvoipsupport = true
        }
        if (data['data']['show_no_id'] == 1) {
          this.showid = true
        }
        if (data['data']['whatsup_access'] == 0) {
          this.whatsupaccess = true
        }
        this.getManagerDetail(data['data']['created_by']);
        this.monitoragent = data['data']['monitor_agent'];
        this.managerid = data['data']['created_by'];
      },
      err => {
        console.log('error');
      })
  }

  async getAgentCurrentCall(agentid) {
    this.isDisabled1 = true;

    await this.userservice.getAgentCurrentCall(agentid).then(
      data => {
        console.log(data)
        if (data['data'].length > 0) {
          this.currentcall = data['data'][0]
          console.log(this.currentcall['id']);
          //this.iscurrentcall=true;

          if (this.currentcall['id'] > 0) {
            this.feedbackform.get("id").setValue(this.currentcall['id']);
            this.getCalldetailhistory(this.currentcall['id']);
            this.getAgentList(this.currentcall['accountid'], agentid);
          }
        }
        this.isDisabled1 = false;

      },
      err => {
        console.log('error');
        this.isDisabled1 = false;

      }
    );
  }
  async CheckZohoAgent(agentid) {
    await this.userservice.CheckZohoAgent(agentid).then(
      data => {
        this.iszohoagent = data['msg']
      },
      err => {
        console.log('error');
      }
    );
  }
  async getAgentList(accountid, agentid) {
    await this.userservice.getAgents(accountid).then(
      data => {
        this.agentlist = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCalldetailhistory(userid) {
    // console.log(userid);    
    await this.userservice.getCalldetailhistory(userid).then(
      data => {
        // console.log('manual:' ,data['data']);
        this.scheduledataSource.data = data['data'];
        this.scheduleLength = data['data'].length;
        this.isLoading = false;
        this.scheduledataSource.paginator = this.schedulepaginator;
      },
      err => {
        console.log('error');
      }
    );
  }
  feedbacksubmit() {
    if (this.feedbackform.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      let data: any = Object.assign(this.feedbackform.value);
      console.log("feedback", data);
      this.userservice.updateAgentCallFeedback(data).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          //this.iscurrentcall=false;
          this.feedbackform.get("feedback").setValue('');
          this.feedbackform.get("note").setValue('');
          this.feedbackform.get("scheduledate").setValue('');
          this.feedbackform.get("starttime").setValue('');
          this.getAgentRecentCall(this.agentid);
        },
        err => {
          console.log('error');
        }
      );
    }

  }

  showSchedule(value) {
    if (value == 'schedule') {
      this.schedule = true;
    } else {
      this.schedule = false;
    }
  }

  async getAgentProducts(agentid) {
    await this.userservice.getAgentProducts(agentid).then(
      data => {
        console.log("Product Data");
        //console.log(JSON.stringify(data));
        this.products = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  /**
   * 
   * @param agentid 
   * product listing
   */
  async getAgentRecentCall(agentid) {
    this.isDisabled1 = true;

    await this.userservice.getAgentRecentCall(agentid).then(
      data => {
        this.isDisabled1 = false;

        this.recentcall = data['data'];
      },
      err => {
        this.isDisabled1 = false;

        console.log('error');
      }
    );
  }

  callFromHistory(agentid, mobile) {
    //console.log(mobile);
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
            } else {
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
              this.dialernumber.nativeElement.value = "";
            }
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }

  async getAgentLead() {
    this.isDisabled1 = true

    await this.userservice.getAgentLead(this.agentid).then(
      data => {
        this.agentlead = data['data'];
        this.isLoading = false;
        this.isDisabled1 = false;

      },
      err => {
        this.isDisabled1 = false;

        console.log('error');
      }
    );
  }

  calltolead(numid) {
    if (confirm("Are you sure to call ?")) {
      var voipstatus = localStorage.getItem('voipstatus')
      if (voipstatus == 'true') {
        this.basecomponent.voipcall(numid)
      } else {
        this.userservice.agentLeadCall(this.agentid, numid).then(
          data => {
            if (data['err'] == false) {
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
              this.getAgentLead();
            }
            if (data['err'] != '') {
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
  }
  async getAgentGroupwithPackage(agentid) {
    await this.userservice.getAgentGroupwithPackage(agentid).then(
      data => {
        console.log(data['data']);
        this.groupArr = data['data'];
        //this.groupname = data['data'][0]['groupname'];
        // this.transferext=data['data'][0]['transferext'];
      },
      err => {
        console.log('error');
      }
    );
  }
  ngAfterViewInit() {
    this.scheduledataSource.paginator = this.schedulepaginator;
  }

  //Call Control
  hangup() {
    this.iscurrentcall = false;
  }
  transfershow(id) {
    if (this.transferarea) {
      this.transferarea = false
    } else {
      this.transferarea = true
    }
  }
  transfer(id, agentid) {
    this.userservice.calltransfer(id, agentid).then(
      data => {
        this.iscurrentcall = false;
        this._snackBar.open('Call transfer successfully.', '', {
          duration: 2000, verticalPosition: 'top'
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async getManagerDetail(managerid) {
    await this.managerservice.getManagerDetail(managerid).then(
      data => {
        this.dialpad = true;
        if (data['data']['services'].length > 1) {
          var services = JSON.parse(data['data']['services']);
          if (services.length > 0) {
            for (var i = 0; i < services.length; i++) {
              if (services[i] == '8') {
                this.dialpad = false;
              }
            }

          } else {
            var services = data['data']['services'];
            if (services == '8') {
              this.dialpad = false;
            }
          }
        }
        var settingsArr = data['settings']
        console.log(this.settings);
        if (settingsArr.length > 0) {
          var that = this
          settingsArr.map(function (elem) {
            var name = elem.setting_name
            that.settings[name] = elem.setting_value
          });
        }
        console.log(this.settings);
        if (this.settings['voip_call_auto_answer'] == 1) {
          var autoanswerstatus = localStorage.getItem('autoanswer')
          console.log(autoanswerstatus);
          if (autoanswerstatus == 'false' || autoanswerstatus == undefined) {
            localStorage.setItem('autoanswer', 'true');
            location.reload();
          }
        }
      },
      err => {
        console.log('error');
      })
  }
  opensoftphone() {
    this.basecomponent.opencallpopup()
    // var url = 'https://agent.cloudX.in/webphone/';
    // var features = 'menubar=no,location=no,resizable=no,scrollbars=no,status=no,addressbar=no,width=320,height=480';
    // window.open(url, 'VoipPhone', features);
  }


  openagentshareDialog(): void {
    const dialogRef = this.dialog.open(AgentProductShareComponents, {

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  callqueuemodal() {
    const dialogRef = this.dialog.open(CallQueueComponent, {
      data: 0
    });//disableClose: true,
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {

      }
    });
  }


  productPreview(productid) {
    console.log('productid :' + productid);
    //this.router.navigate(['/', 'http://localhost:4200/product/'+productid]);

    window.open(
      "http://products.cloudX.in/product/" + productid, "_blank");
  }

  agentemailshare(productid): void {
    var data = { productid: productid, type: 'email' }
    const dialogRef = this.dialog.open(AgentProductShareComponents, {
      disableClose: true, data: data, width: '650px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  agentsmsshare(productid): void {
    var data = { productid: productid, type: 'sms' }
    const dialogRef = this.dialog.open(AgentProductShareComponents, {
      disableClose: true, data: data, width: '650px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  agentwhatsappshare(productid): void {
    var data = { productid: productid, type: 'whatsapp' }
    const dialogRef = this.dialog.open(AgentProductShareComponents, {
      disableClose: true, data: data, width: '650px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  getAgentStartBreakTime() {
    var userid = localStorage.getItem("access_id");
    this.userservice.getAgentStartBreakTime(userid).then(
      data => {
        if (data['data']) {
          this.breakmode = true;
        } else {
          this.breakmode = false;
        }

      },
      err => {
        console.log('error');
      }
    );
  }

  //Refresh Data
  refreshdata() {
    this.agentid = localStorage.getItem('access_id');
    //this.getAgentCurrentCall(this.agentid);
    this.getAgentRecentCall(this.agentid);
    this.getAgentAnalytics();
    this.getAgentLead();
    this.getCallStopTime();
  }

  shownumber(number, id) {
    if (this.showid) {
      return id;//"TF"+number.substring(4,3)+"3"+number.substring(1,3)+"2"+number.substring(7,3)+"1"+number.substring(10,3)
    } else {
      return number
    }
  }
  microphone(){
    
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
    // Code for success
    alert("Microphone  detected")
    }).catch(err => {
        if(err.includes("NotFoundError: Requested device not found")){
          alert("Microphone not detected")

        }
        else{alert("Error recording audio")} 
  })
  }

}





@Component({
  selector: 'agent-product-share',
  templateUrl: 'agent-product-share.component.html',
  styleUrls: ['./agent-dialer.component.css']
})
export class AgentProductShareComponents implements OnInit {
  @ViewChild('parent') parent: ElementRef;
  form: FormGroup;
  public addForm: FormGroup;
  emailhtml;
  ehtml;
  emailtempid;
  smstempid;
  isemailmode = false;
  issmsmode = false;
  iswhatsappmode = false;
  p_name;
  p_desc;
  sms_design;
  constructor(
    public dialogRef: MatDialogRef<AgentProductShareComponents>,
    @Inject(MAT_DIALOG_DATA) public data: AgentDialerComponent,
    private productservice: ProductsService,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    public router: Router,
    private fb: FormBuilder, ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {


    let userid = localStorage.getItem('access_id');

    if (this.data['type'] == 'email') {
      this.isemailmode = true;
      this.issmsmode = false;
      this.iswhatsappmode = false;

      this.productservice.getProductEmail(this.data['productid']).then(
        data => {
          this.emailhtml = this.sanitizer.bypassSecurityTrustHtml(data['data'].email_html);
          this.ehtml = data['data'].email_html;
          this.emailtempid = data['data'].templateid;
          this.p_name = data['data'].product_name;
          this.p_desc = data['data'].product_desc;
        },
        err => {
          console.log('error');
        }
      );

      this.addForm = this.fb.group({
        agent_id: [userid],
        email: [null, [Validators.email]],
        subject: [null, [Validators.required]],
        htmlContent: [null, [Validators.required]],
        product_id: [this.data['productid']],
        //template_id: [this.emailtempid]

      });
    }

    if (this.data['type'] == 'sms') {
      this.isemailmode = false;
      this.issmsmode = true;
      this.iswhatsappmode = false;

      this.productservice.getProductSMS(this.data['productid']).then(
        data => {

          console.log("sms data");
          //console.log(JSON.stringify(data));
          this.sms_design = this.sanitizer.bypassSecurityTrustHtml(data['data'].sms_text);
          //this.ehtml = data['data'].email_html;
          //this.emailtempid = data['data'].templateid;
          this.p_name = data['data'].product_name;
          this.p_desc = data['data'].product_desc;
          this.smstempid = data['data'].templateid;
        },
        err => {
          console.log('error');
        }
      );

      this.addForm = this.fb.group({
        agent_id: [userid],
        sms_to: [null, [Validators.required]],
        product_id: [this.data['productid']],
        //template_id: [this.emailtempid]

      });

    }

    if (this.data['type'] == 'whatsapp') {
      this.isemailmode = false;
      this.issmsmode = false;
      this.iswhatsappmode = true;

      this.productservice.getProductWhatsapp(this.data['productid']).then(
        data => {

          this.sms_design = this.sanitizer.bypassSecurityTrustHtml(data['data'].sms_text);
          //this.ehtml = data['data'].email_html;
          //this.emailtempid = data['data'].templateid;
          this.p_name = data['data'].product_name;
          this.p_desc = data['data'].product_desc;
          this.smstempid = data['data'].templateid;
        },
        err => {
          console.log('error');
        }
      );

      this.addForm = this.fb.group({
        agent_id: [userid],
        sms_to: [null, [Validators.required]],
        product_id: [this.data['productid']],
        //template_id: [this.emailtempid]

      });

    }

  }

  submit() {

    let data: any = Object.assign(this.addForm.value);

    if (this.data['type'] == 'email') {
      data['email_template'] = this.ehtml;
      data['template_id'] = this.emailtempid;

      this.productservice.sendProductEmail(data).then(
        data => {
          this._snackBar.open("Email sent successfully !", 'Dissmis', {
            duration: 5000,
          });
          this.dialogRef.close({ event: 'Add' });
        },
        err => {
          console.log('error');
        }
      );
    }

    if (this.data['type'] == 'sms') {
      data['sms_template'] = this.sms_design;
      data['template_id'] = this.smstempid;

      this.productservice.sendProductSMS(data).then(
        data => {
          this._snackBar.open(data['msg'], 'Dissmis', {
            duration: 5000,
          });
          this.dialogRef.close({ event: 'Add' });
        },
        err => {
          console.log('error');
        }
      );
    }

    if (this.data['type'] == 'whatsapp') {
      data['sms_template'] = this.sms_design;
      data['template_id'] = this.smstempid;

      this.productservice.sendProductWHATSAPP(data).then(
        data => {
          // console.log("last step");
          // console.log(JSON.stringify(data));
          // console.log(data['data']['sms_to']);
          this.dialogRef.close({ event: 'Add' });
          window.open("http://api.whatsapp.com/send?phone=+91" + data['data']['sms_to'] + "&text=" + data['data']['sms_text'])

        },
        err => {
          console.log('error');
        }
      );
    }


  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    width: '100%',
    minHeight: '100px',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };


}