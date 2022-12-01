import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-header-footer-set',
  templateUrl: './header-footer-set.component.html',
  styleUrls: ['./header-footer-set.component.css']
})
export class HeaderFooterSetComponent implements OnInit {

  headerimg = '';
  footerimg = '';
  setting = [];
  public addForm: FormGroup;
  isLoding1=false;
  isLoding2=false;
  constructor(
    private el: ElementRef,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem("access_id");
    this.addForm = this.fb.group({
      header_html: [null],
      footer_html: [null],
      letter_head: [null],
      account_id: [userid]
    });
    this.getSetting();
  }

  getSetting() {
    var userid = localStorage.getItem("access_id");
    this.userservice.getHeaderFooterSetting(userid).then(
      data => {
        
        this.setting = (data['data']);
        this.addForm = this.fb.group({
          header_html: [data['data'].header_html],
          footer_html: [data['data'].footer_html],
          letter_head: [data['data'].letter_head],
          account_id: [userid]
        });
        this.headerimg = data['data'].header_image;
        this.footerimg = data['data'].footer_image;
      },
      err => {
        console.log('error');
      })
  }


  onUploadHeaderImage() {
    this.isLoding1=true;
    const fileUpload = document.getElementById('fileupload') as HTMLInputElement;
    fileUpload.onchange = () => {
      let kycformData = new FormData();
      var userid = localStorage.getItem('access_id');
      kycformData.append('account_id', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          kycformData.append('header_image', headerinputEl.files.item(0));
        }
      }
      console.log(kycformData);
      this.userservice.uploadHeaderImage(kycformData).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open('Header image upload successfully!!', '', {
            duration: 2000, verticalPosition: 'top'
          })
          this.headerimg = (data['data']);

          this.isLoding1=false;
        },
        err => {
          console.log('error');
        })
    };

    fileUpload.click();
  }
  onUploadFooterImage() {
    this.isLoding2=true;
    const fileUpload = document.getElementById('fileupload1') as HTMLInputElement;
    fileUpload.onchange = () => {
      let kycformData = new FormData();
      var userid = localStorage.getItem('access_id');
      kycformData.append('account_id', userid);
      let footerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload1')
      if (footerinputEl) {
        let fileCount1: number = footerinputEl.files.length;
        if (fileCount1 > 0) {
          kycformData.append('footer_image', footerinputEl.files.item(0));
        }
      }
      console.log(kycformData);
      this.userservice.uploadFooterImage(kycformData).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open('Footer image upload successfully!!', '', {
            duration: 2000, verticalPosition: 'top'
          })
          this.footerimg = (data['data']);
          this.isLoding2=false;
        },
        err => {
          console.log('error');
        })



    };

    fileUpload.click();
  }
  removeHeaderImage() {
    this.headerimg = '';
    // console.log(array);
  }

  removeFooterImage() {
    this.footerimg = '';
  }



  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],

  };

  submit() {
    let data: any = Object.assign(this.addForm.value);
    data.header_image = this.headerimg;
    data.footer_image = this.footerimg;
    //console.log(data);
    this.userservice.saveHeaderFooterSetting(data).then(
      data => {
        //console.log(data['data']);
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        })
        //this.footerimg.push(data['data']);



      },
      err => {
        console.log('error');
      })


  }


}
