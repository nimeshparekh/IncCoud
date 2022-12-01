import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudService } from '../../crud.service';
import { ErpService } from '../../erp.service';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

@Component({
  selector: 'app-generate-contact',
  templateUrl: './generate-contact.component.html',
  styleUrls: ['./generate-contact.component.css']
})
export class GenerateContactComponent implements OnInit {

  submitted = false;
  addmode = false;
  editmode = false;
  deletemode = false;
  delagentid = '';
  delagentname = '';
  page_data = [];
  category = [];
  otherfileds = [{ key: 'otherkey1', value: 'othervalue1' }]
  addConForm: FormGroup;
  callogid = '';
  items: FormArray;
  leadid = 0
  defaultsegment = ''
  defaultcontactsegment = '';
  Source = [];
  source_data = false
  msg='';
  constructor(
    public dialogRef: MatDialogRef<GenerateContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private crudservice: CrudService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private erpservice: ErpService
  ) { }

  ngOnInit(): void {
    //console.log("data::"+JSON.stringify(this.data));
    this.getContactCategory();

    let userinfo = localStorage.getItem('access_id');
    this.callogid = this.data.id;
    let callernumber = this.data.callernumber;
    //console.log(callernumber);
    let userid = this.data.managerid;
    this.checkCallerNumber(callernumber, userid);
    this.get_lead_Source();
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async getContactCategory() {
    let userinfo = this.data.managerid;
    await this.crudservice.getCategorylist(userinfo).then(data => {
      if (data) {
        this.category = data['data'];
        this.defaultcontactsegment = data['data'][0]['cont_id']
      }
    },
      err => {
        console.log('error' + err);
      })
  }

  

  async checkCallerNumber(no, userid) {
    let userinfo = localStorage.getItem('access_id');
    var mobileno = (no.length == 10 || no.length == 11) ? no : no.substring(2)
    mobileno = mobileno.toString()[0] == 0 ? mobileno.substring(1) : mobileno
    //var mobileno = no;
    await this.crudservice.checkCallerNumber(userid, mobileno).then(data => {
      if (data) {
        if (data['data'].length > 0) {          
          this.addmode = false;
          this.editmode = true;
          this.leadid = data['data'][0].lead_id
          let segment = data['data'][0].category ? data['data'][0].category : this.defaultsegment;
          this.addConForm = this.fb.group({
            category: [segment],
            name: [data['data'][0].NAME, [Validators.required]],
            mobile: [data['data'][0].mobile, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            email: [data['data'][0].email, [Validators.email]],
            address: [data['data'][0].address],
            state: [data['data'][0].state],
            city: [data['data'][0].city],
            items: this.fb.array([]),
            is_mobile_dnd: [data['data'][0].is_mobile_dnd, [Validators.required]],
            cont_id: [data['data'][0].cont_id],
            lead_id: [data['data'][0].lead_id],
            source: [data['data'][0].lead_source],
            is_lead: [data['data'][0].lead_id > 0 ? 'yes' : 'no']
          })
          if (data['metadata'].length > 0) {
            data['metadata'].forEach(element => {
              this.items = this.addConForm.get('items') as FormArray;
              this.items.push(this.fb.group({
                otherkey: element.meta_key,
                othervalue: element.meta_value,
              }));
            });
          }
          if (data['data'][0].category) {

          } else {
            this.crudservice.getDefaultCategory(userinfo).then(data1 => {
              if (data1) {
                if (data1['data'].length > 0) {
                  this.defaultsegment = data1['data'][0]['metavalue'];
                  this.addConForm.get('category').setValue(this.defaultsegment);
                } else {
                 // this.msg = 'Please set contact category from lead configuration setting!!';
                }
              }
            },
              err => {
                console.log('error' + err);
              })
          }

        } else {
          this.addmode = true;
          this.editmode = false;
          this.addConForm = this.fb.group({
            category: [null],
            name: [null, [Validators.required]],
            mobile: [mobileno, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            email: [null, [Validators.email]],
            address: [null],
            state: [null],
            city: [null],
            items: this.fb.array([this.createItem()]),
            is_mobile_dnd: ['no', [Validators.required]],
            customer_id: [userinfo],
            lead_id: [null],
            source: [null],
            is_lead: ['no'],
          });
          this.crudservice.getDefaultCategory(localStorage.getItem('access_id')).then(data => {
            if (data) {
              if (data['data'].length > 0) {
                this.defaultsegment = data['data'][0]['metavalue']
                this.addConForm.get('category').setValue(data['data'][0]['metavalue']);
              } else {
                //this.msg = 'Please set contact category from lead configuration setting!!';
              }


            }
          },
            err => {
              console.log('error' + err);
            })
          let segment = this.defaultsegment ? this.defaultsegment : this.defaultcontactsegment;
          
        }
        //this.category = data['data'];
      }
    },
      err => {
        console.log('error' + err);
      })
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
  removetem(group: FormGroup, index: number) {
    (this.addConForm.get('items') as FormArray).removeAt(index)
  }
  contactsubmit() {
    this.submitted = true;
    if (this.addConForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.addConForm.value);
      //console.log(data);
      if (this.editmode) {
        this.http.post(environment.apiUrl + '/contacts/update/', data).subscribe((data: any) => {
          if (data.msg) {
            this._snackBar.open('Contact Updated Successfully', '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
            //window.location.href = '/voip-agent-list/';
          }
        });
      } else {
        this.http.post(environment.apiUrl + '/contacts/createcontact', data).subscribe((data: any) => {
          if (data.msg) {
            this._snackBar.open('Contact Created Successfully', '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
          }

        });
      }
    }
  }
  leaddetailpage(id) {
    this.router.navigateByUrl('/lead-details/' + id);
    this.dialogRef.close({ event: 'lead' });
  }
  async get_lead_Source() {
    await this.erpservice.getAllLeadSource(localStorage.getItem('access_id')).then(
      data => {
        if (data['data'].length > 0) {
          this.Source = data['data']
        } else {
          this.Source = []
        }
      },
      err => {
        console.log('error');
      }
    );
  }
}