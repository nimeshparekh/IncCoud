import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../template.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mail-composer',
  templateUrl: './mail-composer.component.html',
  styleUrls: ['./mail-composer.component.css']
})
export class MailComposerComponent implements OnInit {
  emailId = this.route_a.snapshot.paramMap.get('id');

  savejson = {}
  form: FormGroup;
  addmode = true;
  editmode = false;
  deletemode = false;
  submitted = false;
  name;
  public addForm: FormGroup;
  imgpreview = '';
  imgfile = false;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    uploadUrl: 'http://localhost:3000/api/default/upload',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote'
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1'
      }
    ]
  };


  constructor(private el: ElementRef, private route: ActivatedRoute, private toastr: ToastrService, private router: Router, private route_a: ActivatedRoute, private fb: FormBuilder, private _snackBar: MatSnackBar, private TemplateService: TemplateService) { }


  ngOnInit(): void {


    let userid = localStorage.getItem('access_id');
    var tempid = this.route.snapshot.paramMap.get('id');
    //console.log("Email Id :" + tempid);
    if (tempid != '' && tempid != null) {
      this.addForm = this.fb.group({
        account_id: [userid],
        name: [null, [Validators.required]],
        email_subject: [null, [Validators.required]],
        isschedulemeeting: [null],
        email_html: [null],
      });
      this.TemplateService.getEmailTemplate(tempid).then(
        data => {
          if (data['data'][0].attach_file) {
            this.imgpreview = data['data'][0].attach_file;
            var filextension = this.imgpreview.split('.').pop();
            if (filextension == 'jpg' || filextension == 'jpeg' || filextension == 'png') {
              this.imgfile = true;
            } else {
              this.imgfile = false;
            }
          }

          this.addForm.get("name").setValue(data['data'][0].email_title);
          if (data['data'][0].isschedulemeeting == 1) {
            this.addForm.get("isschedulemeeting").setValue(true);
          } else {
            this.addForm.get("isschedulemeeting").setValue(false);
          }

          this.addForm.get("email_subject").setValue(data['data'][0].email_subject);
          //if(data['data'][0].email_html!='null' || data['data'][0].email_html!=''){
          this.addForm.get("email_html").setValue(data['data'][0].email_html);
          //}

          //this.addForm.controls['name'].setValue(data['data'][0].name);
        },
        err => {
          console.log('error');
        })

    }

    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      email_subject: [null, [Validators.required]],
      email_html: [null],
      email_design: [null],
      account_id: [userid],
      isschedulemeeting: [null],
    });

  }


  exportHtml() {
    console.log("control goes here !!");
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {

      let tempdata: any = Object.assign(this.addForm.value);


      if (this.emailId && parseInt(this.emailId) > 0) {
        console.log("A");
        tempdata['emailid'] = this.emailId;
        let kycformData = new FormData();
        kycformData.append('account_id', tempdata.account_id);
        kycformData.append('emailid', this.emailId);
        kycformData.append('name', tempdata.name);
        kycformData.append('email_subject', tempdata.email_subject);
        kycformData.append('email_html', tempdata.email_html);
        kycformData.append('email_image', this.imgpreview);
        kycformData.append('isschedulemeeting', tempdata.isschedulemeeting);
        // kycformData.append('kyc_id', this.kycid);
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#attach_file')
        if (inputEl) {
          let fileCount1: number = inputEl.files.length;
          if (fileCount1 > 0) {
            kycformData.append('attach_file', inputEl.files.item(0));
          }
        }
        // console.log((kycformData));
        this.TemplateService.updateEmailTemplate(kycformData).then(
          data => {
            this.toastr.success('Template updated successfully.');
            const path = '/email-template';
            this.router.navigate([path]);
          },
          err => {
            console.log('error');
          }
        );
      } else {
        let kycformData = new FormData();
        kycformData.append('account_id', tempdata.account_id);
        kycformData.append('name', tempdata.name);
        kycformData.append('email_subject', tempdata.email_subject);
        kycformData.append('email_html', tempdata.email_html);
        kycformData.append('email_image', this.imgpreview);
        kycformData.append('isschedulemeeting', tempdata.isschedulemeeting);
        // kycformData.append('kyc_id', this.kycid);
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#attach_file')
        if (inputEl) {
          let fileCount1: number = inputEl.files.length;
          if (fileCount1 > 0) {
            kycformData.append('attach_file', inputEl.files.item(0));
          }
        }
        //console.log(tempdata);
        this.TemplateService.saveEmailTemplate(kycformData).then(
          data => {
            this.toastr.success('Template saved successfully.');
            const path = '/email-template';
            this.router.navigate([path]);
          },
          err => {
            console.log('error');
          }
        );
      }


    }
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

}
