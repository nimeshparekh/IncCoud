import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
//import { FacebookService } from '../../shared/facebook.service';
import { CreateAdComponent } from '../create-ad/create-ad.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from "@angular/router";
//import { PlatformService } from '../../shared/platform.service';
import { ThemePalette } from "@angular/material/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { DigitalService } from '../../../digital.service';
export interface PeriodicElement {
  campaign_name: string;
  campaign_objective: string;
  campaign_status:string;
  campaign_budget:string;
  action: string;

}
const ELEMENT_DATA: PeriodicElement[] = [

  {campaign_name: 's',campaign_objective:'test',campaign_status:'',campaign_budget:'',action:''},

];
@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {
  brandcheck = true;
  public dataSource: MatTableDataSource<any>;
  saveArr : any = []
  displayedColumns: string[] = ['no','campaign_status','campaign_name','campaign_objective','campaign_budget','action'];
  constructor(
    //private authAPIService: FacebookService,
    public dialog: MatDialog,private router: Router,
    private digitalService : DigitalService, 
    ) { }
  color: ThemePalette = "accent";
  li_insights=[];
  ngOnInit() {
    this.dataSource = new MatTableDataSource(); // create new object
    this.saved_campaign();
    // this.campaign_insights();
  }

  async saved_campaign(){
    await this.digitalService.saved_campaign(localStorage.getItem('current_brand_id')).then(
      data => {
        if (data != undefined) {
         console.log(data['data'])
         this.dataSource.data = data['data'];
         this.saveArr = data['data'];
        }
      },
      err => {
        console.log("languages_data Error :" + JSON.stringify(err));
      }
    );
  }


  // openDialog(){
  //   this.router.navigate(['/create-ad']);
        
    
  // }

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

  // promiseloop_LI(i,data1,campaign_id,campaign,insight_payload){
  //   return new Promise((resolve,reject) =>{
  //     for(i=0;i<data1['data'].length ;i++){
  //       var campaign_id = data1['data'][i]['campaign_id'];
  //       console.log(campaign_id)
  //       campaign[i] = campaign_id;
  //       insight_payload.push({'campaign_id': campaign_id,'campaign_objective':'','daily_budget':'','objective':'','insight':''});
  //       if (i == data1['data'].length-1){
  //         resolve('a')
  //       }
  //     }// end of for 
  //   });
  // }

  // campaign_insights(){
  //   this.authAPIService.saved_campaign(localStorage.getItem('current_brand_id')).then(
  //     data1 => {
  //           console.log(data1['data'])
  //           var data = data1['data']
  //           var i;
  //           var campaign = [];
  //           var campaign_id; 
  //           var insight_payload =[];
  //           this.promiseloop_LI(i,data1,campaign_id,campaign,insight_payload).then(
  //             data2=>{
  //               this.li_insights = insight_payload;
  //               console.log(data2);
  //               for(i=0;i<data1['data'].length;i++){
  //                 this.authAPIService.sync_campaign(campaign[i],i).then(
  //                   data3=>{
  //                     console.log(data3)
  //                     this.li_insights[data3['index']].campaign_objective =data3['objective'];
  //                     this.li_insights[data3['index']].daily_budget =data3['daily_budget'];
  //                     this.li_insights[data3['index']].objective =data3['objective'];
  //                     this.li_insights[data3['index']].insight =data3['insights'];
  //                     this.li_insights[data3['index']].inline_post_engagement =data3['inline_post_engagement'];

  //                     // console.log(this.li_insights)
  //                   err=>{
  //                     console.log("Error in getting insights: "+ err);
  //                   }   
  //                   }
  //                 )
  //               }
  //             }
  //           );
  //   },
  //   err=>{
  //     console.log("Error in getting Channels: "+err);
  //   }
  //   );
  // }


  openDialog(index) {
    console.log(this.saveArr[index])
    this.digitalService.setSavedCampaignid(this.saveArr[index]);
    this.dialog.open(FbPeoplereachDialogComponent, {
      
    });
  }


}













@Component({
  selector: 'post-insight',
  templateUrl: 'fb-peoplereach-dialog.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class FbPeoplereachDialogComponent {
  constructor(public dialogRef: MatDialogRef<FbPeoplereachDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CampaignListComponent,private _snackBar: MatSnackBar,
     private digitalService : DigitalService, 
    ) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    insight_reach;
    insight_engagement = { 
      cost_per_inline_link_click:'NA',
      impressions:'NA',
      reach : 'NA',
      spend:  'NA',
      social_spend:'NA',
      cpm:'NA',
      cpc:'NA',
      frequency:'NA',
      unique_ctr:'NA',
      inline_link_clicks:'NA',
      inline_post_engagement:'NA',
      clicks:'NA'
    };
    ngOnInit() {
      this.loadinginsightCampaign();
      // this.page_insight_engagement();
    }

    loadinginsightCampaign(){
      this.insight_reach=this.digitalService.getSavedCampiagnid();
      if (this.insight_reach){
        var data_n = {'campaign_id':this.insight_reach.ads_id,'page_id':this.insight_reach.leadgen_form_page}
            this.digitalService.sync_insights(data_n).then(
            data => {
              console.log(data['insights'])              
              if (data['insights'] != undefined) {
                console.log(data['insights'])
               this.insight_engagement.reach= data['insights']['data'][0]['reach']
               this.insight_engagement.spend= data['insights']['data'][0]['spend']
               this.insight_engagement.impressions= data['insights']['data'][0]['impressions']
               this.insight_engagement.cost_per_inline_link_click= data['insights']['data'][0]['cost_per_inline_link_click'],
               this.insight_engagement.social_spend= data['insights']['data'][0]['social_spend']
               this.insight_engagement.cpm= data['insights']['data'][0]['cpm']
               this.insight_engagement.cpc= data['insights']['data'][0]['cpc']
               this.insight_engagement.frequency= data['insights']['data'][0]['frequency']
               this.insight_engagement.unique_ctr= data['insights']['data'][0]['unique_ctr']
               this.insight_engagement.inline_link_clicks= data['insights']['data'][0]['inline_link_clicks']
               this.insight_engagement.inline_post_engagement= data['insights']['data'][0]['inline_post_engagement']
               this.insight_engagement.clicks= data['insights']['data'][0]['clicks']


              }else{
                this.dialogRef.close();
                this._snackBar.open('Ads Not Active !!', '', {
                  duration: 2000,
                });
              }
            },
            err => {
              console.log("languages_data Error :" + JSON.stringify(err));
            }
          );
      }      console.log(this.insight_reach)
    }
  
}

