import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { EditDidConfigComponent } from '../edit-did-config/edit-did-config.component';
import {Router} from "@angular/router";

@Component({
  selector: 'app-did-routing',
  templateUrl: './did-routing.component.html',
  styleUrls: ['./did-routing.component.css']
})
export class DidRoutingComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'did_no', 'type','date'  ,'edit'];//'action',
  Length = 0;
  isLoading = true
  kyc;

  constructor(private userservice: UserService,public dialog: MatDialog,private router: Router) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.getDIDConfig(userid)
  }

  async getDIDConfig(userid) {
    await this.userservice.getDIDRouting(userid).then(
      data => {
        //console.log(data['data'].length);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  viewdialog(id): void {
    const dialogRef = this.dialog.open(EditDidConfigComponent, {
      width: '400px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getDIDConfig(userid);
      }
    });
  }
  
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
