import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-call-recording-list',
  templateUrl: './call-recording-list.component.html',
  styleUrls: ['./call-recording-list.component.css']
})
export class CallRecordingListComponent implements OnInit {
  audioid = '';
  agentid = '';
  public addForm: FormGroup;
  reviewform;
  reviews: FormArray;
  reviewrate = [];
  reviewratelength = 0;
  role;
  managerid = 0
  constructor(public dialogRef: MatDialogRef<CallRecordingListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private userservice: UserService) { }

  ngOnInit(): void {
    //console.log(localStorage);
    var userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      console.log(this.data)
      this.audioid = this.data.recpath
      this.getCdrDetail(this.data.id);
      this.getForm(userid);
      this.getAgentDetail(userid);
      this.addForm = this.fb.group({
        account_id: [userid],
        cdrid: [this.data.id],
        audio_id: [this.audioid],
        agent_id: [this.agentid],
        reviews: this.fb.array([])
      });

    }
    //console.log(this.reviews);
  }
  cancelDialog(): void {
    this.dialog.closeAll();
  }
  async getAgentDetail(agentid) {
    await this.userservice.getAgentDatail(agentid).then(
      data => {
        this.role = data['data'].account_type
        this.managerid = data['data'].created_by
      },
      err => {
        console.log('error');
      })
  }
  
  getCdrDetail(cdrid) {
    this.userservice.getcdrdetail(cdrid).then(
      data => {
        //console.log(data['data'][0].RecPath)
        this.agentid= data['data'][0].AgentID;
        this.addForm.get('agent_id').setValue(data['data'][0].AgentID)
      },
      err => {
        console.log('error');
      }
    );
    //console.log();
  }
  saverate(id, value) {
    var reviews = this.reviews.value;
    if(this.reviewratelength==0){
      for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].formid == id) {
          reviews[i].rate = value;
        }
      }
    }else{
      this.reviews = this.addForm.get('reviews') as FormArray;
        this.reviews.push(this.fb.group({
          formid: id,
          rate: value,
        }));
    }    
    console.log(reviews);
  }

  submit(event: any) {
    let data: any = Object.assign(this.addForm.value);
    console.log(data);
    this.userservice.saveReviewRate(data).then(
      data => {

        this._snackBar.open(data['msg'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.dialogRef.close({ event: 'Update' });

      },
      err => {
        console.log('error');
      }
    );
    //console.log();
  }

  async getForm(userid) {
    await this.userservice.getCallReviewForm(userid).then(
      data1 => {
        //console.log(data['data']);
        this.reviewform = data1['data'];
        this.addForm = this.fb.group({
          account_id: [userid],
          cdrid: [this.data.id],
          audio_id: [this.audioid],
          agent_id: [this.agentid],
          reviews: this.fb.array([])
        });
        this.getreviewrate(this.data.id);
      },
      err => {
        console.log('error');
      }
    );
  }

  async getreviewrate(cdrid) {
    await this.userservice.getReviewRate(cdrid).then(
      data => {
        this.reviewrate = (data['data']);
        this.reviewratelength = data['data'].length;
        if (this.reviewratelength > 0) {
          this.reviews = this.addForm.get('reviews') as FormArray;
          for (var i = 0; i < this.reviewrate.length; i++) {
            this.reviews.push(this.fb.group({
              formid: this.reviewrate[i].review_formid,
              rate: this.reviewrate[i].review_rate,
            }));
          }
        } else {
          var reviewArr = this.reviewform;
          this.reviews = this.addForm.get('reviews') as FormArray;
          for (var i = 0; i < reviewArr.length; i++) {
            this.reviews.push(this.fb.group({
              formid: reviewArr[i].form_id,
              rate: 0,
            }));
          }
          console.log(this.reviews);
        }

      },
      err => {
        console.log('error');
      }
    );
  }


}
