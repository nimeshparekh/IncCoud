import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DigitalService } from '../../digital.service.js';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { CreateMediaComponent } from '../create-media/create-media.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagerService } from "../../manager.service";

export interface PeriodicElement {
  position: number;
  name: string;
  create: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Images', create: '', action: '' },
];

@Component({
  selector: 'app-media-directory',
  templateUrl: './media-directory.component.html',
  styleUrls: ['./media-directory.component.css']
})
export class MediaDirectoryComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'create', 'action'];
  public dataSource: MatTableDataSource<any>;
  interestLength = 0;
  spin = false
  constructor(public digitalService: DigitalService,
     private router: Router, public dialog: MatDialog, private _snackBar: MatSnackBar 
     ,  private managerservice: ManagerService,) { }
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(); // create new object
    //this.getMenuAccess();
    this.get_folder();
    this.accesssetting();
  }
  getMenuAccess() {
    // this.authService.getMenuAccess().then(
    //   data => {
    //     var accessdata = ((data['access']['menuaccess']));
    //     //console.log(data['access']['menuaccess']);
    //     if (accessdata.includes('medialibrary')) {
    //       //this.router.navigate(['/dashboard']);
    //     } else {
    //       this.router.navigate(['/dashboard']);
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

  refresh() {
    this.get_folder();
  }

  create_new_folder() {
    console.log('create');
    const dialogRef = this.dialog.open(CreateMediaComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.get_folder()
    });
  }


  get_folder() {
    //this.spin = true
     var user_id=localStorage.getItem('access_id');
    this.digitalService.get_folder(user_id).then(
      data => {
        this.spin = false
        this.dataSource.data = data['data'];
        this.interestLength = data['data'].length;
      },
      err => {
        this.spin = false
        console.log(err);
      }
    );
  }


  delete(data) {
    this.spin = true
    let param = {'user_id': data.access_customer_id,id:data.B_id }
    if (confirm('Are you sure to delete this ?')) {
      this.digitalService.delete_folder(param).then(
        data => {
          this.spin = false
          this._snackBar.open(data['message'], 'Close', {
            duration: 5000,
          });
          this.get_folder()
        },
        err => {
          this.spin = false
          console.log(err);
        }
      );
    }
  }


  click_file(data) {
    console.log('click_file',data.B_id);
    //this.router.navigate(['/digital/media-library/' + data.B_id]);
    this.router.navigate(['/digital/media-library/', data.B_id]);
    //this.router.navigateByUrl('/digital/media-library/'+data.B_id);
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('17')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '17') {
        //       console.log("yes");
              
        //     }else{

        //       this.router.navigate(['/dashboard']);

        //     }
        //   }
        // }


       
      },
      err => {
        console.log('error');
      })
  }
}
