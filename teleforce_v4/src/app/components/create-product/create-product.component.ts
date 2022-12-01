import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl,FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { ErpService } from '../../erp.service';
import { ProductsService } from '../../products.service';
import { environment } from '../../../environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  form: FormGroup;
  addmode = true;
  editmode = false;
  deletemode = false;
  submitted = false;
  delagentid = '';
  delagentname = '';
  public addForm: FormGroup;
  email_templates = [];
  sms_templates = [];
  whatsapp_templates = [];
  progress: number;
  progressbar = false;
  apiUrl: string;
  baseUrl: string;
  //digitactionarr = [];
  //misscallservice=false;
  //ivr=false;
  thimage;
  image;
  formdata;
  thumbnailfile;
  document;
  attributes: FormArray;
  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private erpservice: ErpService,
    private productservice: ProductsService,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    private el: ElementRef,
  ) {
    this.apiUrl = environment.apiUrl;
    this.baseUrl = window.location.origin;
  }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    if (this.data.action == 'WAdd') {
      this.addForm = this.fb.group({
        userid: [userid],
        name: [null, [Validators.required]],
        description: [null, [Validators.required]],
        // longdescription: [null, [Validators.required]],
        // emailtemplate: [0, [Validators.required]],
        // smstemplate: [0, [Validators.required]],
        // whatsapptemplate: [0, [Validators.required]],
        status: [0, [Validators.required]],
        price: [null, [Validators.required]],
        unit: [null, [Validators.required]],
        gst: [null, [Validators.required]],
        actual_qty: [0, [Validators.required]],
        amount: [0, [Validators.required]],
        item_code: [null],
        item_price_id: [null],
        hsn: [null],
        web_url:[null],
        attributes: this.fb.array([this.createItem()]),
      });
    }
    else if (this.data != '' && this.data != null && this.data.action != 'add') {
      this.addmode = false
      if (this.data.action == 'delete') {
        this.deletemode = true
        this.delagentid = this.data.productid
        this.delagentname = this.data.product_name
      } else {
        this.editmode = true;
        this.image = this.data.product_thumbnail;
        this.document = this.data.product_document;

        this.addForm = this.fb.group({
          userid: [userid],
          name: [this.data.product_name, [Validators.required]],
          description: [this.data.product_desc, [Validators.required]],
          // longdescription: [this.data.product_long_desc, [Validators.required]],
          // emailtemplate: [this.data.email_template, [Validators.required]],
          // smstemplate: [this.data.sms_template, [Validators.required]],
          // whatsapptemplate: [this.data.whatsapp_template, [Validators.required]],
          status: [this.data.product_status, [Validators.required]],
          price: [this.data.price, [Validators.required]],
          unit: [this.data.unit, [Validators.required]],
          gst: [this.data.gst, [Validators.required]],
          productid: [this.data.productid],
          actual_qty: [this.data.actual_qty, [Validators.required]],
          amount: [this.data.amount, [Validators.required]],
          item_code: [this.data.item_code],
          item_price_id: [this.data.item_price_id],
          group_id: [this.data.pg_id],
          hsn: [this.data.hsn],
          web_url:[this.data.web_url],
          attributes: this.fb.array([]),
        });
        if (this.data['metadata'].length > 0) {
          this.data['metadata'].forEach(element => {
            this.attributes = this.addForm.get('attributes') as FormArray;
            this.attributes.push(this.fb.group({
              otherkey: element.attribute_key,
              othervalue: element.attribute_value,
            }));
          });
        }
      }
    }
    else {

      if (this.data.action == 'add') {
        this.addForm = this.fb.group({
          userid: [userid],
          name: [null, [Validators.required]],
          description: [null, [Validators.required]],
          // longdescription: [null, [Validators.required]],
          // emailtemplate: [0, [Validators.required]],
          // smstemplate: [0, [Validators.required]],
          // whatsapptemplate: [0, [Validators.required]],
          status: [0, [Validators.required]],
          price: [null, [Validators.required]],
          unit: [null, [Validators.required]],
          gst: [null, [Validators.required]],
          actual_qty: [0, [Validators.required]],
          amount: [0, [Validators.required]],
          item_code: [null],
          group_id: [this.data.pg_id],
          item_price_id: [null],
          hsn: [null],
          web_url:[null],
          attributes: this.fb.array([this.createItem()]),
        });
      } else {

        this.addForm = this.fb.group({
          userid: [userid],
          name: [null, [Validators.required]],
          description: [null, [Validators.required]],
          // longdescription: [null, [Validators.required]],
          // emailtemplate: [0, [Validators.required]],
          // smstemplate: [0, [Validators.required]],
          // whatsapptemplate: [0, [Validators.required]],
          status: [0, [Validators.required]],
          price: [null, [Validators.required]],
          unit: [null, [Validators.required]],
          gst: [null, [Validators.required]],
          actual_qty: [0, [Validators.required]],
          amount: [0, [Validators.required]],
          item_code: [null],
          hsn: [null],
          item_price_id: [null],
          web_url:[null],
          attributes: this.fb.array([this.createItem()]),
        });
      }
    }
    this.getSmsTemplate(userid);
    this.getEmailTemplate(userid);
    this.getWhatsappTemplate(userid);
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  createItem(): FormGroup {
    return this.fb.group({
      otherkey: '',
      othervalue: '',
    });
  }


  addItem(): void {
    this.attributes = this.addForm.get('attributes') as FormArray;
    this.attributes.push(this.createItem());
  }
  removetem(index) {
    if(this.data['productid']){
      var key = this.addForm.get('attributes').value[index].otherkey;
     var data = {key:key,productid:this.data['productid']};
     (this.addForm.get('attributes') as FormArray).removeAt(index)
      this.productservice.deleteProductAttribute(data).then(data => {
        if(data){
          console.log("if");
        }else{
          console.log("esle");
        }
        
      },
        err => {
          console.log('error' + err);
        })
        
    }else{
      (this.addForm.get('attributes') as FormArray).removeAt(index)
    }
      
  }
  

  async getEmailTemplate(userid) {
    await this.userservice.getEmailData(userid).then(
      data => {
        this.email_templates = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getWhatsappTemplate(userid) {
    await this.userservice.getSmsData(userid).then(
      data => {
        this.whatsapp_templates = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async getamount() {
    var price = this.addForm.controls['price'].value;
    if (price > 0) {
      var actual_qty = this.addForm.controls['actual_qty'].value;

      var p_amount = price;
      if (actual_qty > 0) {
        p_amount = price * actual_qty;
      }
      this.addForm.controls['amount'].setValue(p_amount);
    } else {
      this.addForm.controls['amount'].setValue(0);
    }

  }

  async getSmsTemplate(userid) {
    await this.userservice.getSmsData(userid).then(
      data => {
        this.sms_templates = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }


  /*thumbnailfileupload() {
    this.progress = 1;
    let data: any = Object.assign(this.addForm.value);

    if (this.form.invalid == true) {
      return;
    } else {
      //console.log(data)
      this.progressbar = true;
      let fdata = new FormData();
      let fileItem = data.thumbnailfile._files[0];
      fdata.append('thumbnail', fileItem);
      fdata.append('userid', data.userid);
      this.productservice.uploadthumbnailfile(fdata).then(
        (data) => {
          this.progressbar = false;
          this.progress = 100;
          this._snackBar.open('Sound file upload successfully', '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Add' });

        });
    }
  }*/

  onUploadHeaderImage() {
    const fileUpload = document.getElementById('fileupload') as HTMLInputElement;
    fileUpload.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          formData.append('thumbnail', headerinputEl.files.item(0));
          this.thumbnailfile = headerinputEl.files.item(0).name;
          if (this.thumbnailfile && (this.thumbnailfile != '' || this.thumbnailfile != 'null')) {
            let data: any = Object.assign(this.addForm.value);
            this.productservice.uploadthumbnailfile(formData).then(
              (tdata) => {
                this.progressbar = false;
                this.progress = 100;
                //data.thimage = tdata['data'];
                this.image = tdata['data'];
              });
          }
        }
      }
      //let data: any = Object.assign(this.addForm.value);
      this.formdata = formData;
      // console.log(data);
    };

    fileUpload.click();
  }

  onUploadDocs() {
    const fileDoc = document.getElementById('filedoc') as HTMLInputElement;
    fileDoc.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#filedoc')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        console.log(headerinputEl.files.item(0));
        if (fileCount1 > 0) {
          formData.append('documentfile', headerinputEl.files.item(0));
            this.productservice.uploadProductDocFile(formData).then(
              (tdata) => {
                this.progressbar = false;
                this.progress = 100;
                //data.thimage = tdata['data'];
                this.document = tdata['data'];
              });
        }
      }
      //let data: any = Object.assign(this.addForm.value);
      this.formdata = formData;
      // console.log(data);
    };

    fileDoc.click();
  }


  async submit() {
    this.submitted = true;
    let data: any = Object.assign(this.addForm.value);

    if (this.addForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value);
      data.thimage = this.image;
      data.document = this.document;
      // var item_code = await this.itemCodeGenerator(5);

      // data['item_code'] = item_code;







      if (this.data != '' && this.data != null && this.data.action != 'add' && this.data.action != 'WAdd') {

        data.product_thumbnail = this.data.product_thumbnail;
        data.product_document = this.data.product_document;

        // this.erpservice.update_Item(data).then(
        //   data => {
        //     this._snackBar.open(data['data'], '', {
        //             duration: 2000, verticalPosition: 'top'
        //           });
        //           this.dialogRef.close({ event: 'Add' });

        //   },
        //   err => {
        //     console.log('error');
        //   }
        // );
        //console.log(data);
        this.productservice.updateProduct(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.productservice.saveProduct(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
          },
          err => {
            console.log('error');
          }
        );

        // this.erpservice.create_Item(data).then(
        //   data => {
        //     this._snackBar.open(data['data'], '', {
        //             duration: 2000, verticalPosition: 'top'
        //           });
        //           this.dialogRef.close({ event: 'Add' });

        //   },
        //   err => {
        //     console.log('error');
        //   }
        // );

      }

    }
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    width: '100%',
    minHeight: '100px',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  // async itemCodeGenerator(length) {
  //   var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   var result = '';
  //   for (var i = 0; i < length; i++) {
  //     result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  //   }
  //   return result;
  // }

  async deleteData(cont_id) {
    await this.productservice.deleteproduct(cont_id).then(data => {
      if (data) {
        this.toastr.success('Delete succesfully.');
        this.dialogRef.close({ event: 'Delete' });
      }
    },
      err => {
        console.log('error' + err);
      })
  }
  removeimage() {
    if (confirm('Are your sure to delete image?')) {

      this.image = '';
      this.thumbnailfile = '';
      let data: any = Object.assign(this.addForm.value);
      data.thimage = null;

    }
  }
  removedoc() {
    if (confirm('Are your sure to delete document?')) {
      this.document = '';
      let data: any = Object.assign(this.addForm.value);
      data.document = null;

    }
  }
}
