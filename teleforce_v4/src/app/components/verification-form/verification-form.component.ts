import { Component, OnInit, VERSION, ViewChild, Inject, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-verification-form',
  templateUrl: './verification-form.component.html',
  styleUrls: ['./verification-form.component.css']
})
export class VerificationFormComponent implements OnInit {
  submitted = false;
  public addForm: FormGroup;
  public kycform: FormGroup;
  state = [];
  serviceErrors: any = {};

  registration_certiimg = '';
  gst_certificateimg = '';
  agreementimg = '';
  pan_cardimg = '';
  kycid = '';
  authorized_person_proofimg = '';
  registrationpdf = false;
  gstpdf = false;
  agreementpdf = false;
  pancardpdf = false;
  personproofpdf = false;
  planid;
  kycstatus;
  validateKyc = false;
  public breakpoint: number;
  transid = ''
  responseurl = environment.apiUrl + '/payment/success'
  didlist = [];
  loggeduser = ''
  paystatus = 'unpaid'
  constructor(private adminservice: AdminService, public router: Router, private fb: FormBuilder, private authAPIservice: AuthService, private http: HttpClient, private _snackBar: MatSnackBar, private userservice: UserService, private el: ElementRef) { }

  ngOnInit(): void {

    this.loadlocalScript('https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js');//https://checkout-static.citruspay.com/bolt/run/bolt.min.js
    this.loadScript('./assets/js/payu.js')
    var ord = JSON.stringify(Math.random() * 1000000);
    var i = ord.indexOf('.');
    ord = 'txn' + ord.substr(0, i);
    this.transid = ord;

    this.loadScript('./assets/js/verification-form.js');
    let userid = localStorage.getItem('access_id');
    let username = localStorage.getItem('user');
    this.loggeduser = username
    this.getstatedata();
    this.addForm = this.fb.group({
      // udf5: ['BOLT_KIT_NODE_JS'],
      // surl: ['http://localhost:3000/response.html'],
      // key: ['M9Gf1lTf'],
      // salt: ['efR7yq4nIc'],
      txnid: [ord],
      pacakge: ['', [Validators.required]],
      pinfo: ['cloudX Telephony Solution'],
      hash: [''],
      name: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: [null, [Validators.email]],
      address: [null],
      state: [null],
      totalusers: [0, [Validators.required]],
      amount: [0, [Validators.required]],
      gst: [18, [Validators.required]],
      totalamount: [0, [Validators.required]],
      username: [username],
    })

    this.kycform = this.fb.group({
      registration_certi: ['', Validators.required],
      gst_certificate: ['', Validators.required],
      agreement: [''],
      pan_card: ['', Validators.required],
      authorized_person_proof: ['', Validators.required]
    });

    //check whether this user is in temp record or not
    this.userservice.getTempUser(username).then(
      data => {
        
        if (data && data['data'].length > 0) {
          this.planid = data['data'][0].userid;
          this.paystatus = data['data'][0].pay_status;
          this.addForm = this.fb.group({
            name: [data['data'][0].name, [Validators.required]],
            mobile: [data['data'][0].mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            email: [data['data'][0].email, [Validators.email]],
            address: [data['data'][0].address],
            state: [data['data'][0].state],
            totalusers: [data['data'][0].totalusers, [Validators.required]],
            amount: [data['data'][0].amount, [Validators.required]],
            gst: [18, [Validators.required]],
            totalamount: [data['data'][0].totalamount, [Validators.required]],
            username: [username],
          })

          this.kycform = this.fb.group({
            registration_certi: [''],
            gst_certificate: [''],
            agreement: [''],
            pan_card: [''],
            authorized_person_proof: ['']

          });

          this.getkyc(this.planid);

        } else {

        }

      },
      err => {
        console.log('error');
      }
    );
    this.getUnusedDid(0);
  }

  async getUnusedDid(userid) {
    await this.adminservice.getUnusedDid(userid).then(
      data => {
        this.didlist = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  public loadlocalScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.id = 'bolt';
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }


  doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    //console.log('status'+xhr.status);
    if (xhr.status == 200) {
      return true;
    } else {
      return false;
    }
  }


  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  getstatedata() {
    let userinfo = localStorage.getItem('access_id');
    this.http.get(environment.apiUrl + '/contacts/getStatedata/').subscribe((data: any) => {
      this.state = data['data'];
    });
  }

  getPlan(plan_val) {
    this.addForm.controls['amount'].setValue(plan_val);
    this.getTotalAmount();
  }

  getTotalAmount() { //event
    //console.log("Amount :"+ this.addForm.controls['amount'].value);
    //var total_users = event.target.value;
    var total_users = this.addForm.controls['totalusers'].value;
    var amount = this.addForm.controls['amount'].value;
    var gst = 18;
    var sub_total = (parseInt(total_users) * parseFloat(amount));
    var gst_amt = ((parseInt(total_users) * parseFloat(amount) * (gst)) / 100).toFixed(2);
    var amt = sub_total + parseFloat(gst_amt);
    //console.log("total data:"+ amt);
    this.addForm.controls['totalamount'].setValue(amt);
  }
  submit() {
    this.submitted = true;
    let data: any = Object.assign(this.addForm.value);
    console.log("test");
    
    let newuserid = localStorage.getItem('newuserid');
    
    console.log("data :"+ this.planid);
    if (this.planid > 0) {
      data['userid'] = newuserid;
      this.userservice.updatePlan(data).then(
        data => {
        },
        err => {
          console.log('error');
        }
      );
      
    } else {
      this.userservice.savePlan(data).then(
        data => {
          console.log("nimesh garuda");
          console.log(data);
          this.planid = data;
        },
        err => {
          console.log('error');
        }
      );
    }

  }

  doc_submit() {
    this.submitted = true;
    this.validateKyc = true;

    let newuserid = localStorage.getItem('newuserid');
    let kycid = localStorage.getItem('kycid');
    if (newuserid === 'undefined' || newuserid === null) {
      newuserid = this.planid;
    }

    if (this.kycform.invalid == true) {
      // console.log("hello", this.kycform.value);
      console.log("Error");
      return;
    } else {
      let data: any = Object.assign(this.kycform.value);
      
      let kycformData = new FormData();
      kycformData.append('userid', newuserid);

      let registerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#registration_certi');
      if (registerinputEl) {
        let fileCount1: number = registerinputEl.files.length;
        if (fileCount1 > 0) {
          kycformData.append('registration_certi', registerinputEl.files.item(0));
        }
      }

      let gstinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#gst_certificate')
      if (gstinputEl) {
        let fileCount1: number = gstinputEl.files.length;
        if (fileCount1 > 0) {
          kycformData.append('gst_certificate', gstinputEl.files.item(0));
        }
      }

      let agreementinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#agreement')
      if (agreementinputEl) {
        let fileCount1: number = agreementinputEl.files.length;
        if (fileCount1 > 0) {
          kycformData.append('agreement', agreementinputEl.files.item(0));
        }
      }

      let pancardinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#pan_card')
      if (pancardinputEl) {
        let fileCount1: number = pancardinputEl.files.length;
        if (fileCount1 > 0) {
          kycformData.append('pan_card', pancardinputEl.files.item(0));
        }
      }

      let authoinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#authorized_person_proof')
      if (authoinputEl) {
        let fileCount1: number = authoinputEl.files.length;
        if (fileCount1 > 0) {
          kycformData.append('authorized_person_proof', authoinputEl.files.item(0));
        }
      }

      if (kycid === null) {
        this.userservice.addkycformData(kycformData).then(
          data => {
            //console.log('update::' + data['data']);
            this.submitted = false;
          },
          err => {
            console.log('error');
          })
      } else {
        kycformData.append('kycid', kycid);
        this.userservice.updateuserkycformData(kycformData).then(
          data => {
            //console.log('update::' + data['data']);
            this.submitted = false;
          },
          err => {
            console.log('error');
          })
      }

    }
   
    this.getkyc(newuserid);

  }

  requiredRegistration() {
    return (this.submitted && this.kycform.controls.registration_certi.errors != null);
  }
  requiredGST() {
    return (this.submitted && this.kycform.controls.gst_certificate.errors != null);
  }
  requiredPanCard() {
    return (this.submitted && this.kycform.controls.pan_card.errors != null);
  }
  requiredPersonProof() {
    return (this.submitted && this.kycform.controls.authorized_person_proof.errors != null);
  }

  getkyc(userid) {


    this.userservice.getTempKycData(userid).then(
      data => {

        if (data['data'].length > 0) {
          const appdata = data['data'][0];
          this.kycid = appdata.kyc_id;
          this.kycstatus = appdata.approval_status;



          console.log("this.kycstatus :"+ this.kycstatus);
          if ((this.kycstatus === 0 || this.kycstatus === 2) && data['data'].length > 0) {
            this.validateKyc = true;
          }
          if (this.doesFileExist('api/tmpkyc/' + appdata.registration_certi) == true) {
            //if pdf file upload
            this.registrationpdf = false;
            var strArr = appdata.registration_certi.split('.');
            if (strArr.length > 0 && strArr[1] == 'pdf') {
              this.registrationpdf = true;
            }
            //when image file upload         
            this.registration_certiimg = appdata.registration_certi;
          } else {
            this.registration_certiimg = '';
          }

          if (this.doesFileExist('api/tmpkyc/' + appdata.gst_certificate) == true) {
            //if pdf file upload
            this.gstpdf = false;
            var strArr = appdata.gst_certificate.split('.');
            if (strArr.length > 0 && strArr[1] == 'pdf') {
              this.gstpdf = true;
            }
            //when image file upload         
            this.gst_certificateimg = appdata.gst_certificate;
          } else {
            this.gst_certificateimg = '';
          }

          if (this.doesFileExist('api/tmpkyc/' + appdata.agreement) == true) {
            //if pdf file upload
            this.agreementpdf = false;
            var strArr = appdata.agreement.split('.');
            if (strArr.length > 0 && strArr[1] == 'pdf') {
              this.agreementpdf = true;
            }
            //when image file upload          
            this.agreementimg = appdata.agreement;
          } else {
            this.agreementimg = '';
          }

          if (this.doesFileExist('api/tmpkyc/' + appdata.pan_card) == true) {
            //if pdf file upload
            this.pancardpdf = false;
            var strArr = appdata.pan_card.split('.');
            if (strArr.length > 0 && strArr[1] == 'pdf') {
              this.pancardpdf = true;
            }
            //when image file upload          
            this.pan_cardimg = appdata.pan_card;
          } else {
            this.pan_cardimg = '';
          }

          if (this.doesFileExist('api/tmpkyc/' + appdata.authorized_person_proof) == true) {
            //if pdf file upload
            this.personproofpdf = false;
            var strArr = appdata.authorized_person_proof.split('.');
            if (strArr.length > 0 && strArr[1] == 'pdf') {
              this.personproofpdf = true;
            }
            //when image file upload          
            this.authorized_person_proofimg = appdata.authorized_person_proof;
          } else {
            this.authorized_person_proofimg = '';
          }
        }




      },
      err => {
        console.log('error');
      }
    );
  }
}
