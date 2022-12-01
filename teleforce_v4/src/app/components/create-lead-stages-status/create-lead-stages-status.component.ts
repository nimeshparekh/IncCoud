import { Component, OnInit, VERSION, ViewChild,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import { ErpService } from '../../erp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-create-lead-stages-status',
  templateUrl: './create-lead-stages-status.component.html',
  styleUrls: ['./create-lead-stages-status.component.css']
})
export class CreateLeadStagesStatusComponent implements OnInit {

  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  delagentid = '';
  status
  delagentname = '';
  serviceErrors:any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addConForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateLeadStagesStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private erpservice: ErpService,
    private _snackBar: MatSnackBar,

  ) { }


  public ngOnInit(): void {
    let userinfo = localStorage.getItem('access_id');
    console.log(this.data);
    this.master_status()
    if(this.data!='' && this.data!=null){
      
      if(this.data.action=='delete'){
        this.addmode = false
        this.deletemode = true
        this.editmode = false

        this.delagentid = this.data.s_id
        this.delagentname = this.data.stage_name
      }else{
        if(this.data.action=="update"){
          this.addmode = false
          this.editmode = true
          this.deletemode=false

          this.addConForm = this.fb.group({
            
            name: [this.data['data'].stage_status, [Validators.required]],
            St_id: [this.data['data'].St_id],
            stage_id: [this.data['data'].stage_id],
            status: [this.data['data'].status_master, [Validators.required]],

          })  
        }else{
          this.addmode = true;
          this.deletemode=false
          this.editmode =false
          this.addConForm = this.fb.group({
            name: [null, [Validators.required]],
            stage_id: [this.data],
            customer_id: [userinfo],
            status: [null, [Validators.required]],
          });
        }
       
      }
    }else{
      this.addmode = true;
      this.deletemode=false
      this.editmode =false
      this.addConForm = this.fb.group({
        name: [null, [Validators.required]],
        customer_id: [userinfo],
      });
    }
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
  }

  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }
  
  formChanged() {
    this.wasFormChanged = true;
  }
  submit() {
    this.submitted = true;
    if (this.addConForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addConForm.value); 
   
      console.log(this.addmode);
      if (this.editmode == true) {
        this.erpservice.updatestagestatus(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
            this.submitted=false;
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.erpservice.savestagestatus(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
            this.submitted=false;
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }
  async contactdelete(cont_id){
    await this.erpservice.deleteleadstagesstatus(cont_id).then(data => {
      if(data){
        this.toastr.success('lead stages Delete succesfully.');
        this.dialogRef.close({event:'Delete'});
      }
    },
    err => {
      console.log('error'+err);
    })
  }


  async master_status() {
    await this.erpservice.unassign_master_status().then(
      data => {
        //console.log(data['data'])
        this.status  = data['data']
        if(this.editmode){
          //console.log(this.data['data'].status_master)
          this.status.push({status_id:0,status_name:this.data['data'].status_master})
        }
      },
      err => {
        console.log('error');
      }
    );
  }



}
