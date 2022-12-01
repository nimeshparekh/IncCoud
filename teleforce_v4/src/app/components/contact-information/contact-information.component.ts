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
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.css']
})
export class ContactInformationComponent implements OnInit {
  groupArr=[]
  constructor(
    public dialogRef: MatDialogRef<ContactInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getcontactextrainfo(this.data.callrefid)
  }
  closeDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
  async getcontactextrainfo(id) {
    await this.userservice.getcontactextrainfo(id).then(
      data => {
        console.log(data['data']);
        this.groupArr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
}
