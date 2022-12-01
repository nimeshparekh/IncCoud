import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErpService } from './../../erp.service';
import { UserService } from './../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-import-lead-csv',
  templateUrl: './import-lead-csv.component.html',
  styleUrls: ['./import-lead-csv.component.css']
})
export class ImportLeadCsvComponent implements OnInit {

  public csvRecords: any[] = [];
  agentarr = []
  category = []
  agentgroup = [];
  isDisabled=false;
  @ViewChild('fileImportInput') fileImportInput: any;
  public importform: FormGroup;
  constructor(public dialogRef: MatDialogRef<ImportLeadCsvComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public authService: ErpService,
    public userservice: UserService,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getContactCategory();
    this.getGroup();
   // this.agentarr = this.data.agentarr
    this.importform = this.fb.group({
      agentgroupid: [null, [Validators.required]],
      agent: [''],
      segment: [null, [Validators.required]],
      duplicate: ['no', [Validators.required]]
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onUploadCsv() {
    if (this.importform.invalid == true) {
      let data: any = Object.assign(this.importform.value);
      console.log(data)
      this.isDisabled=false
      return;
    }
    else {
      let data: any = Object.assign(this.importform.value);
      //console.log(data.agent);
      this.isDisabled=true;
      const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
      fileUpload.onchange = () => {
        for (let index = 0; index < fileUpload.files.length; index++) {
          const file = fileUpload.files[index];
          // this.name = file.name;
          var userid = localStorage.getItem('access_id');
          var agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
          let fdata = new FormData();
          fdata.append('user_id', userid);
          fdata.append('agentgroup_id', data.agentgroupid);
          fdata.append('agent_id', data.agent);
          fdata.append('segmentid', data.segment);
          fdata.append('remove_duplicate', data.duplicate);
          fdata.append('attach_file', file);
          fdata.append('agentrole', agentrole);
          this.authService.uploadcsv(fdata).then(
            (data) => {
              //this.pdf_name = tdata['data']
              this.el.nativeElement.querySelector('#fileUpload').value = '';
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
              this.isDisabled=false;

              this.dialogRef.close({ event: 'Cancel' });
            });
        }
        this.isDisabled=false;

        //this.uploadFiles();
        //this.loading = true
      };
      fileUpload.click();
    }
  }
  getContactCategory() {
    let userinfo = localStorage.getItem('access_id');
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
      this.http.get(environment.apiUrl + '/segments/getsupervisorsegments/' + userinfo).subscribe((data: any) => {
        this.category = data['data'];
      });
    }else{
      this.http.get(environment.apiUrl + '/contacts/getCategorylist/' + userinfo).subscribe((data: any) => {
        this.category = data['data'];
      });
    }
    
  }
  fileChangeListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let dataArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = (<string>csvRecordsArray[i]).split(',');

      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      if (data.length == headerLength) {

        let csvRecord: CSVRecord = new CSVRecord();

        csvRecord.firstName = data[0].trim();
        csvRecord.lastName = data[1].trim();
        csvRecord.email = data[2].trim();
        csvRecord.phoneNumber = data[3].trim();
        csvRecord.title = data[4].trim();
        csvRecord.occupation = data[5].trim();

        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

  async getGroup() {
    // let userid = localStorage.getItem('access_id');
    await this.authService.getActiveAgentGroup().then(data => {
      if (data) {
        this.agentgroup = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async getAssignedAgents(groupid) {
    // console.log(groupid);
    var agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    this.importform.get('agent').setValue('');
    if(agentrole=="supervisor"){
      await this.userservice.getAssignedSupervisorAgentsByGroup(groupid,localStorage.getItem("access_id")).then(
        data => {
          console.log(data['data']);
          this.agentarr = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    }else{
      await this.userservice.getAssignedAgents(groupid).then(
        data => {
          //console.log(data['data']);
          this.agentarr = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    }    
  }


}
export class CSVRecord {

  public firstName: any;
  public lastName: any;
  public email: any;
  public phoneNumber: any;
  public title: any;
  public occupation: any;

  constructor() {

  }
}

