import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { ProductsService } from '../../products.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-product-documents',
  templateUrl: './product-documents.component.html',
  styleUrls: ['./product-documents.component.css']
})
export class ProductDocumentsComponent implements OnInit {

  productform: FormGroup;
  appdata: any;
  
  submitted = false;

  progress: number;
  progressbar = false;
  fileInputLabel: string;
  fileUploadForm: FormGroup;
  imagedata = [];

  constructor(
    public dialogRef: MatDialogRef<ProductDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private productservice: ProductsService,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    let id = localStorage.getItem('access_id');
    this.productform = this.fb.group({
      docfile: ['', [Validators.required]],
    });

    this.getProductDocData(this.data);
  }

  
  docfileupload(){
    this.submitted = true;
    this.progress=1;
    let data: any = Object.assign(this.productform.value);
    if (this.productform.invalid == true) {
      return;
    } else {
      //console.log(data)
      this.progressbar=true;
      let fdata = new FormData();
      let fileItem = data.docfile._files[0];
      fdata.append('image', fileItem);
      fdata.append('product_id', this.data);
      
      this.productservice.updateproductdoc(fdata).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });

          this.getProductDocData(this.data);
         // this.dialogRef.close({ event: 'Add' });
        },
        err => {
          console.log('error');
        })

    }
  }

  getProductDocData(id){
    this.http.get(environment.apiUrl + '/products/getproductdocformdata/' + id).subscribe((data: any) => {
      //var appdata = data['data'][0];
      this.imagedata  = data['data'];
    });
  }

  deleteProdDoc(id,image){
    
    var appdata = {id:id,image:image};
    this.productservice.deleteDoc(appdata).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });

        this.getProductDocData(this.data);
       // this.dialogRef.close({ event: 'Add' });
      },
      err => {
        console.log('error');
      })


  }

  

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
