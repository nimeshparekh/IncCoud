import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.css']
})
export class CallHistoryComponent implements OnInit {
  callhistorylist = []
  constructor(
    private fb: FormBuilder,  
    public dialog: MatDialog,  
    public dialogRef: MatDialogRef<CallHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private userservice: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getCallHistory(this.data)
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  async getCallHistory(data){
    await this.userservice.getCallHistoryByMobile(data.mobile).then(
      data => {
        //console.log(this.callhistorylist)
        var callArr = data['data']
        callArr.forEach(element => {
          //console.log(this.callhistorylist)
          //console.log(this.callhistorylist[element.calldate])
          if(this.callhistorylist[element.calldate]==undefined){
            this.callhistorylist[element.calldate] = new Array(element);
          }else{
            this.callhistorylist[element.calldate].push(element)
          } 
        });
        console.log(this.callhistorylist)
        this.callhistorylist.sort();
      },
      err => {
        console.log('error');
      })
  }
}
