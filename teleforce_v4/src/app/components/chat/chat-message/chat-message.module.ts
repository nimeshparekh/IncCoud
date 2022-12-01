import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ChatMessageRoutingModule } from './chat-message-routing.module';
import { ChatMessageComponent } from './chat-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { MaterialModule } from '../../../../app/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    ChatMessageRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
  ],
  declarations: [
    ChatMessageComponent,
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ChatMessageModule {
    
 }
