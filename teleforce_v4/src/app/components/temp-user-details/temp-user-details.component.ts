import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ManagerService } from "../../manager.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
  selector: 'app-temp-user-details',
  templateUrl: './temp-user-details.component.html',
  styleUrls: ['./temp-user-details.component.css']
})
export class TempUserDetailsComponent implements OnInit {


  managerid = this.route.snapshot.paramMap.get('id');
  managername = '';
  registration_certiimg = '';
  gst_certificateimg = '';
  agreementimg = '';
  pan_cardimg = '';
  authorized_person_proofimg = '';
  approval_status = '';
  note = '';
  uploaded_date = '';
  approve_date = '';
  registrationpdf = false;
  gstpdf = false;
  agreementpdf = false;
  pancardpdf = false;
  personproofpdf = false;
  submitted = false;
  progress: number;
  progressbar = false;
  kycid ;
  managardata :any=[];
  username ;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'firstname','email','mobile','address','city','state','bank_ref_num', 'payuMoneyId','date','amount','mihpayid','productinfo','status'];
  Length = 0;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private managerservice: ManagerService,
    private userservice: UserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
    private http: HttpClient,

  ) { }
  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.getKycDocumentData(this.managerid);
    this.getManagerName(this.managerid);
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
  async getKycDocumentData(id) {
    await this.managerservice.tempkycDocumentData(id).then(
      data => {
        var appdata = data['data'][0];
       // console.log(appdata);
       
       this.approval_status = appdata.approval_status;

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
             // console.log(appdata.gst_certificate);
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
          this.approval_status = appdata.approval_status;
          this.uploaded_date = appdata.uploaded_date;
          this.approve_date = appdata.approve_date;

      },
      err => {
        console.log('error');
      })
  }
  async getManagerName(managerid) {
    await this.managerservice.gettempusernamebyid(managerid).then(
      data => {
        this.managername = data['data']['name'];
        this.managardata =data['data'];
        
        this.username = data['data']['username'];
        this.gettemptransctiondata(this.username)
      },
      err => {
        console.log('error');
      })
  }
  async gettemptransctiondata(id) {

    await this.managerservice.gettemptransctiondata(id).then(
      data => {
  
      console.log(data);
      this.dataSource.data = data['data'];
      this.Length = data['data'].length;
      this.isLoading = false;

      },
      err => {
        console.log('error');
      })
  }
}
