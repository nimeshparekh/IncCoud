import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { TemplateService } from '../../template.service';
import { CreateEmailTemplateComponent } from '../create-email-template/create-email-template.component';
import { Router } from "@angular/router";
import { CopySendEmailComponent } from '../copy-send-email/copy-send-email.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css']
})
export class EmailTemplateComponent implements OnInit {


  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'email_title', 'email_subject', 'action'];
  Length = 0;
  isLoading = true;
  kyc;
  constructor(private userservice: UserService, public dialog: MatDialog, private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getEmailData(userid);
  }
  async getEmailData(id) {
    await this.userservice.getEmailData(id).then(
      data => {
        console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateEmailTemplateComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getEmailData(userid);
      }
    });
  }

  DuplicateTemplate(id): void {
    const dialogRef = this.dialog.open(CopySendEmailComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      var userid = localStorage.getItem('access_id');
      this.getEmailData(userid);
    });
  }

  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateEmailTemplateComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getEmailData(userid);
      }
    });
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateEmailTemplateComponent, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        var userid = localStorage.getItem('access_id');
        this.getEmailData(userid);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

        } else {
          this.router.navigate(['/kyc-document-upload']);
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  replacevariable(id): void {
    const dialogRef = this.dialog.open(EmailMessageVariables, {
      width: '600px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getEmailData(userid);
      }
    });
  }

}

@Component({
  selector: 'app-email-message-variable',
  templateUrl: './message-variables.component.html',
  styleUrls: ['./email-template.component.css']
})
export class EmailMessageVariables implements OnInit {


