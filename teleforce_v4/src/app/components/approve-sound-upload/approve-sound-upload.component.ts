import { Component ,Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service';

import {MatSnackBar} from '@angular/material/snack-bar';
import{ApproveSoundStatusComponent} from '../approve-sound-status/approve-sound-status.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-approve-sound-upload',
  templateUrl: './approve-sound-upload.component.html',
  styleUrls: ['./approve-sound-upload.component.css']
})
export class ApproveSoundUploadComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  public pendingdataSource: MatTableDataSource<any>;
 displayedColumns: string[] = ['id', 'name','file','upload','approve','note','status'];
  pendingdisplayedColumns: string[] = ['id', 'name','file','upload','approve','note','status','action'];
  pendingLength = 0;  Length = 0;
   isLoading = true;
  constructor(
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  openDialog(file): void {
    const dialogRef = this.dialog.open(ApproveSoundPlay, {
      width: 'auto',data:file

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    
    });
  }


  @ViewChild('paginator')paginator:MatPaginator;
  @ViewChild('pendingpaginator')pendingpaginator:MatPaginator;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();// create new object
    this.pendingdataSource =new MatTableDataSource();
    this.getsounddata();
    this.Pendingsounddata();  }
  getsounddata(){
    this.managerservice.getsounddata().then(
      data => {
        console.log("helo"+data['data']);
    
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading =false;
        
      },
      err => {
        console.log('error');
      }
    );
  }
    Pendingsounddata(){
      this.managerservice.Pendingsounddata().then(
        data => {
          console.log("hello",data['data']);
      
         this.pendingdataSource.data = data['data'];
          this.pendingLength = data['data'].length;
          this.isLoading =false;
          
        },
        err => {
          console.log('error');
        }
      );
  
    }
  
  approvedialoag(id):void {
    console.log(id);
    const dialogRef = this.dialog.open(ApproveSoundStatusComponent, {
      width: '640px', disableClose: true, data: id
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.getsounddata();
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}


@Component({
  selector: 'approve-sound-play',
  templateUrl: 'approve-sound-play.component.html',
  styleUrls: ['./approve-sound-upload.component.css']
})
export class ApproveSoundPlay {

  filename='';

  constructor(
    public dialogRef: MatDialogRef<ApproveSoundPlay>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      this.filename = this.data;
      console.log(this.filename)
    }
  }


}