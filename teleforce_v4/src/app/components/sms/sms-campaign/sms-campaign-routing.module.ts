import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsCampaignComponent } from './sms-campaign.component';

const routes: Routes = [
    {path: '',component: SmsCampaignComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SmsCampaignRoutingModule {}
