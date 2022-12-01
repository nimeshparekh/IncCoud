import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from "@angular/forms";
import {Router} from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DigitalService } from '../../../digital.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-lead-manual',
  templateUrl: './lead-manual.component.html',
  styleUrls: ['./lead-manual.component.css']
})
export class LeadManualComponent implements OnInit {

  public AdGroupForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<LeadManualComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,private _snackBar: MatSnackBar,public dialog: MatDialog,
    private digitalService: DigitalService,
    private router: Router,
    //private PFService : PlatformService
  ){ }
  voiceCampaignDisplay=false;
  mailCampaignDisplay=false;
  smsCampaignDisplay=false;
  agentCampaignDisplay=false
  segmentError=false
  agentgroupError=false
  ads_idError = false
  voiceCampaigns;
  smsCampaigns;
  agentgroupCampaigns;
  mailCampaigns;
  segments;
  page_data;
  nrSelect;
  page_select_event;
  savedCampaignData;
  spin = false
  monedaSelect
  adsdata = []
  webhookurl = environment.GOOGLE_WEBHOOK_URL_BASE_PATH;
  webhookurl_show;
  key = null
  auto = false
  selectedAutomationData={segment:null,voice:null,sms:null,email:null,agentgroup:null};
  async ngOnInit() {
    console.log(this.data);
    if(this.data['type'] == 'google'){
      this.auto = true
      this.getAutomationData();
      //this.googleadsaccounts()
      this.AdGroupForm = this.formBuilder.group({
        ads_id:[null],
        page_id:[null],
       // voice_campaign_id:[null],
       // sms_campaign_id:[null],
       // mail_campaign_id:[null],
        segment:[null],
        agentgroup:[null],
      })
    }else if(this.data['type'] == 'google_edit'){
      console.log(this.data);
      this.savedCampaignData = this.data['data']
      //this.getAutomationData();
      if(this.savedCampaignData['voiceCampaignID']>0){
        this.voiceCampaignDisplay = true
      }
      if(this.savedCampaignData['smsCampaignID']>0){
        this.smsCampaignDisplay = true
      }
      if(this.savedCampaignData['mailCampaignID']>0){
        this.mailCampaignDisplay = true
      }
      this.AdGroupForm = this.formBuilder.group({
        ads_id:[this.savedCampaignData['ads_id']],
        page_id:[this.savedCampaignData['ads_id']],
        //voice_campaign_id:[Number(this.savedCampaignData['voiceCampaignID'])],
       // sms_campaign_id:[Number(this.savedCampaignData['smsCampaignID'])],
        //mail_campaign_id:[Number(this.savedCampaignData['mailCampaignID'])],
        segment:[this.savedCampaignData['automationSegmentID']],
        agentgroup:[Number(this.savedCampaignData['AgentGroupID'])],
      })
      
    }else{

      this.savedCampaignData = this.data['adsdata']
      console.log(this.savedCampaignData)
      this.getAutomationData();
     // this.ad_pages();
      if(this.savedCampaignData['voiceCampaignID']>0){
        this.voiceCampaignDisplay = true
      }
      if(this.savedCampaignData['smsCampaignID']>0){
        this.smsCampaignDisplay = true
      }
      if(this.savedCampaignData['mailCampaignID']>0){
        this.mailCampaignDisplay = true
      }
      this.AdGroupForm = this.formBuilder.group({
        ads_id:[''],
        page_id:[''],
       // voice_campaign_id:[Number(this.savedCampaignData['voiceCampaignID'])],
       // sms_campaign_id:[Number(this.savedCampaignData['smsCampaignID'])],
       // mail_campaign_id:[Number(this.savedCampaignData['mailCampaignID'])],
        segment:[this.savedCampaignData['automationSegmentID']],
        agentgroup:[Number(this.savedCampaignData['AgentGroupID'])],
      })
    }    
  }

  onCheckChange(event) {
    console.log("check"+event.target.value)
    this.page_select_event = event.target.value;
  }
  /*
  loadingSavedCampaign(){
    this.savedCampaignData=this.PFService.getSavedadid();
    console.log(this.savedCampaignData['voiceCampaignID'])
    if(this.savedCampaignData['is_automation'] == 'yes'){
      console.log("data")
      if(this.savedCampaignData['is_automation'].length>0){
        this.voiceCampaignDisplay=true;
        // this.AdGroupForm.get['page_id'].setValue(this.savedCampaignData['voiceCampaignID'])
        this.AdGroupForm = this.formBuilder.group({
          ads_id:[''],
          page_id:[''],
          voice_campaign_id:[this.savedCampaignData['voiceCampaignID']]        })
          console.log(this.AdGroupForm.get('voice_campaign_id'))
      }
    }
  }
  async ad_pages(){
    await this.authAPIService.ad_pages_list().then(
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

  googleadsaccounts(){
    this.PFService.getgoogleadsaccounts().then(
      data=>{
        this.spin = false
        console.log(data)
      },
      err => {
        this.spin = false
        console.log(JSON.stringify(err));
      }      
    );
  }
 */
  voiceSelect(event){
    if (event.checked){
      this.voiceCampaignDisplay=true;
    }
    else {
      this.voiceCampaignDisplay=false;
      this.selectedAutomationData.voice=null;
    }
  }
  smsSelect(event){
    if (event.checked){
      this.smsCampaignDisplay=true;
    }
    else {
      this.smsCampaignDisplay= false;
      this.selectedAutomationData.sms=null;
    }
  }
  agentgroupSelect(event){
    if (event.checked){
      this.agentCampaignDisplay=true;
    }
    else {
      this.agentCampaignDisplay= false;
      this.selectedAutomationData.agentgroup=null;
    }
  }
  mailSelect(event){
    if (event.checked){
      this.mailCampaignDisplay=true;
    }
    else {
      this.mailCampaignDisplay= false;
      this.selectedAutomationData.email=null;
    }
  }

  getAutomationData(){
    this.digitalService.getAutomationSegments({}).then(
      data=>{
        this.segments = data['data'];
        console.log(data);
      },
      err=>{
        console.log(err)
      }
    );
   /*
    this.digitalService.getAutomationVoice({}).then(
      data=>{
        this.voiceCampaigns = data['data'];
        console.log(data);
      },
      err=>{
        console.log(err)
      }
    );

    this.digitalService.getAutomationSMS({}).then(
      data=>{
        this.smsCampaigns = data['data'];
        console.log(data);
      },
      err=>{
        console.log(err)
      }
    );

    this.digitalService.getAutomationMail({}).then(
      data=>{
        this.mailCampaigns = data['data'];
        console.log(data);
      },
      err=>{
        console.log(err)
      }
    );
   */
    this.digitalService.getAutomationagentgroup({}).then(
      data=>{
        this.agentgroupCampaigns = data['data'];
        console.log(data);
      },
      err=>{
        console.log(err)
      }
    );
  }


  changeAutomationCampaign(type,event){
    console.log(type);
    console.log(event);
    if (type=='segment'){
      this.selectedAutomationData.segment=event.value;
      this.segmentError = false
      console.log(event.value);
    }
    else if (type=='voice'){
      this.selectedAutomationData.voice=event.value;
      console.log(event.value);
    }
    else if (type=='mail'){
      this.selectedAutomationData.email=event.value;
      console.log(this.selectedAutomationData);
      console.log(event.value);
    }
    else if (type=='sms'){
      this.selectedAutomationData.sms=event.value;
      console.log(event.value);
    }
    else if (type=='agentgroup'){
      this.selectedAutomationData.agentgroup=event.value;
      this.agentgroupError = false
      console.log(event.value);
    }
  }

  createAdGroup(){
    if(this.data['type'] == 'google' || this.data['type'] == 'google_edit'){

      let data_ad: any = Object.assign(this.AdGroupForm.value);
      console.log(data_ad);
      
      if(data_ad.segment == null){
        this.segmentError = true
        this.spin = false
      }
      if(data_ad.agentgroup == null){
        this.agentgroupError = true
        this.spin = false
      }
      if(data_ad.ads_id == null){
        this.ads_idError = true
        this.spin = false
      }
      if(data_ad.agentgroup != null && data_ad.segment != null && data_ad.ads_id != null){
        console.log("heyy");
        this.digitalService.lead_ad_create_automation(data_ad).then(
          data=>{
            this.spin = false
            console.log(data)
            this.dialogRef.close();
            // this.router.navigate(['/async-cam']);
          },
          err => {
            this.spin = false
            console.log(JSON.stringify(err));
          }
          
        );
      
      }

    }else
    {

      this.spin = true
      console.log("start")
      let data = new FormData();
      let data_ad: any = Object.assign(this.AdGroupForm.value);
      //data_ad.automation = this.selectedAutomationData
      data_ad.page_data = this.savedCampaignData
      console.log(this.selectedAutomationData)
      if(data_ad.segment == null){
        console.log("No start")
        this.segmentError = true
        this.spin = false
      }
      if(data_ad.agentgroup == null){
        console.log("No start")
        this.agentgroupError = true
        this.spin = false
      }
      if(data_ad.agentgroup != null && data_ad.segment != null){
        console.log("Start")
        this.digitalService.createLeadsAd_manual(data_ad).then(
          data=>{
            this.spin = false
            console.log(data)
            this.dialogRef.close();
            this.router.navigate(['/async-cam']);
          },
          err => {
            this.spin = false
            console.log(JSON.stringify(err));
          }
          
        );
        
      }
      
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  copyText(){
    this.webhookurl=this.webhookurl+localStorage.getItem('access_id');
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.webhookurl
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._snackBar.open('Copy Webhook URL', '', {
      duration: 1000,
    });
    this.webhookurl_show = this.webhookurl;
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
        this.key = data['key']
        this.AdGroupForm.get('ads_id').setValue(this.key);
        this.AdGroupForm.get('page_id').setValue(this.key);
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
  
}
