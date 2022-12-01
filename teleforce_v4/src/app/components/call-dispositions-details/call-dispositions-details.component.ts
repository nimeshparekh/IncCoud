import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignSupervisiorComponent } from '../assign-supervisior/assign-supervisior.component';



@Component({
  selector: 'app-call-dispositions-details',
  templateUrl: './call-dispositions-details.component.html',
  styleUrls: ['./call-dispositions-details.component.css']
})
export class CallDispositionsDetailsComponent implements OnInit {

 
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'action'];
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
    this.getassignsupervisior(this.groupid);
    this.dataSource = new MatTableDataSource();
  }
  async getassignsupervisior(groupid) {
    await this.userservice.getassignsupervisior(groupid).then(
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
    const dialogRef = this.dialog.open(AssignSupervisiorComponent, {
      disableClose: true,  data: { action: 'add', id: this.groupid }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getassignsupervisior(this.groupid);
      }
    });
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(AssignSupervisiorComponent, {
     disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getassignsupervisior(this.groupid);
      }
    });
  }

 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
