import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErpService } from './../../erp.service';
import { TemplateService } from './../../template.service';

@Component({
  selector: 'app-share-whatsapp',
  templateUrl: './share-whatsapp.component.html',
  styleUrls: ['./share-whatsapp.component.css']
})
export class ShareWhatsappComponent implements OnInit {
  public wpform: FormGroup;
  whatsapptemplate = [];
  show_no_id=this.data.show_no_id;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ShareWhatsappComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private authService: ErpService,
    private tempService: TemplateService
  ) { }

  ngOnInit(): void {
    var mobile = this.data.callernumber;
    console.log('show_no_id::'+this.data.show_no_id);
    mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
    // mobile = (mobile.length == 11 || mobile.length == 12) ? mobile : mobile
    mobile = mobile.substr(-10)
    if(localStorage.getItem('access_id')=="2656"){
      mobile = mobile
    }else{
      mobile = '+91' + mobile
    }   
    this.wpform = this.fb.group({
      mobile: [mobile],
      message: [null],
      email_tempid: [null]
    });
    this.getTempData(localStorage.getItem('access_id'));
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  sendtowhatsapp() {
    this.authService.getAccessSettingByName(localStorage.getItem('access_id'), 'sent_whatsupmsg_by').then(
      data => {
        if (data['data']) {
          if (data['data']['setting_value'] == '1') {
            let formdata: any = Object.assign(this.wpform.value);
            //if(this.data.lead_id){
              formdata.lead_id = this.data.lead_id
            //} 
            //if(this.data.cdrid){
              formdata.cdrid = this.data.cdrid
           // }             
            
            this.authService.sentMsgByWhatsupAPI(formdata).then(
              data => {
                this.dialogRef.close();
                this._snackBar.open(data['msg'], '', {
                  duration: 2000, verticalPosition: 'top'
                });
              }
            )
          } else {
            let data: any = Object.assign(this.wpform.value);
            window.open("http://api.whatsapp.com/send?phone=" + data.mobile + "&text=" + data.message)
            //if(this.data.lead_id){
              data.lead_id = this.data.lead_id
            //} 
            //if(this.data.cdrid){
              data.cdrid = this.data.cdrid
            //}                  
            data.mobile = this.data.callernumber
            this.authService.save_whatsapp(data).then(
              data => {
                this.dialogRef.close();
                this._snackBar.open(data['msg'], '', {
                  duration: 2000, verticalPosition: 'top'
                });
              },
              err => {
                console.log('error');
              }
            );
          }
        } else {
          let data: any = Object.assign(this.wpform.value);
          window.open("http://api.whatsapp.com/send?phone=" + data.mobile + "&text=" + data.message)
          //if(this.data.lead_id){
            data.lead_id = this.data.lead_id
          //} 
          //if(this.data.cdrid){
            data.cdrid = this.data.cdrid
          //}                    
          data.mobile = this.data.callernumber
          this.authService.save_whatsapp(data).then(
            data => {
              this.dialogRef.close();
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
            },
            err => {
              console.log('error');
            }
          );
        }
      },
      err => {
        console.log('error');
      }
    );

    // console.log(data);

  }
  async getTempData(id) {//console.log("HII");
    await this.tempService.getWhatsappTemplateData(id).then(
      data => {
        //console.log('email::'+JSON.stringify(data['data']));
        this.whatsapptemplate = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  getTemplateDetail(id) {
    this.tempService.getWhatsappTemplate(id).then(
      data => {
        var regex = /(&nbsp;|<([^>]+)>)/ig;
        var body = data['data'][0].wtemp_description;
        var result = body.replace(regex, "");
        this.wpform.get('message').setValue(result);
      },
      err => {

      }
    );
  }
}
