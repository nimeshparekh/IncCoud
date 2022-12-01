import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { ZohoService } from '../../zoho.service';
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-zoho-user-map',
  templateUrl: './zoho-user-map.component.html',
  styleUrls: ['./zoho-user-map.component.css']
})
export class ZohoUserMapComponent implements OnInit {
  feedbackform: FormGroup;
  agents = []
  constructor(
    public dialogRef: MatDialogRef<ZohoUserMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private zohoservice: ZohoService,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,
    private userservice: UserService
  ) { }

  ngOnInit(): void {
    var accountid = localStorage.getItem('access_id');
    this.feedbackform = this.formBuilder.group({
      userid: [this.data.id],
      mapuserid: ['', [Validators.required]],
    });
    this.getAgents(accountid);
    this.getZohoUser(this.data.id);
  }
  async getZohoUser(userid) {
    await this.zohoservice.getZohoUserById(userid).then(
      rs => {
        console.log(rs['data'][0]['mapuser_id'])
        this.feedbackform = this.formBuilder.group({
          userid: [this.data.id],
          mapuserid: [rs['data'][0]['mapuser_id'], [Validators.required]],
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async getAgents(userid) {
    await this.userservice.getAgents(userid).then(
      data => {
        this.agents = data['data']; 
      },
      err => {
        console.log('error');
      }
    );
  }
  submit(){
    if(this.feedbackform.invalid == true)
  	{
      // console.log(form.value);
  		return;
  	}
  	else
  	{
      let data: any = Object.assign(this.feedbackform.value);
      console.log(data)
      this.zohoservice.MapZohoUser(data).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000,verticalPosition: 'top'
          });
          this.dialogRef.close({event:'Update'});
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  CancelDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
}
