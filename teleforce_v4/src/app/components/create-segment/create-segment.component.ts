import { Component, OnInit, VERSION, ViewChild,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import { CrudService } from '../../crud.service';


@Component({
  selector: 'app-create-segment',
  templateUrl: './create-segment.component.html',
  styleUrls: ['./create-segment.component.css']
})
export class CreateSegmentComponent implements OnInit {
  isDisabled=false;
  isLoading=false;
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
    public dialogRef: MatDialogRef<CreateSegmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private userservice: CrudService
  ) { }

  public ngOnInit(): void {
    let userinfo = localStorage.getItem('access_id');
    if(this.data!='' && this.data!=null){
      this.addmode = false
      if(this.data.action=='delete'){
        this.deletemode = true
        this.delagentid = this.data.cont_id
        this.delagentname = this.data.username
      }else{
        this.editmode = true
        this.addConForm = this.fb.group({
          name: [this.data.name, [Validators.required]],
          cont_id: [this.data.cont_id],
        })  
      }
    }else{
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
  contactsubmit(){
    this.submitted = true;
    if(this.addConForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{  
      let data: any = Object.assign(this.addConForm.value);
      if(this.editmode){
        this.isDisabled=true;
        this.isLoading=true;
        this.http.post(environment.apiUrl+'/segments/update/', data).subscribe((data:any) => {
          if(data.msg){
            this.toastr.success(data.msg);
            this.dialogRef.close({event:'Update'});
           this.isDisabled=false;
            this.isLoading=false;
          }
          if(data.err){
            this.toastr.error(data.err);
          }
        }, error =>
        {
          this.serviceErrors = error.error.error;
        });
      }else{
        this.http.post(environment.apiUrl+'/segments/createcontact', data).subscribe((data:any) => {
          if(data.msg){
            this.toastr.success(data.msg);
            this.dialogRef.close({event:'Add'});
            this.isDisabled=false;
            this.isLoading=false;
          }
          if(data.err){
            this.toastr.error(data.err);
          }
        }, error =>
        {
          this.serviceErrors = error.error.error;
        });
      }
    }
    
  }
  async contactdelete(cont_id){
    await this.userservice.deleteallsegments(cont_id).then(data => {
      if(data){
        this.toastr.success('Segment Delete succesfully.');
        this.dialogRef.close({event:'Delete'});
      }
    },
    err => {
      console.log('error'+err);
    })
  }
}
