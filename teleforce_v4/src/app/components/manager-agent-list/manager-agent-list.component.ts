import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-manager-agent-list',
  templateUrl: './manager-agent-list.component.html',
  styleUrls: ['./manager-agent-list.component.css']
})
export class ManagerAgentListComponent implements OnInit {

  agents = [];
  
  constructor(
    public dialogRef: MatDialogRef<ManagerAgentListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
  ) { }

  ngOnInit(): void {
    this.getManagerAgents(this.data);
  }

  async getManagerAgents(id){
    // console.log(id);   
     await this.userservice.getAgents(id).then(
       data => {
        this.agents = data['data'];
        // this.toastr.success(data['data']);
         //this.dialogRef.close({event:'show'});
       },
       err => {
         console.log('error');
       }
     );
   }

   openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }

}
