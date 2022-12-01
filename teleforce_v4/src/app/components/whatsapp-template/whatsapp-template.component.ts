import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { TemplateService } from '../../template.service';
import { MatDialog } from '@angular/material/dialog';
import {CreateEmailTemplateComponent} from '../create-email-template/create-email-template.component';
import {Router} from "@angular/router";
import { CopySendEmailComponent } from '../copy-send-email/copy-send-email.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-whatsapp-template',
  templateUrl: './whatsapp-template.component.html',
  styleUrls: ['./whatsapp-template.component.css']
})
export class WhatsappTemplateComponent implements OnInit {

  
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'email_title', 'action'];
  Length = 0;
  isLoading = true;
  kyc;
  constructor(private userservice: UserService,public dialog: MatDialog,private router: Router,private templateservice:TemplateService,private _snackBar: MatSnackBar) { }

  @ViewChild('paginator') paginator: MatPaginator;


  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getTempData(userid);
  }

  async getTempData(id) {
    await this.templateservice.getWhatsappTemplateData(id).then(
      data => {
        console.log(data['data']);
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
    const dialogRef = this.dialog.open(CreateEmailTemplateComponent, {
       disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getTempData(userid);
      }
    });
  }

  DuplicateTemplate(id): void {
    const dialogRef = this.dialog.open(CopySendEmailComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      var userid = localStorage.getItem('access_id');
      this.getTempData(userid);  
    });
  }

  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateEmailTemplateComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getTempData(userid);
      }
    });
  }

  async deleteData(id){
   if(confirm('Are you sure to delete this?')){
    await this.templateservice.deleteWhatsappTemplateData(id).then(
      data => {
        var userid = localStorage.getItem('access_id');
        this.getTempData(userid);
        
        const path = '/whatsapp-template';
        this.router.navigate([path]);
      },
      err => {
        console.log('error');
      }
    );
   }
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


