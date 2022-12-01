import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagerService } from '../../manager.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent implements OnInit {

  public scheduledataSource: MatTableDataSource<any>;
  scheduleColumns: string[] = ['id', 'form_title', 'form_value'];
  scheduleLength = 0;
  isLoading = true;
  calluserid;

  constructor(
    public dialogRef: MatDialogRef<ViewFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private managerservice: ManagerService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  @ViewChild('schedulepaginator') schedulepaginator: MatPaginator;

  ngOnInit(): void {
    this.scheduledataSource = new MatTableDataSource(); // create new object
    this.getfeedback(this.data.id); 
  }

  async getfeedback(userid) {
    console.log(userid);
    await this.managerservice.getfeedback(userid).then(
      data => {
        console.log('manual:' ,data['data']);
        this.scheduledataSource.data = data['data'];
        this.scheduleLength = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }

  ngAfterViewInit() {
    this.scheduledataSource.paginator = this.schedulepaginator;
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }



}
