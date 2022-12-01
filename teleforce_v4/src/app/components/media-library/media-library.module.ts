import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MediaLibraryRoutingModule } from './media-library-routing.module';
import { MediaLibraryComponent, deleteConfirmComponent, imagePreviewComponent,BulkSchedualPostComponent} from './media-library.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { MaterialModule } from '../../material/material.module';
@NgModule({
  imports: [
    CommonModule,
    MediaLibraryRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
  ],
  declarations: [
    MediaLibraryComponent,
    BulkSchedualPostComponent,
    deleteConfirmComponent,
    imagePreviewComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class MediaLibraryModule {
    
 }
