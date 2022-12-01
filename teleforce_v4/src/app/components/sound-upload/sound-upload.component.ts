import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateSoundComponent } from '../create-sound/create-sound.component';
import {Router} from "@angular/router";


@Component({
  selector: 'app-sound-upload',
  templateUrl: './sound-upload.component.html',
  styleUrls: ['./sound-upload.component.css']
})
export class SoundUploadComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'file',  'date', 'action'];
  Length = 0;
  isLoading = true;
  kyc;
  constructor(private userservice: UserService,public dialog: MatDialog,private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getSoundList(userid);
  }

  async getSoundList(userid) {
    await this.userservice.getSoundList(userid).then(
      data => {
        //console.log(data['data'].length);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  
  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateSoundComponent, {
      width: '300px', disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getSoundList(userid);
      }
    });
  }

  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateSoundComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getSoundList(userid);
      }
    });
  }


  // async deleteRequest(id){
  //   const dialogRef = this.dialog.open(CreateSoundComponent, {
  //     width: '640px', disableClose: true, data: {action:'delete',id:id}
  //   });  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result.event == 'Delete'){
  //       var userid = localStorage.getItem('access_id');
  //       this.getSoundList(userid);
  //     }
  //   });
  // }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async checkkyc(id){
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
        }else{
          this.router.navigate(['/kyc-document-upload']);
        }        
      },
      err => {
        console.log('error');
      }
    );
  }

}
