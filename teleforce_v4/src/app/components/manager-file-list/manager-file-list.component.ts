import { Component, OnInit, VERSION, ViewChild,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { MatTableDataSource } from '@angular/material/table';
import {ToastrService} from "ngx-toastr";
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-manager-file-list',
  templateUrl: './manager-file-list.component.html',
  styleUrls: ['./manager-file-list.component.css']
})
export class ManagerFileListComponent implements OnInit {

  collection = { count: 0, data: [] };
  public contactdataSource: MatTableDataSource<any>;
  displayedColumns = ["id","name", "status","note"];
  contactLength = 0;
  isLoading = true;
  wasFormChanged = false;
  total;
  complete;
  pending;

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<ManagerFileListComponent>) { }

  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  
  ngOnInit(): void {
    this.contactdataSource   = new MatTableDataSource(); // create new object
    this.getFiles();
  }
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }

  getFiles(){
    let userinfo = localStorage.getItem('access_id');
    this.http.get(environment.apiUrl+'/contacts/agentfiledata/'+userinfo).subscribe((data:any) =>{
      this.collection.count = data['count'];       
      this.collection.data = data['data'];      
      this.contactdataSource.data = data['data'];
      this.contactLength = data['data'].length;
      this.isLoading =false;
      var valuelength = data['count'].length
      this.total = valuelength;
      var filtered = data['count'].filter(Boolean);
      var finishcount = filtered.length;
      this.complete = finishcount;
      var lesscount = valuelength - finishcount;
      this.pending = lesscount;
    });
  }

  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }

  public doFilter = (value: string) => {
    this.contactdataSource.filter = value.trim().toLocaleLowerCase();
  }


}
