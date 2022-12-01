import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { AssignAgentsComponent } from '../assign-agents/assign-agents.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hunt-group-detail',
  templateUrl: './hunt-group-detail.component.html',
  styleUrls: ['./hunt-group-detail.component.css']
})
export class HuntGroupDetailComponent implements OnInit {
  

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'seq_no', 'action' ];
  Length = 0;
  groupid = this.route.snapshot.paramMap.get('id');
  groupname = '';
  isLoading = true;

  constructor(
    private userservice: UserService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;


  ngOnInit(): void {
    this.getAssignedAgents(this.groupid);
    this.dataSource = new MatTableDataSource();
    this.getHuntgroupDetail(this.groupid);
  }
  async getAssignedAgents(groupid) {
    await this.userservice.getAssignedAgents(groupid).then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  Createdialog(): void {
    const dialogRef = this.dialog.open(AssignAgentsComponent, {
      disableClose: true,  data: { action: 'add', id: this.groupid }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getAssignedAgents(this.groupid);
      }
    });
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(AssignAgentsComponent, {
     disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getAssignedAgents(this.groupid);
      }
    });
  }

  getHuntgroupDetail(id) {
    this.userservice.getHuntgroupDetail(id).then(
      data => {
        this.groupname = data['data'].GroupName;
      },
      err => {
        console.log('error');
      }
    );
  }

  onSeqChange(id,value) {
    this.userservice.updateSequenceno(id,value).then(
      data => {
        this._snackBar.open('Sequence NO changed successfully', '', {
          duration: 2000,verticalPosition: 'top'
        });
        this.getAssignedAgents(this.groupid);
        
      },
      err => {
        console.log('error');
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
