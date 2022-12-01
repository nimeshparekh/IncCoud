import { Component, OnInit,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from "../../user.service";
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-call-transfer',
  templateUrl: './call-transfer.component.html',
  styleUrls: ['./call-transfer.component.css']
})
export class CallTransferComponent implements OnInit {
  allagentlist = []
  groupArr=[]
  cdrid = ''
  isvoipenable = false
  constructor(
    public dialogRef: MatDialogRef<CallTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    var voipstatus = localStorage.getItem('voipstatus')
    if (voipstatus == 'true') {
      this.isvoipenable = true
    }
    if(this.data!='' && this.data!=null){
      this.cdrid = this.data.callrefid
      console.log(this.cdrid)
    }
    this.getAllAgents()
    this.getAgentGroupwithPackage()
  }
  closeDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
  async getAllAgents(){
    await this.userservice.getFreeAgents().then(
      data => {
        this.allagentlist = data['data']
      },
      err => {
        console.log('error');
      })
  }
  async getAgentGroupwithPackage() {
    await this.userservice.getAgentGroupwithPackage(0).then(
      data => {
        console.log(data['data']);
        this.groupArr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  conferencecall(cdrid){
    this.userservice.conferencecallwithmanager({cdrid:cdrid}).then(
          data => {
            //console.log(data['msg']);
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
          },
        err => {
          console.log('error');
        }
    );
  }
  transferdtmf(ext){
    //this.basecomponent.sendDtmf(ext)
    this.dialogRef.close({event:'transfer',ext:ext});
  }
}
