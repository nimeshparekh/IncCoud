import { Component, OnInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { DigitalService } from '../../digital.service'
import { Router, } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from "../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from "moment";

@Component({
  selector: 'app-account-access',
  templateUrl: './account-access.component.html',
  styleUrls: ['./account-access.component.css']
})
export class AccountAccessComponent implements OnInit {
  linked_in_acc;
  linked_auth_data;
  constructor(
    public digitalService: DigitalService,
    public router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params: any) => {
        console.log('params',params);
        if(params['oauth_token']){
          var brand_id = localStorage.getItem('current_brand_id');
          var user_id = localStorage.getItem('access_id');
          const newObj = Object.assign({tokenSecret: localStorage.getItem('tokenSecret'), brand_id: brand_id,user_id:user_id}, params);
          this.digitalService.twittercallback(newObj).then(
            data => {
              console.log(data);
              window.close();
              if(data['islogin']){// change this condition to success message then close window 
                console.log(data);
                window.close();
                const expiresAt = moment().add(data['expires_in'],'second');
                localStorage.setItem('id_token', data['access_token']);
                localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
                this.digitalService.storeData(data['user']);
                
              }
            },
            err => {
              console.log(err);
            }
          );
        }
        if(params['code']){
          console.log(params);
          var cmid = localStorage.getItem('current_brand_id');
          var userid = localStorage.getItem('access_id');
          this.digitalService.linkedin_callback({params,brand_id:cmid,userid}).then(
            data => {
              console.log(data);
              window.close();
              this.linked_in_acc= data['pages'];
              this.linked_auth_data = data['auth'];
              
            },
            err => {
              console.log(err);
            }
          );
        }

        
      }
    });
  }
}
