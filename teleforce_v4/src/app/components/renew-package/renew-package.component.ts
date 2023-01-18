import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-renew-package',
  templateUrl: './renew-package.component.html',
  styleUrls: ['./renew-package.component.css']
})
export class RenewPackageComponent implements OnInit {
  old_req='';

  adminid = '';
  submitted = false;
  public addForm: FormGroup;
  private debouncedTimeout;
  packages = [];
  service = '';
  serviceArr = [];
  gstArr = [];
  billingamount = 0;
  withdiscountamount = 0;
  gstamount = 0;
  billfinalamount = 0;
  stateArr = [];
  totalrenew = 0;
  packageid = null;
  smspackages = [];
  mailpackages = [];
  meetpackages = [];
  digitalpackages = [];
  digitaladspackages = [];
  tollfreepackages = [];
  obdpackages = [];
  transno = null;
  tollfreeno = null;
  obdno = null;
  promotionalno = null;
  otpno = null;
  mailmaxuser = null;
  mailgb = null;
  showbestpackage = false;
  showsmspackage = false;
  showmailpackage = false;
  showmeetpackage = false;
  showdigitalpackage = false;
  checkedbestpackage = false;
  checkedsmspackage = false;
  checkedmailpackage = false;
  checkedmeetpackage = false;
  checkeddigitalpackage = false;
  showpackageminute = false;
  mailvalidity = null;
  bulkmailno = null;
  meetvalidity = null;
  digitalvalidity = null;
  showdiscountamt = false;
  showdiscountper = false;  
  hostingmode = false;
  bulkmode = false;
  smsprvalue = 0;
  hostingservicevalue = 0;
  bulkemailvalue = 0;
  showtollfreepackage = false;
  showobdpackage = false;
  obdpulserate = 60;
  showdigitaladspackage = false;


  constructor(
    public dialogRef: MatDialogRef<RenewPackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private managerservice: ManagerService,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.getPackages();
    this.getTeleSMSPackages();
    this.getTeleMailPackages();
    this.getTeleDigitalPackages();
    this.getTeleMeetPackages();
    this.getGSTdata();
    this.getStatedata();
    this.getManagerDetail(this.data);
    this.getTollfreePackages();
    this.getOBDPackages();
    this.getAdsPackages();
    var startdate = new Date();
    this.addForm = this.fb.group({
      expirydate: [null],
      userlimit: [null, [Validators.required]],
      channels: [null, [Validators.required]],
      package: [null],
      services: [null],
      mgstno: [null],
      companygstno: [null, [Validators.required]],
      packagediscount: [0],
      created_by: [userid],
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
      tollfreepackage:[null],
      tollfreepackagevalue: [null],
      obdpackage:[null],
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
      tele_startdate : [startdate],
      meet_startdate:[startdate],
      mail_startdate:[startdate],
      digital_startdate:[startdate],
      obd_startdate:[startdate],
      tollfree_startdate:[startdate],
      digitalads_startdate:[startdate],
      telesms_startdate:[startdate],
    });
  }

