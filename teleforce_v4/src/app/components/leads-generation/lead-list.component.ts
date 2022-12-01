import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
//import { FacebookService } from '../../shared/facebook.service';
//import { AuthService }  from '../../shared/auth.service'
import { CreateAdComponent } from './create-ad/create-ad.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//import { PlatformService } from '../../shared/platform.service';
import { ThemePalette } from "@angular/material/core";
import {FbPeoplereachDialogComponent} from "./campaign-list/campaign-list.component";
import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadManualComponent } from './lead-manual/lead-manual.component';
import { DigitalService } from '../../digital.service';
import { ManagerService } from"../../manager.service";
import { Router } from '@angular/router';
export interface PeriodicElement {
  campaign_name: string;
  campaign_objective: string;
  campaign_status:string;
  campaign_budget:string;
  automation:string;
  action: string;

}
const ELEMENT_DATA: PeriodicElement[] = [

  {campaign_name: 's',campaign_objective:'test',campaign_status:'',campaign_budget:'',automation:'',action:''},

];

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent implements OnInit {
  justdailwebhook ='';
  public dataSource: MatTableDataSource<any>;
  public dataSource_google: MatTableDataSource<any>;
  displayedColumns: string[] = ['no','ads_name','ads_id','ads_status','total_leads','today_leads','duplicate_leads','automation','action'];
  displayedColumns_google: string[] = ['no','ads_name','ads_id','ads_status','total_leads','today_leads','duplicate_leads','automation'];
  saveArr : any = []
  saveArr_google : any = []
  interestLength = 0;
  interestLength_google = 0;
  yourkey = ''
  webhookurl = 'https://web.cloudX.in/api/google/webhook'
  @ViewChild('interestpaginator',{static: false}) interestpaginator: MatPaginator;  
  @ViewChild('interestpaginator_google',{static: false}) interestpaginator_google: MatPaginator;  
  constructor(
    //private authAPIService: FacebookService,
    public dialog: MatDialog,
    private digitalService : DigitalService, private managerservice: ManagerService,private router: Router,
    //private authService:AuthService,
    private _snackBar: MatSnackBar) { }
  // @ViewChild('interestpaginator') interestpaginator: MatPaginator;
  isLoading = true;
  isLoading_google = true;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.dataSource_google = new MatTableDataSource(); // create new object
    //this.campaign_insights();
    this.saved_leads_campaign();
    this.saved_leads_campaign_google();
   // this.getMenuAccess();
    this.yourkey = localStorage.getItem('access_id')
    this.justdailwebhook ='https://app.cloudX.in/api/tfapi/jd/'+ this.yourkey
    this.accesssetting();
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('16')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '16') {
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
  connect_google_ads(){
    this.digitalService.googleadsaccesslink()
      .subscribe(
        (data) => {
          window.location.href = data['url'];
        }
    );
  }
  /*
  getMenuAccess() {
    this.authService.getMenuAccess().then(
      data => {
        var accessdata = ((data['access']['menuaccess']));
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
  */
  async saved_leads_campaign(){
    await this.digitalService.saved_leads_campaign(localStorage.getItem('current_brand_id')).then(
      data => {
        if (data != undefined) {
         console.log(data['data'])
         this.dataSource.data = data['data'];
         this.saveArr = data['data'];
         this.interestLength = data['data'].length;
         this.isLoading = false;
        }
      },
      err => {
        console.log("languages_data Error :" + JSON.stringify(err));
      }
    );
  }


  async saved_leads_campaign_google(){
    await this.digitalService.saved_leads_campaign_google(localStorage.getItem('current_brand_id')).then(
      data => {
        if (data != undefined) {
         console.log(data['data'])
         this.dataSource_google.data = data['data'];
         this.saveArr_google = data['data'];
         this.interestLength_google = data['data'].length;
         this.isLoading_google = false;
        }
      },
      err => {
        console.log("Error :" + JSON.stringify(err));
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.interestpaginator;
    this.dataSource_google.paginator = this.interestpaginator_google;

  }

  loadSavedPost(index){
    console.log(this.saveArr[index])
    this.digitalService.setSavedCampaignData(this.saveArr[index]);
    this.router.navigateByUrl('/create-ad');
  }

  nextAdset(index){
    console.log(this.saveArr[index])
    this.digitalService.setSavedCampaignid(this.saveArr[index]);
    this.router.navigateByUrl('/adset-list');
  }


  onChange(e,index) {
    console.log(e.checked)
    console.log(index.campaign_id)
    if(e.checked == true){
      console.log("true")
      var data_n = {'campaign_id':index.campaign_id,'status':'ACTIVE'}
      this.digitalService.change_campaign_status(data_n).then(
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
      var data_n = {'campaign_id':index.campaign_id,'status':'PAUSED'}
      this.digitalService.change_campaign_status(data_n).then(
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
    if(this.saveArr[index]['campaign_status'] == 'PAUSED'){
      this._snackBar.open('Campaign Not Active !!', '', {
        duration: 2000,
      });
    }else{
      this.digitalService.setSavedCampaignid(this.saveArr[index]);
      this.dialog.open(FbPeoplereachDialogComponent, {
      });
    }
  }

  showautomation(data){
    const dialogRef = this.dialog.open(LeadManualComponent,{
      width: '550px',data:{adsdata:data}
    });
  }

  syncfblead(adid,pageid){
    this.isLoading = true;
    var data = {ads_id:adid,page_id:pageid}
    this.digitalService.sync_facebook_leads(data).then(
      data=>{
        this._snackBar.open(data['msg'], '', {
          duration: 2000,
        });
        this.isLoading = false;
      },
      err => {
        console.log(JSON.stringify(err));
      }
    
    );
  }

  getTotalLead(){
    return this.saveArr.map(t => t.total_leads).reduce((acc, value) => acc + value, 0);
  }
  getTodayTotalLead(){
    return this.saveArr.map(t => t.today_leads).reduce((acc, value) => acc + value, 0);
  }
  getDuplicateTotalLead(){
    return this.saveArr.map(t => t.duplicate_leads).reduce((acc, value) => acc + value, 0);
  }

  getTotalLead_google(){
    return this.saveArr_google.map(t => t.total_leads).reduce((acc, value) => acc + value, 0);
  }
  getTodayTotalLead_google(){
    return this.saveArr_google.map(t => t.today_leads).reduce((acc, value) => acc + value, 0);
  }
  getDuplicateTotalLead_google(){
    return this.saveArr_google.map(t => t.duplicate_leads).reduce((acc, value) => acc + value, 0);
  }
  copyText(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.webhookurl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._snackBar.open('Copy Webhook URL', '', {
      duration: 1000,
    });
  }

  copyText_key(){

    this.digitalService.get_webhook_key().then(
      data=>{
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = data['key'];
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this._snackBar.open('Copy Webhook key', '', {
          duration: 1000,
        });
      },
      err => {
        console.log(JSON.stringify(err));
      }
    
    );

  }

  showautomation_google(data){
    const dialogRef = this.dialog.open(LeadManualComponent,{
      width: '550px',data:{type:'google_edit','data':data}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.saved_leads_campaign_google() 
    });
  }

  openDialog_g() {
    const dialogRef = this.dialog.open(LeadManualComponent,{
      width: '550px',data:{type:'google'}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.saved_leads_campaign_google();
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
     this.saved_leads_campaign();
      }
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./lead-list.component.css']

})

export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private digitalService : DigitalService, private managerservice: ManagerService,private router: Router,
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


