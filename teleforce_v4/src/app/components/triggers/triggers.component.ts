import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ErpService } from '../../erp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.css']
})
export class TriggersComponent implements OnInit {
  public createform: FormGroup;
  conditiontextinput = false
  leadstatus = []
  actionvaluedata = []
  triggerlist = []
  public dataSource: MatTableDataSource<any>;
  displayedColumns = ["id","column_name","condition_name","condition_value","action_name"];
  Length = 0;
  isLoading = true;
  constructor(private fb: FormBuilder,public ErpService: ErpService,private _snackBar: MatSnackBar,) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.get_lead_status()
    this.get_trigger_list()
    this.createform = this.fb.group({
      account_id: [userid],
      column: [null,Validators.required],
      condition: [null,Validators.required],
      conditionvalue: [null,Validators.required],
      action: [null,Validators.required],
      actionvalue: [null],
    });
  }
  async get_lead_status() {
    await this.ErpService.get_lead_status().then(
      data => {
        if(data['data'].length>0){
          this.leadstatus  = data['data']
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  changestatus(status){
    console.log(status)
    if(status=="creation" || status=="modified"){
      this.conditiontextinput = true
    }else{
      this.conditiontextinput = false
    }
  }

  async changeaction(action){
    this.actionvaluedata  = []
    await this.ErpService.get_trigger_action_value(action).then(
      data => {
        if(data['data'].length>0){
          this.actionvaluedata  = data['data']
        }else{
          this.actionvaluedata  = []
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  createtrigger(){
    if (this.createform.invalid == true) {
      console.log("hello", this.createform.value);
       return;
     }
     else {
      let data: any = Object.assign(this.createform.value);
      console.log(data)
      this.ErpService.create_trigger(data).then(
        data => {
          console.log(data);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          })
          this.createform.reset();
          this.get_trigger_list()
        },
        err => {
          console.log(err);
        }
      );
     }
  }
  async get_trigger_list() {
    await this.ErpService.get_trigger_list().then(
      data => {
        if(data['data'].length>0){
          this.triggerlist  = data['data']
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
          this.isLoading = false; 
        }
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
