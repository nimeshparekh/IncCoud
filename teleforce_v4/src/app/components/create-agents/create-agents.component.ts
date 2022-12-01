import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-agents',
  templateUrl: './create-agents.component.html',
  styleUrls: ['./create-agents.component.css']
})

export class CreateAgentsComponent implements OnInit {
  isLoading = false;
  is_deleted = 'no';
  isDisabled = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  passwordmode = false;
  agentid = '';
  regex = '';
  submitted = false;
  public addForm: FormGroup;
  public passwordForm: FormGroup;
  private debouncedTimeout;
  didArr = [];
  emailserver = [];
  codeGenerated = ''; // for 10 digit code
  userlimit = 0;
  agentcount = 0;
  msg = "";
  msg1 = "";
  button = false;
  only_supervisior = false ;
  super_check = 0;
  agentcount_2=0
  constructor(
    public dialogRef: MatDialogRef<CreateAgentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    //this.regex = 
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'password') {
        this.agentid = this.data.id;
        this.passwordmode = true;
        this.deletemode = false;
        this.addmode = false;
        this.editmode = false;
        this.passwordForm = this.fb.group({
          newpassword: [null, [Validators.required]],
          agentid: [this.agentid],
        });

      }
      else if (this.data.action == 'delete') {
        this.agentid = this.data.id;
        this.passwordmode = false;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.agentid = this.data
        this.editmode = true;
        this.addmode = false;
        this.passwordmode = false;
        this.getAgentDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      user_role: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.pattern("[a-z0-9]*"), Validators.maxLength(12)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.maxLength(10)], [Validators.composeAsync([this.checkValidMobile.bind(this)])]],
      password: [null, [Validators.required]],
      authorised_person_name: [null, [Validators.required]],
      created_by: [userid],
      showtype: [0],
      status: [0],
      voip_status: [1],
      starttime: ["12:01", [Validators.required]],
      endtime: ["23:59", [Validators.required]],
      did_alloted: [''],
      emailserver_alloted: [''],
      monitor_agent: [0],
      supervisor_only:[0],

      whatsup_access: [0],
      deleted: ["no"],
    });
    this.getOutgoingDID(userid);
    this.getEmailServer(userid);
    this.getUserLimit(userid);
    this.getActiveAgents(userid);
    this.getActiveAgents2(userid)
  }
  get_only_supervisior(value){
    if(value == 2){
      this.only_supervisior =true

    }else{
      this.only_supervisior =false


    }

  }
  randomString() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    const stringLength = 10;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    this.codeGenerated = randomstring;
    if (this.passwordmode) {
      this.passwordForm.controls.newpassword.setValue(randomstring);
    } else {
      this.addForm.controls.password.setValue(randomstring);
    }
    return 0;
  }
  async getOutgoingDID(userid) {
    await this.userservice.getOutgoingDID(userid).then(
      data => {
        this.didArr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getEmailServer(userid) {
    await this.userservice.getEmailServerData(userid).then(
      data => {
        this.emailserver = data['data'];
      },
      err => {
        console.log('error');
      }
    );
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

        this.http.post(environment.apiUrl + '/signin/check_user_name/', { check: control.value, editid: this.data }).subscribe(data => {
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

        this.http.post(environment.apiUrl + '/default/checkagentmobile/', { check: control.value }).subscribe(data => {
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
    return (this.addForm.controls.name.errors != null);
  }

  invalidMobile() {
    return (this.addForm.controls.mobile.errors != null);
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
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
      console.log(data);
      this.isLoading = true;

      this.isDisabled = true;
      if (this.data != '' && this.data != null) {
        this.userservice.updateAgent(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
            this.isDisabled = false;
            this.isLoading = false;
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.userservice.saveAgent(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
            this.isDisabled = false;
            this.isLoading = false;

          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }
  getAgentDetail(id) {
    this.userservice.getAgentDetail(id).then(
      data => {
        console.log(data['data']);
        this.is_deleted = data['data']['is_deleted'];
        this.super_check =data['data']['supervisor_only']
        if(this.super_check == 1){
          this.only_supervisior =true;
        }else{
          this.only_supervisior =false;

        }

        console.log("delete agnt",this.super_check);
        this.addForm = this.fb.group({
          user_role: [String(data['data'].account_role), [Validators.required]],
          agentid: [data['data'].account_id],
          deleted: [data['data'].is_deleted],

          name: [data['data'].account_name, [Validators.required, Validators.pattern("[a-z0-9]*"), Validators.maxLength(12)], [Validators.composeAsync([this.checkUsernameValid.bind(this)])]],
          email: [data['data'].email, [Validators.required, Validators.email]],
          authorised_person_name: [data['data'].authorised_person_name, [Validators.required]],
          mobile: [data['data'].mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.maxLength(10)], [Validators.composeAsync([this.checkEditValidMobile.bind(this)])]],
          created_by: [data['data']['created_by']],
          showtype: [data['data']['show_no_id']],
          status: [data['data']['current_status']],
          voip_status: [data['data']['voip_status']],
          starttime: [data['data']['start_time'], [Validators.required]],
          endtime: [data['data']['end_time'], [Validators.required]],
          did_alloted: [data['data']['did_alloted']],
          emailserver_alloted: [data['data']['emailserver_alloted']],
          monitor_agent: [data['data']['monitor_agent']],
          whatsup_access: [data['data']['whatsup_access']],
          supervisor_only:[data['data']['supervisor_only']]
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.userservice.agentdeleteshoft(id).then(
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
  private checkEditValidMobile(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string

    var agentid = this.addForm.value.agentid;
    if (control.value == null) {
      console.log('control' + control)
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/default/checkagenteditmobile/', { check: control.value, id: agentid }).subscribe(data => {
          if (data['isexist']) {
            resolve({ 'mobile': true });
            this.isDisabled = true;
          } else {
            resolve(null);
            this.isDisabled = false;
          }
        });
      }, 300);
    });
    return q;
  }

  checkmobilelength() {
    let data: any = Object.assign(this.addForm.value);
    if (data.mobile.length == 10) {
      this.isDisabled = false;
    } else if (data.mobile.length > 10 || data.mobile.length < 10) {
      this.isDisabled = true
    } else {
      this.isDisabled = true;
    }
  }


  changepassword() {
    this.submitted = true;
    if (this.passwordForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.passwordForm.value);
      this.userservice.agentChangePassword(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Password' });
        },
        err => {
          console.log('error');
        }
      );

    }
  }
  async getUserLimit(userid) {
    await this.userservice.Getuserlimit(userid).then(
      data => {
        this.userlimit = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getActiveAgents(userid) {
    await this.userservice.getActiveAgents(userid).then(
      data => {

        this.agentcount = data['data'].length;
        //this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getActiveAgents2(userid) {
    await this.userservice.getActiveAgents2(userid).then(
      data => {

        this.agentcount_2 = data['data'].length;
        //this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  checkusers(value) {
    if (value == 'no') {
      if (this.agentcount == this.userlimit) {
        this.msg1 = "Your userlimit is " + this.userlimit + ".Please delete someone!";
        this.isDisabled = true;
      } else {
        this.msg1 = "";
        this.isDisabled = false;
      }
    } else {
      this.msg1 = "";
      this.isDisabled = false;
    }

    let data: any = Object.assign(this.addForm.value);
    //console.log(data);
    if (data.status == '0') {
      this.checkuserlimit(data.status);
    }
  }

  checkuserlimit(value) {
    
    
    if (value == '0') {
      if (this.agentcount_2 == this.userlimit) {
        this.msg = "Your userlimit is " + this.userlimit + ".Please inactive someone then you can active this user!";
        this.isDisabled = true;
      } else {
        this.msg = "";
        this.isDisabled = false;
      }
    } else {
      this.msg = "";
      this.isDisabled = false;
    }
    if (this.is_deleted == 'yes') {
      let data: any = Object.assign(this.addForm.value);
      //console.log(data);
      if (data.deleted == 'no') {
        this.checkuserlimit(data.deleted);
      }
    }
  }
  copy_user_name(value){
    console.log(value.key);
    var name = this.addForm.get('name').value;
    this.addForm.get('email').setValue(name+'@cloudX.in')
    this.addForm.get('authorised_person_name').setValue(name)

    
  }
}
