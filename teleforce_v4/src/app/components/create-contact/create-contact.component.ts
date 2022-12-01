import { Component, OnInit, VERSION, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { CrudService } from '../../crud.service';


@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {
  isDisabled = false;
  isLoading = false;
  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  delagentid = '';
  delagentname = '';
  page_data = [];
  category = [];
  state = [];
  items: FormArray;

  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addConForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;
  leadid = 0
  constructor(
    public dialogRef: MatDialogRef<CreateContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private userservice: CrudService,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.getContactCategory();
    this.getstatedata();
    let userinfo = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      this.addmode = false
      if (this.data.action == 'delete') {
        this.deletemode = true
        this.delagentid = this.data.cont_id
        this.delagentname = this.data.username
      } else {
        this.editmode = true
        this.leadid = this.data.lead_id
        this.addConForm = this.fb.group({
          category: [this.data.category, [Validators.required]],
          name: [this.data.name, [Validators.required]],
          mobile: [this.data.mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),Validators.maxLength(10)], [Validators.composeAsync([this.checkEditValidMobile.bind(this)])]],
          email: [this.data.email, [Validators.email]],
          address: [this.data.address],
          state: [this.data.state],
          city: [this.data.city],
          items: this.fb.array([]),
          is_mobile_dnd: [this.data.is_mobile_dnd, [Validators.required]],
          cont_id: [this.data.cont_id],
          lead_id: [this.data.lead_id],
          is_lead: [this.data.lead_id > 0 ? 'yes' : 'no']
        })
        if (this.data['metadata'].length > 0) {
          this.data['metadata'].forEach(element => {
            this.items = this.addConForm.get('items') as FormArray;
            this.items.push(this.fb.group({
              otherkey: element.meta_key,
              othervalue: element.meta_value,
            }));
          });
        }
      }
    } else {
      this.addConForm = this.fb.group({
        category: [null, [Validators.required]],
        name: [null, [Validators.required]],
        mobile: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),Validators.maxLength(10)], [Validators.composeAsync([this.checkValidMobile.bind(this)])]],
        email: [null, [Validators.email]],
        address: [null],
        state: [null],
        city: [null],
        items: this.fb.array([this.createItem()]),
        is_mobile_dnd: ['no', [Validators.required]],
        customer_id: [userinfo],
        lead_id: [null],
        is_lead: ['no'],
      });
    }
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
  }
  createItem(): FormGroup {
    return this.fb.group({
      otherkey: '',
      othervalue: '',
    });
  }
  addItem(): void {
    this.items = this.addConForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  removetem(index) {
    (this.addConForm.get('items') as FormArray).removeAt(index)
    //if (this.data != '' && this.data != null) {
      var metaid = this.data['metadata'][index].meta_id
     // console.log(this.data['metadata'][index].meta_id);
      this.userservice.deletecontactmeta(23).then(data => {
        if (data) {
          //console.log(data['data']);
        }
      },
        err => {
          console.log('error' + err);
        })
    //}
  }
  openDialog(): void {
    //console.log(this.wasFormChanged);
    this.dialogRef.close({ event: 'Cancel' });
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }
  getstatedata() {
    let userinfo = localStorage.getItem('access_id');
    this.http.get(environment.apiUrl + '/contacts/getStatedata/').subscribe((data: any) => {
      this.state = data['data'];
    });
  }
  formChanged() {
    this.wasFormChanged = true;
  }
  contactsubmit() {
    this.submitted = true;
    if (this.addConForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.addConForm.value);
      data.agentrole = localStorage.getItem("agent_role") ? localStorage.getItem("agent_role") : 'agent'
      this.isDisabled = true;
      this.isLoading = true;
      if (this.editmode) {
        this.http.post(environment.apiUrl + '/contacts/update/', data).subscribe((data: any) => {
          if (data.msg) {
            this.toastr.success(data.msg);
            this.dialogRef.close({ event: 'Update' });
            //window.location.href = '/voip-agent-list/';
            this.isDisabled = false;
            this.isLoading = false;
          }
          if (data.err) {
            this.toastr.error(data.err);
          }
        }, error => {
          this.serviceErrors = error.error.error;
        });
      } else {
        this.http.post(environment.apiUrl + '/contacts/createcontact', data).subscribe((data: any) => {
          if (data.msg) {
            this.toastr.success(data.msg);
            this.dialogRef.close({ event: 'Add' });
            this.isDisabled = false;
            this.isLoading = false;
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
  async contactdelete(cont_id) {
    await this.userservice.deleteallcontacts(cont_id).then(data => {
      if (data) {
        this.toastr.success('Contact Delete Succesfull.');
        this.dialogRef.close({ event: 'Delete' });
      }
    },
      err => {
        console.log('error' + err);
      })
  }

  async getContactCategory() {
    let userinfo = localStorage.getItem('access_id');
    var agentrole = localStorage.getItem('agent_role') ? localStorage.getItem('agent_role') : 'agent';
    if (agentrole == "supervisor") {
      await this.userservice.getallsupervisorsegments(userinfo).then(data => {
        if (data) {
          this.category = data['data'];
        }
      },
        err => {
          console.log('error' + err);
        })
    } else {
      await this.userservice.getCategorylist(userinfo).then(data => {
        if (data) {
          this.category = data['data'];
        }
      },
        err => {
          console.log('error' + err);
        })
    }
  }
  leaddetailpage(id) {
    this.router.navigateByUrl('/lead-details/' + id);
    this.dialogRef.close({ event: 'lead' });
  }
  private checkEditValidMobile(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string

    var agentid =  this.data.cont_id;
    if (control.value == null) {
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/default/checkcontecteditmobile/', { check: control.value, id: agentid }).subscribe(data => {
          if (data['isexist']) {
            resolve({ 'mobile': true });
            this.isDisabled=true;
          } else {
            resolve(null);
            this.isDisabled=false;
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
      Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {

      this.debouncedTimeout = setTimeout(() => {

        this.http.post(environment.apiUrl + '/default/checkcontactmobile/', { check: control.value }).subscribe(data => {
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
  invalidMobile() {
    return (this.addConForm.controls.mobile.errors != null);
  }
}
