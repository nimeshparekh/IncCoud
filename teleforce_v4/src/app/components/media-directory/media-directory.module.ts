import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MediaDirectoryRoutingModule } from './media-directory-routing.module';
import { MediaDirectoryComponent } from './media-directory.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { MaterialModule } from '../../material/material.module';
import { CreateMediaComponent } from '../create-media/create-media.component';
@NgModule({
  imports: [
    CommonModule,
    MediaDirectoryRoutingModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MediaDirectoryComponent,
    CreateMediaComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class MediaDirectoryModule {
    
 }
