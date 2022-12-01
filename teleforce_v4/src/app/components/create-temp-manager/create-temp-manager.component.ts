import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-temp-manager',
  templateUrl: './create-temp-manager.component.html',
  styleUrls: ['./create-temp-manager.component.css']
})
export class CreateTempManagerComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  packages = [];
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
  transno = null;
  promotionalno = null;
  otpno = null;
  mailmaxuser = null;
  mailgb = null;
  codeGenerated = ''; // for 10 digit code
  showbestpackage = false;
  showsmspackage = false;
  showmailpackage = false;
  showmeetpackage = false;
  showdigitalpackage = false;
  showpackageminute = false;
  mailvalidity=null;
  meetvalidity=null;
  digitalvalidity=null;
  showdiscountper = false;
  showdiscountamt = false;

  constructor(
    public dialogRef: MatDialogRef<CreateTempManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private managerservice: ManagerService,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getPackages();
    this.getTeleSMSPackages();
    this.getTeleMailPackages();
    this.getTeleDigitalPackages();
    this.getTeleMeetPackages();
    this.getGSTdata();
    this.getStatedata();
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
      }

    }

    this.addForm = this.fb.group({
      userid: [null],
      name: [null, [Validators.required, Validators.maxLength(15)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")], [Validators.composeAsync([this.checkValidMobile.bind(this)])]],
      alternatemobile: [null, [ Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
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
      telemailpackage: [null],
      telemailpackagevalue: [null],
      mailexpirydate: [null],
      telemeetpackage: [null],
      telemeetpackagevalue: [null],
      meetexpirydate: [null],
      teledigitalpackage: [null],
      teledigitalpackagevalue: [null],
      digitalexpirydate: [null],
      bestpackagemode: [null],
      telesmspackagemode: [null],
      telemailpackagemode: [null],
      telemeetpackagemode: [null],
      teledigitalpackagemode: [null],
      packageminutes: [null],
      packagefreeminutes: [0],
      discountype: [null],
      discountper: [0],
    });

  }

  private checkUsernameValid(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    //console.log(control)
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
    return (this.submitted && this.addForm.controls.name.errors != null);
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

  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); //console.log(data);
      data.transno = this.transno;
      data.promotionalno = this.promotionalno;
      data.otpno = this.otpno;
      data.mailmaxuser = this.mailmaxuser;
      data.mailgb = this.mailgb;
      data.mailvalidity = this.mailvalidity;
      data.meetvalidity = this.meetvalidity;
      data.digitalvalidity = this.digitalvalidity;
      //console.log('data:'+JSON.stringify(data));
        this.managerservice.saveTempManager(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
          },
          err => {
            console.log('error');
          }
        );
      
    }
  }

  getManagerDetail(id) {
    this.managerservice.getTempManagerDetail(id).then(
      data => {
        this.addForm.get('userid').setValue(data['data'].userid);
        this.addForm.get('name').setValue(data['data'].name);
        this.addForm.get('mobile').setValue(data['data'].mobile);
        this.addForm.get('email').setValue(data['data'].email);
        this.addForm.get('accountaddress').setValue(data['data'].Account_Address);
        this.addForm.get('userlimit').setValue(data['data'].totalusers);
        this.addForm.get('companygstno').setValue(data['data'].gst);        
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

  countBillingAmount() {
    let formdata: any = Object.assign(this.addForm.value);
    if (formdata.bestpackagemode == true) {
      this.adminservice.getPackageDetail(formdata.package).then(
        data => {
          this.billingamount = ((formdata.userlimit) * data['data']['package_price']);
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
          if (formdata.discountype==0) {
            var discountamt = Math.round(((this.billingamount)*(formdata.discountper))/100);
            this.addForm.get('packagediscount').setValue(discountamt);
            this.withdiscountamount = (this.billingamount - discountamt);
          }else if (formdata.discountype==1) {
            this.withdiscountamount = (this.billingamount - formdata.packagediscount);
          }else{
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
      if (formdata.discountype==0) {
        var discountamt = Math.round(((this.billingamount)*(formdata.discountper))/100);
        this.addForm.get('packagediscount').setValue(discountamt);
        this.withdiscountamount = (this.billingamount - discountamt);
      }else if (formdata.discountype==1) {
        this.withdiscountamount = (this.billingamount - formdata.packagediscount);
      }else{
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
        this.addForm.get('telesmspackagevalue').setValue(data['data'][0].SMS_Plan_Value);
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
        // console.log(data['data']);
        this.addForm.get('telemailpackagevalue').setValue(data['data'][0].Mail_Plan_Value);
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
        this.digitalvalidity = data['data'][0]['package_validity'];
        this.addForm.get('teledigitalpackagevalue').setValue(data['data'][0].Digital_Plan_Value);
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
  checkbestpackagevalue(event) {
    if (event.checked == true) {
      this.showbestpackage = true;
    } else {
      this.showbestpackage = false;
      this.addForm.get('package').setValue(null);
      this.countBillingAmount();
    }
  }

  checktelesmsvalue(event) {
    if (event.checked == true) {
      this.showsmspackage = true;
    } else {
      this.showsmspackage = false;
      this.addForm.get('telesmspackage').setValue(null);
      this.addForm.get('telesmspackagevalue').setValue(null);
      this.countBillingAmount();
    }
  }
  checktelemailvalue(event) {
    if (event.checked == true) {
      this.showmailpackage = true;
    } else {
      this.showmailpackage = false;
      this.addForm.get('telemailpackage').setValue(null);
      this.addForm.get('telemailpackagevalue').setValue(null);
      this.addForm.get('mailexpirydate').setValue(null);
      this.countBillingAmount();
    }
  }
  checktelemeetvalue(event) {
    if (event.checked == true) {
      this.showmeetpackage = true;
    } else {
      this.showmeetpackage = false;
      this.addForm.get('telemeetpackage').setValue(null);
      this.addForm.get('telemeetpackagevalue').setValue(null);
      this.addForm.get('meetexpirydate').setValue(null);
      this.countBillingAmount();
    }
  }
  checkteledigitalvalue(event) {
    if (event.checked == true) {
      this.showdigitalpackage = true;
    } else {
      this.showdigitalpackage = false;
      this.addForm.get('teledigitalpackage').setValue(null);
      this.addForm.get('teledigitalpackagevalue').setValue(null);
      this.addForm.get('digitalexpirydate').setValue(null);
      this.countBillingAmount();
    }
  }

  showDiscount(value){
    if(value==0){
      let formdata: any = Object.assign(this.addForm.value);
      var discountamt = Math.round(((this.billingamount)*(formdata.discountper))/100);
      this.addForm.get('packagediscount').setValue(discountamt);
      //this.addForm.get('packagediscount').setValue(100);
      this.showdiscountper=true;
      this.showdiscountamt=false;
    }else{
      this.addForm.get('packagediscount').setValue(0);
      this.showdiscountper=false;
      this.showdiscountamt=true;
    }
    this.countBillingAmount();
  }

}
