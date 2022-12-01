import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { CreateChennallistComponent } from '../create-chennallist/create-chennallist.component';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../auth.service';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-displaychanel',
  templateUrl: './displaychanel.component.html',
  styleUrls: ['./displaychanel.component.css']
})
export class DisplaychanelComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["id", "channelname", "server_uri", "client_uri", "contact_user", "action"];
  Length = 0;
  isLoading = true;
  serverdata = [];
  public addCusForm: FormGroup;

  constructor(private adminservice: AdminService, public dialog: MatDialog,
    private authAPIservice: AuthService, private http: HttpClient,
    private fb: FormBuilder,
  ) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      server_id: [null, [Validators.required]],
    });
    this.dataSource = new MatTableDataSource(); // create new object
    this.getChannel();
    this.getServerData();

  }
  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateChennallistComponent, {
      height: '600px',
      width: 'auto', disableClose: true, autoFocus: false,
      panelClass: 'trend-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getChannel();
      }
    });
  }
  CreateNewdialog(): void {
    const dialogRef = this.dialog.open(CreateNewchannelComponent, {
      width: '900px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      //if (result.event == 'Add') {
      // var userid = localStorage.getItem('access_id');
      this.getChannel();
      //}
    });
  }
  updatechanneldialog(id): void {
    let formdata: any = Object.assign(this.addCusForm.value);
    //console.log(formdata);
    if (formdata.server_id > 0) {
      var data = { server_id: formdata.server_id, id: id }
      this.http.post(environment.apiUrl + '/digital/getchanneldetailbyserver/', data).subscribe((data: any) => {
        //console.log(data['data']);
        const dialogRef = this.dialog.open(CreateNewchannelComponent, {
          width: '900PX', disableClose: true, data: {data:data['data'],server_id:data['server_id']}, maxHeight: '800px'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            this.getChannel();
          }
        });
      });

    } else {
      this.http.get(environment.apiUrl + '/digital/getchanneldetail/' + id).subscribe((data: any) => {
        //console.log(data['data']);
        const dialogRef = this.dialog.open(CreateChennallistComponent, {
          width: 'auto', disableClose: true, data: data['data'], height: '600px'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            this.getChannel();
          }
        });
      });
    }

  }

  deletechanneldialog(id, username): void {
    let formdata: any = Object.assign(this.addCusForm.value);
    //console.log(formdata);
    const dialogRef = this.dialog.open(CreateChennallistComponent
      , {
        width: '640px', disableClose: true, data: { action: 'delete', id: id, username: username, server_id: formdata.server_id }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getChannel();
      }
    });
  }

  async getChannel() {
    var userinfo = this.authAPIservice.getData()
    var userid = localStorage.getItem('username');
    let formdata: any = Object.assign(this.addCusForm.value);
    //console.log(formdata);
    if (formdata.server_id > 0) {
      await this.adminservice.getchannelbyserver(formdata.server_id).then(
        data => {
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false;
        },
        err => {
          console.log('error');
        }
      );
    } else {
      await this.adminservice.getchannel(userid).then(
        data => {

          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false;
        },
        err => {
          console.log('error');
        }
      );
    }

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  async getServerData() {
    await this.adminservice.getAsteriskServerData().then(
      data => {
        // console.log(data['data']);
        this.serverdata = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getServerChannels(id) {
    // var id = event;
    this.adminservice.getchannelbyserver(id).then(
      data => {
        console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }


}

@Component({
  selector: 'app-create-newchannel',
  templateUrl: './create-newchannel.component.html',
  styleUrls: ['./../create-chennallist/create-chennallist.component.css']
})
export class CreateNewchannelComponent implements OnInit {

  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  delchannelid = '';
  delchannelname = '';
  iswebrtc = false;
  serverdata = [];
  registrationopt = false;
  authsopt = false;
  serverid = 0;

  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addCusForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateChennallistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DisplaychanelComponent,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private adminservice: AdminService,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
   
    if (this.data != null) {
      this.addmode = false;
      this.editmode = true;
      
      var serverid = this.data['server_id'];
      this.data = this.data['data']
      if (this.data['regid']) {
        this.registrationopt = true;
      }
      if (this.data['authid']) {
        this.authsopt = true;
      }
      this.addCusForm = this.fb.group({
        server_id: [serverid],
        id: [this.data['id']],
        transport: [this.data['transport']],
        outbound_auth: [this.data['outbound_auth']],
        server_uri: [this.data['server_uri']],
        client_uri: [this.data['client_uri']],
        retry_interval: [this.data['retry_interval']],
        expiration: [this.data['expiration']],
        line: [this.data['line']],
        contact_user: [this.data['contact_user']],
        endpoint: [this.data['endpoint']],
        r_outbound_proxy: [this.data['r_outbound_proxy']],

        max_contacts: [this.data['max_contacts'], [Validators.required]],
        contact: [this.data['contact'], [Validators.required]],
        qualify_frequency: [this.data['qualify_frequency'], [Validators.required]],
        remove_existing: [this.data['remove_existing'], [Validators.required]],

        auth_type: [this.data['auth_type']],
        //password: [this.data.password, [Validators.required, Validators.minLength(5)]],
        //username: [this.data.username, [Validators.required]],
        realm: [this.data['realm']],
        a_outbound_proxy: [this.data['a_outbound_proxy']],

        e_transport: [this.data['e_transport'], [Validators.required]],
        e_aors: [this.data['e_aors'], [Validators.required]],
        e_outbound_auth: [this.data['e_outbound_auth'], [Validators.required]],
        e_context: [this.data['e_context'], [Validators.required]],
        e_disallow: [this.data['e_disallow'], [Validators.required]],
        e_allow: [this.data['e_allow'], [Validators.required]],
        e_direct_media: [this.data['e_direct_media'], [Validators.required]],
        e_rtp_symmetric: [this.data['e_rtp_symmetric'], [Validators.required]],
        e_force_rport: [this.data['e_force_rport'], [Validators.required]],
        e_rewrite_contact: [this.data['e_rewrite_contact'], [Validators.required]],
        e_dtls_ca_file: [this.data['e_dtls_ca_file']],
        e_dtls_cert_file: [this.data['e_dtls_cert_file']],
        e_from_domain: [this.data['e_from_domain']],
        e_preferred_codec_only: [this.data['e_preferred_codec_only'], [Validators.required]],
        e_webrtc: [this.data['e_webrtc'], [Validators.required]],
        e_outbound_proxy: [this.data['e_outbound_proxy']],

        ip_endpoint: [this.data['ip_endpoint'], [Validators.required]],
        ip_match: [this.data['ip_match'], [Validators.required]]
      })
    } else {
      let userinfo = this.authAPIservice.getData();
      this.addCusForm = this.fb.group({
        server_id: [null, [Validators.required]],
        registrationopt: [0, [Validators.required]],
        id: [null, [Validators.required], [Validators.composeAsync([this.checkIdValid.bind(this)])]],
        transport: ['transport-udp-nat'],
        outbound_auth: [null],
        server_uri: ['sip:10.51.140.18'],
        client_uri: ['sip:num@10.51.140.18'],
        retry_interval: ['60'],
        expiration: ['3600'],
        line: ['yes'],
        contact_user: ['num'],
        endpoint: [null],
        r_outbound_proxy: [null],

        max_contacts: ['1', [Validators.required]],
        contact: ['sip:gaesip.cloudX.in:5060', [Validators.required]],
        qualify_frequency: ['20', [Validators.required]],
        remove_existing: ['yes'],

        auth_type: ['userpass'],
        password: [null],
        username: [null, [Validators.maxLength(12)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
        realm: [null],
        a_outbound_proxy: [null],

        e_transport: ['transport-udp-nat', [Validators.required]],
        e_aors: [null],
        e_outbound_auth: [null],
        e_context: ['from-tata-siptrunk', [Validators.required]],
        e_disallow: ['all', [Validators.required]],
        e_allow: ['alaw', [Validators.required]],
        e_direct_media: ["no", [Validators.required]],
        e_rtp_symmetric: ["yes", [Validators.required]],
        e_force_rport: ["yes", [Validators.required]],
        e_rewrite_contact: ["yes", [Validators.required]],
        e_dtls_ca_file: [null],
        e_dtls_cert_file: [null],
        e_from_domain: [''],
        e_preferred_codec_only: ["yes", [Validators.required]],
        e_webrtc: ["no", [Validators.required]],
        e_outbound_proxy: [null],

        ip_endpoint: [null],
        ip_match: ['gaesip.cloudX.in,192.168.35.164', [Validators.required]]
      });
      this.addCusForm.controls.endpoint = this.addCusForm.controls.id;
      this.addCusForm.controls.outbound_auth = this.addCusForm.controls.id;
      this.addCusForm.controls.e_aors = this.addCusForm.controls.id;
      this.addCusForm.controls.e_outbound_auth = this.addCusForm.controls.id;
      this.addCusForm.controls.ip_endpoint = this.addCusForm.controls.id;

    }



    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
    this.getServerData();
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
        this.http.post(environment.apiUrl + '/digital/checkchannelusername/', { check: control.value, server_id: this.serverid }).subscribe(data => {
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
    //console.log(control.value)
    if (control.value == null) {
      console.log(control)
      Promise.resolve(null);
    }
    let formdata: any = Object.assign(this.addCusForm.value);
    if (formdata.server_id == null) {
      Promise.resolve(null);
    }
    //console.log(formdata.server_id);
    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/digital/checkchannelid/', { check: control.value, server_id: formdata.server_id }).subscribe(data => {
          //console.log(data['isexist']);
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
    return (this.addCusForm.controls.username.errors != null);
  }

  invalidId() {
    return (this.addCusForm.controls.id.errors != null);
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
      var id2 = data.id;
      var outbound_auth2 =data.outbound_auth;
      var e_aors2 =data.e_aors;
      var ip_endpoint2 =data.ip_endpoint; 
      var e_outbound_auth2 =data.e_outbound_auth;
      var endpoint2 = data.endpoint;
      data.endpoint =endpoint2.replaceAll(" ","")

      data.e_outbound_auth =e_outbound_auth2.replaceAll(" ","")
      data.ip_endpoint = ip_endpoint2.replaceAll(" ","");
      data.e_aors = e_aors2.replaceAll(" ","");
      data.outbound_auth= outbound_auth2.replaceAll(" ","");
      data.id =id2.replaceAll(" ", "");

      data.registrationopt=this.registrationopt;
      data.authsopt=this.authsopt;
      console.log("before",data);
      if (this.editmode) {        
        this.http.post(environment.apiUrl + '/digital/updatenewdynamicchannel/', data).subscribe((data: any) => {
          if (data) {
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
            //window.location.href = '/voip-agent-list/';
          }
          if (data.err) {
            console.log(data.err);
          }
        }, error => {
          this.serviceErrors = error.error.error;
        });
      } else {

       
        //console.log(data);
        this.http.post(environment.apiUrl + '/digital/createnewdynamicchannel/', data).subscribe((data: any) => {
          if (data) {
            //this.toastr.success(data.msg);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
          }
          if (data.err) {
            //this.toastr.error(data.err);
          }
        }, error => {
          this.serviceErrors = error.error.error;
        });
      }
    }
  }

  checkWebrtc() {
    if (this.addCusForm.value.e_webrtc == 'no') {
      this.iswebrtc = true;
    } else {
      this.iswebrtc = false;
    }
  }

  channeldelete(id) {
    console.log("helo", id)
    var params = { id: id }
    this.http.post(environment.apiUrl + '/digital/deletechannel/', params).subscribe((data: any) => {
      //console.log("Msg ::" + data.msg);
      if (data.msg) {
        //this.toastr.success(data.msg);
        this.dialogRef.close({ event: 'Delete' });
      }
      if (data.err) {
        // this.toastr.error(data.err);
      }
    }, error => {
      this.serviceErrors = error.error.error;
    });
  }

  async getServerData() {
    await this.adminservice.getAsteriskServerData().then(
      data => {
        console.log(data['data']);
        this.serverdata = data['data'];
      },
      err => {
        console.log('error');
      }
    );

  }
  showOpt(value) {
    if (value == 1) {
      this.registrationopt = true;
      this.authsopt = true;
    } else {
      this.registrationopt = false;
      this.authsopt = false;
    }
  }
  async getServerDetail(value) {
    await this.adminservice.getAsteriskServerDetail(value).then(
      data => {
        this.serverid = (data['data'][0].server_id);
        this.addCusForm.get('e_from_domain').setValue(data['data'][0].sip_host);
        this.addCusForm.get('contact').setValue('sip:' + data['data'][0].sip_host + ':5060');
        this.addCusForm.get('ip_match').setValue(data['data'][0].sip_host);
        this.addCusForm.get('server_uri').setValue('sip:' + data['data'][0].sip_host);
        this.addCusForm.get('client_uri').setValue('sip:num@' + data['data'][0].sip_host);
      },
      err => {
        console.log('error');
      }
    );
  }


}
