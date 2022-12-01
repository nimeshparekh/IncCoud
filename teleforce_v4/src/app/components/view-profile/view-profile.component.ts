import { Component, OnInit, VERSION, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  ivr = false;
  clicktocall = false;
  conference = false;
  campaign = false;
  misscall = false;
  dialer = false;
  package_name = '';
  package_price = '';
  package_validity = '';
  package_userlimit = '';
  package_channels = '';
  package_type = '';
  package_service = "";
  expiry_date = '';
  AccessKey = '';
  addmode = true;
  editmode = false;
  deletemode = false;
  agentform: FormGroup;
  changepasswordform: FormGroup;
  webhookform: FormGroup;
  serviceErrors: any = {};
  public newpassword: string;
  public confirmpassword: string;
  username = '';
  userole = '';
  company_name = '';
  create_date = '';
  services = [];
  serviceList = [];
  UserData = {
    username: '',
    role: ''
  };
  plandetail = '';
  constructor(
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private userservice: UserService,
    public dialog: MatDialog,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    let id = localStorage.getItem('access_id');
    this.username = localStorage.getItem('username');

    this.getplanDetail(id);
    if (this.editmode = true) {
      if (this.authService.isLoggedIn) {
        this.UserData.username = localStorage.getItem('username');


        this.authService.getRole(localStorage.getItem('access_id')).then(
          data => {

            //console.log("personal info");
            //console.log(JSON.stringify(data));

            this.UserData.role = data['data']['account_type'];
            // console.log("hello"+ this.UserData.role );
            if (this.UserData.role == '1') {
              this.getAgentDetail(localStorage.getItem('access_id'));
            }
            if (this.UserData.role == '2') {
              this.getAgentDetail(localStorage.getItem('access_id'));
            }
            if (this.UserData.role == '3') {
              this.getAgentDetail(localStorage.getItem('access_id'));
            }
            if (this.UserData.role == '4') {
              this.getAgentDetail(localStorage.getItem('access_id'));
            }
          });
      }
      //this.getAgentDetail(id);
    }
    this.agentform = this.fb.group({
      account_id: [id],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      authorised_person_name: ['', [Validators.required]],
      company_address: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
    });
    this.changepasswordform = this.fb.group({
      account_id: [id],
      newpassword: [null, Validators.required],
      confirmpassword: [null, Validators.required]
    });
    this.webhookform = this.fb.group({
      account_id: [id],
      webhookurl: [null, Validators.required],
    });
    //webhookform
  }
  getAgentDetail(id) {
    this.userservice.getAgentDatail(id).then(
      data => {
        // console.log(data['data']['services']);
        this.agentform = this.fb.group({
          account_id: [data['data'].account_id],

          email: [data['data'].email, [Validators.required, Validators.email]],
          mobile: [data['data'].mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          authorised_person_name: [data['data'].authorised_person_name, [Validators.required]],
          company_address: [data['data'].company_address, [Validators.required]],
          company_name: [data['data'].company_name, [Validators.required]],
        });

        this.webhookform = this.fb.group({
          account_id: [data['data'].account_id],
          webhookurl: [data['data'].webhookurl, [Validators.required]],
        });

        this.ivr = false;
        this.misscall = false;
        this.dialer = false;
        this.conference = false;
        this.clicktocall = false;
        this.campaign = false;

        if (data['data']['services'] != null) {
          if (data['data']['services'].length > 1) {
            var services = JSON.parse(data['data']['services']);
            if (services.length > 0) {
              services.map(service => {
                switch (service) {
                  case '0':
                    this.serviceList.push('IVR');
                    break;
                  case '1':
                    this.serviceList.push('MissCall');
                    break;
                  case '2':
                    this.serviceList.push('Conference');
                    break;
                  case '3':
                    this.serviceList.push('Dialer');
                    break;
                  case '4':
                    this.serviceList.push('Click to Call');
                    break;
                  case '5':
                    this.serviceList.push('Campaign');
                    break;
                }

              })

            }

          }
        }

        this.AccessKey = data['data'].AccessKey,
          this.create_date = data['data'].create_date,
          this.expiry_date = data['data'].expiry_date
      },
      err => {
        console.log('error');
      }
    );
  }
  getplanDetail(id) {
    //console.log(id);  
    this.userservice.getManagerCurrentplanDetail(id).then(
      data => {
        this.plandetail = data['data'];
        if (data['data'].length > 0) {
          this.plandetail = data['data'][0];
        }

       /* if (data['data'].length > 0) {

        this.package_name=data['data'][0].package_name;
        this.package_price=data['data'][0].package_price;
        this.package_validity=data['data'][0].package_validity;
        this.package_userlimit=data['data'][0].package_userlimit;
        this.package_channels	=data['data'][0].package_channels;
        this.package_type=data['data'][0].package_type;
        this.package_service=data['data'][0].package_service;
       this.expiry_date=data['data'][0].expiry_date;
      }*/},
      err => {
        console.log('error');
      }

    );
  }
  changePassword() {
    if (this.changepasswordform.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.changepasswordform.value);

      this.userservice.changepassword(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          })
        },
        err => {
          console.log('error');
        })


    }
  }

  updatewebhook() {
    let data: any = Object.assign(this.webhookform.value);
    //console.log("webhook");
    

    this.userservice.updateWebhook(data).then(
      data => {
        //console.log(data['data']);
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        })
      },
      err => {
        console.log('error');
      })
      
  }

  updateProfile() {
    if (this.agentform.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.agentform.value);

      this.userservice.updateProfile(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          })
        },
        err => {
          console.log('error');
        })

    }
  }
}
