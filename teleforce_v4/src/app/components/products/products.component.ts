import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateConferenceCallComponent } from '../create-conference-call/create-conference-call.component';
import { ProductsService } from '../../products.service';
import { ConferenceDetailComponent } from '../conference-detail/conference-detail.component';
import { Router, ActivatedRoute } from "@angular/router";
import { CreateProductComponent } from '../create-product/create-product.component';
import { ProductImagesComponent } from '../product-images/product-images.component';
import { ProductDocumentsComponent } from '../product-documents/product-documents.component';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [ 'productid','product_name', 'product_desc','unit','price', 'product_status','date','product_thumbnail',  'action'];
  Length = 0;
  isLoading = true;
  apiUrl: string;
  baseUrl: string;
  leadid
  constructor(private route: ActivatedRoute,private _http: HttpClient,private http: HttpClient,private productservice:  ProductsService ,public dialog: MatDialog,private router: Router) {
    this.apiUrl = environment.apiUrl;
    this.baseUrl = window.location.origin;
   }

  @ViewChild('paginator') paginator: MatPaginator;  

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.leadid  = this.route.snapshot.paramMap.get('id');
    console.log(this.leadid);
    
    this.dataSource = new MatTableDataSource(); // create new object
    this.getProducts(userid);
    //window.location.href='/dashboard/';
  }
  
  async getProducts(userid) {
    console.log("Products");
    console.log(userid);
    if(this.route.snapshot.paramMap.get('id') == null){

      await this.productservice.getProducts().then(
        data => {
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false;
        },
        err => {
          console.log('error');
        }
      );

    }else{
      await this.productservice.getProductsgroup(this.route.snapshot.paramMap.get('id')).then(
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

  Createdialog(): void {
    //if(this.route.snapshot.paramMap.get('id') == null){
      const dialogRef = this.dialog.open(CreateProductComponent, {
        disableClose: true,data:{action:'WAdd'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
          var userid = localStorage.getItem('access_id');
          this.getProducts(userid);
        }
      });

    /*}else{

      const dialogRef = this.dialog.open(CreateProductComponent,{
        disableClose: true ,data:{action:'add',pg_id:this.route.snapshot.paramMap.get('id')}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
          var userid = localStorage.getItem('access_id');
          this.getProducts(userid);      }
      });

    }*/
  }

  updateproduct(productid): void {
    this.http.get(environment.apiUrl + '/products/getproductdetail/' + productid).subscribe((data: any) => {
      console.log("Data update");
      console.log(JSON.stringify(data));
      const dialogRef = this.dialog.open(CreateProductComponent, {
        disableClose: true, data: data['data']
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getProducts(localStorage.getItem('access_id'));
      });
    });
  }

  addproductimages(productid){
    const dialogRef = this.dialog.open(ProductImagesComponent, {
      disableClose: true, data: productid
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  addproductdocs(productid){
    const dialogRef = this.dialog.open(ProductDocumentsComponent, {
      disableClose: true, data: productid
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  deleteData(s_id,group_name): void {
    const dialogRef = this.dialog.open(CreateProductComponent,{
      disableClose: true,data:{action:'delete',productid:s_id,product_name:group_name} 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getProducts(localStorage.getItem('access_id'));
      }
    });
  }
}
