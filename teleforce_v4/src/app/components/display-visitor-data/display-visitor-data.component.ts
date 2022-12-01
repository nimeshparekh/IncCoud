
import { Component, OnInit, ViewChild ,Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-display-visitor-data',
  templateUrl: './display-visitor-data.component.html',
  styleUrls: ['./display-visitor-data.component.css']
})
export class DisplayVisitorDataComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','date','ip','path'];
  Length = 0;
  isLoading = true;
  constructor(
    public dialogRef: MatDialogRef<DisplayVisitorDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
   
    private adminservice: AdminService,
    private toastr: ToastrService) {}

 @ViewChild('paginator') paginator: MatPaginator; 
    ngOnInit(): void {
      this.dataSource = new MatTableDataSource();
       this.getVisitorbyIp();
      }
   
  
  async getVisitorbyIp(){
    var ip =  [this.data.ip];
   
    await this.adminservice.getVisitorbyIp(ip).then(
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
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }

}
