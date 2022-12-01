import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {

  mail_template = [];
  isLoading = false;
  ehtml;
  public searchform: FormGroup;
  emailhtml;
  constructor(private userservice: UserService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.getEmailTemplate(userid);

    this.searchform = this.fb.group({
      customer_id: [userid],
      templateid: [''],
      usertype: [''],
    });


  }

  sendEmail() {
    let data: any = Object.assign(this.searchform.value);
    data['email_template'] = this.ehtml;
    this.userservice.sendAdminEmail(data).then(
      data => {
        const path = '/send-email';
            this.router.navigate([path]);
            
        this._snackBar.open("Email sent successfully !", 'Dissmis', {
          duration: 5000,
        });
        
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_template(id) {
    await this.userservice.getEmailTemplateData(id).then(
      data => {
        console.log("render template");
        console.log(data['data'][0].email_html);
        this.emailhtml = this.sanitizer.bypassSecurityTrustHtml(data['data'][0].email_html);
        this.ehtml = data['data'][0].email_html;
      },
      err => {
        console.log('error');
      }
    );
  }

  async getEmailTemplate(userid) {
    await this.userservice.getEmailData(userid).then(
      data => {
        this.mail_template = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
}
