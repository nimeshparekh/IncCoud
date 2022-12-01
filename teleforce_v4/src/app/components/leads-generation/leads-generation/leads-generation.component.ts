import { UpperCasePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from "@angular/forms";
//import { isThisSecond } from 'date-fns';
//import { FacebookService } from '../../shared/facebook.service';
//import { AuthService } from '../../shared/auth.service';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
//import { PlatformService } from '../../shared/platform.service';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostMediaComponent } from '../post-media/post-media.component';
import { group } from '@angular/animations';
import { DigitalService } from '../../../digital.service';
@Component({
  selector: 'app-leads-generation',
  templateUrl: './leads-generation.component.html',
  styleUrls: ['./leads-generation.component.css']
})
export class LeadsGenerationComponent implements OnInit {

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, 
    private router: Router, 
    private _snackBar: MatSnackBar,
    private digitalService : DigitalService,
    ) { }
  public AdGroupForm: FormGroup;
  page_data;
  languages_data;
  track_pixel;
  facebook;
  instagram;
  pub = []
  upload_name;
  adset_questions = ['EMAIL', 'FULL_NAME'];
  page_select_event;
  map_country = "IN";
  enable_cat = false;
  enable_c = false;
  enable_m = false;
  enable_n = false;
  enable_fb = false;
  enable_ins = false;
  enable_pl = false;
  //file upload
  loadingfile = false;
  uploaded_file_data = [];
  uploaded_file_name = [];
  uploaded_file_type = [];
  file_in_post_count = 0;
  image_to_show: any[] = [];
  video_to_show: any[] = [];
  //
  //automation
  voiceCampaignDisplay = false;
  mailCampaignDisplay = false;
  smsCampaignDisplay = false;
  agentCampaignDisplay = false
  voiceCampaigns;
  smsCampaigns;
  segmentError = false
  agentgroupError = false
  mailCampaigns;
  selectedAutomationData = { segment: null, voice: null, sms: null, email: null, agentgroup: null };
  //
  savedCampaignData;
  savedAd_setData;
  savedAd_setData2;
  agentgroupCampaigns
  disbaleSelect = true;
  adsetsubmit = false;
  facebook_place = ['feed', 'marketplace', 'video_feeds', 'right_hand_column', 'story', 'instream_video', 'search', 'instant_article'];
  instagram_place = ['stream', 'explore', 'story'];
  campaign_name_Editable = false;
  dailybudget_Editable = false;
  objective_Editable = false;
  adset_name_Editable = false;
  age_min = false;
  gender = false;
  language_key = false
  campaign_id;
  enable_track = false;
  pixel_id = 'NONE';
  segments;
  audience_data;
  audience;
  flexible_spec
  geo_locations;
  spin = false;
  next = false;
  msg = "";
  async ngOnInit() {
    this.disbaleSelect = false;
    this.loadScript('./assets/js/ad-step-form.js');
    this.loadScript('./assets/js/hover.js');
    this.ad_pages();
    this.language_list();
    this.saved_audience();
    this.ads_pixel_list();
    this.AdGroupForm = this.formBuilder.group({
      customerid: [''],
      objective: ['LEAD_GENERATION'],
      campaign_name: ['', [Validators.required]],
      dailybudget: ['', [Validators.required]],
      adset_name: ['', [Validators.required]],
      age_min: ['', [Validators.required]],
      age_max: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      language_key: ['', [Validators.required]],
      special_ad_category: ['[]'],
      bid_strategy: ['LOWEST_COST_WITHOUT_CAP'],
      status: ['ACTIVE'],
      billing_event: ['IMPRESSIONS'],
      countries: ['', [Validators.required]],
      image_files: [''],
      adsName: [''],
      optimization_goal: [''],
      page_id: ['', [Validators.required]],
      ad_account_id: ['', [Validators.required]],
      creative_message: ['', Validators.required],
      cta_prompt: ['', Validators.required],
      page_offerid: [''],
      detail: ['', [Validators.required]],
      offer_text: ['', [Validators.required]],
      tim: ['', [Validators.required]],
      offer_value: ['', [Validators.required]],
      offer_url: ['', [Validators.required]],
      formQuestions: [''],
      form_name: [''],
      p_link: [''],
      w_link: [''],
      form_button: [''],
      form_website: [''],
      custom_event_type: ['', [Validators.required]],
      autoplacements: [''],
    });
    this.loadingSavedCampaign();
    this.loadingSavedadset();
    this.getAutomationData();
    this.get_audience()
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

  checkAdsBalance() {
    let data_ad: any = Object.assign(this.AdGroupForm.value);
    //console.log(data_ad.dailybudget);
      this.digitalService.getUserBalance().then(
        data => {
          var adsbalance = ((data['balance']).Ads_User_Balance);
          if(adsbalance==0){
            this.msg="Your Ads plan balance is "+adsbalance+".Please renew Ads Plan";
            //this.AdGroupForm.get("dailybudget").setValue(null);
            this.next=true;
          }else  if(data_ad.dailybudget<=adsbalance){
            this.msg="";
            this.next=false;
          }else{
            this.msg="Your Ads plan balance is "+adsbalance+".Please enter amount below " +adsbalance;
            //this.AdGroupForm.get("dailybudget").setValue(null);
            this.next=true;
          }
        },
        err => {
          console.log(err);
        }
      );
  }


  getAutomationData() {
    this.digitalService.getAutomationSegments({}).then(
      data => {
        this.segments = data['data'];
        console.log(data);
      },
      err => {
        console.log(err)
      }
    );

    this.digitalService.getAutomationVoice({}).then(
      data => {
        this.voiceCampaigns = data['data'];
        console.log(data);
      },
      err => {
        console.log(err)
      }
    );

    this.digitalService.getAutomationSMS({}).then(
      data => {
        this.smsCampaigns = data['data'];
        console.log(data);
      },
      err => {
        console.log(err)
      }
    );

    this.digitalService.getAutomationMail({}).then(
      data => {
        this.mailCampaigns = data['data'];
        console.log(data);
      },
      err => {
        console.log(err)
      }
    );
  }

  async get_audience() {
    console.log("data")
    await this.digitalService.get_audience().then(
      data => {
        if (data != undefined) {
          console.log(data['data'])
          this.audience_data = data['data']
        }
      },
      err => {
        console.log("languages_data Error :" + JSON.stringify(err));
      }
    );
    this.digitalService.getAutomationagentgroup({}).then(
      data => {
        this.agentgroupCampaigns = data['data'];
        console.log(data);
      },
      err => {
        console.log(err)
      }
    );
  }

  onaudienceSelection1(data) {
    this.audience = this.audience_data[data];
    console.log(this.audience)
    var data1 = this.audience['detailed_targeting']
    var data2 = JSON.parse(data1)
    var audience_t = []
    var i;
    var interests = []
    var behaviors = []
    var demographics = []
    var connections = []
    var friends_of_connections = []
    var custom_audiences = []
    var college_years = []
    var education_majors = []
    var education_schools = []
    var education_statuses = []
    var family_statuses = []
    var home_value = []
    var interested_in = []
    var income = []
    var life_events = []
    var user_adclusters = []
    var work_positions = []
    var work_employers = []
    var industries = []
    for (i = 0; i < data2.length; i++) {
      console.log(data2[i].type)
      if (data2[i].type == 'interests') {
        interests.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'behaviors') {
        behaviors.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'demographics') {
        demographics.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'connections') {
        connections.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'friends_of_connections') {
        friends_of_connections.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'custom_audiences') {
        custom_audiences.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'college_years') {
        college_years.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'education_majors') {
        education_majors.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'education_schools') {
        education_schools.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'education_statuses') {
        education_statuses.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'family_statuses') {
        family_statuses.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'home_value') {
        home_value.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'interested_in') {
        interested_in.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'income') {
        income.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'life_events') {
        life_events.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'user_adclusters') {
        user_adclusters.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'work_positions') {
        work_positions.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'work_employers') {
        work_employers.push({ "id": data2[i].id, "name": data2[i].name })
      } else if (data2[i].type == 'industries') {
        industries.push({ "id": data2[i].id, "name": data2[i].name })
      }
    }
    if (interests.length != 0) {
      audience_t.push({ 'interests': interests })
    }
    if (behaviors.length != 0) {
      audience_t.push({ 'behaviors': behaviors })
    }
    if (demographics.length != 0) {
      audience_t.push({ 'demographics': demographics })
    }
    if (connections.length != 0) {
      audience_t.push({ 'connections': connections })
    }
    if (friends_of_connections.length != 0) {
      audience_t.push({ 'friends_of_connections': friends_of_connections })
    }
    if (custom_audiences.length != 0) {
      audience_t.push({ 'custom_audiences': custom_audiences })
    }
    if (college_years.length != 0) {
      audience_t.push({ 'college_years': college_years })
    }
    if (education_majors.length != 0) {
      audience_t.push({ 'education_majors': education_majors })
    }
    if (education_schools.length != 0) {
      audience_t.push({ 'education_schools': education_schools })
    }
    if (education_statuses.length != 0) {
      audience_t.push({ 'education_statuses': education_statuses })
    }
    if (family_statuses.length != 0) {
      audience_t.push({ 'family_statuses': family_statuses })
    }
    if (home_value.length != 0) {
      audience_t.push({ 'home_value': home_value })
    }
    if (interested_in.length != 0) {
      audience_t.push({ 'interested_in': interested_in })
    }
    if (income.length != 0) {
      audience_t.push({ 'income': income })
    }
    if (life_events.length != 0) {
      audience_t.push({ 'life_events': life_events })
    }
    if (user_adclusters.length != 0) {
      audience_t.push({ 'user_adclusters': user_adclusters })
    }
    if (work_positions.length != 0) {
      audience_t.push({ 'work_positions': work_positions })
    }
    if (work_employers.length != 0) {
      audience_t.push({ 'work_employers': work_employers })
    }
    if (industries.length != 0) {
      audience_t.push({ 'industries': industries })
    }
    this.flexible_spec = audience_t




    //geotargeting loops

    var data3 = this.audience['geo_targeting']
    var data4 = JSON.parse(data3)
    var audience_g = []
    var j;
    var country_group = []
    var country = []
    var region = []
    var city = []
    var zip = []
    var neighborhood = []
    var geo_market = []
    var medium_geo_area = []
    var large_geo_area = []
    var small_geo_area = []
    var subcity = []
    var subneighborhood = []
    var metro_area = []
    var electoral_district = []
    for (j = 0; j < data4.length; j++) {
      console.log(data4[j].type)
      if (data4[j].type == 'country_group') {
        country_group.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "is_worldwide": data4[j].is_worldwide, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city })
      } else if (data4[j].type == 'country') {
        country.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city })
      } else if (data4[j].type == 'region') {
        region.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name })
      }
      else if (data4[j].type == 'city') {
        city.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "distance_unit": "kilometer", "radius": data4[j].radius })
      }
      else if (data4[j].type == 'zip') {
        zip.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "primary_city": data4[j].primary_city, "primary_city_id": data4[j].primary_city_id })
      }
      else if (data4[j].type == 'neighborhood') {
        neighborhood.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      }
      else if (data4[j].type == 'geo_market') {
        geo_market.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name })
      } else if (data4[j].type == 'medium_geo_area') {
        medium_geo_area.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      } else if (data4[j].type == 'large_geo_area') {
        large_geo_area.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      } else if (data4[j].type == 'small_geo_area') {
        small_geo_area.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      } else if (data4[j].type == 'subcity') {
        subcity.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      } else if (data4[j].type == 'subneighborhood') {
        subneighborhood.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      } else if (data4[j].type == 'metro_area') {
        metro_area.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      } else if (data4[j].type == 'electoral_district') {
        electoral_district.push({ "key": data4[j].key, "name": data4[j].name, "type": data4[j].type, "country": data4[j].country_code, "supports_region": data4[j].supports_region, "supports_city": data4[j].supports_city, "country_name": data4[j].country_name, "region": data4[j].region, "region_id": data4[j].region_id, "geo_hierarchy_level": data4[j].geo_hierarchy_level, "geo_hierarchy_name": data4[j].geo_hierarchy_name })
      }
    }
    if (country_group.length != 0) {
      audience_g.push({ 'country_group': country_group })
    }
    if (country.length != 0) {
      console.log(country[0].key)
      audience_g.push({ 'countries': [country[0].key] })
      // this.map_country = country[0].key
    }
    if (region.length != 0) {
      audience_g.push({ 'regions': region })
    }
    if (city.length != 0) {
      audience_g.push({ 'cities': city })
    }
    if (zip.length != 0) {
      audience_g.push({ 'zips': zip })
    }
    if (neighborhood.length != 0) {
      audience_g.push({ 'neighborhood': neighborhood })
    }
    if (geo_market.length != 0) {
      audience_g.push({ 'geo_market': geo_market })
    }
    if (medium_geo_area.length != 0) {
      audience_g.push({ 'medium_geo_area': medium_geo_area })
    }
    if (large_geo_area.length != 0) {
      audience_g.push({ 'large_geo_area': large_geo_area })
    }
    if (small_geo_area.length != 0) {
      audience_g.push({ 'small_geo_area': small_geo_area })
    }
    if (subcity.length != 0) {
      audience_g.push({ 'subcity': subcity })
    }
    if (subneighborhood.length != 0) {
      audience_g.push({ 'subneighborhood': subneighborhood })
    }
    if (metro_area.length != 0) {
      audience_g.push({ 'metro_area': metro_area })
    }
    if (electoral_district.length != 0) {
      audience_g.push({ 'electoral_district': electoral_district })
    }
    this.geo_locations = audience_g
    console.log(this.audience['gender'])
  }

  voiceSelect(event) {
    if (event.checked) {
      this.voiceCampaignDisplay = true;
    }
    else {
      this.voiceCampaignDisplay = false;
      this.selectedAutomationData.voice = null;
    }
  }
  smsSelect(event) {
    if (event.checked) {
      this.smsCampaignDisplay = true;
    }
    else {
      this.smsCampaignDisplay = false;
      this.selectedAutomationData.sms = null;
    }
  }
  mailSelect(event) {
    if (event.checked) {
      this.mailCampaignDisplay = true;
    }
    else {
      this.mailCampaignDisplay = false;
      this.selectedAutomationData.email = null;
    }
  }
  agentgroupSelect(event) {
    if (event.checked) {
      this.agentCampaignDisplay = true;
    }
    else {
      this.agentCampaignDisplay = false;
      this.selectedAutomationData.agentgroup = null;
    }
  }

  changeAutomationCampaign(type, event) {
    console.log(type);
    if (type == 'segment') {
      this.selectedAutomationData.segment = event.value;
      this.segmentError = false
      console.log(event.value);
    }
    else if (type == 'voice') {
      this.selectedAutomationData.voice = event.value;
      console.log(event.value);
    }
    else if (type == 'mail') {
      this.selectedAutomationData.email = event.value;
      console.log(this.selectedAutomationData);
      console.log(event.value);
    }
    else if (type == 'sms') {
      this.selectedAutomationData.sms = event.value;
      console.log(event.value);
    }
    else if (type == 'agentgroup') {
      this.selectedAutomationData.agentgroup = event.value;
      this.agentgroupError = false
      console.log(event.value);
    }
  }
  onAddressChange(event) {
    console.log('onAddressChange', event.address.country_code);
    this.map_country = event.address.country_code.toUpperCase()
    console.log(this.map_country)
  }

  onCheckChange(event) {
    console.log("check" + event.target.value)
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

  async ad_pages() {
    await this.digitalService.ad_pages().then(
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

  async language_list() {
    await this.digitalService.language_list().then(
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

  async saved_audience() {
    await this.digitalService.audience_saved().then(
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

  async ads_pixel_list() {
    await this.digitalService.ads_pixel_list().then(
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

  // upload(element) {
  //   let formData = new FormData();
  //   formData.append('file', element.target.files[0], localStorage.getItem('current_brand_id') );
  //   this.authAPIService.file_upload(formData).then(
  //     data=>{
  //       console.log(data);
  //       this.upload_name = data['name']
  //       console.log(this.upload_name);
  //     },
  //     err=>{
  //       console.log(err);
  //     }
  //   )
  // }

  getImageFromService(img_data, img_names, mimeType) {
    if (mimeType.substring(0, 5) == 'video') {
      this.createVideoFromBlob(img_names);
    }
    else {
      this.createImageFromBlob(img_names);
    }
  }


  createImageFromBlob(image) {
    this.image_to_show[this.file_in_post_count] = image;
    this.file_in_post_count += 1;
    // let reader = new FileReader();
    // reader.addEventListener("load", () => {
    //   console.log("file in post count: "+this.file_in_post_count);
    //   this.image_to_show[this.file_in_post_count] = reader.result;
    //   console.log(this.image_to_show);
    //   this.file_in_post_count+=1;
    // }, false);

    // if (image) {
    //   console.log("IF=yes in createimagefromblob");
    //   reader.readAsDataURL(image);
    // }
  }

  createVideoFromBlob(video) {
    this.image_to_show[this.file_in_post_count] = 'video';
    this.video_to_show[0] = video;
    this.file_in_post_count += 1;
    // let reader = new FileReader();
    // reader.addEventListener("load", () => {
    //   console.log("file in post count(video found): "+this.file_in_post_count);
    //   this.video_to_show[0] = reader.result;
    //   this.openDialog1();
    //   this.image_to_show[this.file_in_post_count] = 'video';
    //   this.file_in_post_count+=1;
    // }, false);
    // if (video) {
    //   console.log("IF=yes in createvideofromblob");
    //   reader.readAsDataURL(video);
    // }
  }

  upload(element) {
    const file: File = element.target.files[0];
    // console.log('size', file.size);
    // console.log('type', file.type);
    // console.log("Called Upload");
    // console.log(element);
    if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'video/mp4') {
      this.spin = true
      var formData = new FormData();
      // formData.append('brand_id', localStorage.getItem('current_brand_id') );
      formData.append('file', element.target.files[0], localStorage.getItem('current_brand_id'));
      this.digitalService.file_upload(formData).then(
        data => {
          // let response = JSON.parse(data); //success server response
          //console.log(data);
          this.spin = false
          this._snackBar.open(data['msg'], 'Close', {
            duration: 5000,
          });
          this.uploaded_file_data[this.file_in_post_count] = data['name'];
          this.uploaded_file_name[this.file_in_post_count] = data['link'];
          this.uploaded_file_type[this.file_in_post_count] = data['type'];
          console.log("Trying to get file: " + this.uploaded_file_name[this.file_in_post_count]);
          //this.image_to_show[this.file_in_post_count] = data['link'];
          this.getImageFromService(this.uploaded_file_data[this.file_in_post_count], this.uploaded_file_name[this.file_in_post_count], this.uploaded_file_type[this.file_in_post_count]);
        },
        err => {
          this.spin = false
          console.log(err);
          this._snackBar.open('Something went wrong.please try again!', 'Close', {
            duration: 5000,
          });
        }
      )
    } else {
      this.spin = false
      this._snackBar.open('File format invalid!', 'Close', {
        duration: 5000,
      });
    }
  }

  openmedia() {
    const dialogRef = this.dialog.open(PostMediaComponent, { width: '80%', disableClose: true, data: {} });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed');
        console.log(result);
        if (result.event == "Add") {
          result.filesdata.map((element, i) => {
            this.uploaded_file_name[i] = element['media_link'];
            this.uploaded_file_type[i] = element['media_type'];
            this.uploaded_file_data[i] = element['media_name'];
            //this.image_to_show[i] = element['media_link'];
            this.getImageFromService('', this.uploaded_file_name[i], this.uploaded_file_type[i]);
          })
        }
      }
    });
  }

  createAdGroup() {
    this.spin = true
    if (this.selectedAutomationData.segment == null) {
      console.log("No start")
      this.segmentError = true
      this.spin = false
    }
    if (this.selectedAutomationData.agentgroup == null) {
      console.log("No start")
      this.agentgroupError = true
      this.spin = false
    }
    let data = new FormData();
    // not used looks like 
    // this.facebook = ['feed','marketplace','video_feeds','right_hand_column','story','instream_video','search','instant_article'];
    // this.instagram = ['stream','explore','story'];;
    let data_ad: any = Object.assign(this.AdGroupForm.value);
    // if (data_ad.objective == 'REACH') {
    //   data_ad.optimization_goal = 'REACH';
    // };
    // if (data_ad.objective == 'BRAND_AWARENESS') {
    //   data_ad.optimization_goal = 'AD_RECALL_LIFT';
    // };
    // if (data_ad.objective == 'LINK_CLICKS') {
    //   data_ad.optimization_goal = 'LINK_CLICKS';
    // };
    // if (data_ad.objective == 'POST_ENGAGEMENT') {
    //   data_ad.optimization_goal = 'POST_ENGAGEMENT';
    // };
    // if (data_ad.objective == 'APP_INSTALLS') {
    //   data_ad.optimization_goal = 'APP_INSTALLS';
    // };
    // if (data_ad.objective == 'LEAD_GENERATION') {
    //   data_ad.optimization_goal = 'LEAD_GENERATION';
    // };
    // if (data_ad.objective == 'MESSAGES') {
    //   data_ad.optimization_goal = 'CONVERSATIONS';
    // };
    // if (data_ad.objective == 'CONVERSIONS') {
    //   data_ad.optimization_goal = 'OFFSITE_CONVERSIONS';
    // };
    // if (data_ad.objective == 'VIDEO_VIEWS') {
    //   data_ad.optimization_goal = 'THRUPLAY';
    // }
    var edit_budget = data_ad.dailybudget + "00";
    data.append('page_id', data_ad.page_id);
    var questionString = '';
    this.adset_questions.map((element, i) => {
      questionString = questionString + "{'type':'" + element + "'},"
    })
    console.log(questionString)
    var data_n = {
      'facebook': JSON.stringify(this.facebook_place), 'instagram': JSON.stringify(this.instagram_place), 'formQuestions': questionString, 'publish': JSON.stringify(this.pub), 'objective': data_ad.objective, 'optimization_goal': data_ad.optimization_goal, 'campaign_name': data_ad.campaign_name, 'special_ad_category': data_ad.special_ad_category, 'bid_strategy': data_ad.bid_strategy, 'status': data_ad.status, 'dailybudget': edit_budget, 'adset_name': data_ad.adset_name, 'billing_event': data_ad.billing_event, 'gender': this.audience['gender'],
      'upload_name': this.uploaded_file_data[0], 'upload_link': this.uploaded_file_name[0], 'age_min': this.audience['age_min'], 'age_max': this.audience['age_max'], 'language_key': this.audience['language_key'], 'adsName': data_ad.adsName, 'page_id': this.page_select_event, 'detail': data_ad.detail, 'tim': data_ad.tim, 'offer_url': data_ad.offer_url, 'offer_value': data_ad.offer_value, 'offer_text': data_ad.offer_text, 'page_offerid': this.page_select_event, 'form_name': data_ad.form_name, 'p_link': data_ad.p_link, 'w_link': data_ad.w_link, 'form_button': data_ad.form_button, 'form_website': data_ad.form_website, 'custom_event_type': data_ad.custom_event_type, 'placement': data_ad.autoplacements, 'pixel_select': this.pixel_id,
      'creative_message': data_ad.creative_message, 'cta_prompt': data_ad.cta_prompt, 'flexible_spec': this.flexible_spec, 'geo_locations': this.geo_locations,
      automation: this.selectedAutomationData
    };
    console.log("form is" + JSON.stringify(data_n))

    if (this.selectedAutomationData.agentgroup != null && this.selectedAutomationData.segment != null) {
      this.digitalService.createLeadsAd(data_n).then(
        data => {
          this.spin = false
          this.router.navigate(['/campaign-list']);
        },
        err => {
          this.spin = false
          console.log(JSON.stringify(err));
        }

      );
    }
  }


  submitValidation() {
    if (this.smsCampaignDisplay) {
      if (this.selectedAutomationData.sms == null) {
        return false;
      }
      else {
        return this.segmentChecker();
      }
    }
    if (this.voiceCampaignDisplay) {
      if (this.selectedAutomationData.voice == null) {
        return false;
      }
      else {
        return this.segmentChecker();
      }
    }
    if (this.mailCampaignDisplay) {
      if (this.selectedAutomationData.email == null) {
        return false;
      }
      else {
        return this.segmentChecker();
      }
    }
    else {
      return true;
    }
  }

  segmentChecker() {
    if (this.selectedAutomationData.segment == null) {
      return false;
    }
    else {
      return true;
    }
  }

  disableCat(val) {
    if (val == 'LINK_CLICKS') {
      this.enable_cat = true;
      this.enable_c = false;
      this.enable_m = false;
      this.enable_n = false;
    }
    else if (val == 'LEAD_GENERATION') {
      this.enable_c = true;
      this.enable_cat = false;
      this.enable_m = false;
      this.enable_n = false;
    }
    else if (val == 'MESSAGES') {
      this.enable_m = true;
      this.enable_cat = false;
      this.enable_c = false;
      this.enable_n = false;
    }
    else if (val == 'CONVERSIONS') {
      this.enable_n = true;
      this.enable_cat = false;
      this.enable_c = false;
      this.enable_m = false;
    }
    else {
      this.enable_cat = false;
      this.enable_c = false;
      this.enable_m = false;
      this.enable_n = false;

    }
  }

  disablecaat(val) {
    if (val.target.value == 'fb') {
      this.enable_fb = !this.enable_fb;
      this.pub.push('facebook')
      console.log(this.pub)
    }
    else if (val.target.value == 'ins') {
      this.enable_ins = !this.enable_ins;
      this.pub.push('instagram')
      console.log(this.pub)
    }
    if (this.enable_fb || this.enable_ins) { this.enable_pl = true }
    else {
      this.enable_pl = false;
    }
  }

  disablecaatt(val) {
    if (val.checked == true) {
      this.enable_track = true
    } else {
      this.enable_track = false
    }
  }

  disablecaattt(index) {
    console.log(this.pixel_id)
    this.pixel_id = index;
    console.log(this.pixel_id)
  }


  setAll(completed) {
    console.log(completed.source.value)
    console.log(completed.checked)
    if (completed.checked == false) {
      this.facebook_place.splice(this.facebook_place.indexOf(completed.source.value), 1)
      console.log(this.facebook_place)
    }
    else if (completed.checked == true) {
      this.facebook_place.push(completed.source.value)
      console.log(this.facebook_place)
    }

  }

  questionArr(completed) {
    console.log(completed.source.value)
    console.log(completed.checked)
    if (completed.checked == false) {
      this.adset_questions.splice(this.adset_questions.indexOf(completed.source.value), 1)
      console.log(this.adset_questions)
    }
    else if (completed.checked == true) {
      this.adset_questions.push(completed.source.value)
      console.log(this.adset_questions)
    }

  }

  setIn(completed) {
    console.log(completed.source.value)
    console.log(completed.checked)
    if (completed.checked == false) {
      this.instagram_place.splice(this.instagram_place.indexOf(completed.source.value), 1)
      console.log(this.instagram_place)
    }
    else if (completed.checked == true) {
      this.instagram_place.push(completed.source.value)
      console.log(this.instagram_place)
    }

  }

  disable() {
    this.campaign_name_Editable = true;
    this.dailybudget_Editable = true;
    this.objective_Editable = true;
    this.adset_name_Editable = true;
    this.age_min = true;
    this.gender = true;
    this.language_key = true
  }

  loadingSavedCampaign() {
    this.savedCampaignData = this.digitalService.getSavedCampiagnData();
    if (this.savedCampaignData) {
      this.campaign_name_Editable = true;
      this.dailybudget_Editable = true;
      this.objective_Editable = true;
      this.campaign_id = this.savedCampaignData.campaign_id;
      this.AdGroupForm = this.formBuilder.group({
        customerid: [''],
        objective: [this.savedCampaignData.campaign_objective],
        campaign_name: [this.savedCampaignData.campaign_name],
        dailybudget: [this.savedCampaignData.campaign_budget / 100],
        adset_name: ['', [Validators.required]],
        age_min: ['', [Validators.required]],
        age_max: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        language_key: ['', [Validators.required]],
        special_ad_category: ['[]'],
        bid_strategy: ['LOWEST_COST_WITHOUT_CAP'],
        status: ['PAUSED'],
        billing_event: ['IMPRESSIONS'],
        countries: ['', [Validators.required]],
        image_files: [''],
        adsName: [''],
        optimization_goal: [''],
        page_id: ['', [Validators.required]],
        ad_account_id: ['', [Validators.required]],
        page_offerid: [''],
        detail: ['', [Validators.required]],
        offer_text: ['', [Validators.required]],
        tim: ['', [Validators.required]],
        offer_value: ['', [Validators.required]],
        offer_url: ['', [Validators.required]],
        form_name: [''],
        p_link: [''],
        w_link: [''],
        form_button: [''],
        form_website: [''],
        custom_event_type: ['', [Validators.required]],
        autoplacements: ['']
      });
      var val = this.savedCampaignData.campaign_objective;
      if (val == 'LINK_CLICKS') {
        this.enable_cat = true;
        this.enable_c = false;
        this.enable_m = false;
        this.enable_n = false;
      }
      else if (val == 'LEAD_GENERATION') {
        this.enable_c = true;
        this.enable_cat = false;
        this.enable_m = false;
        this.enable_n = false;
      }
      else if (val == 'MESSAGES') {
        this.enable_m = true;
        this.enable_cat = false;
        this.enable_c = false;
        this.enable_n = false;
      }
      else if (val == 'CONVERSIONS') {
        this.enable_n = true;
        this.enable_cat = false;
        this.enable_c = false;
        this.enable_m = false;
      }
      else {
        this.enable_cat = false;
        this.enable_c = false;
        this.enable_m = false;
        this.enable_n = false;

      }
      this.adsetsubmit = true
    }
  }

  loadingSavedadset() {
    this.savedAd_setData = this.digitalService.getSavedCampiagnid();
    if (this.savedAd_setData) {
      var data_n = { 'adset_id': this.savedAd_setData.adset_id }
      this.digitalService.ad_set_data(data_n).then(
        data => {
          console.log(this.savedAd_setData)
          this.savedAd_setData2 = data
          this.disable();
          console.log(this.savedAd_setData.campaign_name);
          this.campaign_id = this.savedAd_setData.campaign_id;
          this.AdGroupForm = this.formBuilder.group({
            customerid: [''],
            objective: [this.savedAd_setData.campaign_objective],
            campaign_name: [this.savedAd_setData.campaign_name],
            dailybudget: [this.savedAd_setData.campaign_budget / 100],
            adset_name: [this.savedAd_setData.adset_name],
            age_min: [JSON.stringify(this.savedAd_setData2['age_min'])],
            age_max: [JSON.stringify(this.savedAd_setData2['age_max'])],
            gender: [JSON.stringify(this.savedAd_setData2['genders'][0])],
            language_key: [JSON.stringify(this.savedAd_setData2['locales'][1])],
            special_ad_category: ['[]'],
            bid_strategy: ['LOWEST_COST_WITHOUT_CAP'],
            status: ['PAUSED'],
            billing_event: ['IMPRESSIONS'],
            countries: ['', [Validators.required]],
            image_files: [''],
            adsName: [''],
            optimization_goal: [''],
            page_id: ['', [Validators.required]],
            ad_account_id: ['', [Validators.required]],
            page_offerid: [''],
            detail: ['', [Validators.required]],
            offer_text: ['', [Validators.required]],
            tim: ['', [Validators.required]],
            offer_value: ['', [Validators.required]],
            offer_url: ['', [Validators.required]],
            form_name: [''],
            p_link: [''],
            w_link: [''],
            form_button: [''],
            form_website: [''],
            custom_event_type: ['', [Validators.required]],
            autoplacements: ['']
          });
          var val = this.savedAd_setData.campaign_objective;
          if (val == 'LINK_CLICKS') {
            this.enable_cat = true;
            this.enable_c = false;
            this.enable_m = false;
            this.enable_n = false;
          }
          else if (val == 'LEAD_GENERATION') {
            this.enable_c = true;
            this.enable_cat = false;
            this.enable_m = false;
            this.enable_n = false;
          }
          else if (val == 'MESSAGES') {
            this.enable_m = true;
            this.enable_cat = false;
            this.enable_c = false;
            this.enable_n = false;
          }
          else if (val == 'CONVERSIONS') {
            this.enable_n = true;
            this.enable_cat = false;
            this.enable_c = false;
            this.enable_m = false;
          }
          else {
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
      if (this.savedAd_setData) {

        this.adsetsubmit = true
      }
    }

  }



  async createAdSet() {
    let data = new FormData();
    this.facebook = ['feed', 'marketplace', 'video_feeds', 'right_hand_column', 'story', 'instream_video', 'search', 'instant_article'];
    this.instagram = ['stream', 'explore', 'story'];;
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
    data.append('page_id', data_ad.page_id);
    var questionString = '';
    this.adset_questions.map((element, i) => {
      questionString = questionString + "{'type':'" + element + "'},"
    })
    console.log(questionString)
    var data_n = { 'facebook': JSON.stringify(this.facebook_place), 'instagram': JSON.stringify(this.instagram_place), 'formQuestions': questionString, 'publish': JSON.stringify(this.pub), 'adaccount_id': 'act_2782960858450991', 'objective': 'LEAD_GENERATION', 'optimization_goal': 'LEAD_GENERATION', 'campaign_name': data_ad.campaign_name, 'campaign_id': this.campaign_id, 'special_ad_category': data_ad.special_ad_category, 'bid_strategy': data_ad.bid_strategy, 'status': data_ad.status, 'dailybudget': edit_budget, 'adset_name': data_ad.adset_name, 'billing_event': data_ad.billing_event, 'countries': "IN", 'gender': data_ad.gender, 'upload_name': this.upload_name, 'age_min': data_ad.age_min, 'age_max': data_ad.age_max, 'language_key': JSON.stringify(data_ad.language_key), 'adsName': data_ad.adset_name, 'page_id': this.page_select_event, 'detail': data_ad.detail, 'tim': data_ad.tim, 'offer_url': data_ad.offer_url, 'offer_value': data_ad.offer_value, 'offer_text': data_ad.offer_text, 'page_offerid': this.page_select_event, 'form_name': data_ad.form_name, 'p_link': data_ad.p_link, 'w_link': data_ad.w_link, 'form_button': data_ad.form_button, 'form_website': data_ad.form_website, 'custom_event_type': data_ad.custom_event_type, 'placement': data_ad.autoplacements, 'pixel_select': this.pixel_id }
    console.log("form is" + JSON.stringify(data_n))
    this.digitalService.ad_set_create(data_n).then(
      data => {
        this.router.navigate(['/campaign-list']);
      },
      err => {
        console.log(JSON.stringify(err));
      }

    );
  }


}
