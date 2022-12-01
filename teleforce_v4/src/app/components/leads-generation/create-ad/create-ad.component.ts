import { UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from "@angular/forms";
//import { isThisSecond } from 'date-fns';
//import { FacebookService } from '../../shared/facebook.service';
import {Router} from "@angular/router";
//import { PlatformService } from '../../shared/platform.service';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    //private authAPIService: FacebookService,
    private router: Router,
    //private PFService : PlatformService
    ) { }
  public AdGroupForm: FormGroup;
  page_data;
  languages_data;
  track_pixel;
  facebook;
  instagram;
  pub = []
  upload_name;
  page_select_event;
  map_country;
  enable_cat = false;
  enable_c = false;
  enable_m = false;
  enable_n = false;
  enable_fb = false;
  enable_ins = false;
  enable_pl = false;
  savedCampaignData;
  savedAd_setData;
  savedAd_setData2;
  disbaleSelect = true;
  adsetsubmit = false;
  facebook_place = ['feed','marketplace','video_feeds','right_hand_column','story','instream_video','search','instant_article'];
  instagram_place = ['stream','explore','story'];
  campaign_name_Editable = false;
  dailybudget_Editable = false;
  objective_Editable = false;
  adset_name_Editable = false;
  age_min = false;
  gender = false;
  language_key = false
  campaign_id;
  enable_track = false;
  pixel_id = 'NONE'
  async ngOnInit() {
    this.disbaleSelect = false;
    this.loadScript('./assets/js/ad-step-form.js');
    this.loadScript('./assets/js/hover.js');
    //this.fb_page();
    //this.language_list();
    //this.saved_audience();
    //this.ads_pixel_list();
    this.AdGroupForm = this.formBuilder.group({
      customerid:[''],
      objective:[''],
      campaign_name: ['', [Validators.required]],
      dailybudget:['', [Validators.required]],
      adset_name: ['',[Validators.required]],
      age_min: ['', [Validators.required]],
      age_max: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      language_key:['', [Validators.required]],
      special_ad_category:['[]'],
      bid_strategy:['LOWEST_COST_WITHOUT_CAP'],
      status:['PAUSED'],
      billing_event:['IMPRESSIONS'],
      countries:['', [Validators.required]],
      image_files: [''],
      adsName:[''],
      optimization_goal:[''],
      page_id:['', [Validators.required]],
      ad_account_id:['', [Validators.required]],
      page_offerid:[''],
      detail:['', [Validators.required]],
      offer_text:['', [Validators.required]],
      tim:['', [Validators.required]],
      offer_value:['', [Validators.required]],
      offer_url:['', [Validators.required]],
      form_name:[''],
      p_link:[''],
      w_link:[''],
      form_button:[''],
      form_website:[''],
      custom_event_type:['', [Validators.required]],
      autoplacements:['']
    });
    //this.loadingSavedCampaign();
   // this.loadingSavedadset();
  }

  onAddressChange(event) {
    console.log('onAddressChange', event)
    this.map_country = event.address.country_code.toUpperCase()
    console.log(this.map_country)
  }

  onCheckChange(event) {
    console.log("check"+event.target.value)
    this.page_select_event = event.target.value;
  }
  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
