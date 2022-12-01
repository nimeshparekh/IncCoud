import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { DigitalService } from '../../digital.service';
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';
//import { BrandManagementComponent } from '../brand-management/brand-management.component';
@Component({
  selector: 'app-brand-creation',
  templateUrl: './brand-creation.component.html',
  styleUrls: ['./brand-creation.component.css']
})
export class BrandCreationComponent implements OnInit {
  brand;
  public addForm: FormGroup;
  constructor( 
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BrandCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    //private userservice: UserService,
    private toastr: ToastrService,
    private el: ElementRef,
    private _snackBar: MatSnackBar,
    private digitalService: DigitalService,
    ) { }

    ngOnInit(){
      console.log(this.data)
      this.brand = this.data['type'] 
      if(this.brand == 'edit'){
        //this.get_brand()
        this.addForm = this.formBuilder.group({
          brand_name: this.data.formdata.brand_name,
          auto_share: this.data.formdata.auto_share,
        });
      }else{
        this.addForm = this.formBuilder.group({
          brand_name: ['',Validators.required],
          auto_share:['',Validators.required]
        });
      }
     
    }
  
    get_brand(){
      var data = {'brand_id':localStorage.getItem('current_brand_id')}
      this.digitalService.get_brand(data).then(
        data=>{
          console.log('data11',data);
          console.log('data11',data[0]['brand_name']);
          console.log('data11',data[0].brand_name);
          
          this.addForm.get("brand_name").patchValue(data[0].brand_name);
            
        }
      )
    }
  
    update_brand(){
      if(this.brand == 'edit'){
        let data_ad: any = Object.assign(this.addForm.value);
        console.log('update_brand',data_ad);
        var data = {'brand_name':data_ad.brand_name,'auto_share':data_ad.auto_share,'brand_id':this.data.formdata.brand_id}
        this.digitalService.brand_update(data).then(
          data=>{
            console.log(data);
            this._snackBar.open('Brand Details Change Successful !!', '', {
              duration: 2000,
            });
            localStorage.setItem("current_brand_name",data_ad.brand_name);
            // this.router.navigate(['brand-management']);
            //window.location.href  = "/digital/brand-management";    
            this.dialogRef.close();  
          },err => {
            console.log(err);
            this._snackBar.open(err.error['msg'], 'Close', {
              duration: 5000,
            });
          }
        )
      }else{
        let data_ad: any = Object.assign(this.addForm.value);
        console.log('data_ad',data_ad);
        console.log('name',data_ad.brand_name);
        this.digitalService.brand_create(data_ad).then(
          data => {
            if(data){
              console.log(data['message']);
              this._snackBar.open(data['message'], '', {
                duration: 2000,
              });
              localStorage.setItem('current_brand_id', data['result']['brand_id']);
              localStorage.setItem('current_brand_name', data['result']['brand_name']);  
              this.dialogRef.close(); 
            }else{
              this._snackBar.open(data['message'], 'Close', {
                duration: 5000,
              });
            }    
          },
          err => {
            console.log(err);
            this._snackBar.open(err.error['msg'], 'Close', {
              duration: 5000,
            });
          }
        )
      }
      
    }
  
  close() {
    this.dialogRef.close();
  }
  
}
