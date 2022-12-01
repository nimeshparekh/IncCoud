import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailCampaignComponent } from './email-campaign.component';

const routes: Routes = [
    {path: '',component: EmailCampaignComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class   EmailCampaignRoutingModule {}
