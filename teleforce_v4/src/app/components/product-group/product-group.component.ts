import { Component, OnInit,ChangeDetectionStrategy,Input ,ElementRef,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl} from "@angular/forms";
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import {Router,ActivatedRoute} from "@angular/router";
import { environment } from '../../../environments/environment';
import {ToastrService} from "ngx-toastr";
import { AuthService } from '../../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import {finalize , delay} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CreateStageComponent} from '../create-stage/create-stage.component';
import { CreateProductComponent } from '../create-product/create-product.component';
import {CreateProductGroupComponent} from '../create-product-group/create-product-group.component'
import { ErpService } from '../../erp.service';
import { from } from 'rxjs'

import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.css']
})
export class ProductGroupComponent implements OnInit {

  public contactdataSource: MatTableDataSource<any>;
  displayedColumns = ["id","group_name","action"];
  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  isLoading =true;
  constructor(private formBuilder: FormBuilder,private http: HttpClient, 
    private router: Router,private toastr: ToastrService,
    private authAPIservice: AuthService,
    private sanitizer: DomSanitizer,private el: ElementRef,
    private route:ActivatedRoute,public dialog: MatDialog,
    private productservice : ProductsService) 
  { }
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;


  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.contactdataSource   = new MatTableDataSource(); // create new object
this.getproductgroup()
  }
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateProductGroupComponent,{
      disableClose: true 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getproductgroup();
      }
    });
  }
  async updateagentdialog(cont_id) {
    await this.productservice.updateproductgroup(cont_id).then(data => {
      if(data){
        const dialogRef = this.dialog.open(CreateProductGroupComponent,{
         disableClose: true,data:data['data']
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result.event == 'Update'){
            this.getproductgroup();
          }
        });
      }
    },
    err => {
      console.log('error');
    })
  }

  deleteData(s_id,group_name): void {
    const dialogRef = this.dialog.open(CreateProductGroupComponent,{
      disableClose: true,data:{action:'delete',pg_id:s_id,group_name:group_name} 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getproductgroup();
      }
    });
  }
  createstatusdialog(id): void {
    const dialogRef = this.dialog.open(CreateProductComponent,{
      disableClose: true ,data:{action:'add',pg_id:id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getproductgroup();
      }
    });
  }
  createupdatedialog(id): void {
    // const dialogRef = this.dialog.open(LeadStagesStatusComponent,{
    //   disableClose: true ,data:id
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if(result.event == 'Add'){
    //     this.getproductgroup();
    //   }
    // });
    this.router.navigateByUrl('/products/' + id);
  }
  
  async getproductgroup(){
    var userid = localStorage.getItem('access_id');

    await this.productservice.getproductgroup(userid).then(data => {
      if(data){
            
        this.contactdataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.isLoadingcon = false; 
        this.isLoading =false;
      }
    },
    err => {
      console.log('error');
    })
  }


}
