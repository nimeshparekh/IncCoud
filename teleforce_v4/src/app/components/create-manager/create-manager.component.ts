import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErpService } from './../../erp.service';
import { UserService } from './../../user.service';

@Component({
  selector: 'app-create-manager',
  templateUrl: './create-manager.component.html',
  styleUrls: ['./create-manager.component.css']
})
export class CreateManagerComponent implements OnInit {
  ipdata='';
  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  packages = [];
  voiceservers = [];
  socketservers = [];
  service = '';
  serviceArr = [];
  gstArr = [];
  stateArr = [];
  billingamount = 0;
  withdiscountamount = 0;
  gstamount = 0;
  packageid = null;
  billfinalamount = 0;
  smspackages = [];
  mailpackages = [];
  meetpackages = [];
  digitalpackages = [];
  tollfreepackages = [];
  obdpackages = [];
  digitaladspackages = [];
  transno = null;
  promotionalno = null;
  otpno = null;
  mailmaxuser = null;
  mailgb = null;
  bulkmailno = null;
  tollfreeno = null;
  obdno = null;
  codeGenerated = ''; // for 10 digit code
  showbestpackage = false;
  showsmspackage = false;
  showmailpackage = false;
  showmeetpackage = false;
  showtollfreepackage = false;
  showobdpackage = false;
  showdigitaladspackage = false;
  showdigitalpackage = false;
  showpackageminute = false;
  mailvalidity = null;
  meetvalidity = null;
  digitalvalidity = null;
  showdiscountper = false;
  showdiscountamt = false;
  hostingmode = false;
  bulkmode = false;
  smsprvalue = 0;
  hostingservicevalue = 0;
  bulkemailvalue = 0;
  obdpulserate = 60;
  agentcount = 0;
  isdisabled = false;
  msg = '';
  groupname=[];
  obd_voiceservers=[];
  old_req =''
  constructor(
    public dialogRef: MatDialogRef<CreateManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private managerservice: ManagerService,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    public authService: ErpService,
    public userservice: UserService
  ) { }
  randomString() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    const stringLength = 10;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    this.codeGenerated = randomstring;
    this.addForm.controls.password.setValue(randomstring);
    return 0;
  }
  ngOnInit(): void {
    this.get_obd_server()
    this.getVoiceServer()
    this.getSocketServer()
    this.getPackages();
    this.getTeleSMSPackages();
    this.getTeleMailPackages();
    this.getTeleDigitalPackages();
    this.getTeleMeetPackages();
    this.getTollfreePackages();
    this.getOBDPackages();
    this.getGSTdata();
    this.getStatedata();
    this.getAdsPackages();
    this.getAssignedAgents()
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.adminid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.adminid = this.data
        this.editmode = true;
        this.addmode = false;
        this.getManagerDetail(this.data);
        //this.countBillingAmount();
        this.getActiveAgents(this.data);
      }

    }
    var startdate = new Date();
    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(15)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
      email: [null, [Validators.required, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z]{2,}")], [Validators.composeAsync([this.checkEmailValid.bind(this)])]],
      mobile: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")], [Validators.composeAsync([this.checkValidMobile.bind(this)])]],
      alternatemobile: [null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: [null, [Validators.required]],
      created_by: [userid],
      companyname: ['', [Validators.required]],
      authorised_person_name: [''],
      pulse: ['0'],
      credits: ['0'],
      balance: ['0'],
      status: [null, [Validators.required]],
      expirydate: [null],
      userlimit: [null, [Validators.required]],
      channels: [null, [Validators.required]],
      package: [null],
      services: [null],
      mgstno: [null],
      companygstno: [null, [Validators.required]],
      packagediscount: [0],
      accountstatecode: [null, [Validators.required]],
      accountaddress: [null, [Validators.required]],
      telesmspackage: [null],
      telesmspackagevalue: [null],
      telesmsprvalue: [null],
      telemailpackage: [null],
      telemailpackagevalue: [null],
      mailexpirydate: [null],
      telemeetpackage: [null],
      telemeetpackagevalue: [null],
      meetexpirydate: [null],
      teledigitalpackage: [null],
      teledigitalpackagevalue: [null],
      teledigitaladspackage: [null],
      teledigitaladspackagevalue: [null],
      tollfreepackage: [null],
      tollfreepackagevalue: [null],
      obdpackage: [null],
      obdpackagevalue: [null],
      digitalexpirydate: [null],
      bestpackagemode: [null],
      telesmspackagemode: [null],
      telemailpackagemode: [null],
      telemeetpackagemode: [null],
      teledigitalpackagemode: [null],
      teledigitaladspackagemode: [null],
      tollfreepackagemode: [null],
      obdpackagemode: [null],
      packageminutes: [null],
      packagefreeminutes: [0],
      discountype: [null],
      discountper: [0],
      tele_startdate: [startdate],
      meet_startdate: [startdate],
      mail_startdate: [startdate],
      digital_startdate: [startdate],
      obd_startdate: [startdate],
      tollfree_startdate: [startdate],
      digitalads_startdate: [startdate],
      telesms_startdate: [startdate],
      voice_server: [null],
      socket_server: [null],
      demo_account: [0],
      voip_chargeable: [0],
      billing_type: [0],
      leadlimit: [null],ip:[''],renew_account_manager:[''],obd_server:[''],obd_channels:['']
    });
    // this.http.post(environment.apiUrl + '/tfapi/getmanageraccountbalance/', { username: "rinkal14" }).subscribe(data => {
    //   console.log(data['balance']);
    // });


  }
  private checkUsernameValid(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    if (control.value == null) {
      console.log('control' + control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);
    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/signin/checkusername/', { check: control.value }).subscribe(data => {

          if (data['isexist']) {
            resolve({ 'name': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
  }

  private checkEmailValid(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    if (control.value == null) {
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/signin/checkemail/', { check: control.value }).subscribe(data => {
          console.log(data);

          if (data['isexist']) {

            resolve({ 'email': true });
          } else {

            resolve(null);
          }
        });
      }, 30);
    });
    return q;
  }

  private checkValidMobile(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    //console.log(control)
    if (control.value == null) {
      console.log('control' + control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/manager/checkmanagermobile/', { check: control.value }).subscribe(data => {
          if (data['isexist']) {
            resolve({ 'mobile': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
  }

  invalidUserName() {
    return (this.addForm.controls.name.errors != null);
  }

  invalidEmail() {
    return (this.addForm.controls.email.errors != null);
  }

  invalidMobile() {
    return (this.addForm.controls.mobile.errors != null);
  }


  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  getPackages() {
    this.adminservice.getPackages().then(
      data => {
        //console.log(data['data']);
        this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  getVoiceServer() {
    this.adminservice.getAsteriskServerData().then(
      data => {
        //console.log(data['data']);
        this.voiceservers = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  get_obd_server() {
    this.adminservice.get_obd_asterisk_server_data().then(
      data => {
        //console.log(data['data']);
        this.obd_voiceservers = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getSocketServer() {
    this.adminservice.getSocketServerData().then(
      data => {
        //console.log(data['data']);
        this.socketservers = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getActiveAgents(userid) {
    await this.userservice.getActiveAgents(userid).then(
      data => {

        this.agentcount = data['data'].length;
        //this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }


  changeuserlimit(value) {
    if (this.data != '' && this.data != null) {
      let data: any = Object.assign(this.addForm.value);
      if (this.agentcount > data.userlimit) {
        this.msg = 'You have ' + this.agentcount + ' current users.please delete someone to change your user limit.';
        this.isdisabled = true;
      } else {
        this.msg = '';
        this.isdisabled = false;
      }
    }
    this.countBillingAmount();
  }
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value);
      data.transno = this.transno;
      data.promotionalno = this.promotionalno;
      data.otpno = this.otpno;
      data.mailmaxuser = this.mailmaxuser;
      data.mailgb = this.mailgb;
      data.bulkmailno = this.bulkmailno;
      data.mailvalidity = this.mailvalidity;
      data.meetvalidity = this.meetvalidity;
      data.digitalvalidity = this.digitalvalidity;
      data.tollfreeno = this.tollfreeno;
      data.obdno = this.obdno;
      data.obdpulserate = this.obdpulserate;
      console.log("manager data");
      console.log(JSON.stringify(data));

      var owner = 'sonali@cloudX.in';

      // var user_obj = {};
      // user_obj['doctype'] = "User";
      // user_obj['enabled'] = 1;
      // user_obj['__unsaved'] = 1;
      // user_obj['send_welcome_email'] = 0;
      // user_obj['unsubscribed'] = 0;
      // user_obj['language'] = 'en';
      // user_obj['mute_sounds'] = 0;
      // user_obj['logout_all_sessions'] = 0;
      // user_obj['__islocal'] = 1;
      // user_obj['document_follow_notify'] = 0;
      // user_obj['document_follow_frequency'] = "Daily";
      // user_obj['thread_notify'] = 1;
      // user_obj['send_me_a_copy'] = 0;
      // user_obj['allowed_in_mentions'] = 0;
      // user_obj['simultaneous_sessions'] = 1;
      // user_obj['user_type'] = "System User";
      // user_obj['bypass_restrict_ip_check_if_2fa_enabled'] = 0;

      // user_obj['email'] = data.email;
      // user_obj['name'] = data.name;
      // user_obj['first_name'] = data.name;
      // user_obj['username'] = data.name;
      // user_obj['mobile_no'] = data.mobile;
      // user_obj['new_password'] = "Garuda@dv321" //data.password;

      // user_obj['block_modules'] = [{ "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 1, "module": "Automation" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 2, "module": "Customization" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 3, "module": "Website" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 4, "module": "Leaderboard" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 5, "module": "Getting Started" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 6, "module": "Selling" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 7, "module": "Stock" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 8, "module": "Projects" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 9, "module": "Loan Management" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 10, "module": "HR" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 11, "module": "Healthcare" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 12, "module": "Marketplace" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 13, "module": "Settings" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 14, "module": "Users and Permissions" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 15, "module": "Integrations" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 16, "module": "Social" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 17, "module": "Accounts" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 18, "module": "Buying" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 19, "module": "Assets" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 21, "module": "Support" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 22, "module": "Quality Management" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 23, "module": "Help" }];
      // user_obj['roles'] = [{ "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 1, "role": "Customer" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 2, "role": "Dashboard Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 3, "role": "Analytics" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 4, "role": "Accounts Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 5, "role": "Projects Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 6, "role": "Purchase Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 7, "role": "Purchase User" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 8, "role": "Report Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 9, "role": "Sales Master Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 10, "role": "Item Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 11, "role": "Purchase Master Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 12, "role": "Quality Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 13, "role": "Sales Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 14, "role": "Sales User" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 15, "role": "Stock Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 16, "role": "Supplier" }];


      // console.log(data);
     
      if (this.data != '' && this.data != null) {
        var new_data =JSON.stringify(data);
        this.managerservice.updateManager(data).then(
          data1 => {
            this._snackBar.open(data1['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
            console.log("STart");
            this.managerservice.create_subscription(data).then(
              data2 => {
                console.log("DONE");

              },
              err => {
                console.log('error');
              }
            );
            this.http.get("https://sbc2.cloudX.in/ip.php").subscribe((res: any) => {
              var data={ip:res.ip,action:"update manager",account_id:this.data,old_req:JSON.stringify(this.old_req),new_req :new_data}
              this.managerservice.get_ip_for_instert_data(data).then(
                data2 => {
                  console.log("DONE");
  
                },
                err => {
                  console.log('error');
                }
              );
    
            });
         
          },
          err => {
            console.log('error');
          }
        );
      } else {
        var new_data2 =JSON.stringify(data);

        this.managerservice.saveManager(data).then(
          mdata => {
            // console.log("smit:" + mdata['data']);
            console.log(JSON.stringify(mdata));
            data.adminid = mdata['data']
            this.managerservice.create_subscription(data).then(
              data => {
                console.log();

              },
              err => {
                console.log('error');
              }
            );
            this.http.get("https://sbc2.cloudX.in/ip.php").subscribe((res: any) => {
              var data={ip:res.ip,action:"save manager",account_id :mdata['data'],old_req:JSON.stringify(this.old_req),new_req :new_data2}
              this.managerservice.get_ip_for_instert_data(data).then(
                data2 => {
                  console.log("DONE");
  
                },
                err => {
                  console.log('error');
                }
              );
    
            });
            this._snackBar.open('Manager detail saved succesfully.', '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
            // this.authService.create_User(user_obj).then(
            //   data => {
            //     console.log("data");
            //     // console.log(JSON.stringify(data));
            //     var erp_userid = data['data']['social_logins'][0]['userid'];
            //     var erp_username = data['data']['social_logins'][0]['parent'];
            //     var erp_password = 'Garuda@dv321';

            //     var erp_data = { erp_userid: erp_userid, erp_username: erp_username, erp_password: erp_password, id: mdata['data'] }

            //     this.managerservice.update_erp_manager(erp_data).then(
            //       data => {
            //         this._snackBar.open(data['data'], '', {
            //           duration: 2000, verticalPosition: 'top'
            //         });
            //         this.dialogRef.close({ event: 'Add' });
            //       },
            //       err => {
            //         console.log('error');
            //       }
            //     );

            //   },
            //   err => {
            //     console.log('error');
            //   }
            // );
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }

  getManagerDetail(id) {
    this.managerservice.getManagerDetail(id).then(
      data => {
        console.log(data['data']);
        this.old_req = data['data'];
        var bestpackagemode = false;
        if (data['data'].package_id > 0) {
          this.packageid = data['data'].package_id;

          var expirydate = new Date(data['data']['expiry_date']);
          var bestpackagemode = true;
          this.showbestpackage = true;
          if (data['data'].plan_minuits != null) {
            this.showpackageminute = true;
          }
        } else {
          this.packageid = null;
          var expirydate = new Date();
        }

        var telesmspackagemode = false;
        var telemailpackagemode = false;
        var telemeetpackagemode = false;
        var teledigitalpackagemode = false;
        var teledigitaladspackagemode = false;
        var tollfreepackagemode = false;
        var obdpackagemode = false;

        /*if (data['data'].SMS_ID != null) {
          var telesmspackagemode = true;
          this.showsmspackage = true;
        }
        if (data['data'].Mail_ID != null) {
          var telemailpackagemode = true;
          this.showmailpackage = true;
        }
        if (data['data'].Meet_ID != null) {
          var telemeetpackagemode = true;
          this.showmeetpackage = true;
        }
        if (data['data'].Digital_ID != null) {
          var teledigitalpackagemode = true;
          this.showdigitalpackage = true;
        }
        if (data['data'].TFree_ID != null) {
          var tollfreepackagemode = true;
          this.showtollfreepackage = true;
        }
        if (data['data'].OBD_ID != null) {
          var obdpackagemode = true;
          this.showobdpackage = true;
        }
        if (data['data'].Ads_ID != null) {
          var teledigitaladspackagemode = true;
          this.showdigitaladspackage = true;
        }*/
        if (data['data'].Tele_Startdate == null || data['data'].Tele_Startdate == '1970-01-01') {
          var telestartdate = new Date();
        } else {
          var telestartdate = data['data'].Tele_Startdate;
        }

        /* if (data['data'].Meet_Startdate == null || data['data'].Meet_Startdate == '1970-01-01') {
           var meetstartdate = new Date();
         } else {
           var meetstartdate = data['data'].Meet_Startdate;
         }
 
         if (data['data'].Mail_Startdate == null || data['data'].Mail_Startdate == '1970-01-01') {
           var mailstartdate = new Date();
         } else {
           var mailstartdate = data['data'].Mail_Startdate;
         }
 
         if (data['data'].Digital_Startdate == null || data['data'].Digital_Startdate == '1970-01-01') {
           var digitalstartdate = new Date();
         } else {
           var digitalstartdate = data['data'].Digital_Startdate;
         }
 
         if (data['data'].SMS_Startdate == null || data['data'].SMS_Startdate == '1970-01-01') {
           var smstartdate = new Date();
         } else {
           var smstartdate = data['data'].SMS_Startdate;
         }
 
         if (data['data'].TFree_Startdate == null || data['data'].TFree_Startdate == '1970-01-01') {
           var tfreestartdate = new Date();
         } else {
           var tfreestartdate = data['data'].TFree_Startdate;
         }
 
         if (data['data'].obdstartdate == null || data['data'].obdstartdate == '1970-01-01') {
           var obdstartdate = new Date();
         } else {
           var obdstartdate = data['data'].obdstartdate;
         }
         if (data['data'].Ads_Startdate == null || data['data'].Ads_Startdate == '1970-01-01') {
           var adstartdate = new Date();
         } else {
           var adstartdate = data['data'].Ads_Startdate;
         }*/

        this.addForm = this.fb.group({
          adminid: [data['data'].account_id],
          name: [data['data'].account_name, [Validators.required]],
          email: [data['data'].email, [Validators.required, Validators.email]],
          mobile: [data['data'].mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")], [Validators.composeAsync([this.checkEditValidMobile.bind(this)])]],
          alternatemobile: [data['data'].alternate_mobile, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          created_by: [data['data'].created_by],
          companyname: [data['data'].company_name, [Validators.required]],
          authorised_person_name: [data['data'].authorised_person_name],
          pulse: [data['data'].pulse],
          credits: [data['data'].credits],
          balance: [data['data'].balance],
          channels: [data['data'].channels, [Validators.required]],
          package: [this.packageid],
          services: [data['data'].services],
          userlimit: [data['data'].user_limit, [Validators.required]],
          status: [data['data'].current_status, [Validators.required]],
          expirydate: [expirydate],
          mgstno: [data['data'].Account_GST_NO],
          companygstno: [data['data'].Company_GST_ID, [Validators.required]],
          packagediscount: [data['data'].Plan_discount],
          accountstatecode: [data['data'].Account_State_Code, [Validators.required]],
          accountaddress: [data['data'].Account_Address, [Validators.required]],
          /*telesmspackage: [data['data'].SMS_ID],
          telesmspackagevalue: [data['data'].SMS_Plan_Value],
          telesmsprvalue: [data['data'].SMS_Pr_No],
          telemailpackage: [data['data'].Mail_ID],
          telemailpackagevalue: [data['data'].Mail_Plan_Value],
          telemeetpackage: [data['data'].Meet_ID],
          telemeetpackagevalue: [data['data'].Meet_Plan_Value],
          teledigitalpackage: [data['data'].Digital_ID],
          teledigitalpackagevalue: [data['data'].Digital_Plan_Value],*/
          bestpackagemode: [bestpackagemode],
          /*telesmspackagemode: [telesmspackagemode],
          telemailpackagemode: [telemailpackagemode],
          telemeetpackagemode: [telemeetpackagemode],
          teledigitalpackagemode: [teledigitalpackagemode],
          teledigitaladspackagemode: [teledigitaladspackagemode],
          tollfreepackagemode: [tollfreepackagemode],
          obdpackagemode: [obdpackagemode],
          mailexpirydate: [data['data'].mailexpirydate],
          meetexpirydate: [data['data'].meetexpirydate],
          digitalexpirydate: [data['data'].digitalexpirydate],*/
          packageminutes: [data['data'].plan_minuits],
          packagefreeminutes: [data['data'].free_minuites],
          discountype: [data['data'].Discount_Type],
          discountper: [data['data'].Discount_Per],
          tele_startdate: [telestartdate],
          // tollfreepackage: [data['data'].TFree_ID],
          // tollfreepackagevalue: [data['data'].TFree_Plan_Value],
          // obdpackage: [data['data'].OBD_ID],
          // obdpackagevalue: [data['data'].OBD_Plan_Value],
          // meet_startdate: [meetstartdate],
          // mail_startdate: [mailstartdate],
          // digital_startdate: [digitalstartdate],
          // obd_startdate: [obdstartdate],
          // tollfree_startdate: [tfreestartdate],
          // telesms_startdate: [smstartdate],
          // teledigitaladspackage: [data['data'].Ads_ID],
          // teledigitaladspackagevalue: [data['data'].Ads_Plan_Value],
          // digitalads_startdate: [adstartdate],
          obd_channels:[data['data'].obd_channel],
          obd_server:[data['data'].obd_server_id],
          voice_server: [data['data'].voice_server_id],
          socket_server: [data['data'].socket_url],
          demo_account: [data['data'].is_demo],
          voip_chargeable: [data['data'].voip_pulse_charge],
          billing_type: [data['data'].billing_type],
          leadlimit: [data['data'].lead_limit]
          ,ip:[''],renew_account_manager:[data['data'].renew_account_manager]
        });
        if (data['data'].Discount_Type == 0) {
          this.showdiscountper = true;
          this.showdiscountamt = false;
        }
        if (data['data'].Discount_Type == 1) {
          this.showdiscountper = false;
          this.showdiscountamt = true;
        }
        if (data['data'].package_id > 0) {
          if (data['data']['services'].length > 1) {
            //if(data['data']['package_service'].indexOf(0)==-1){
            this.serviceArr = JSON.parse(data['data']['services']);
            this.service = '';
            this.addForm.get('services').setValue(JSON.parse(data['data']['services']));
          } else {
            this.service = data['data']['services'];
            this.serviceArr = [];
            this.addForm.get('services').setValue(JSON.parse(data['data']['services']));
          }

        }
        /* if (data['data'].SMS_ID != null) {
           this.getEditTeleSMSPackageDetail(data['data'].SMS_ID);
         }
         if (data['data'].Mail_ID != null) {
           this.getTeleMailPackageDetail(data['data'].Mail_ID);
         }
         if (data['data'].Meet_ID != null) {
           this.getTeleMeetPackageDetail(data['data'].Meet_ID);
         }
         if (data['data'].Digital_ID != null) {
           this.getTeleDigitalPackageDetail(data['data'].Digital_ID);
         }
         if (data['data'].TFree_ID != null) {
           this.getTollfreePackageDetail(data['data'].TFree_ID);
         }
         if (data['data'].OBD_ID != null) {
           this.getOBDPackageDetail(data['data'].OBD_ID);
         }*/
        this.countBillingAmount();

      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.managerservice.deleteManager(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
      },
      err => {
        console.log('error');
      }
    );
  }
  getPackageDetail(value) {
    this.adminservice.getPackageDetail(value).then(
      data => {
        //this.billingamount = (data['data']['package_userlimit']*data['data']['package_price']);
        // console.log(this.billingamount);
        //show create time data show
        if (this.data != '' && this.data != null) {

          //console.log();
          if (this.packageid != data['data']['package_id']) {
            if (data['data']['package_validity'] == 0) {
              var myDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
            }
            if (data['data']['package_validity'] == 1) {
              var myDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
            }
            if (data['data']['package_validity'] == 2) {
              var myDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
            }
            if (data['data']['package_validity'] == 3) {
              var myDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
            }

            this.addForm.get('expirydate').setValue(myDate);
            // console.log(this.packageid+"::"+ data['data']['package_id']);
          }

        } else {
          this.addForm.get('userlimit').setValue(data['data']['package_userlimit']);
          this.addForm.get('channels').setValue(data['data']['package_channels']);
          if (data['data']['package_validity'] == 0) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          }
          if (data['data']['package_validity'] == 1) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
          }
          if (data['data']['package_validity'] == 2) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
          }
          if (data['data']['package_validity'] == 3) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
          }

          this.addForm.get('expirydate').setValue(myDate);
          //console.log(data['data']['package_service'].indexOf(0));
        }
        // console.log(this.packageid);
        if (this.packageid == null) {
          if (data['data']['package_validity'] == 0) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          }
          if (data['data']['package_validity'] == 1) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
          }
          if (data['data']['package_validity'] == 2) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
          }
          if (data['data']['package_validity'] == 3) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
          }

          this.addForm.get('expirydate').setValue(myDate);
        }
        //show disabled services
        //console.log(data['data']['package_service'].length);
        if (data['data']['package_service'].length > 1) {
          //if(data['data']['package_service'].indexOf(0)==-1){
          this.serviceArr = JSON.parse(data['data']['package_service']);
          this.service = '';
          this.addForm.get('services').setValue(JSON.parse(data['data']['package_service']));
        } else {
          this.service = data['data']['package_service'];
          this.serviceArr = [];
          //console.log(JSON.parse(data['data']['package_service']));
          this.addForm.get('services').setValue(JSON.parse(data['data']['package_service']));
        }
        if (data['data']['minute_type'] == 1) {
          this.showpackageminute = true;
          this.addForm.get('packageminutes').setValue(data['data']['minutes']);
        } else {
          this.addForm.get('packageminutes').setValue(null);
          this.addForm.get('packagefreeminutes').setValue(null);
          this.showpackageminute = false;
        }

        //console.log(this.serviceArr);    
        //console.log(this.service);
        this.countBillingAmount();

      },
      err => {
        console.log('error');
      }
    );

  }

  private checkEditValidMobile(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string

    var id = this.addForm.value.adminid;
    if (control.value == null) {
      console.log('control' + control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/manager/checkmanagereditmobile/', { check: control.value, id: id }).subscribe(data => {
          if (data['isexist']) {
            resolve({ 'mobile': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
  }

  async getGSTdata() {
    await this.adminservice.getGSTdata().then(
      data => {
        this.gstArr = (data['data']);
      },
      err => {
        console.log('error');
      }
    );
  }

  getTeleSMSPackageValue() {
    var amt = this.addForm.controls['telesmsprvalue'].value;

    console.log("Amit ::" + amt);
    console.log("smsprvalue ::" + this.smsprvalue);

    var prVal = amt * this.smsprvalue;
    this.addForm.get('telesmspackagevalue').setValue(prVal);
    this.countBillingAmount();
  }

  countBillingAmount() {
    let formdata: any = Object.assign(this.addForm.value);
    if (formdata.bestpackagemode == true) {
      this.adminservice.getPackageDetail(formdata.package).then(
        data => {
          if (data['data']['minute_type'] == 1) {
            this.billingamount = (data['data']['package_price']);
          } else {
            this.billingamount = ((formdata.userlimit) * data['data']['package_price']);
          }

          if (formdata.telesmspackagevalue != null) {
            this.billingamount = (this.billingamount) + (formdata.telesmspackagevalue);
          }
          if (formdata.telemailpackagevalue != null) {
            this.billingamount = (this.billingamount) + (formdata.telemailpackagevalue);
          }
          if (formdata.telemeetpackagevalue != null) {
            this.billingamount = (this.billingamount) + (formdata.telemeetpackagevalue);
          }
          if (formdata.teledigitalpackagevalue != null) {
            this.billingamount = (this.billingamount) + (formdata.teledigitalpackagevalue);
          }
          if (formdata.tollfreepackagevalue != null) {
            this.billingamount = (this.billingamount) + (formdata.tollfreepackagevalue);
          }
          if (formdata.obdpackagevalue != null) {
            this.billingamount = (this.billingamount) + (formdata.obdpackagevalue);
          }
          if (formdata.teledigitaladspackagevalue != null) {
            this.billingamount = (this.billingamount) + (formdata.teledigitaladspackagevalue);
          }
          if (formdata.discountype == 0) {
            var discountamt = Math.round(((this.billingamount) * (formdata.discountper)) / 100);
            this.addForm.get('packagediscount').setValue(discountamt);
            this.withdiscountamount = (this.billingamount - discountamt);
          } else if (formdata.discountype == 1) {
            this.withdiscountamount = (this.billingamount - formdata.packagediscount);
          } else {
            this.withdiscountamount = (this.billingamount);
          }
          //console.log(formdata.packagediscount);

          this.billfinalamount = (this.withdiscountamount);
          var mgstno = formdata.mgstno;
          var accountstatecode = formdata.accountstatecode;
          var companygstno = formdata.companygstno;
          //console.log(accountstatecode);
          if (accountstatecode != null && companygstno != '') {
            // var accountstatecode = mgstno.substring(0, 2);
            var companystatecode = companygstno.substring(0, 2);
            var cgst = 0;
            var sgst = 0;
            var igst = 0;
            //this.gstamount = 0;
            if (accountstatecode == companystatecode) {
              var cgst = Math.round((this.withdiscountamount * 9) / 100);
              var sgst = Math.round((this.withdiscountamount * 9) / 100);
              this.gstamount = (cgst + sgst);
            }
            if (accountstatecode != companystatecode) {
              var igst = Math.round((this.withdiscountamount * 18) / 100);
              this.gstamount = igst;
            }
            if (this.gstamount > 0) {
              this.billfinalamount = (this.gstamount + this.withdiscountamount);
            } else {
              this.billfinalamount = (this.withdiscountamount);
            }
          }
        });
    } else {
      this.billingamount = 0;
      if (formdata.telesmspackagevalue != null) {
        this.billingamount = (this.billingamount) + (formdata.telesmspackagevalue);
      }
      if (formdata.telemailpackagevalue != null) {
        this.billingamount = (this.billingamount) + (formdata.telemailpackagevalue);
      }
      if (formdata.telemeetpackagevalue != null) {
        this.billingamount = (this.billingamount) + (formdata.telemeetpackagevalue);
      }
      if (formdata.teledigitalpackagevalue != null) {
        this.billingamount = (this.billingamount) + (formdata.teledigitalpackagevalue);
      }
      if (formdata.teledigitaladspackagevalue != null) {
        this.billingamount = (this.billingamount) + (formdata.teledigitaladspackagevalue);
      }
      if (formdata.tollfreepackagevalue != null) {
        this.billingamount = (this.billingamount) + (formdata.tollfreepackagevalue);
      }
      if (formdata.obdpackagevalue != null) {
        this.billingamount = (this.billingamount) + (formdata.obdpackagevalue);
      }
      if (formdata.discountype == 0) {
        var discountamt = Math.round(((this.billingamount) * (formdata.discountper)) / 100);
        this.addForm.get('packagediscount').setValue(discountamt);
        this.withdiscountamount = (this.billingamount - discountamt);
      } else if (formdata.discountype == 1) {
        this.withdiscountamount = (this.billingamount - formdata.packagediscount);
      } else {
        this.withdiscountamount = (this.billingamount);
      }

      this.billfinalamount = (this.withdiscountamount);
      var mgstno = formdata.mgstno;
      var accountstatecode = formdata.accountstatecode;
      var companygstno = formdata.companygstno;
      //console.log(accountstatecode);
      if (accountstatecode != null && companygstno != '') {
        // var accountstatecode = mgstno.substring(0, 2);
        var companystatecode = companygstno.substring(0, 2);
        var cgst = 0;
        var sgst = 0;
        var igst = 0;
        //this.gstamount = 0;
        if (accountstatecode == companystatecode) {
          var cgst = Math.round((this.withdiscountamount * 9) / 100);
          var sgst = Math.round((this.withdiscountamount * 9) / 100);
          this.gstamount = (cgst + sgst);
        }
        if (accountstatecode != companystatecode) {
          var igst = Math.round((this.withdiscountamount * 18) / 100);
          this.gstamount = igst;
        }
        if (this.gstamount > 0) {
          this.billfinalamount = (this.gstamount + this.withdiscountamount);
        } else {
          this.billfinalamount = (this.withdiscountamount);
        }
      }
    }

  }

  async getStatedata() {
    await this.adminservice.getStatedata().then(
      data => {
        this.stateArr = (data['data']);
      },
      err => {
        console.log('error');
      }
    );
  }

  getTeleSMSPackages() {
    this.adminservice.getTeleSMSPackages().then(
      data => {
        //console.log(data['data']);
        this.smspackages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  getTeleSMSPackageDetail(id) {
    this.adminservice.getTeleSMSPackageDetail(id).then(
      data => {
        // console.log(data['data']);
        //if(this.editmode == false){
        this.addForm.get('telesmspackagevalue').setValue(data['data'][0].SMS_Plan_Value);
        this.addForm.get('telesmsprvalue').setValue(data['data'][0].SMS_Pr_No);
        //}

        this.smsprvalue = data['data'][0].SMS_Pr_Rate;

        this.transno = data['data'][0].SMS_TR_No;
        this.promotionalno = data['data'][0].SMS_Pr_No;
        this.otpno = data['data'][0].SMS_otp_No;

        this.countBillingAmount();
        //this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  getEditTeleSMSPackageDetail(id) {
    this.adminservice.getTeleSMSPackageDetail(id).then(
      data => {


        this.smsprvalue = data['data'][0].SMS_Pr_Rate;

        this.transno = data['data'][0].SMS_TR_No;
        this.promotionalno = data['data'][0].SMS_Pr_No;
        this.otpno = data['data'][0].SMS_otp_No;

        this.countBillingAmount();
        //this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  getTeleMailPackages() {
    this.adminservice.getTeleMailPackages().then(
      data => {
        //console.log(data['data']);
        this.mailpackages = data['data'];


      },
      err => {
        console.log('error');
      }
    );
  }

  getTeleMailPackageDetail(id) {
    this.adminservice.getTeleMailPackageDetail(id).then(
      data => {
        var packagetotalvalue = (data['data'][0].Bulk_Mail_Value + data['data'][0].Mail_Plan_Value);
        // console.log(packagetotalvalue);
        if (data['data'][0].hosting_service == 1) {
          this.hostingmode = true;
          this.hostingservicevalue = data['data'][0].Mail_Plan_Value;
        } else {
          this.hostingmode = false;
          this.hostingservicevalue = 0;
        }
        if (data['data'][0].bulk_email == 1) {
          this.bulkmode = true;
          this.bulkemailvalue = data['data'][0].Bulk_Mail_Value;
          this.bulkmailno = data['data'][0].Bulk_Mail_No;
        } else {
          this.bulkmode = false;
          this.bulkemailvalue = 0;
          this.bulkmailno = null;
        }
        this.addForm.get('telemailpackagevalue').setValue(packagetotalvalue);
        this.mailmaxuser = data['data'][0].Max_User_No;
        this.mailgb = data['data'][0].Mail_Gb;
        this.mailvalidity = data['data'][0]['package_validity'];
        if (this.data != '' && this.data != null) {

        } else {
          if (data['data'][0]['package_validity'] == 0) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          }
          if (data['data'][0]['package_validity'] == 1) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
          }
          if (data['data'][0]['package_validity'] == 2) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
          }
          if (data['data'][0]['package_validity'] == 3) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
          }
          this.addForm.get('mailexpirydate').setValue(myDate);
        }

        this.countBillingAmount();
        //this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getTeleMeetPackages() {
    this.adminservice.getTeleMeetPackages().then(
      data => {
        //console.log(data['data']);
        this.meetpackages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  getTeleMeetPackageDetail(id) {
    this.adminservice.getTeleMeetPackageDetail(id).then(
      data => {
        // console.log(data['data']);
        this.meetvalidity = data['data'][0]['package_validity'];
        this.addForm.get('telemeetpackagevalue').setValue(data['data'][0].Meet_Plan_Value);
        if (this.data != '' && this.data != null) {

        } else {
          if (data['data'][0]['package_validity'] == 0) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          }
          if (data['data'][0]['package_validity'] == 1) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
          }
          if (data['data'][0]['package_validity'] == 2) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
          }
          if (data['data'][0]['package_validity'] == 3) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
          }

          this.addForm.get('meetexpirydate').setValue(myDate);
        }
        this.countBillingAmount();
        //this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getTeleDigitalPackages() {
    this.adminservice.getTeleDigitalPackages().then(
      data => {
        //console.log(data['data']);
        this.digitalpackages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  getTeleDigitalPackageDetail(id) {
    this.adminservice.getTeleDigitalPackageDetail(id).then(
      data => {
        // console.log(data['data']);
        this.digitalvalidity = data['data'][0]['Package_Validity'];
        this.addForm.get('teledigitalpackagevalue').setValue(data['data'][0].Package_Value);
        if (this.data != '' && this.data != null) {

        } else {
          if (data['data'][0]['Package_Validity'] == 0) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          }
          if (data['data'][0]['Package_Validity'] == 1) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
          }
          if (data['data'][0]['Package_Validity'] == 2) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
          }
          if (data['data'][0]['Package_Validity'] == 3) {
            var myDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
          }

          this.addForm.get('digitalexpirydate').setValue(myDate);
        }
        this.countBillingAmount();
        //this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getTollfreePackageDetail(id) {
    this.adminservice.getTollfreePackageDetail(id).then(
      data => {
        // console.log(data['data']);
        this.addForm.get('tollfreepackagevalue').setValue(data['data'][0].TFree_Value);
        this.tollfreeno = data['data'][0].TFree_No;
        this.countBillingAmount();
        //this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getTollfreePackages() {
    this.adminservice.getTollfreePackages().then(
      data => {
        //console.log(data['data']);
        this.tollfreepackages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getOBDPackageDetail(id) {
    this.adminservice.getOBDPackageDetail(id).then(
      data => {
        // console.log(data['data']);
        this.addForm.get('obdpackagevalue').setValue(data['data'][0].OBD_Value);
        this.obdno = data['data'][0].OBD_No;
        this.obdpulserate = data['data'][0].OBD_Pulserate;
        this.countBillingAmount();
        //this.packages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getOBDPackages() {
    this.adminservice.getOBDPackages().then(
      data => {
        //console.log(data['data']);
        this.obdpackages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getAdsPackages() {
    await this.adminservice.getAdsPackages().then(
      data => {
        //console.log(data['data']);
        this.digitaladspackages = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getAdsPackageDetail(id) {
    this.adminservice.getAdsPackageDetail(id).then(
      data => {
        this.addForm.get('teledigitaladspackagevalue').setValue(data['data'].Adspackage_value);
        this.countBillingAmount();
      },
      err => {
        console.log('error');
      }
    );
  }




  checkbestpackagevalue(event) {
    if (event.checked == true) {
      this.showbestpackage = true;
    } else {
      this.showbestpackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('package').setValue(null);
      }
      this.countBillingAmount();
    }
  }
  checktelesmsvalue(event) {
    if (event.checked == true) {
      this.showsmspackage = true;
    } else {
      this.showsmspackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('telesmspackage').setValue(null);
        this.addForm.get('telesmspackagevalue').setValue(null);
        this.promotionalno = null;
      }

      this.countBillingAmount();
    }
  }
  checktelemailvalue(event) {
    if (event.checked == true) {
      this.showmailpackage = true;
    } else {
      this.showmailpackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('telemailpackage').setValue(null);
        this.addForm.get('telemailpackagevalue').setValue(null);
        this.addForm.get('mailexpirydate').setValue(null);
      }

      this.countBillingAmount();
    }
  }
  checktelemeetvalue(event) {
    if (event.checked == true) {
      this.showmeetpackage = true;
    } else {
      this.showmeetpackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('telemeetpackage').setValue(null);
        this.addForm.get('telemeetpackagevalue').setValue(null);
        this.addForm.get('meetexpirydate').setValue(null);
      }

      this.countBillingAmount();
    }
  }
  checkteledigitalvalue(event) {
    if (event.checked == true) {
      this.showdigitalpackage = true;
    } else {
      this.showdigitalpackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('teledigitalpackage').setValue(null);
        this.addForm.get('teledigitalpackagevalue').setValue(null);
        this.addForm.get('digitalexpirydate').setValue(null);
      }

      this.countBillingAmount();
    }
  }
  checktollfreevalue(event) {
    if (event.checked == true) {
      this.showtollfreepackage = true;
    } else {
      this.showtollfreepackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('tollfreepackage').setValue(null);
        this.addForm.get('tollfreepackagevalue').setValue(null);
      }

      this.countBillingAmount();
    }
  }
  checkobdvalue(event) {
    if (event.checked == true) {
      this.showobdpackage = true;
    } else {
      this.showobdpackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('obdpackage').setValue(null);
        this.addForm.get('obdpackagevalue').setValue(null);
      }
      this.countBillingAmount();
    }
  }
  checkteledigitaladsvalue(event) {
    if (event.checked == true) {
      this.showdigitaladspackage = true;
    } else {
      this.showdigitaladspackage = false;
      if (this.data != null) {

      } else {
        this.addForm.get('adspackage').setValue(null);
        this.addForm.get('adspackagevalue').setValue(null);
      }
      this.countBillingAmount();
    }
  }


  showDiscount(value) {
    if (value == 0) {
      let formdata: any = Object.assign(this.addForm.value);
      var discountamt = Math.round(((this.billingamount) * (formdata.discountper)) / 100);
      this.addForm.get('packagediscount').setValue(discountamt);
      //this.addForm.get('packagediscount').setValue(100);
      this.showdiscountper = true;
      this.showdiscountamt = false;
    } else {
      this.addForm.get('packagediscount').setValue(0);
      this.showdiscountper = false;
      this.showdiscountamt = true;
    }
    this.countBillingAmount();
  }
  async getAssignedAgents() {
    var id= 854
    await this.userservice.getAssignedAgents(id).then(
      data => {
        this.groupname = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

}