/*
  async fb_page(){
    await this.authAPIService.fb_page().then(
      data => {
        if (data != undefined) {
          this.page_data = data;
        }
      },
      err => {
        console.log("page_data Error :" + JSON.stringify(err));
      }
    );
  }

  async language_list(){
    await this.authAPIService.language_list().then(
      data => {
        if (data != undefined) {
          this.languages_data = data;
        }
      },
      err => {
        console.log("languages_data Error :" + JSON.stringify(err));
      }
    );
  }

  async saved_audience(){
    await this.authAPIService.audience_saved().then(
      data => {
        if (data != undefined) {
         console.log(data['data'])
        }
      },
      err => {
        console.log("languages_data Error :" + JSON.stringify(err));
      }
    );
  }

  async ads_pixel_list(){
    await this.authAPIService.ads_pixel_list().then(
      data => {
        if (data != undefined) {
          this.track_pixel = data
        }
      },
      err => {
        console.log("languages_data Error :" + JSON.stringify(err));
      }
    );
  }
*/
  upload(element) {
    let formData = new FormData();
    formData.append('file', element.target.files[0], localStorage.getItem('current_brand_id') );
    /*
    this.authAPIService.file_upload(formData).then(
      data=>{
        console.log(data);
        this.upload_name = data['name']
        console.log(this.upload_name);
      },
      err=>{
        console.log(err);
      }
    )
    */
  }

  createAdGroup() {
    let data = new FormData();
    this.facebook = ['feed','marketplace','video_feeds','right_hand_column','story','instream_video','search','instant_article'];
    this.instagram = ['stream','explore','story'];;
    let data_ad: any = Object.assign(this.AdGroupForm.value);
    if (data_ad.objective == 'REACH') {
      data_ad.optimization_goal = 'REACH';
    };
    if (data_ad.objective == 'BRAND_AWARENESS') {
      data_ad.optimization_goal = 'AD_RECALL_LIFT';
    };
    if (data_ad.objective == 'LINK_CLICKS') {
      data_ad.optimization_goal = 'LINK_CLICKS';
    };
    if (data_ad.objective == 'POST_ENGAGEMENT') {
      data_ad.optimization_goal = 'POST_ENGAGEMENT';
    };
    if (data_ad.objective == 'APP_INSTALLS') {
      data_ad.optimization_goal = 'APP_INSTALLS';
    };
    if (data_ad.objective == 'LEAD_GENERATION') {
      data_ad.optimization_goal = 'LEAD_GENERATION';
    };
    if (data_ad.objective == 'MESSAGES') {
      data_ad.optimization_goal = 'CONVERSATIONS';
    };
    if (data_ad.objective == 'CONVERSIONS') {
      data_ad.optimization_goal = 'OFFSITE_CONVERSIONS';
    };
    if (data_ad.objective == 'VIDEO_VIEWS') {
      data_ad.optimization_goal = 'THRUPLAY';
    }
    var edit_budget = data_ad.dailybudget + "00";
    data.append('page_id' , data_ad.page_id);
    var data_n = {'facebook':JSON.stringify(this.facebook_place), 'instagram':JSON.stringify(this.instagram_place), 'publish':JSON.stringify(this.pub), 'adaccount_id':'act_2782960858450991', 'objective':  data_ad.objective , 'optimization_goal': data_ad.optimization_goal, 'campaign_name': data_ad.campaign_name, 'special_ad_category': data_ad.special_ad_category, 'bid_strategy': data_ad.bid_strategy , 'status': data_ad.status, 'dailybudget': edit_budget, 'adset_name': data_ad.adset_name, 'billing_event':data_ad.billing_event, 'countries': this.map_country, 'gender': data_ad.gender, 'upload_name':this.upload_name, 'age_min':data_ad.age_min, 'age_max': data_ad.age_max, 'language_key':JSON.stringify(data_ad.language_key) , 'adsName': data_ad.adset_name, 'page_id':this.page_select_event, 'detail': data_ad.detail, 'tim':data_ad.tim, 'offer_url': data_ad.offer_url, 'offer_value': data_ad.offer_value, 'offer_text':data_ad.offer_text, 'page_offerid': this.page_select_event, 'form_name': data_ad.form_name , 'p_link': data_ad.p_link, 'w_link': data_ad.w_link, 'form_button': data_ad.form_button, 'form_website': data_ad.form_website, 'custom_event_type':data_ad.custom_event_type, 'placement': data_ad.autoplacements,'pixel_select':this.pixel_id}
    console.log("form is"+JSON.stringify(data_n))
    /*
     this.authAPIService.saveImages(data_n).then(
      data=>{
        this.router.navigate(['/campaign-list']);
      },
      err => {
        console.log(JSON.stringify(err));
      }
      
     );
     */
  }

  disableCat(val){
    if(val=='LINK_CLICKS'){
      this.enable_cat = true;
      this.enable_c = false;
      this.enable_m = false;
      this.enable_n = false;
    }
    else if(val=='LEAD_GENERATION'){
      this.enable_c = true;
      this.enable_cat = false;
      this.enable_m = false;
      this.enable_n = false;
    }
    else if(val=='MESSAGES'){
      this.enable_m = true;
      this.enable_cat = false;
      this.enable_c = false;
      this.enable_n = false;
    }
    else if(val=='CONVERSIONS'){
      this.enable_n = true;
      this.enable_cat = false;
      this.enable_c = false;
      this.enable_m = false;
    }
    else{
      this.enable_cat = false;
      this.enable_c = false;
      this.enable_m = false;
      this.enable_n = false;

    }
  }

  disablecaat(val){
    if(val.target.value=='fb'){
      this.enable_fb = !this.enable_fb;
      this.pub.push('facebook')
      console.log(this.pub)
    }
    else if(val.target.value=='ins'){
      this.enable_ins = !this.enable_ins;
      this.pub.push('instagram')
      console.log(this.pub)
    }
    if(this.enable_fb || this.enable_ins){this.enable_pl = true}
    else{
      this.enable_pl = false;
    }
  }

  disablecaatt(val){
    if (val.checked == true){
      this.enable_track = true
    }else{
      this.enable_track = false
    }
  }

  disablecaattt(index){
    console.log(this.pixel_id)
    this.pixel_id = index;
    console.log(this.pixel_id)
  }


  setAll(completed) {
    console.log(completed.source.value)
    console.log(completed.checked)
    if (completed.checked==false){
      this.facebook_place.splice(this.facebook_place.indexOf(completed.source.value),1)
      console.log(this.facebook_place)
    }
    else if(completed.checked==true){
      this.facebook_place.push(completed.source.value)
      console.log(this.facebook_place)
    }

  }

  setIn(completed) {
    console.log(completed.source.value)
    console.log(completed.checked)
    if (completed.checked==false){
      this.instagram_place.splice(this.instagram_place.indexOf(completed.source.value),1)
      console.log(this.instagram_place)
    }
    else if(completed.checked==true){
      this.instagram_place.push(completed.source.value)
      console.log(this.instagram_place)
    }

  }

  disable(){
    this.campaign_name_Editable = true;
    this.dailybudget_Editable = true;
    this.objective_Editable = true;
    this.adset_name_Editable = true;
    this.age_min = true;
    this.gender = true;
    this.language_key = true
  }
  /*
  loadingSavedCampaign(){
    this.savedCampaignData=this.PFService.getSavedCampiagnData();
    if (this.savedCampaignData){
      this.campaign_name_Editable = true;
      this.dailybudget_Editable = true;
      this.objective_Editable = true;
      this.campaign_id = this.savedCampaignData.campaign_id;
      this.AdGroupForm = this.formBuilder.group({
        customerid:[''],
        objective:[this.savedCampaignData.campaign_objective],
        campaign_name: [this.savedCampaignData.campaign_name],
        dailybudget:[this.savedCampaignData.campaign_budget/100],
        adset_name: ['',[Validators.required]],
        age_min: ['', [Validators.required]],
        age_max: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        language_key:['', [Validators.required]],
        special_ad_category:['[]'],
        bid_strategy:['LOWEST_COST_WITHOUT_CAP'],
        status:['PAUSED'],
        billing_event:['IMPRESSIONS'],
        countries:['', [Validators.required]],
        image_files: [''],
        adsName:[''],
        optimization_goal:[''],
        page_id:['', [Validators.required]],
        ad_account_id:['', [Validators.required]],
        page_offerid:[''],
        detail:['', [Validators.required]],
        offer_text:['', [Validators.required]],
        tim:['', [Validators.required]],
        offer_value:['', [Validators.required]],
        offer_url:['', [Validators.required]],
        form_name:[''],
        p_link:[''],
        w_link:[''],
        form_button:[''],
        form_website:[''],
        custom_event_type:['', [Validators.required]],
        autoplacements:['']
      });
      var val = this.savedCampaignData.campaign_objective;
      if(val=='LINK_CLICKS'){
        this.enable_cat = true;
        this.enable_c = false;
        this.enable_m = false;
        this.enable_n = false;
      }
      else if(val=='LEAD_GENERATION'){
        this.enable_c = true;
        this.enable_cat = false;
        this.enable_m = false;
        this.enable_n = false;
      }
      else if(val=='MESSAGES'){
        this.enable_m = true;
        this.enable_cat = false;
        this.enable_c = false;
        this.enable_n = false;
      }
      else if(val=='CONVERSIONS'){
        this.enable_n = true;
        this.enable_cat = false;
        this.enable_c = false;
        this.enable_m = false;
      }
      else{
        this.enable_cat = false;
        this.enable_c = false;
        this.enable_m = false;
        this.enable_n = false;
  
      }
      this.adsetsubmit = true
    }
  }

  loadingSavedadset(){
    this.savedAd_setData=this.PFService.getSavedCampiagnid();
    if (this.savedAd_setData){
      var data_n = {'adset_id':this.savedAd_setData.adset_id}
    this.authAPIService.ad_set_data(data_n).then(
      data=>{
        console.log(this.savedAd_setData)
        this.savedAd_setData2 = data
        this.disable();
        console.log(this.savedAd_setData.campaign_name);
        this.campaign_id = this.savedAd_setData.campaign_id;
        this.AdGroupForm = this.formBuilder.group({
          customerid:[''],
          objective:[this.savedAd_setData.campaign_objective],
          campaign_name: [this.savedAd_setData.campaign_name],
          dailybudget:[this.savedAd_setData.campaign_budget/100],
          adset_name: [this.savedAd_setData.adset_name],
          age_min: [JSON.stringify(this.savedAd_setData2['age_min'])],
          age_max: [JSON.stringify(this.savedAd_setData2['age_max'])],
          gender: [JSON.stringify(this.savedAd_setData2['genders'][0])],
          language_key:[JSON.stringify(this.savedAd_setData2['locales'][1])],
          special_ad_category:['[]'],
          bid_strategy:['LOWEST_COST_WITHOUT_CAP'],
          status:['PAUSED'],
          billing_event:['IMPRESSIONS'],
          countries:['', [Validators.required]],
          image_files: [''],
          adsName:[''],
          optimization_goal:[''],
          page_id:['', [Validators.required]],
          ad_account_id:['', [Validators.required]],
          page_offerid:[''],
          detail:['', [Validators.required]],
          offer_text:['', [Validators.required]],
          tim:['', [Validators.required]],
          offer_value:['', [Validators.required]],
          offer_url:['', [Validators.required]],
          form_name:[''],
          p_link:[''],
          w_link:[''],
          form_button:[''],
          form_website:[''],
          custom_event_type:['', [Validators.required]],
          autoplacements:['']
        });
        var val = this.savedAd_setData.campaign_objective;
        if(val=='LINK_CLICKS'){
          this.enable_cat = true;
          this.enable_c = false;
          this.enable_m = false;
          this.enable_n = false;
        }
        else if(val=='LEAD_GENERATION'){
          this.enable_c = true;
          this.enable_cat = false;
          this.enable_m = false;
          this.enable_n = false;
        }
        else if(val=='MESSAGES'){
          this.enable_m = true;
          this.enable_cat = false;
          this.enable_c = false;
          this.enable_n = false;
        }
        else if(val=='CONVERSIONS'){
          this.enable_n = true;
          this.enable_cat = false;
          this.enable_c = false;
          this.enable_m = false;
        }
        else{
          this.enable_cat = false;
          this.enable_c = false;
          this.enable_m = false;
          this.enable_n = false;

        }
        },
      err => {
        console.log(JSON.stringify(err));
      }
      
    );
    if (this.savedAd_setData){
      
      this.adsetsubmit = true
    }
    }
    
  }



  createAdSet() {
    let data = new FormData();
    this.facebook = ['feed','marketplace','video_feeds','right_hand_column','story','instream_video','search','instant_article'];
    this.instagram = ['stream','explore','story'];;
    let data_ad: any = Object.assign(this.AdGroupForm.value);
    if (data_ad.objective == 'REACH') {
      data_ad.optimization_goal = 'REACH';
    };
    if (data_ad.objective == 'BRAND_AWARENESS') {
      data_ad.optimization_goal = 'AD_RECALL_LIFT';
    };
    if (data_ad.objective == 'LINK_CLICKS') {
      data_ad.optimization_goal = 'LINK_CLICKS';
    };
    if (data_ad.objective == 'POST_ENGAGEMENT') {
      data_ad.optimization_goal = 'POST_ENGAGEMENT';
    };
    if (data_ad.objective == 'APP_INSTALLS') {
      data_ad.optimization_goal = 'APP_INSTALLS';
    };
    if (data_ad.objective == 'LEAD_GENERATION') {
      data_ad.optimization_goal = 'LEAD_GENERATION';
    };
    if (data_ad.objective == 'MESSAGES') {
      data_ad.optimization_goal = 'CONVERSATIONS';
    };
    if (data_ad.objective == 'CONVERSIONS') {
      data_ad.optimization_goal = 'OFFSITE_CONVERSIONS';
    };
    if (data_ad.objective == 'VIDEO_VIEWS') {
      data_ad.optimization_goal = 'THRUPLAY';
    }
    var edit_budget = data_ad.dailybudget + "00";
    data.append('page_id' , data_ad.page_id);
    var data_n = {'facebook':JSON.stringify(this.facebook_place), 'instagram':JSON.stringify(this.instagram_place), 'publish':JSON.stringify(this.pub), 'adaccount_id':'act_2782960858450991', 'objective':  data_ad.objective , 'optimization_goal': data_ad.optimization_goal, 'campaign_name': data_ad.campaign_name,'campaign_id':this.campaign_id, 'special_ad_category': data_ad.special_ad_category, 'bid_strategy': data_ad.bid_strategy , 'status': data_ad.status, 'dailybudget': edit_budget, 'adset_name': data_ad.adset_name, 'billing_event':data_ad.billing_event, 'countries': this.map_country, 'gender': data_ad.gender, 'upload_name':this.upload_name, 'age_min':data_ad.age_min, 'age_max': data_ad.age_max, 'language_key':JSON.stringify(data_ad.language_key) , 'adsName': data_ad.adset_name, 'page_id':this.page_select_event, 'detail': data_ad.detail, 'tim':data_ad.tim, 'offer_url': data_ad.offer_url, 'offer_value': data_ad.offer_value, 'offer_text':data_ad.offer_text, 'page_offerid': this.page_select_event, 'form_name': data_ad.form_name , 'p_link': data_ad.p_link, 'w_link': data_ad.w_link, 'form_button': data_ad.form_button, 'form_website': data_ad.form_website, 'custom_event_type':data_ad.custom_event_type, 'placement': data_ad.autoplacements,'pixel_select':this.pixel_id}
    console.log("form is"+JSON.stringify(data_n))
    this.authAPIService.ad_set_create(data_n).then(
      data=>{
            this.router.navigate(['/campaign-list']);
      },
      err => {
        console.log(JSON.stringify(err));
      }
      
    );
  }
 */
    
}
