import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaDirectoryComponent } from './media-directory.component';
const routes: Routes = [
    {path: '',component: MediaDirectoryComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MediaDirectoryRoutingModule {}
