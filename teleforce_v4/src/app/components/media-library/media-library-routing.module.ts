import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaLibraryComponent } from './media-library.component';

const routes: Routes = [
    {path: '',component: MediaLibraryComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MediaLibraryRoutingModule {}