  getManagerDetail(id) {
    this.managerservice.getManagerRenewPackageDetail(id).then(
      data => {
        // console.log("manager data");
         console.log(JSON.stringify(data['data']));
         this.old_req = data['data'];

        this.totalrenew = data['data']['total_renew'];
        var bestpackagemode = false;
        if (data['data'].package_id > 0) {
          this.packageid = data['data'].package_id;
          var expirydate = new Date(data['data']['expiry_date']);
          var bestpackagemode = true;
          this.showbestpackage = true;
          this.checkedbestpackage = true;
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

        if (data['data'].SMS_ID != null) {
          var telesmspackagemode = true;
          this.showsmspackage = true;
          this.checkedsmspackage = true;
        }
        if (data['data'].Mail_ID != null) {
          var telemailpackagemode = true;
          this.showmailpackage = true;
          this.checkedmailpackage = true;
        }
        if (data['data'].Meet_ID != null) {
          var telemeetpackagemode = true;
          this.showmeetpackage = true;
          this.checkedmeetpackage = true;
        }
        if (data['data'].Digital_ID != null) {
          var teledigitalpackagemode = true;
          this.showdigitalpackage = true;
          this.checkeddigitalpackage = true;
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
          //this.checkeddigitalpackage = true;
        }
        if (data['data'].Meet_Startdate == null || data['data'].Meet_Startdate == '1970-01-01') {
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
        }
        //console.log(data['data'].mailexpirydate);
        this.addForm = this.fb.group({
          adminid: [data['data'].account_id],
          created_by: [data['data'].created_by],
          channels: [data['data'].channels, [Validators.required]],
          package: [this.packageid],
          services: [data['data'].services],
          userlimit: [data['data'].user_limit, [Validators.required]],
          expirydate: [expirydate],
          mgstno: [data['data'].Account_GST_NO],
          companygstno: [data['data'].Company_GST_ID, [Validators.required]],
          packagediscount: [data['data'].Plan_discount],
          accountstatecode: [data['data'].Account_State_Code, [Validators.required]],
          accountaddress: [data['data'].Account_Address, [Validators.required]],
          telesmspackage: [data['data'].SMS_ID],
          telesmspackagevalue: [data['data'].SMS_Plan_Value],
          telesmsprvalue: [data['data'].SMS_Pr_No],
          telemailpackage: [data['data'].Mail_ID],
          telemailpackagevalue: [data['data'].Mail_Plan_Value],
          telemeetpackage: [data['data'].Meet_ID],
          telemeetpackagevalue: [data['data'].Meet_Plan_Value],
          teledigitalpackage: [data['data'].Digital_ID],
          teledigitalpackagevalue: [data['data'].Digital_Plan_Value],
          bestpackagemode: [bestpackagemode],
          telesmspackagemode: [telesmspackagemode],
          telemailpackagemode: [telemailpackagemode],
          telemeetpackagemode: [telemeetpackagemode],
          teledigitalpackagemode: [teledigitalpackagemode],
          teledigitaladspackagemode: [teledigitaladspackagemode],
          tollfreepackagemode: [tollfreepackagemode],
          obdpackagemode: [obdpackagemode],
          mailexpirydate: [data['data'].mailexpirydate],
          meetexpirydate: [data['data'].meetexpirydate],
          digitalexpirydate: [data['data'].digitalexpirydate],
          packageminutes: [data['data'].plan_minuits],
          packagefreeminutes: [data['data'].free_minuites],
          discountype: [data['data'].Discount_Type],
          discountper: [data['data'].Discount_Per],
          tollfreepackage:[data['data'].TFree_ID],
          tollfreepackagevalue: [data['data'].TFree_Plan_Value],
          obdpackage:[data['data'].OBD_ID],
          obdpackagevalue: [data['data'].OBD_Plan_Value],
          tele_startdate : [data['data'].Tele_Startdate],          
          meet_startdate: [meetstartdate],
          mail_startdate: [mailstartdate],
          digital_startdate: [digitalstartdate],
          obd_startdate: [obdstartdate],
          tollfree_startdate: [tfreestartdate],
          telesms_startdate: [smstartdate],
          teledigitaladspackage: [data['data'].Ads_ID],
          teledigitaladspackagevalue: [data['data'].Ads_Plan_Value],
          digitalads_startdate: [adstartdate],
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
        if (data['data'].SMS_ID != null) {
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
        }

        this.countBillingAmount();
        this.getPackages();

      },
      err => {
        console.log('error');
      }

    );
  }

  getPackageDetail(value) {
    this.adminservice.getPackageDetail(value).then(
      data => {


        //show create time data show
        if (this.data != '' && this.data != null) {
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
            //console.log(this.packageid+"::"+ data['data']['package_id']);
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

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  submit() {
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value); //console.log(data);
      if (this.totalrenew != null) {
        data.totalrenew = this.totalrenew;
      } else {
        data.totalrenew = 0;
      }
      data.transno = this.transno;
      data.promotionalno = this.promotionalno;
      data.otpno = this.otpno;
      data.mailmaxuser = this.mailmaxuser;
      data.mailgb = this.mailgb;
      data.mailvalidity = this.mailvalidity;
      data.meetvalidity = this.meetvalidity;
      data.digitalvalidity = this.digitalvalidity;
      data.tollfreeno =this.tollfreeno;
      data.obdno = this.obdno;
      data.bulkmailno = this.bulkmailno;
      data.obdpulserate = this.obdpulserate;
     // console.log(data);
     var new_data =JSON.stringify(data);

      this.managerservice.renewManagerPackage(data).then(
        data1 => {
          //console.log(data['data']);
          this._snackBar.open(data1['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.dialogRef.close({ event: 'Update' });
          this.managerservice.create_subscription(data).then(
            data2 => {
              console.log("DONE");
              
            },
            err => {
              console.log('error');
            }
          );
          this.http.get("https://(wrong)sbc2.cloudX.in/ip.php").subscribe((res: any) => {
            var data={ip:res.ip,action:"renew package",account_id :this.data,old_req:JSON.stringify(this.old_req),new_req :new_data}
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
    }
  }
  getTeleSMSPackageValue() {
    var amt = this.addForm.controls['telesmsprvalue'].value;
    
    // console.log("Amit ::" + amt);
    // console.log("smsprvalue ::" + this.smsprvalue);
    var prVal = amt * this.smsprvalue;
    this.addForm.get('telesmspackagevalue').setValue(prVal);
    this.countBillingAmount();
  }
  countBillingAmount() {
    let formdata: any = Object.assign(this.addForm.value);

    //console.log("form data");
    console.log(JSON.stringify(formdata));

    if (formdata.bestpackagemode == true) {
      this.adminservice.getPackageDetail(formdata.package).then(
        data => {

          //console.log("final step");
          //console.log(JSON.stringify(data));
          if(data['data']['minute_type']==1){
            this.billingamount = ( data['data']['package_price']);
          }else{
            this.billingamount = ((formdata.userlimit) * data['data']['package_price']);
          }
         
          if (formdata.telesmspackagemode == true) {
            this.billingamount = (this.billingamount) + (formdata.telesmspackagevalue);
          }
          if (formdata.telemailpackagemode == true) {
            this.billingamount = (this.billingamount) + (formdata.telemailpackagevalue);
          }
          if (formdata.telemeetpackagemode == true) {
            this.billingamount = (this.billingamount) + (formdata.telemeetpackagevalue);
          }
          if (formdata.teledigitalpackagemode == true) {
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
      if (formdata.telesmspackagemode == true) {
        this.billingamount = (this.billingamount) + (formdata.telesmspackagevalue);
      }
      if (formdata.telemailpackagemode == true) {
        this.billingamount = (this.billingamount) + (formdata.telemailpackagevalue);
      }
      if (formdata.telemeetpackagemode == true) {
        this.billingamount = (this.billingamount) + (formdata.telemeetpackagevalue);
      }
      if (formdata.teledigitalpackagemode == true) {
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
        console.log("sonali");
        console.log(data['data']);
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
        //this.addForm.controls['amount'].setValue(plan_val);
        this.addForm.get('telesmspackagevalue').setValue(data['data'][0].SMS_Plan_Value);
        this.addForm.get('telesmsprvalue').setValue(data['data'][0].SMS_Pr_No);
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
        //this.addForm.controls['amount'].setValue(plan_val);
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
        // console.log(data['data']);
        var packagetotalvalue = (data['data'][0].Bulk_Mail_Value + data['data'][0].Mail_Plan_Value);
        // console.log(packagetotalvalue);
        if(data['data'][0].hosting_service==1){
          this.hostingmode=true;
          this.hostingservicevalue=data['data'][0].Mail_Plan_Value ;
        }else{
          this.hostingmode=false;
          this.hostingservicevalue=0;
        }
        if(data['data'][0].bulk_email==1){
          this.bulkmode=true;
          this.bulkemailvalue=data['data'][0].Bulk_Mail_Value ;
          this.bulkmailno = data['data'][0].Bulk_Mail_No;
        }else{
          this.bulkmode=false;
          this.bulkemailvalue=0;
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
    }
    this.countBillingAmount();
  }
  checktelesmsvalue(event) {
    if (event.checked == true) {
      this.showsmspackage = true;
    } else {
      this.showsmspackage = false;
    }
    this.countBillingAmount();
  }
  checktelemailvalue(event) {
    if (event.checked == true) {
      this.showmailpackage = true;
    } else {
      this.showmailpackage = false;
    }
    this.countBillingAmount();
  }
  checktelemeetvalue(event) {
    if (event.checked == true) {
      this.showmeetpackage = true;
    } else {
      this.showmeetpackage = false;
    }
    this.countBillingAmount();
  }
  checkteledigitalvalue(event) {
    if (event.checked == true) {
      this.showdigitalpackage = true;
    } else {
      this.showdigitalpackage = false;
    }
    this.countBillingAmount();
  }

  checktollfreevalue(event) {
    if (event.checked == true) {
      this.showtollfreepackage = true;
    } else {
      this.showtollfreepackage = false;
      this.addForm.get('tollfreepackage').setValue(null);
      this.addForm.get('tollfreepackagevalue').setValue(null);
      this.countBillingAmount();
    }
  }

  checkobdvalue(event) {
    if (event.checked == true) {
      this.showobdpackage = true;
    } else {
      this.showobdpackage = false;
      this.addForm.get('obdpackage').setValue(null);
      this.addForm.get('obdpackagevalue').setValue(null);
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
      this.addForm.get('packagediscount').setValue(0);
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


}
