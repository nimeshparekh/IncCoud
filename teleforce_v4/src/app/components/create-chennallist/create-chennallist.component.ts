
import { Component, OnInit, VERSION, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-chennallist',
  templateUrl: './create-chennallist.component.html',
  styleUrls: ['./create-chennallist.component.css']
})
export class CreateChennallistComponent implements OnInit {

  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  delchannelid = '';
  delchannelname = '';
  iswebrtc = false;
 serverid=0;
  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addCusForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateChennallistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    let userinfo = this.authAPIservice.getData();
    //console.log(this.data);
    if (this.data != '' && this.data != null) {
      this.addmode = false
      if (this.data.action == 'delete') {
        this.deletemode = true
        this.delchannelid = this.data.id
        this.delchannelname = this.data.id
        this.serverid = this.data.server_id
      } else {
        this.editmode = true
        this.addCusForm = this.fb.group({
          id: [this.data.id, [Validators.required]],
          transport: [this.data.transport, [Validators.required]],
          outbound_auth: [this.data.outbound_auth, [Validators.required]],
          server_uri: [this.data.server_uri, [Validators.required]],
          client_uri: [this.data.client_uri, [Validators.required]],
          retry_interval: [this.data.retry_interval, [Validators.required]],
          expiration: [this.data.expiration, [Validators.required]],
          line: [this.data.line, [Validators.required]],
          contact_user: [this.data.contact_user, [Validators.required]],
          endpoint: [this.data.endpoint, [Validators.required]],

          max_contacts: [this.data.max_contacts, [Validators.required]],
          contact: [this.data.contact, [Validators.required]],
          qualify_frequency: [this.data.qualify_frequency, [Validators.required]],
          remove_existing: [this.data.remove_existing, [Validators.required]],

          auth_type: [this.data.auth_type, [Validators.required]],
          //password: [this.data.password, [Validators.required, Validators.minLength(5)]],
          //username: [this.data.username, [Validators.required]],
          realm: [this.data.realm, [Validators.required]],

          e_transport: [this.data.e_transport, [Validators.required]],
          e_aors: [this.data.e_aors, [Validators.required]],
          e_outbound_auth: [this.data.e_outbound_auth, [Validators.required]],
          e_context: [this.data.e_context, [Validators.required]],
          e_disallow: [this.data.e_disallow, [Validators.required]],
          e_allow: [this.data.e_allow, [Validators.required]],
          e_direct_media: [this.data.e_direct_media, [Validators.required]],
          e_rtp_symmetric: [this.data.e_rtp_symmetric, [Validators.required]],
          e_force_rport: [this.data.e_force_rport, [Validators.required]],
          e_rewrite_contact: [this.data.e_rewrite_contact, [Validators.required]],
          e_dtls_ca_file: [this.data.e_dtls_ca_file],
          e_dtls_cert_file: [this.data.e_dtls_cert_file],
          e_from_domain: [this.data.e_from_domain, [Validators.required]],
          e_preferred_codec_only: [this.data.e_preferred_codec_only, [Validators.required]],
          e_webrtc: [this.data.e_webrtc, [Validators.required]],

          ip_endpoint: [this.data.ip_endpoint, [Validators.required]],
          ip_match: [this.data.ip_match, [Validators.required]]
        })

        if(this.data.e_webrtc == 'yes'){
          this.iswebrtc = true;
        }else{
          this.iswebrtc = false;
        }
      }
    } else {
      this.addCusForm = this.fb.group({
        id: [null, [Validators.required], [Validators.composeAsync([this.checkIdValid.bind(this)])]],
        transport: ['transport-udp-nat', [Validators.required]],
        outbound_auth: [null, [Validators.required]],
        server_uri: ['sip:10.51.140.18', [Validators.required]],
        client_uri: ['sip:num@10.51.140.18', [Validators.required]],
        retry_interval: ['60', [Validators.required]],
        expiration: ['3600', [Validators.required]],
        line: ['yes', [Validators.required]],
        contact_user: ['num', [Validators.required]],
        endpoint: [null, [Validators.required]],

        max_contacts: ['1', [Validators.required]],
        contact: ['sip:10.51.140.18:5060', [Validators.required]],
        qualify_frequency: ['20', [Validators.required]],
        remove_existing: [null],

        auth_type: ['userpass', [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(4)]],
        username: [null, [Validators.required, Validators.maxLength(12)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
        realm: [null],

        e_transport: ['transport-udp-nat', [Validators.required]],
        e_aors: [null, [Validators.required]],
        e_outbound_auth: [null, [Validators.required]],
        e_context: ['from-tata-siptrunk', [Validators.required]],
        e_disallow: ['all', [Validators.required]],
        e_allow: ['alaw', [Validators.required]],
        e_direct_media: ["no", [Validators.required]],
        e_rtp_symmetric: ["yes", [Validators.required]],
        e_force_rport: ["yes", [Validators.required]],
        e_rewrite_contact: ["yes", [Validators.required]],
        e_dtls_ca_file: [null],
        e_dtls_cert_file: [null],
        e_from_domain: ['10.51.140.18', [Validators.required]],
        e_preferred_codec_only: ["yes", [Validators.required]],
        e_webrtc: ["no", [Validators.required]],

        ip_endpoint: [null, [Validators.required]],
        ip_match: ['10.51.140.18', [Validators.required]]
      });
    }
    this.addCusForm.controls.endpoint = this.addCusForm.controls.id;
    this.addCusForm.controls.outbound_auth = this.addCusForm.controls.id;
    this.addCusForm.controls.e_aors = this.addCusForm.controls.id;
    this.addCusForm.controls.e_outbound_auth = this.addCusForm.controls.id;
    this.addCusForm.controls.ip_endpoint = this.addCusForm.controls.id;
    
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
  }
  private checkUsernameValid(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    //console.log(control)
    if (control.value == null) {
      console.log(control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/digital/checkchannelusername/', { check: control.value }).subscribe(data => {
          //console.log("Data::"+ JSON.stringify(data));
          if (data['isexist']) {
            resolve({ 'username': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
  }

  private checkIdValid(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    //console.log(control)
    if (control.value == null) {
      console.log(control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/digital/checkchannelid/', { check: control.value }).subscribe(data => {
          //console.log("Data::"+ JSON.stringify(data));
          if (data['isexist']) {
            resolve({ 'id': true });
          } else {
            resolve(null);
          }
        });
      }, 300);
    });
    return q;
  }

  invalidUserName() {
    return (this.submitted && this.addCusForm.controls.username.errors != null);
  }

  invalidId() {
    return (this.submitted && this.addCusForm.controls.id.errors != null);
  }


  openDialog(): void {
    console.log(this.wasFormChanged);
    this.dialogRef.close({ event: 'Cancel' });
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  formChanged() {
    this.wasFormChanged = true;
  }

  channelsubmit() {
 
    if (this.addCusForm.invalid == true) {
      console.log("Error");
      return;
    }
    else {
      let data: any = Object.assign(this.addCusForm.value);
      //console.log(JSON.stringify(data))
      if (this.editmode) {
        this.http.post(environment.apiUrl + '/digital/updatechannel/', data).subscribe((data: any) => {
          if (data.msg) {
            this.toastr.success(data.msg);
            this.dialogRef.close({ event: 'Update' });
            //window.location.href = '/voip-agent-list/';
          }
          if (data.err) {
            this.toastr.error(data.err);
          }
        }, error => {
          this.serviceErrors = error.error.error;
        });
      } else {
        this.http.post(environment.apiUrl + '/digital/createchannel/', data).subscribe((data: any) => {
          if (data.msg) {
            this.toastr.success(data.msg);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
          }
          if (data.err) {
            this.toastr.error(data.err);
          }
        }, error => {
          this.serviceErrors = error.error.error;
        });
      }
    }
  }

  checkWebrtc(){
    if(this.addCusForm.value.e_webrtc == 'no'){
      this.iswebrtc = true;
    }else{
      this.iswebrtc = false;
    }
  }

  channeldelete(id) {
    console.log("helo",this.serverid)
    var params = { id: id,server_id:this.serverid }
    this.http.post(environment.apiUrl + '/digital/deletechannel/', params).subscribe((data: any) => {
      //console.log("Msg ::" + data.msg);
      if (data) {
        //this.toastr.success(data.msg);
        this._snackBar.open(data['msg'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.dialogRef.close({ event: 'Delete' });
      }
      if (data.err) {
        this.toastr.error(data.err);
      }
    }, error => {
      this.serviceErrors = error.error.error;
    });
  }


}
