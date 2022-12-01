import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';

import { UserService } from '../../user.service';

import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-kyc-document-view',
  templateUrl: './kyc-document-view.component.html',
  styleUrls: ['./kyc-document-view.component.css']
})
export class KycDocumentViewComponent implements OnInit {
  registration_certiimg = '';
  gst_certificateimg = '';
  agreementimg = '';
  pan_cardimg = '';
  authorized_person_proofimg = '';
  registrationpdf = false;
  gstpdf = false;
  agreementpdf = false;
  pancardpdf = false;
  personproofpdf = false;
  constructor(
    public dialogRef: MatDialogRef<KycDocumentViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb:FormBuilder,
    private managerservice:ManagerService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
   this. getKycDocumentData(this.data)
    
  }
  async getKycDocumentData(id) {
    await this.userservice.kycDocumentView(id).then(
      data => {
        console.log(data);
        
        let appdata = data['data'][0];
        // console.log(appdata);
        if (data['data'].length > 0) {
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
      },
      err => {
        console.log('error');
      })
  }
  doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    //console.log('status' + xhr.status);
    if (xhr.status == 200) {
      return true;
    } else {
      return false;
    }
  }

}
