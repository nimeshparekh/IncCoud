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
  selector: 'app-manager-details',
  templateUrl: './manager-details.component.html',
  styleUrls: ['./manager-details.component.css']
})
export class ManagerDetailsComponent implements OnInit {
  old_req ='';
  managerid = this.route.snapshot.paramMap.get('id');
  managername = '';
  registration_certiimg = '';
  gst_certificateimg = '';
  agreementimg = '';
  pan_cardimg = '';
  authorized_person_proofimg = '';
  kycstatus = '';
  note = '';
  uploaded_date = '';
  approve_date = '';
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'did', 'status'];
  Length = 0;
  public billdataSource: MatTableDataSource<any>;
  public subscriptiondataSource: MatTableDataSource<any>;
  billdisplayedColumns: string[] = ['id', 'billdate', 'package', 'telesms', 'telemail', 'telemeet', 'teledigital', 'billamount', 'invoice'];
  billLength = 0;
  subLength = 0;
  isLoading = true;
  isLoading2 = true;
  public addForm: FormGroup;
  public kycform: FormGroup;
  public daccessForm: FormGroup;
  registrationpdf = false;
  gstpdf = false;
  agreementpdf = false;
  pancardpdf = false;
  personproofpdf = false;
  submitted = false;
  progress: number;
  progressbar = false;
  kycid;
  subdisplayedColumns: string[] = ['id', 'subdate', 'startdate', 'name', 'amount', 'end_date', 'status', 'action'];

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
  @ViewChild('billpaginator') billpaginator: MatPaginator;
  @ViewChild('subscriptionpaginator') subscriptionpaginator: MatPaginator;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.billdataSource = new MatTableDataSource();
    this.subscriptiondataSource = new MatTableDataSource()
    this.getManagerName(this.managerid);
    this.getChannelList(this.managerid);
    this.getBillingData(this.managerid);
    this.getsubscriptionData(this.managerid)
    this.addForm = this.fb.group({
      userid: [this.managerid],
      ivr: [false],
      clicktocall: [false],
      conference: [false],
      campaigns: [false],
      misscall: [false],
      dialer: [false],
      progressivedialer: [false],
      obd: [false],
      bulksms: [false],
      dialpad: [false],
      zoho: [false],
      lms: [false],
      voicemail: [false],
      sms: [false],
      email: [false],
      chat: [false],
      digital: [false],
      media_libaray: [false],
      custom_api: [false],
      did_routing: [false]
    });
    this.daccessForm = this.fb.group({
      userid: [this.managerid],
      post: [false],
      members: [false],
      monitor: [false],
      groups: [false],
      medialibrary: [false],
      leads: [false],
      store: [false],
      audience: [false],
      hashtag: [false]
    });

    this.kycform = this.fb.group({
      account_id: [this.managerid],
      registration_certi: ['', Validators.required],
      gst_certificate: ['', Validators.required],
      agreement: [''],
      pan_card: ['', Validators.required],
      authorized_person_proof: ['', Validators.required]
    });
    //this.getKycFormData(this.managerid);

    this.getKycDocumentData(this.managerid);
  }

  async getKycDocumentData(id) {
    await this.managerservice.kycDocumentData(id).then(
      data => {
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
              console.log(appdata.gst_certificate);
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
          this.kycstatus = appdata.status;
          this.note = appdata.note;
          this.uploaded_date = appdata.uploaded_date;
          this.approve_date = appdata.approve_date;
        }
      },
      err => {
        console.log('error');
      })
  }

  kycsubmit() {
    this.submitted = true;

    this.progress = 1;

    if (this.kycform.invalid == true) {
      // console.log("hello", this.kycform.value);

      return;
    }
    else {
      this.progressbar = true;
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
            this.progress = 100;
            this.progressbar = false;
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
            this.getKycDocumentData(this.managerid);
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
            this.progressbar = false;
            this.getKycDocumentData(this.managerid);
            this.submitted = false;

          },
          err => {
            console.log('error');
          })


      }
    }
  }

  changestatus(data, value2) {
    console.log("Work");
    console.log(data.s_id);
    console.log(value2);
    let values = { 's_id': data.s_id, 'status': value2 }
    this.managerservice.change_subscription(values).then(
      data => {
        this.getsubscriptionData(this.managerid)
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
      },
      err => {
        console.log('error');
      }
    );

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
  async getManagerName(managerid) {
    await this.managerservice.getManagerDetail(managerid).then(
      data => {

        this.managername = data['data']['account_name'];
        // var access = JSON.parse(data['data']['digital_access']);
        //console.log("access::" + access[0]);

        if (data['data']['digital_access'] != null) {
          var access = JSON.parse(data['data']['digital_access']);
          if (access.length > 0) {
            for (var i = 0; i < access.length; i++) {
              if (access[i] == 'post') {
                this.daccessForm.get('post').setValue('true');
              }
              else if (access[i] == 'members') {
                this.daccessForm.get('members').setValue('true');
              }
              else if (access[i] == 'monitor') {
                this.daccessForm.get('monitor').setValue('true');
              }
              else if (access[i] == 'groups') {
                this.daccessForm.get('groups').setValue('true');
              }
              else if (access[i] == 'medialibrary') {
                this.daccessForm.get('medialibrary').setValue('true');
              }
              else if (access[i] == 'leads') {
                this.daccessForm.get('leads').setValue('true');
              }
              else if (access[i] == 'store') {
                this.daccessForm.get('store').setValue('true');
              }
              else if (access[i] == 'audience') {
                this.daccessForm.get('audience').setValue('true');
              }
              else if (access[i] == 'hashtag') {
                this.daccessForm.get('hashtag').setValue('true');
              }
              else {

              }
              this.old_req=JSON.stringify(this.addForm.value)

            }
          }
        }
        console.log(data['data']['services']);
        if (data['data']['services'].length > 1) {
          //if service array in json format
          var services = JSON.parse(data['data']['services']);
          if (services.length > 0) {
            for (var i = 0; i < services.length; i++) {
              if (services[i] == '0') {
                this.addForm.get('ivr').setValue('true');
              } else if (services[i] == '1') {
                this.addForm.get('misscall').setValue('true');
              } else if (services[i] == '2') {
                this.addForm.get('conference').setValue('true');
              } else if (services[i] == '3') {
                this.addForm.get('dialer').setValue('true');
              } else if (services[i] == '4') {
                this.addForm.get('clicktocall').setValue('true');
              } else if (services[i] == '5') {
                this.addForm.get('campaigns').setValue('true');
              } else if (services[i] == '6') {
                this.addForm.get('progressivedialer').setValue('true');
              } else if (services[i] == '7') {
                this.addForm.get('bulksms').setValue('true');
              } else if (services[i] == '8') {
                this.addForm.get('dialpad').setValue('true');
              } else if (services[i] == '9') {
                this.addForm.get('obd').setValue('true');
              } else if (services[i] == '10') {
                this.addForm.get('zoho').setValue('true');
              } else if (services[i] == '11') {
                this.addForm.get('lms').setValue('true');
              } else if (services[i] == '12') {
                this.addForm.get('voicemail').setValue('true');
              } else if (services[i] == '13') {
                this.addForm.get('sms').setValue('true');
              } else if (services[i] == '14') {
                this.addForm.get('email').setValue('true');
              } else if (services[i] == '15') {
                this.addForm.get('chat').setValue('true');
              } else if (services[i] == '16') {
                this.addForm.get('digital').setValue('true');
              } else if (services[i] == '17') {
                this.addForm.get('media_libaray').setValue('true');
              } else if (services[i] == '18') {
                this.addForm.get('custom_api').setValue('true');
              } else if (services[i] == '19') {
                this.addForm.get('did_routing').setValue('true');
              }
              else {
                this.addForm = this.fb.group({
                  userid: [this.managerid],
                  ivr: [false],
                  clicktocall: [false],
                  conference: [false],
                  campaigns: [false],
                  misscall: [false],
                  dialer: [false],
                  progressivedialer: [false],
                  bulksms: [false],
                  dialpad: [false],
                  lms: [false],
                  voicemail: [false],
                  sms: [false],
                  email: [false],
                  chat: [false],
                  digital: [false],
                  media_libaray: [false]
                });
              }
              this.old_req=JSON.stringify( this.addForm.value)
            }

          }
        } else {
          //if single service selected
          var services = data['data']['services'];
          console.log("data", services);

          if (services == '0') {
            this.addForm.get('ivr').setValue('true');
          } else if (services == '1') {
            this.addForm.get('misscall').setValue('true');
          } else if (services == '2') {
            this.addForm.get('conference').setValue('true');
          } else if (services == '3') {
            this.addForm.get('dialer').setValue('true');
          } else if (services == '4') {
            this.addForm.get('clicktocall').setValue('true');
          } else if (services == '5') {
            this.addForm.get('campaigns').setValue('true');
          } else if (services == '6') {
            this.addForm.get('progressivedialer').setValue('true');
          } else if (services == '7') {
            this.addForm.get('bulksms').setValue('true');
          } else if (services == '8') {
            this.addForm.get('dialpad').setValue('true');
          } else if (services == '9') {
            this.addForm.get('obd').setValue('true');
          } else if (services == '10') {
            this.addForm.get('zoho').setValue('true');
          } else if (services == '11') {
            this.addForm.get('lms').setValue('true');
          } else if (services == '12') {
            this.addForm.get('voicemail').setValue('true');
          } else if (services == '13') {
            this.addForm.get('sms').setValue('true');
          } else if (services == '14') {
            this.addForm.get('email').setValue('true');
          } else if (services == '15') {
            this.addForm.get('chat').setValue('true');
          } else if (services == '16') {
            this.addForm.get('digital').setValue('true');
          } else if (services == '17') {
            this.addForm.get('media_libaray').setValue('true');
          } else if (services == '18') {
            this.addForm.get('custom_api').setValue('true');
          } else if (services == '19') {
            this.addForm.get('did_routing').setValue('true');
          }
          else {
            this.addForm = this.fb.group({
              userid: [this.managerid],
              ivr: [false],
              clicktocall: [false],
              conference: [false],
              campaigns: [false],
              misscall: [false],
              dialer: [false],
              progressivedialer: [false],
              bulksms: [false],
              dialpad: [false],
              lms: [false],
              voicemail: [false],
              sms: [false],
              email: [false],
              chat: [false],
              digital: [false],
              media_libaray: [false]
            });
          }
          this.old_req=JSON.stringify(this.addForm.value)

        }

      },
      err => {
        console.log('error');
      })
  }
  async getChannelList(managerid) {
    await this.managerservice.getManagerChannels(managerid).then(
      data => {
        //console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.billdataSource.paginator = this.billpaginator;
    this.subscriptiondataSource.paginator = this.subscriptionpaginator
  }

  submit() {
    if (this.addForm.invalid == true) {
      console.log("hello", this.addForm.value);

      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value);
      //console.log("data module access", data);
      var new_data_1 =JSON.stringify(data);

      this.managerservice.updateService(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.http.get("https://sbc2.(wrong)cloudX.in/ip.php").subscribe((res: any) => {
            var data={ip:res.ip,action:"update televoice module access",account_id :this.managerid,old_req:JSON.stringify(this.old_req),new_req :new_data_1}
            this.managerservice.get_ip_for_instert_data(data).then(
              data2 => {
                console.log("DONE");

              },
              err => {
                console.log('error');
              }
            );
  
          });
          //this.getManagerName(this.managerid);
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  async getsubscriptionData(managerid) {
    await this.managerservice.getsubscriptionData(managerid).then(
      data => {
        console.log(data['data']);
        this.subscriptiondataSource.data = data['data'];
        this.subLength = data['data'].length;
        this.isLoading2 = false
        // this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  async getBillingData(managerid) {
    await this.managerservice.getBillingData(managerid).then(
      data => {
        //console.log(data['data']);
        this.billdataSource.data = data['data'];
        this.billLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  async generateinvoice(id) {
    //console.log(id);
    await this.managerservice.generateinvoice(id).then(
      data => {
        console.log(data['data']);
        this.getBillingData(this.managerid);
      },
      err => {
        console.log('error');
      })
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
  digitalsubmit() {
    let data: any = Object.assign(this.daccessForm.value);
    var new_data =JSON.stringify(data);

    this.managerservice.updateDigitalAccess(data).then(
      data => {
        //console.log(data['data']);
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.http.get("https://sbc2.(wrong)cloudX.in/ip.php").subscribe((res: any) => {
          var data={ip:res.ip,action:"update tele digital module access",account_id :this.managerid,old_req:JSON.stringify(this.old_req),new_req :new_data}
          this.managerservice.get_ip_for_instert_data(data).then(
            data2 => {
              console.log("DONE");

            },
            err => {
              console.log('error');
            }
          );

        });
        //this.getManagerName(this.managerid);
      },
      err => {
        console.log('error');
      }
    );
  }
  getAuthKey() {
    var userid = this.managerid;
    if (confirm("Are you sure to generate key?")) {
      this.managerservice.getAuthKey(userid).then(
        data => {
          //console.log('msg::'+data['msg']);
          this._snackBar.open(data['msg'], '', {
            duration: 2000,
          });
        },
        err => {
          console.log('error');
        });
    }
  }



}
