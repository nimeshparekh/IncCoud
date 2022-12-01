import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {KycAprovelComponent} from '../kyc-aprovel/kyc-aprovel.component';
import{KycDocumentViewComponent} from '../kyc-document-view/kyc-document-view.component';
@Component({
  selector: 'app-kyc-document',
  templateUrl: './kyc-document.component.html',
  styleUrls: ['./kyc-document.component.css']
})
export class KycDocumentComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  public pendingdataSource: MatTableDataSource<any>;
  
  pendingdisplayedColumns: string[] = ['id', 'name','registration','gst', 'agreement', 'pancard', 'authorized_person_proof','upload','approve','note','status','action'];

  displayedColumns: string[] = ['id', 'name','registration','gst', 'agreement', 'pancard', 'authorized_person_proof','upload','approve','note','status','action'];
  Length = 0;
  pendingLength=0;
  pancard = '';
  appdata ="";
  isLoading = true;
  constructor(
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }
  
  @ViewChild('paginator')paginator:MatPaginator;
  @ViewChild('pendingpaginator')pendingpaginator:MatPaginator;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();// create new object
    this.pendingdataSource= new MatTableDataSource();
    var userid = localStorage.getItem('access_id');
    var username=localStorage.getItem('username');
    this.getkycdata();
    this.getKycPendingData();
   
  }
  approvedialoag(id):void {
    //console.log(id);
    const dialogRef = this.dialog.open(KycAprovelComponent, {
      width: '640px', disableClose: true, data: id
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.getkycdata();
        
      }
    });
  }
  viewdialoag(id){
       //console.log(id);
       const dialogRef = this.dialog.open(KycDocumentViewComponent, {
        width: '640px', disableClose: true, data: id
        
      });
      // dialogRef.afterClosed().subscribe(result => {
      //   if(result.event == 'Update'){
      //     this.getkycdata();
      //   }
      // });
  }
  getKycPendingData() {
    this.userservice.getKycPendingData().then(
      data => {
        console.log(data['data']);
    
       this.pendingdataSource.data = data['data'];
        this.pendingLength = data['data'].length;
        this.isLoading =false;
        
      },
      err => {
        console.log('error');
      }
    );
  }

 getkycdata() {
    this.userservice.getKycData().then(
      data => {
        //console.log(data['data']);
    
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading =false;
        
      },
      err => {
        console.log('error');
      }
    );
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.pendingdataSource.paginator = this.pendingpaginator;
  }


}
