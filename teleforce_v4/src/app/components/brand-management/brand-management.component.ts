import { Component, OnInit ,Inject,ViewChild} from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DigitalService } from '../../digital.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrandCreationComponent } from '../brand-creation/brand-creation.component'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ManagerService } from"../../manager.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.css']
})
export class BrandManagementComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'create', 'action'];
  public dataSource: MatTableDataSource<any>;
  interestLength = 0;
  spin=false
  constructor(
    private digitalService: DigitalService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,private managerservice: ManagerService,private router: Router,
  ) { }
  brand_info
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); 
    this.get_brands();
    this.accesssetting();
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('16')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '16') {
        //       console.log("yes");
              
        //     }else{

        //       this.router.navigate(['/dashboard']);

        //     }
        //   }
        // }


       
      },
      err => {
        console.log('error');
      })
  }
  get_brands(){
    this.spin = true
    var data = {'user_id':localStorage.getItem('access_id')}
    this.digitalService.get_brands(data).then(
      data=>{
        this.dataSource.data=data['data'];
        this.interestLength = data['data'].length;
        this.spin = false
      }
    )
  }
  get_brand(){
    var data = {'brand_id':localStorage.getItem('current_brand_id')}
    this.digitalService.get_brand(data).then(
      data=>{
        console.log('data',data);
        this.brand_info = data[0]
        console.log('data:',data[0]);
      }
    )
  }

  

 

  DeleteConfirm(data): void {
    console.log('data',data);
    const dialogRef = this.dialog.open(BrandDeleteComponent, {data: {brand_id: data.brand_id}});
    dialogRef.afterClosed().subscribe(() => {
      this.get_brands()
    });
  }

  editform(res): void{
    var data = {'brand_id':res.brand_id}
    this.digitalService.get_brand(data).then(
      data=>{
        if(data){
          console.log('editform',data);
          const dialogRef = this.dialog.open(BrandCreationComponent, {
          width:'450',data: {brand_id: res.brand_id,'type':'edit',formdata:data[0]},
        
          });
          dialogRef.afterClosed().subscribe(() => {
            this.get_brands()
          });
        }else{
          this._snackBar.open(data['message'], 'Close', {
            duration: 5000,
          });
        }
          
      }
    )
    
    
  }

  newform(): void{
   
    const dialogRef = this.dialog.open(BrandCreationComponent, 
      {
        width: '400px',
       data: {brand_id: localStorage.getItem('current_brand_id'),'type':'new'}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.get_brands()
      });
   
  }

}


@Component({
  selector: 'brand-delete',
  templateUrl: 'brand-delete.component.html',
})
export class BrandDeleteComponent {

  constructor(
    public digitalService: DigitalService,
    public dialogRef: MatDialogRef<BrandDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BrandManagementComponent) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
    deleteBrand(){
      this.digitalService.brand_delete(this.data['brand_id']).then(
        data=>{
          if(localStorage.getItem('current_brand_id')==this.data['brand_id']){
            localStorage.removeItem('current_brand_id');
          }
          this.dialogRef.close();
         // window.location.href ='/digital/brand-management';
        },err=>{
          console.log(err);
        }
      )
    }

}


