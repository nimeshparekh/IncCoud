import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SocialChannelsRoutingModule } from './social-channels-routing.module';
import { SocialChannelsComponent,ConnectComponent,ChatassignComponent } from './social-channels.component';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SocialChannelsRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
    
  ],
  declarations: [
    SocialChannelsComponent,
    ConnectComponent,
    AddChannelComponent,
    ChatassignComponent

  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class SocialChannelsModule {
    
 }
