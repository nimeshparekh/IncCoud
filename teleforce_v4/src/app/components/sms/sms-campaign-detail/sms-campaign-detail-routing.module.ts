import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsCampaignDetailComponent } from './sms-campaign-detail.component';

const routes: Routes = [
    {path: '',component: SmsCampaignDetailComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SmsCampaignDetailRoutingModule {}