  emailid = this.data;
  submitted = false;
  public addForm: FormGroup;
  msgcharcnt = 0
  msgcredit = 1;
  msgunicode = false
  chartxt = 'characters.'
  svariablemode = false;
  dvariablemode = false;
  originalmsg = '';
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
  dvar1=false;
  dvar2=false;
  dvar3=false;
  dvar4=false;
  dvar5=false;
  svar1=false;
  svar2=false;
  constructor(
    public dialogRef: MatDialogRef<EmailMessageVariables>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private TemplateService: TemplateService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      email_id: [this.data],
      email_description: [null, [Validators.required]],
      email_subject: [null, [Validators.required]],
      sub_var1: [null],
      sub_var2: [null],
      desc_var1: [null],
      desc_var2: [null],
      desc_var3: [null],
      desc_var4: [null],
      desc_var5: [null],
    });
    this.getDetail();
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value);
      
      if (this.data != '' && this.data != null) {
        this.TemplateService.updatemailvariablesData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
            this.submitted = false;
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }
  getDetail() {
    this.TemplateService.getEmailTemplate(this.data).then(
      data => {
        this.addForm = this.fb.group({
          email_id: [this.data],
          email_description: [data['data'][0].email_html, [Validators.required]],
          email_subject: [data['data'][0].email_subject, [Validators.required]],
          sub_var1: [data['data'][0].sub_var1],
          sub_var2: [data['data'][0].sub_var2],
          desc_var1: [data['data'][0].desc_var1],
          desc_var2: [data['data'][0].desc_var2],
          desc_var3: [data['data'][0].desc_var3],
          desc_var4: [data['data'][0].desc_var4],
          desc_var5: [data['data'][0].desc_var5],
        }); 
        var subject = data['data'][0].email_subject;
        var description = data['data'][0].email_html;
        if(subject.includes("{#var1#}")||subject.includes("{#var2#}")){
          this.svariablemode=true;
        } else{
          this.svariablemode=false;
        } 
        if(description.includes("{#var1#}")||description.includes("{#var2#}")||description.includes("{#var3#}")||description.includes("{#var4#}")||description.includes("{#var5#}")){
          this.dvariablemode=true;
        } else{
          this.dvariablemode=false;
        } 
        if(subject.includes("{#var1#}")){
          this.svar1=true;
        } else{
          this.svar1=false;
          this.addForm.get("sub_var1").setValue(null);
        } 
        if(subject.includes("{#var2#}")){
          this.svar2=true;
        } else{
          this.svar2=false;
          this.addForm.get("sub_var2").setValue(null);
        } 
        if(description.includes("{#var1#}")){
          this.dvar1=true;
        } else{
          this.dvar1=false;
          this.addForm.get("desc_var1").setValue(null);
        } 
        if(description.includes("{#var2#}")){
          this.dvar2=true;
        } else{
          this.dvar2=false;
          this.addForm.get("desc_var2").setValue(null);
        } 
        if(description.includes("{#var3#}")){
          this.dvar3=true;
        } else{
          this.dvar3=false;
          this.addForm.get("desc_var3").setValue(null);
        } 
        if(description.includes("{#var4#}")){
          this.dvar4=true;
        } else{
          this.dvar4=false;
          this.addForm.get("desc_var4").setValue(null);
        } 
        if(description.includes("{#var5#}")){
          this.dvar5=true;
        } else{
          this.dvar5=false;
          this.addForm.get("desc_var5").setValue(null);
        } 
      },
      err => {
        console.log('error');
      })
  }
  replacevar1(value) {
    console.log(value);
    var msg = this.originalmsg;
    msg = msg.replace("{#var1#}", value);
    if (this.addForm.value.var2) {
      msg = msg.replace("{#var2#}", this.addForm.value.var2);
    }
    if (this.addForm.value.var3) {
      msg = msg.replace("{#var3#}", this.addForm.value.var3);
    }
    if (this.addForm.value.var4) {
      msg = msg.replace("{#var4#}", this.addForm.value.var4);
    }
    if (this.addForm.value.var5) {
      msg = msg.replace("{#var5#}", this.addForm.value.var5);
    }
    this.addForm.get("sms_text").setValue(msg);
  }
  replacevar2(value) {
    var msg = this.originalmsg;
    if (this.addForm.value.var1) {
      msg = msg.replace("{#var1#}", this.addForm.value.var1);
    }
    msg = msg.replace("{#var2#}", value);
    if (this.addForm.value.var3) {
      msg = msg.replace("{#var3#}", this.addForm.value.var3);
    }
    if (this.addForm.value.var4) {
      msg = msg.replace("{#var4#}", this.addForm.value.var4);
    }
    if (this.addForm.value.var5) {
      msg = msg.replace("{#var5#}", this.addForm.value.var5);
    }
    this.addForm.get("sms_text").setValue(msg);
  }
  replacevar3(value) {
    var msg = this.originalmsg;
    if (this.addForm.value.var1) {
      msg = msg.replace("{#var1#}", this.addForm.value.var1);
    }
    if (this.addForm.value.var2) {
      msg = msg.replace("{#var2#}", this.addForm.value.var2);
    }
    msg = msg.replace("{#var3#}", value);
    if (this.addForm.value.var4) {
      msg = msg.replace("{#var4#}", this.addForm.value.var4);
    }
    if (this.addForm.value.var5) {
      msg = msg.replace("{#var5#}", this.addForm.value.var5);
    }
    this.addForm.get("sms_text").setValue(msg);
  }
  replacevar4(value) {
    var msg = this.originalmsg;
    if (this.addForm.value.var1) {
      msg = msg.replace("{#var1#}", this.addForm.value.var1);
    }
    if (this.addForm.value.var2) {
      msg = msg.replace("{#var2#}", this.addForm.value.var2);
    }
    if (this.addForm.value.var3) {
      msg = msg.replace("{#var3#}", this.addForm.value.var3);
    }
    msg = msg.replace("{#var4#}", value);
    if (this.addForm.value.var5) {
      msg = msg.replace("{#var5#}", this.addForm.value.var5);
    }
    this.addForm.get("sms_text").setValue(msg);
  }
  replacevar5(value) {
    var msg = this.originalmsg;
    if (this.addForm.value.var1) {
      msg = msg.replace("{#var1#}", this.addForm.value.var1);
    }
    if (this.addForm.value.var2) {
      msg = msg.replace("{#var2#}", this.addForm.value.var2);
    }
    if (this.addForm.value.var3) {
      msg = msg.replace("{#var3#}", this.addForm.value.var3);
    }
    if (this.addForm.value.var4) {
      msg = msg.replace("{#var4#}", this.addForm.value.var4);
    }
    msg = msg.replace("{#var5#}", value);

    this.addForm.get("sms_text").setValue(msg);
  }

}

