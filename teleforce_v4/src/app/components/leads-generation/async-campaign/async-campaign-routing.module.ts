import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsyncCampaignComponent } from './async-campaign.component';

const routes: Routes = [
    {path: '',component: AsyncCampaignComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AsyncCampaignRoutingModule {}
