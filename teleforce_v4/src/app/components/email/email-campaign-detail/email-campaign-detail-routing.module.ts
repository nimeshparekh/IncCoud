import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailCampaignDetailComponent } from './email-campaign-detail.component';

const routes: Routes = [
    {path: '',component: EmailCampaignDetailComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailCampaignDetailRoutingModule {}
