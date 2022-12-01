import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';


@Component({
  selector: 'app-conference-detail',
  templateUrl: './conference-detail.component.html',
  styleUrls: ['./conference-detail.component.css']
})
export class ConferenceDetailComponent implements OnInit {

  name='';
  date='';
  membertype='';
  did='';
  members = [];

  constructor(
    public dialogRef: MatDialogRef<ConferenceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice:  UserService
  ) { }

  ngOnInit(): void {
    this.getConferenceCallDetail(this.data);
    this.getConferenceMembers(this.data);
  }

  async getConferenceCallDetail(id) {
    await this.userservice.getConferenceCallDetail(id).then(
      data => {
        this.name = data['data'].conf_name;       
        this.date = data['data'].conf_date; 
        this.did = data['data'].conf_did; 
        this.membertype = data['data'].conf_membertype;      
      },
      err => {
        console.log('error');
      }
    );
  }

  async getConferenceMembers(id) {
    await this.userservice.getConferenceMembers(id).then(
      data => {
        this.members = data['data'];     
      },
      err => {
        console.log('error');
      }
    );
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
