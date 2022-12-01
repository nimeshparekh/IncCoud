import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocialChannelsComponent } from './social-channels.component';

const routes: Routes = [
    {path: '',component: SocialChannelsComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SocialChannelsRoutingModule {}
