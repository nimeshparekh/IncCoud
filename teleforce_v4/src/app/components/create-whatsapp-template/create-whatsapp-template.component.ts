import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../template.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-whatsapp-template',
  templateUrl: './create-whatsapp-template.component.html',
  styleUrls: ['./create-whatsapp-template.component.css']
})

export class CreateWhatsappTemplateComponent implements OnInit {
  emailId = this.route_a.snapshot.paramMap.get('id');
  form: FormGroup;
  addmode = true;
  editmode = false;
  deletemode = false;
  submitted = false;
  name;
  public addForm: FormGroup;
  imgpreview = '';
  imgfile = false;
  isDisabled=false;
  isLoading=false;
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
      this.TemplateService.getWhatsappTemplate(tempid).then(
        data => {
          if (data['data']) {
            if (data['data'][0].attach_file) {
              this.imgpreview = data['data'][0].attach_file;
              var filextension = this.imgpreview.split('.').pop();
              if (filextension == 'jpg' || filextension == 'jpeg' || filextension == 'png') {
                this.imgfile = true;
              } else {
                this.imgfile = false;
              }
            }
            this.addForm.get("name").setValue(data['data'][0].wtemp_title);
            if (data['data'][0].isschedulemeeting == 1) {
              this.addForm.get("isschedulemeeting").setValue(true);
            } else {
              this.addForm.get("isschedulemeeting").setValue(false);
            }
            this.addForm.get("description").setValue(data['data'][0].wtemp_description);
          }
        },
        err => {
          console.log('error');
        })

    }

    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
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
      this.isDisabled=true;
      this.isLoading=true;
      let tempdata: any = Object.assign(this.addForm.value);


      if (this.emailId && parseInt(this.emailId) > 0) {
        console.log("A");
        tempdata['emailid'] = this.emailId;
        let kycformData = new FormData();
        kycformData.append('account_id', tempdata.account_id);
        kycformData.append('id', this.emailId);
        kycformData.append('name', tempdata.name);
        kycformData.append('description', tempdata.description);
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
        this.TemplateService.updateWhatsappTemplate(kycformData).then(
          data => {
            this.toastr.success('Template updated successfully.');
            this.isDisabled=false;
            this.isLoading=false;
            const path = '/whatsapp-template';
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
        kycformData.append('description', tempdata.description);
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
        this.TemplateService.saveWhatsappTemplate(kycformData).then(
          data => {
            this.toastr.success('Template saved successfully.');
            this.isDisabled=false;
            this.isLoading=false;
            const path = '/whatsapp-template';
            this.router.navigate([path]);
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }


}
