import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from "@angular/forms";
import {Router} from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { LeadManualComponent } from '../lead-manual/lead-manual.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DigitalService } from '../../../digital.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ThemePalette } from "@angular/material/core";export interface PeriodicElement {
  ads_name: string;
  // adset_optimization_goal: string;
  campaign_budget:string;
  // action: string;

}
const ELEMENT_DATA: PeriodicElement[] = [

  // {adset_name: 's',adset_optimization_goal:'test',ads_status:'',campaign_budget:'',action:''},
  {ads_name: 's',campaign_budget:''},


];

@Component({
  selector: 'app-async-campaign',
  templateUrl: './async-campaign.component.html',
  styleUrls: ['./async-campaign.component.css']
})
export class AsyncCampaignComponent implements OnInit {
  public AdGroupForm: FormGroup;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['no','ads_name','campaign_budget','action'];
  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private digitalService:DigitalService
    ) { }
  voiceCampaignDisplay=false;
  adaccount_select = false;
  mailCampaignDisplay=false;
  smsCampaignDisplay=false;
  campaign_button = false;
  page_data_all = ['page']
  voiceCampaigns;
  smsCampaigns;
  mailCampaigns;
  select_account;
  segments;
  page_data;
  page_select_event;
  adaccount_data;
  savedCampaignData;
  table_show = false
  spin = false
  selectedAutomationData={segment:null,voice:null,sms:null,email:null};
  saveArr;

  async ngOnInit() {
    this.dataSource = new MatTableDataSource(); // create new object
    this.ad_pages();
    this.AdGroupForm = this.formBuilder.group({
      ads_id:[''],
      page_id:['']
    })
    this.getMenuAccess();
  }
  getMenuAccess() {
    this.digitalService.getMenuAccess().then(
      data => {
        var accessdata = ((data['menuaccess']));
        //console.log(data['access']['menuaccess']);
        if (accessdata.includes('leads')) {
          //this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      err => {
        console.log(err);
      }
    );
  }


  onCheckChange(event) {
    this.spin = true
    let index = event.target.value
    console.log(this.page_data[index]['page_id'])
    let data_select = {'token': this.page_data[index]['user_Token']}
    this.digitalService.get_adaccount(data_select).then(
      data=>{
        console.log(data['data']);
        this.adaccount_data = data['data']
        this.adaccount_select = true
        this.campaign_button = true
        this.spin = false

      },
      err=>{
        this.spin = false
        console.log(err)
      }
    );
    this.page_select_event = this.page_data[index]['page_id']
    this.page_data_all = this.page_data[index]
  }

  async ad_pages(){
    await this.digitalService.ad_pages_list().then(
      data => {
        if (data != undefined) {
          console.log(data);
          this.page_data = data;  
        }
      },
      err => {
        console.log("page_data Error :" + JSON.stringify(err));
      }
    );
  }



  selectadaccount(event){
    console.log(event.value);
    this.select_account = event.value
    console.log(this.select_account)
  }


  async sync_campaign(){
    console.log("start")
    this.spin = true
    let data = {}
    data['adaccount'] = this.select_account;
    data['page'] = this.page_data_all['page_id']
    data['token'] = this.page_data_all['user_Token']
    console.log(data)
    this.dataSource.data = []
    this.table_show=false
    await this.digitalService.sync_all_campaign(data).then(
      data2=>{
        if(data2){
          console.log(data2)
          this.spin = false
          this.digitalService.setSavedpgid(this.page_data_all['page_id']);
          this.table_show = true
          this.loadingSavedCampaign()
          // this.router.navigate(['/load-ads']);
        }
      },
      err => {
        this.spin = false
        console.log(JSON.stringify(err));
      }
      
    );
  }



  loadingSavedCampaign(){
    this.savedCampaignData=this.page_data_all['page_id']
    var data_n = {'page_id': this.savedCampaignData}
    this.digitalService.saved_ads_id(data_n).then(
    data => {
      if (data != undefined) {
        console.log(data['data'])
        this.dataSource.data = data['data'];
        this.saveArr = data['data']
      }
    },
    err => {
             console.log("languages_data Error :" + JSON.stringify(err));
    }
  );  
  }



  onChange(e,index) {
    console.log(e.checked)
    console.log(index.adset_id)
    if(e.checked == true){
      console.log("true")
      var data_n = {'ads_id':index.ads_id,'status':'ACTIVE'}
      this.digitalService.change_ads_status(data_n).then(
        data=>{
          this.router.navigate(['/campaign-list']);
        },
        err => {
          console.log(JSON.stringify(err));
        }
      
      );
    }
    else if(e.checked == false){
      console.log("false")
      var data_n = {'ads_id':index.ads_id,'status':'PAUSED'}
      this.digitalService.change_ads_status(data_n).then(
        data=>{
          this.router.navigate(['/campaign-list']);
        },
        err => {
          console.log(JSON.stringify(err));
        }
      
      );
    }
}


  openDialog(index) {
    console.log(this.saveArr[index])
    // this.PFservice.setSavedadid(this.saveArr[index]);
    // this.router.navigate(['/lead-manual']);
    this.digitalService.setSavedadid(this.saveArr[index]);
    const dialogRef = this.dialog.open(LeadManualComponent,{
      width: '550px',data:{adsdata:this.saveArr[index]}
    });

  }

  
  async deleteRequest(id) {
    alert(id)
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getMenuAccess();
        this.ad_pages();

      }
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./async-campaign.component.css']

})

export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private digitalService : DigitalService,private router: Router,
    //private authService:AuthService,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      this.id = this.data.id


    }

  }
  async deleteRequest(dataid) {
var  data= {id:dataid}
    await this.digitalService.delete_fb_req(data).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000,
        });        this.dialogRef.close({ event: 'Delete' });
      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}



