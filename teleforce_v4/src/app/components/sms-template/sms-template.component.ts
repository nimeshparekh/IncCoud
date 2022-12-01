
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { SmscampaignService } from '../../smscampaign.service';
import { CreateSmsTemplateComponent } from '../create-sms-template/create-sms-template.component';
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsTemplateComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'sms_title', 'sms_text', 'status', 'action'];
  Length = 0;
  isLoading = true;
  kyc;
  constructor(private userservice: UserService,
    public dialog: MatDialog, private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getSmsData(userid);
  }
  async getSmsData(id) {
    await this.userservice.getSmsData(id).then(
      data => {
        // console.log(data['data']);
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
    const dialogRef = this.dialog.open(CreateSmsTemplateComponent, {
      width: '340px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getSmsData(userid);
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateSmsTemplateComponent, {
      width: '340px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getSmsData(userid);
      }
    });
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateSmsTemplateComponent, {
      width: '340px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        var userid = localStorage.getItem('access_id');
        this.getSmsData(userid);
      }
    });
  }

  replacevariable(id): void {
    const dialogRef = this.dialog.open(SmsMessageVariables, {
      width: '600px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getSmsData(userid);
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

}


@Component({
  selector: 'app-sms-message-variable',
  templateUrl: './message-variables.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsMessageVariables implements OnInit {


  smsid = this.data;
  submitted = false;
  public addForm: FormGroup;
  msgcharcnt = 0
  msgcredit = 1;
  msgunicode = false
  chartxt = 'characters.'
  variablemode = false;
  originalmsg = '';
  var1 = false;
  var2 = false;
  var3 = false;
  var4 = false;
  var5 = false;
  customvar1 = false;
  customvar2 = false;
  customvar3 = false;
  customvar4 = false;
  customvar5 = false;
  formsmode=false;
  linkmode=false;
  formsdata = [];
  smslinks=[];
  constructor(
    public dialogRef: MatDialogRef<SmsMessageVariables>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private smscampaignservice :SmscampaignService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      sms_id: [this.data],
      sms_text: [null, [Validators.required]],
      var1: [null],
      var2: [null],
      var3: [null],
      var4: [null],
      var5: [null],
      formdata: [''],
      link: [''],
      customvar1: [null],
      customvar2: [null],
      customvar3: [null],
      customvar4: [null],
      customvar5: [null],
    });
    this.getsmsDetail();     
    this.link_list();
    this.getFormsData();
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
      data.msg_length = this.msgcharcnt;
      if (this.msgunicode == true) {
        data.msg_limit = 70;
      } else {
        data.msg_limit = 160;
      }
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.userservice.updatesmsvariablesData(data).then(
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
  getsmsDetail() {
    this.userservice.getsmsDetail(this.data).then(
      data => {
        // console.log(data);
        this.addForm = this.fb.group({
          sms_text: [data['data'][0].sms_text, [Validators.required]],
          sms_id: [data['data'][0].sms_id],
          var1: [data['data'][0].var1],
          var2: [data['data'][0].var2],
          var3: [data['data'][0].var3],
          var4: [data['data'][0].var4],
          var5: [data['data'][0].var5],
          customvar1: [data['data'][0].customvar1],
          customvar2: [data['data'][0].customvar2],
          customvar3: [data['data'][0].customvar3],
          customvar4: [data['data'][0].customvar4],
          customvar5: [data['data'][0].customvar5],
          formdata: [data['data'][0].form_id],
          link: [data['data'][0].link_id],
        });
        this.originalmsg = data['data'][0].sms_text;
        this.var1 = this.originalmsg.includes("{#var1#}");
        this.var2 = this.originalmsg.includes("{#var2#}");
        this.var3 = this.originalmsg.includes("{#var3#}");
        this.var4 = this.originalmsg.includes("{#var4#}");
        this.var5 = this.originalmsg.includes("{#var5#}");
        this.countcharacter();
        if (this.originalmsg.includes("{#var1#}") || this.originalmsg.includes("{#var2#}") || this.originalmsg.includes("{#var3#}") || this.originalmsg.includes("{#var4#}") || this.originalmsg.includes("{#var5#}")) {
          this.variablemode = true;
        }
        if(data['data'][0].var1){
          this.changevar1(data['data'][0].var1);
        }
        if(data['data'][0].var2){
          this.changevar2(data['data'][0].var2);
        }
        if(data['data'][0].var3){
          this.changevar3(data['data'][0].var3);
        }
        if(data['data'][0].var4){
          this.changevar4(data['data'][0].var4);
        }
        if(data['data'][0].var5){
          this.changevar5(data['data'][0].var5);
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  countcharacter() {
    // console.log(this.containsNonLatinCodepoints(this.addForm.value.sms_text))
    let data: any = Object.assign(this.addForm.value);
    var msg = data.sms_text;
    msg = new String(msg);
    // console.log(msg);
    this.msgcharcnt = msg.length
    if (this.containsNonLatinCodepoints(msg)) {
      this.msgunicode = true
      this.chartxt = "unicode characters."
      if (this.msgcharcnt > 70 && this.msgcharcnt < 135) {
        this.msgcredit = 2
      }
      if (this.msgcharcnt > 134 && this.msgcharcnt < 202) {
        this.msgcredit = 3
      }
      if (this.msgcharcnt > 201) {
        this.msgcredit = 4
      }
      if (this.msgcharcnt < 71) {
        this.msgcredit = 1
      }
    } else {
      this.msgunicode = false
      this.chartxt = "characters."
      if (this.msgcharcnt > 160 && this.msgcharcnt < 307) {
        this.msgcredit = 2
      }
      if (this.msgcharcnt > 306 && this.msgcharcnt < 460) {
        this.msgcredit = 3
      }
      if (this.msgcharcnt < 161) {
        this.msgcredit = 1
      }
    }
  }
  containsNonLatinCodepoints(s) {
    return /[^\u0000-\u00ff]/.test(s);
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
    this.countcharacter();
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
    this.countcharacter();
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
    this.countcharacter();
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
    this.countcharacter();
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
    this.countcharacter();
  }

  async getFormsData() {
    await this.userservice.getFormsData().then(
      data => {
        console.log(data['data']);
        this.formsdata = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }
  async link_list() {
    await this.smscampaignservice.getSMSLinkList(localStorage.getItem("access_id")).then(data => {
      if (data) {
        this.smslinks = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  changevar1(value){    
    if(value=='custom'){
      this.customvar1=true;
      this.formsmode=false;
      this.linkmode = false;
    }else if(value=='form'){
      this.formsmode=true;
      this.customvar1=false;
      this.linkmode = false;
    }else if(value=='link'){
      this.formsmode=false;
      this.customvar1=false;
      this.linkmode = true;
    }else{
      this.customvar1=false;
      this.formsmode=false;
      this.linkmode = false;
      this.addForm.get("customvar1").setValue("");
    } 
  }
  changevar2(value){
    if(value=='custom'){
      this.customvar2=true;
      this.linkmode = false;
      this.formsmode=false;
    } else if(value=='form'){
        this.formsmode=true;
        this.customvar2=false;
        this.linkmode = false;
      }else if(value=='link'){
        this.formsmode=false;
        this.customvar2=false;
        this.linkmode = true;
    }else{
      this.customvar2=false;
      this.linkmode = false;
      this.formsmode=false;
      this.addForm.get("customvar2").setValue("");
    }
  }
  changevar3(value){
    if(value=='custom'){
      this.customvar3=true;
    }else{
      this.customvar3=false;
      this.addForm.get("customvar3").setValue("");
    }
  }
  changevar4(value){
    if(value=='custom'){
      this.customvar4=true;
    }else{
      this.customvar4=false;
      this.addForm.get("customvar4").setValue("");
    }
    
  }
  changevar5(value){
    if(value=='custom'){
      this.customvar5=true;
    }else{
      this.customvar5=false;
      this.addForm.get("customvar5").setValue("");
    }
  }

}
