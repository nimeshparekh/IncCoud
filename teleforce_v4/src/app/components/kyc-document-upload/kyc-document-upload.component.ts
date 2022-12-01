import { Component, OnInit, VERSION, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';


import { UserService } from '../../user.service';

@Component({
  selector: 'app-kyc-document-upload',
  templateUrl: './kyc-document-upload.component.html',
  styleUrls: ['./kyc-document-upload.component.css']
})
export class KycDocumentUploadComponent implements OnInit {
  kycform: FormGroup;
  serviceErrors: any = {};
  appdata: any;
  registration_certiimg = '';
  gst_certificateimg = '';
  agreementimg = '';
  pan_cardimg = '';
  kycid = '';
  authorized_person_proofimg = '';
  addmode = true;
  editmode = false;
  deletemode = false;
  submitted = false;
  registrationpdf = false;
  gstpdf = false;
  agreementpdf = false;
  pancardpdf = false;
  personproofpdf = false;
  progress: number;
  progressbar= false;
  kycstatus='';

  constructor(
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private el: ElementRef,
    private userservice: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    let id = localStorage.getItem('access_id');
    this.kycform = this.fb.group({
      account_id: [id],
      registration_certi: ['',Validators.required],
      gst_certificate: ['',Validators.required],
      agreement: [''],
      pan_card: ['',Validators.required],
      authorized_person_proof: ['',Validators.required]
    });
    this.getKycFormData(id);

  }
  getKycFormData(id) {
    this.http.get(environment.apiUrl + '/default/getkycformdata/' + id).subscribe((data: any) => {
      var appdata = data['data'][0];
      // console.log(this.appdata);
      if (data['data'].length > 0) {
        this.kycform = this.fb.group({
          account_id: [id],
          registration_certi: [''],
          gst_certificate: [''],
          agreement: [''],
          pan_card: [''],
          authorized_person_proof: ['']
    
        });
        this.kycid = appdata.kyc_id;
        this.kycstatus = appdata.status;

        if (this.doesFileExist('api/kyc/' + appdata.registration_certi) == true) {
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

        if (this.doesFileExist('api/kyc/' + appdata.gst_certificate) == true) {
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

        if (this.doesFileExist('api/kyc/' + appdata.agreement) == true) {
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

        if (this.doesFileExist('api/kyc/' + appdata.pan_card) == true) {
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

        if (this.doesFileExist('api/kyc/' + appdata.authorized_person_proof) == true) {
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
    })
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


  submit() {
    this.submitted = true;
    
    this.progress=1;

    if (this.kycform.invalid == true) {
     // console.log("hello", this.kycform.value);

      return;
    }
    else {
      this.progressbar=true;
      let data: any = Object.assign(this.kycform.value);
      //console.log(data)

      let kycformData = new FormData();
      kycformData.append('account_id', data.account_id);
      kycformData.append('kyc_id', this.kycid);
      let registerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#registration_certi')
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
      if (this.kycid != '' && this.kycid != null) {
        this.userservice.updatekycformData(kycformData).then(
          data => {
            //console.log('update::' + data['data']);
            this.progress=100;
            this.progressbar=false;
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            })
            let id = localStorage.getItem('access_id');
            this.kycform = this.fb.group({
              account_id: [id],
              registration_certi: [''],
              gst_certificate: [''],
              agreement: [''],
              pan_card: [''],
              authorized_person_proof: ['']

            });
            this.getKycFormData(id);
            this.submitted = false;
          },
          err => {
            console.log('error');
          })

      }
      else {
        this.userservice.kycformData(kycformData).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            })
            this.progressbar=false;
            let id = localStorage.getItem('access_id');
            this.kycform = this.fb.group({
              account_id: [id],
              registration_certi: [''],
              gst_certificate: [''],
              agreement: [''],
              pan_card: [''],
              authorized_person_proof: ['']

            });
            this.getKycFormData(id);
            this.submitted = false;


          },
          err => {
            console.log('error');
          })


      }
    }

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
  readFile(fileEvent: any) {
    const file = fileEvent.target.files[0];
  //  console.log(file.type)
    if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "application/pdf") {

    } else {
      this._snackBar.open('File type you trying to upload is not allowed. only png/jpg file allowed.');
      //this.toastr.error('File type you trying to upload is not allowed. only png/jpg file allowed.'); 
      fileEvent.srcElement.value = null;
    }
  }

}
