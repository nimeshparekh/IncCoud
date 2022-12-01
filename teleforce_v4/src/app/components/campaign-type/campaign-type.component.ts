import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../../manager.service';
@Component({
  selector: 'app-campaign-type',
  templateUrl: './campaign-type.component.html',
  styleUrls: ['./campaign-type.component.css']
})
export class CampaignTypeComponent implements OnInit {

  campaigns=false;
  obd=false;
  sms=false;
  email=false;
  constructor(public managerservice:ManagerService) { }

  ngOnInit(): void {
    this.getManagerDetail(localStorage.getItem('access_id'));
  }
  async getManagerDetail(userid){
    await this.managerservice.getManagerDetail(userid).then(
      data => {
        console.log(data['data']);
        if (data['data']['services'].length > 1) {
        //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for(var i=0;i<data['data']['services'].length;i++ ){            
            if(serviceArr[i]=='5'){
              this.campaigns = true;
            }
            if(serviceArr[i]=='9'){
              this.obd = true;
            }
            if(serviceArr[i]=='13'){
              this.sms = true;
            }
            if(serviceArr[i]=='14'){
              this.email = true;
            }
          }
        }else{
          var service = data['data']['services'];
          if(service=='5'){
            this.campaigns = true;
          }
          if(service=='9'){
            this.obd = true;
          }
          if(service=='13'){
            this.sms = true;
          }
          if(service=='14'){
            this.email = true;
          }
        }  
      },
      err => {
        //console.log('error');
      }
    );
  }

}
