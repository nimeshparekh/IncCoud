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
  selector: 'app-create-stage',
  templateUrl: './create-stage.component.html',
  styleUrls: ['./create-stage.component.css']
})
export class CreateStageComponent implements OnInit {
  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  delagentid = '';
  delagentname = '';
  serviceErrors:any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addConForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;
  constructor(
    public dialogRef: MatDialogRef<CreateStageComponent>,
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
    
    if(this.data!='' && this.data!=null){
      this.addmode = false
      if(this.data.action=='delete'){
        this.deletemode = true
        this.delagentid = this.data.s_id
        this.delagentname = this.data.stage_name
      }else{
        this.editmode = true
        this.addConForm = this.fb.group({
          
          name: [this.data.stage_name, [Validators.required]],
          s_id: [this.data.s_id],
          colorCtr: [this.data.color_id,[Validators.required]],
        })  
      }
    }else{
      this.addConForm = this.fb.group({
        name: [null, [Validators.required]],
        customer_id: [userinfo],
        colorCtr: [null,[Validators.required]],
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
      data.color_id = '#'+data.colorCtr.hex
      console.log(data.color_id);
      if (this.data != '' && this.data != null) {
        this.erpservice.updatestageData(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
            this.submitted=false;
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.erpservice.savestageData(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
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
    await this.erpservice.deleteleadstages(cont_id).then(data => {
      if(data){
        this.toastr.success('lead stages Delete succesfully.');
        this.dialogRef.close({event:'Delete'});
      }
    },
    err => {
      console.log('error'+err);
    })
  }

}
