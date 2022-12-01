import { TriggersComponent } from './components/triggers/triggers.component';
import { ZohoLeadComponent } from './components/zoho-lead/zoho-lead.component';
import { CallPluseReportComponent } from './components/call-pluse-report/call-pluse-report.component';
import { QueueCallComponent } from './components/queue-call/queue-call.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { DeshboardComponent } from './components/deshboard/deshboard.component';
import { DidRoutingComponent } from './components/did-routing/did-routing.component';
import { IvrBuilderComponent } from './components/ivr-builder/ivr-builder.component';
import { AgentsGroupsComponent } from './components/agents-groups/agents-groups.component';
import { OutboundComponent } from './components/outbound/outbound.component';
import { CallLogComponent } from './components/call-log/call-log.component';
import { SoundUploadComponent } from './components/sound-upload/sound-upload.component';
import { AuthGuard } from './auth.guard';
import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';
import { ManagerListComponent } from './components/manager-list/manager-list.component';
import { ChannelListComponent } from './components/channel-list/channel-list.component';
import { ManagerChannelListComponent} from './components/manager-channel-list/manager-channel-list.component';
import { HuntGroupComponent } from './components/hunt-group/hunt-group.component';
import { HuntGroupDetailComponent } from './components/hunt-group-detail/hunt-group-detail.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { LoginActivityComponent } from './components/login-activity/login-activity.component';
import { AgentCallHistoryComponent } from './components/agent-call-history/agent-call-history.component';
import  { KycDocumentUploadComponent } from './components/kyc-document-upload/kyc-document-upload.component';
import  { ContactListComponent } from './components/contact-list/contact-list.component';
import  { SegmentListComponent } from './components/segment-list/segment-list.component';
import  { AgentDialerComponent } from './components/agent-dialer/agent-dialer.component';
import  { KycDocumentComponent } from './components/kyc-document/kyc-document.component';
import  { KycAprovelComponent} from './components/kyc-aprovel/kyc-aprovel.component';
import  { LiveCallComponent } from './components/live-call/live-call.component';
import  { ManagerDetailsComponent } from './components/manager-details/manager-details.component';
import  { ApproveSoundUploadComponent } from'./components/approve-sound-upload/approve-sound-upload.component';
import  { ApproveSoundStatusComponent} from'./components/approve-sound-status/approve-sound-status.component';
import { ClickToCallComponent } from './components/click-to-call/click-to-call.component';
//import { VoipCallingComponent } from './components/voip-calling/voip-calling.component';
import{AdminSmsTemplateComponent} from './components/admin-sms-template/admin-sms-template.component';
import{CreateAdminSmsComponent} from './components/create-admin-sms/create-admin-sms.component'
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { ConferenceCallComponent } from './components/conference-call/conference-call.component';
import {AdminEmailTemplateComponent } from './components/admin-email-template/admin-email-template.component';
import { CreateAdminEmailComponent } from './components/create-admin-email/create-admin-email.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';
import { DemoRequestComponent }  from './components/demo-request/demo-request.component';
import { VisitorTrakingComponent } from './components/visitor-traking/visitor-traking.component';
import{DisplayVisitorDataComponent} from './components/display-visitor-data/display-visitor-data.component';
import { from } from 'rxjs';
import{AdminPackagesComponent} from './components/admin-packages/admin-packages.component';
import{LeadListComponent} from './components/lead-list/lead-list.component';
import{ DisplaySmsServerComponent } from './components/display-sms-server/display-sms-server.component';
import{SmsServerComponent} from './components/sms-server/sms-server.component';
import{AdminEmailServerComponent } from './components/admin-email-server/admin-email-server.component';
import{CreateEmailServerComponent } from './components/create-email-server/create-email-server.component';
import{MissCallComponent} from './components/miss-call/miss-call.component';
import { ManagerLivecallsComponent } from './components/manager-livecalls/manager-livecalls.component';
import{AdminDisplayGetOfferComponent} from './components/admin-display-get-offer/admin-display-get-offer.component';
import{AdminDisplayCareersDataComponent} from './components/admin-display-careers-data/admin-display-careers-data.component';
import{CreateEmailTemplateComponent } from './components/create-email-template/create-email-template.component';
import{SmsTemplateComponent } from './components/sms-template/sms-template.component';
import{CreateSmsTemplateComponent } from './components/create-sms-template/create-sms-template.component';
import{EmailTemplateComponent} from './components/email-template/email-template.component';
import { MasterDataComponent } from './components/master-data/master-data.component';
import { AccountingStatusComponent } from './components/accounting-status/accounting-status.component';
import{ AdminSmsTemplateApproveComponent} from './components/admin-sms-template-approve/admin-sms-template-approve.component';
import{ CallSummaryReportComponent} from './components/call-summary-report/call-summary-report.component';
import{ AgentBreakTimeComponent} from './components/agent-break-time/agent-break-time.component';
import{ AgentLoginLogoutComponent} from './components/agent-login-logout/agent-login-logout.component';
import { ZohoUsersComponent } from './components/zoho-users/zoho-users.component';
import{ AgentPerformanceComponent} from './components/agent-performance/agent-performance.component';
import{ ResourcesAvailabilityComponent} from './components/resources-availability/resources-availability.component';
import{ AgentHourlyComponent} from './components/agent-hourly/agent-hourly.component';
import{ HourlyCallReportComponent} from './components/hourly-call-report/hourly-call-report.component';
import{ DemoReqFeedbackComponent} from './components/demo-req-feedback/demo-req-feedback.component';
import{ BillingReportComponent} from './components/billing-report/billing-report.component';
import{ DialResultReportComponent} from './components/dial-result-report/dial-result-report.component';
import{ KycDocumentViewComponent} from './components/kyc-document-view/kyc-document-view.component';
import{ CampaignSummaryReportComponent} from './components/campaign-summary-report/campaign-summary-report.component';
import{ AgentCalldurationReportComponent} from './components/agent-callduration-report/agent-callduration-report.component';
import{ MinutesAssignResponseComponent} from './components/minutes-assign-response/minutes-assign-response.component';
import{ CallbackSummaryReportComponent} from './components/callback-summary-report/callback-summary-report.component';
import{ CallbackDetailedReportComponent} from './components/callback-detailed-report/callback-detailed-report.component';
import{ ChannelUtilizationComponent} from './components/channel-utilization/channel-utilization.component';
import{ TelephonyDigitalComponent } from './components/telephony-digital/telephony-digital.component';
import{ TelephonyMailComponent} from './components/telephony-mail/telephony-mail.component';
import{ DigitalFeedbackComponent} from './components/digital-feedback/digital-feedback.component';
import{ DigitalMailFeedbackComponent} from './components/digital-mail-feedback/digital-mail-feedback.component';
import{ RenewalReportComponent} from './components/renewal-report/renewal-report.component';
import{ SpamDidReportComponent} from './components/spam-did-report/spam-did-report.component';
import { PackageCalldurationReportComponent} from './components/package-callduration-report/package-callduration-report.component';
import { AdminGstComponent} from './components/admin-gst/admin-gst.component';
import { AdminGstDisplayComponent} from './components/admin-gst-display/admin-gst-display.component';
import { AgentLeadListComponent} from './components/agent-lead-list/agent-lead-list.component';
import { AgentLeadFeedbackComponent} from './components/agent-lead-feedback/agent-lead-feedback.component';
import { AgentCallScheduleComponent } from './components/agent-call-schedule/agent-call-schedule.component';
import { AgentNumberHistoryComponent} from './components/agent-number-history/agent-number-history.component';
import { InvoiceReportComponent} from './components/invoice-report/invoice-report.component';
import { ManagerNumberHistoryComponent} from './components/manager-number-history/manager-number-history.component';
import { ManagerInvoiceReportComponent} from './components/manager-invoice-report/manager-invoice-report.component';
import {  TeleSmsPackageComponent} from './components/tele-sms-package/tele-sms-package.component';
import { LivechannelsComponent } from './components/livechannels/livechannels.component';
import { TeleMailPackageComponent} from './components/tele-mail-package/tele-mail-package.component';
import { TeleMeetPackageComponent} from './components/tele-meet-package/tele-meet-package.component';
import { TeleDigitalPackageComponent} from './components/tele-digital-package/tele-digital-package.component';
import { CreateVendorComponent } from './components/create-vendor/create-vendor.component';
import { DisplayVendorComponent } from './components/display-vendor/display-vendor.component';
import { VendorListComponent } from './components/vendor-list/vendor-list.component';
import { IvrInputReportComponent } from './components/ivr-input-report/ivr-input-report.component';
//import { SmsCampaignComponent } from './components/sms-campaign/sms-campaign.component';
//import { SmsCampaignDetailComponent } from './components/sms-campaign-detail/sms-campaign-detail.component';
//import { CreateSmsCampaignComponent } from './components/create-sms-campaign/create-sms-campaign.component';
import { ManagerSmsServerComponent } from './components/manager-sms-server/manager-sms-server.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import { SmsConfigComponent } from './components/sms-config/sms-config.component';
import { LiveAgentLocationComponent } from './components/live-agent-location/live-agent-location.component';
import { ManagerUserReportComponent } from './components/manager-user-report/manager-user-report.component';
import { AnswerLeadChartComponent } from './components/answer-lead-chart/answer-lead-chart.component';
import { LeadAgentChartComponent } from './components/lead-agent-chart/lead-agent-chart.component';
import { HourlyLeadChartComponent } from './components/hourly-lead-chart/hourly-lead-chart.component';
import { HourlyAgentChartComponent } from './components/hourly-agent-chart/hourly-agent-chart.component';
import { CampaignLeadChartComponent } from './components/campaign-lead-chart/campaign-lead-chart.component';
import { CampaignAgentChartComponent } from './components/campaign-agent-chart/campaign-agent-chart.component';
import { PaymentTransactionComponent } from './components/payment-transaction/payment-transaction.component';
import { EmailSmsConfigComponent } from './components/email-sms-config/email-sms-config.component';
import { SmsBalanceReportComponent } from './components/sms-balance-report/sms-balance-report.component';
import { BlockNumberListComponent } from './components/block-number-list/block-number-list.component';
import { WebLeadListComponent } from './components/web-lead-list/web-lead-list.component';
import { DisplaychanelComponent} from './components/displaychanel/displaychanel.component';
import { CreateChennallistComponent} from './components/create-chennallist/create-chennallist.component';
import { SignupRequestComponent } from './components/signup-request/signup-request.component';
import { CreateVoipcampaignComponent} from './components/create-voipcampaign/create-voipcampaign.component';
import { DisplayVoipcampaignComponent } from './components/display-voipcampaign/display-voipcampaign.component';
import { MamagerLoginComponent } from './components/mamager-login/mamager-login.component';
import { DialerDialogComponent } from './components/dialer-dialog/dialer-dialog.component';
import { CallHistoryComponent } from './components/call-history/call-history.component';
import { FeedbackFormsComponent } from './components/feedback-forms/feedback-forms.component';
import { SoftphoneComponent } from './components/softphone/softphone.component';
import { MailComposerComponent } from './components/mail-composer/mail-composer.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ProductsComponent } from './components/products/products.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { VerificationFormComponent } from './components/verification-form/verification-form.component';
import { ProductImagesComponent } from './components/product-images/product-images.component';
import { ProductDocumentsComponent } from './components/product-documents/product-documents.component';
import { ScheduleMeetingComponent } from './components/schedule-meeting/schedule-meeting.component';
import { SadminPlanCalReportComponent } from './components/sadmin-plan-cal-report/sadmin-plan-cal-report.component';
import { AgentShiftBreakComponent } from './components/agent-shift-break/agent-shift-break.component';
import { VoiceMailComponent } from './components/voice-mail/voice-mail.component';
import { ManagerRequestComponent } from './components/manager-request/manager-request.component';
import { AgentLoginActivityReportComponent } from './components/agent-login-activity-report/agent-login-activity-report.component';
import { TelephonySmsComponent } from './components/telephony-sms/telephony-sms.component';
import { DigitalSmsFeedbackComponent } from './components/digital-sms-feedback/digital-sms-feedback.component';
import { CreateMailreqLeadComponent } from './components/create-mailreq-lead/create-mailreq-lead.component';
import { CreateSmsreqLeadComponent } from './components/create-smsreq-lead/create-smsreq-lead.component';
import { CreateDigitalreqLeadComponent } from './components/create-digitalreq-lead/create-digitalreq-lead.component';
import { TempUserDetailsComponent } from './components/temp-user-details/temp-user-details.component';
import { CreateTempManagerComponent } from './components/create-temp-manager/create-temp-manager.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { FeedbackReportComponent } from './components/feedback-report/feedback-report.component';
import { ViewFeedbackComponent } from './components/view-feedback/view-feedback.component';
import { CopySendEmailComponent } from './components/copy-send-email/copy-send-email.component';
import { RequestedReportComponent } from './components/requested-report/requested-report.component';
import { LeadDetailsComponent } from './components/lead-details/lead-details.component';
import { ErpLeadlistComponent } from './components/erp-leadlist/erp-leadlist.component';
import { RecordingDownloadComponent } from './components/recording-download/recording-download.component';
import { ErpModuleComponent } from './components/erp-module/erp-module.component';
import { AgentMissedCallReportComponent } from './components/agent-missed-call-report/agent-missed-call-report.component';
import { WebsiteChatComponent } from './components/website-chat/website-chat.component';
import { CalenderComponent } from './components/calender/calender.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { LeadConfigComponent } from './components/lead-config/lead-config.component';
import { EmailServerComponent } from './components/email-server/email-server.component';
import { PrintPdfComponent } from './components/print-pdf/print-pdf.component';
import { CreateStageComponent } from './components/create-stage/create-stage.component';
import { LeadStagesComponent } from './components/lead-stages/lead-stages.component';
import { LeadStagesStatusComponent } from './components/lead-stages-status/lead-stages-status.component';
import { CreateLeadStagesStatusComponent } from './components/create-lead-stages-status/create-lead-stages-status.component';
import { TollfreePackageComponent } from './components/tollfree-package/tollfree-package.component';
import { OBDPackageComponent } from './components/obd-package/obd-package.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { ErpModuleNewComponent } from './components/erp-module-new/erp-module-new.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { ScheduleSmsComponent } from './components/schedule-sms/schedule-sms.component';
import { CustAppointmentComponent } from './components/cust-appointment/cust-appointment.component';
//import { ConferenceDetailComponent } from './components/conference-detail/conference-detail.component';
import { ConferenceDetailsComponent } from './components/conference-details/conference-details.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ScheduleReportComponent } from './components/schedule-report/schedule-report.component';
import { CreateScheduleReportComponent } from './components/create-schedule-report/create-schedule-report.component';
import { HoldCallingReasonComponent } from './components/hold-calling-reason/hold-calling-reason.component';
import { AcwReportComponent } from './components/acw-report/acw-report.component';
import { TeleDigitaladsPackageComponent } from './components/tele-digitalads-package/tele-digitalads-package.component';
import { CallReviewFormComponent } from './components/call-review-form/call-review-form.component';

import { CallRecordingListComponent } from './components/call-recording-list/call-recording-list.component';
import { HeaderFooterSetComponent } from './components/header-footer-set/header-footer-set.component';
import { ProductGroupComponent } from './components/product-group/product-group.component'
import { SourceComponent } from './components/source/source.component';
import { ReviewRateReportComponent } from './components/review-rate-report/review-rate-report.component';
import { UntouchLeadReportComponent } from './components/untouch-lead-report/untouch-lead-report.component';
import { LeadStageReportComponent } from './components/lead-stage-report/lead-stage-report.component';
import { LeadSourceReportComponent } from './components/lead-source-report/lead-source-report.component';
import { LeadOpportunityamountReportComponent } from './components/lead-opportunityamount-report/lead-opportunityamount-report.component';
import { LeadTimelineReportComponent } from './components/lead-timeline-report/lead-timeline-report.component';
import { AgentLeadAccessComponent } from './components/agent-lead-access/agent-lead-access.component';
import { AsteriskServerComponent } from './components/asterisk-server/asterisk-server.component';
import { LiveChannel2Component } from './components/live-channel2/live-channel2.component';
import { CampaignDispositionReportComponent } from './components/campaign-disposition-report/campaign-disposition-report.component';
import { MoreNotificationComponent } from './components/more-notification/more-notification.component';
import { CustomeApiComponent } from './components/custome-api/custome-api.component';
import { CreateCustomeApiComponent } from './components/create-custome-api/create-custome-api.component';
import { BlackListComponent } from './components/black-list/black-list.component';
import { LiveChannel3Component } from './components/live-channel3/live-channel3.component';
import { ConsultantListComponent } from './components/consultant-list/consultant-list.component';
import { CallUsageReportComponent } from './components/call-usage-report/call-usage-report.component';
import { AgentPerfomonceReportComponent } from './components/agent-perfomonce-report/agent-perfomonce-report.component';
import { SupervisorAssignAgentComponent } from './components/supervisor-assign-agent/supervisor-assign-agent.component';
import { SupervisorAgentsComponent } from './components/supervisor-agents/supervisor-agents.component';
import { AgentsBreakReportComponent } from './components/agents-break-report/agents-break-report.component';
import { SmsLinksComponent } from './components/sms-links/sms-links.component';
import { WhatsappTemplateComponent } from './components/whatsapp-template/whatsapp-template.component';
import { CreateWhatsappTemplateComponent } from './components/create-whatsapp-template/create-whatsapp-template.component';
import { AccountAccessComponent } from './components/account-access/account-access.component';
import { LmsAnalyticComponent } from './components/lms-analytic/lms-analytic.component';
import { DispotionCallComponent } from './components/dispotion-call/dispotion-call.component';
import { CallDispositionsDetailsComponent } from './components/call-dispositions-details/call-dispositions-details.component';
import { ObdCampaignComponent } from './components/obd-campaign/obd-campaign.component';
import { ObdCampaignDetailComponent } from './components/obd-campaign-detail/obd-campaign-detail.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LeadTagComponent } from './components/lead-tag/lead-tag.component';
import { LeadTagAssignAgentComponent } from './components/lead-tag-assign-agent/lead-tag-assign-agent.component';
import { AgentCallDurationTalktimeReportComponent } from './components/agent-call-duration-talktime-report/agent-call-duration-talktime-report.component';
import { DealDoneListComponent } from './components/deal-done-list/deal-done-list.component';
import { CampaignTypeComponent } from './components/campaign-type/campaign-type.component';
import { SegmentWiseCallLogDetailsComponent } from './components/segment-wise-call-log-details/segment-wise-call-log-details.component';
import { IssueTypeComponent } from './components/issue-type/issue-type.component';
import { XlncAgentPerformanceComponent } from './components/xlnc-agent-performance/xlnc-agent-performance.component';

import { IncomingmisscallReportComponent } from './components/incomingmisscall-report/incomingmisscall-report.component';
import { NewCallerReportComponent } from './components/new-caller-report/new-caller-report.component';
import { AdminSettingComponent } from './components/admin-setting/admin-setting.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { DeletedLeadListComponent } from './components/deleted-lead-list/deleted-lead-list.component';
import { AdminActivityLogComponent } from './components/admin-activity-log/admin-activity-log.component';
import { LinkCountReportComponent } from './components/link-count-report/link-count-report.component';
import { ObdPulseReportComponent } from './components/obd-pulse-report/obd-pulse-report.component';
import { CommonAgentPerformanceReportComponent } from './components/common-agent-performance-report/common-agent-performance-report.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'accessdenied', component: SigninComponent },
  { path: 'signin', component: SigninComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'password-reset', component: PasswordResetComponent},
  { path: 'dashboard', component: DeshboardComponent},
  { path: 'did-routing', component: DidRoutingComponent, canActivate: [AuthGuard]},
  { path: 'ivr-builder', component: IvrBuilderComponent, canActivate: [AuthGuard]},
  //{ path: 'agents', component: AgentsGroupsComponent, canActivate: [AuthGuard]},
  { path: 'users', component: AgentsGroupsComponent, canActivate: [AuthGuard]},
  { path: 'outbound', component: OutboundComponent, canActivate: [AuthGuard]},
  { path: 'call-log', component: CallLogComponent, canActivate: [AuthGuard]},
  { path: 'sound-upload', component: SoundUploadComponent, canActivate: [AuthGuard]},
  { path: 'admin-user', component: AdminUserListComponent, canActivate: [AuthGuard]},
  { path: 'managers', component: ManagerListComponent, canActivate: [AuthGuard]},
  { path: 'manager-livecalls', component: ManagerLivecallsComponent, canActivate: [AuthGuard]},
  { path: 'channels', component: ChannelListComponent, canActivate: [AuthGuard]},
  { path: 'manager-channel-list/:id', component: ManagerChannelListComponent, canActivate: [AuthGuard]},
  //{ path: 'agent-group', component: HuntGroupComponent, canActivate: [AuthGuard]},
  { path: 'user-group', component: HuntGroupComponent, canActivate: [AuthGuard]},
  { path: 'agent-group-detail/:id', component: HuntGroupDetailComponent, canActivate: [AuthGuard]},
  { path: 'view-profile', component: ViewProfileComponent, canActivate: [AuthGuard]},
  { path: 'login-activity', component: LoginActivityComponent, canActivate: [AuthGuard]},
  { path: 'agent-call-history', component: AgentCallHistoryComponent, canActivate: [AuthGuard]},
  { path: 'kyc-document-upload',component:KycDocumentUploadComponent,canActivate:[AuthGuard]},
  { path: 'live-call',component:LiveCallComponent,canActivate:[AuthGuard]},
  { path: 'contact-list',component:ContactListComponent,canActivate:[AuthGuard]},
  { path: 'segment-list',component:SegmentListComponent,canActivate:[AuthGuard]},
  { path: 'agent-dialer',component:AgentDialerComponent,canActivate:[AuthGuard]},
  { path: 'kyc-document',component:KycDocumentComponent,canActivate:[AuthGuard]},
  { path: 'kyc-aprovel',component:KycAprovelComponent,canActivate:[AuthGuard]},
  { path: 'manager-details/:id',component:ManagerDetailsComponent,canActivate:[AuthGuard]},  
  { path: 'approve-sound-upload',component:ApproveSoundUploadComponent,canActivate:[AuthGuard]},
  { path: 'approve-sound-status',component:ApproveSoundStatusComponent,canActivate:[AuthGuard]},
  { path: 'click-to-call',component:ClickToCallComponent,canActivate:[AuthGuard]},
  { path: 'zoho-users',component:ZohoUsersComponent,canActivate:[AuthGuard]},
  //{ path: 'voip-calling',component:VoipCallingComponent,canActivate:[AuthGuard]},
  { path: 'admin-sms-template',component:AdminSmsTemplateComponent,canActivate:[AuthGuard]},
  { path:'create-admin-sms',component:CreateAdminSmsComponent,canActivate:[AuthGuard]},
  
  { path: 'conference-call',component:ConferenceCallComponent,canActivate:[AuthGuard]},
  { path: 'create-admin-email',component:CreateAdminEmailComponent,canActivate:[AuthGuard]},
  { path: 'admin-email-template',component:AdminEmailTemplateComponent,canActivate:[AuthGuard]},
  { path: 'campaign-detail/:id',component:CampaignDetailComponent,canActivate:[AuthGuard]},
  { path:'demo-request',component:DemoRequestComponent,canActivate:[AuthGuard]},
  { path:'visitor-traking',component:VisitorTrakingComponent,canActivate:[AuthGuard]},
  { path:'display-visitor-data',component:DisplayVisitorDataComponent,canActivate:[AuthGuard]},
  { path:'packages',component:AdminPackagesComponent,canActivate:[AuthGuard]},
  { path:'leads',component:LeadListComponent,canActivate:[AuthGuard]},
  { path:'sms-server',component:SmsServerComponent,canActivate:[AuthGuard]},
  { path:'display-sms-server',component:DisplaySmsServerComponent,canActivate:[AuthGuard]},
  { path: 'create-email-server',component:CreateEmailServerComponent,canActivate:[AuthGuard]},
  { path: 'admin-email-server',component:AdminEmailServerComponent,canActivate:[AuthGuard]},
  { path: 'livechannels',component:LivechannelsComponent,canActivate:[AuthGuard]},
  { path:'sms-server',component:SmsServerComponent,canActivate:[AuthGuard]},
  { path:'display-sms-server',component:DisplaySmsServerComponent,canActivate:[AuthGuard]},
  { path:'miss-call',component:MissCallComponent,canActivate:[AuthGuard]},
  { path:'admin-display-careers-data',component:AdminDisplayCareersDataComponent,canActivate:[AuthGuard]},
  { path:'admin-display-get-offer',component:AdminDisplayGetOfferComponent,canActivate:[AuthGuard]},
  { path:'create-sms-template',component:CreateSmsTemplateComponent,canActivate:[AuthGuard]},
  { path:'create-email-template',component:CreateEmailTemplateComponent,canActivate:[AuthGuard]},
  { path:'sms-template',component:SmsTemplateComponent,canActivate:[AuthGuard]},
  { path:'email-template',component:EmailTemplateComponent,canActivate:[AuthGuard]},
  { path:'master-data',component:MasterDataComponent,canActivate:[AuthGuard]},
  { path:'accounting-status',component:AccountingStatusComponent,canActivate:[AuthGuard]},
  { path:'call-summary-report',component:CallSummaryReportComponent,canActivate:[AuthGuard]},
  { path:'break-time',component:AgentBreakTimeComponent,canActivate:[AuthGuard]},
  { path:'agent-login-logout',component:AgentLoginLogoutComponent,canActivate:[AuthGuard]},
  { path:'agent-performance',component:AgentPerformanceComponent,canActivate:[AuthGuard]},
  { path:'resource-availability',component:ResourcesAvailabilityComponent,canActivate:[AuthGuard]},
  { path:'agent-hourly',component:AgentHourlyComponent,canActivate:[AuthGuard]},
  { path:'hourly-call',component:HourlyCallReportComponent,canActivate:[AuthGuard]},
  { path:'dem-req-feedback',component:DemoReqFeedbackComponent,canActivate:[AuthGuard]},
  { path:'billing-report',component:BillingReportComponent,canActivate:[AuthGuard]},
  { path:'dial-result',component:DialResultReportComponent,canActivate:[AuthGuard]},
  { path:'campaign-summary',component:CampaignSummaryReportComponent,canActivate:[AuthGuard]},
  { path:'agent-callduration',component:AgentCalldurationReportComponent,canActivate:[AuthGuard]},
  { path:'minute-assign',component:MinutesAssignResponseComponent,canActivate:[AuthGuard]},
  { path:'callback-summary',component:CallbackSummaryReportComponent,canActivate:[AuthGuard]},
  { path:'callback-detailed',component:CallbackDetailedReportComponent,canActivate:[AuthGuard]},
  { path:'kyc-document-view',component:KycDocumentViewComponent,canActivate:[AuthGuard]},
  { path:'channel-utilization',component:ChannelUtilizationComponent,canActivate:[AuthGuard]},
  { path:'telephony-digital',component:TelephonyDigitalComponent,canActivate:[AuthGuard]},
  { path:'telephony-mail',component:TelephonyMailComponent,canActivate:[AuthGuard]},
  { path:'digital-feedback',component:DigitalFeedbackComponent,canActivate:[AuthGuard]},  
  { path:'digital-mail-feedback',component:DigitalMailFeedbackComponent,canActivate:[AuthGuard]},
  { path:'renewal-report',component:RenewalReportComponent,canActivate:[AuthGuard]},
  { path:'spam-did',component:SpamDidReportComponent,canActivate:[AuthGuard]},
  { path:'plan-callduration',component:PackageCalldurationReportComponent,canActivate:[AuthGuard]},
  { path:'admin-gst',component:AdminGstComponent,canActivate:[AuthGuard]},
  { path:'admin-gst-display',component:AdminGstDisplayComponent,canActivate:[AuthGuard]},
  { path:'agent-lead-list',component:AgentLeadListComponent,canActivate:[AuthGuard]},
  { path:'agent-lead-feedback',component:AgentLeadFeedbackComponent,canActivate:[AuthGuard]},
  { path:'agent-call-schedule',component:AgentCallScheduleComponent,canActivate:[AuthGuard]},
  { path:'agent-number-history',component:AgentNumberHistoryComponent,canActivate:[AuthGuard]},
  { path:'invoice-report',component:InvoiceReportComponent,canActivate:[AuthGuard]},
  { path:'manager-number-history',component:ManagerNumberHistoryComponent,canActivate:[AuthGuard]},
  { path:'manager-invoice',component:ManagerInvoiceReportComponent,canActivate:[AuthGuard]},
  { path:'tele-sms-package',component:TeleSmsPackageComponent,canActivate:[AuthGuard]},
  { path:'tele-mail-package',component:TeleMailPackageComponent,canActivate:[AuthGuard]},
  { path:'tele-meet-package',component:TeleMeetPackageComponent,canActivate:[AuthGuard]},
  { path:'tele-digital-package',component:TeleDigitalPackageComponent,canActivate:[AuthGuard]},
  { path:'create-vendor',component:CreateVendorComponent,canActivate:[AuthGuard]},
  { path:'display-vendor',component:DisplayVendorComponent,canActivate:[AuthGuard]},
  { path:'vendor-list',component:VendorListComponent,canActivate:[AuthGuard]},
  { path:'ivr-input',component:IvrInputReportComponent,canActivate:[AuthGuard]},
  //{ path:'sms-campaign',component:SmsCampaignComponent,canActivate:[AuthGuard]},
  //{ path:'sms-campaign-detail/:id',component:SmsCampaignDetailComponent,canActivate:[AuthGuard]},  
  //{ path:'create-sms-campaign',component:CreateSmsCampaignComponent,canActivate:[AuthGuard]},
  { path:'manager-sms-server/:id',component:ManagerSmsServerComponent,canActivate:[AuthGuard]},
  { path:'user-report',component:UserReportComponent,canActivate:[AuthGuard]},
  { path:'sms-config',component:SmsConfigComponent,canActivate:[AuthGuard]},
  { path:'agent-location',component:LiveAgentLocationComponent,canActivate:[AuthGuard]},
  { path:'manager-user-report',component:ManagerUserReportComponent,canActivate:[AuthGuard]},
  { path:'answer-lead/:sdate/:edate',component:AnswerLeadChartComponent,canActivate:[AuthGuard]},
  { path:'lead-agent-chart/:lead/:sdate/:edate',component:LeadAgentChartComponent,canActivate:[AuthGuard]},
  { path:'hourly-lead/:index/:date',component:HourlyLeadChartComponent,canActivate:[AuthGuard]},
  { path:'hourly-agent-chart/:index1/:index2/:date',component:HourlyAgentChartComponent,canActivate:[AuthGuard]},
  { path:'campaign-lead/:camid/:sdate/:edate',component:CampaignLeadChartComponent,canActivate:[AuthGuard]},
  { path:'campaign-agent-chart/:lead/:camid/:sdate/:edate',component:CampaignAgentChartComponent,canActivate:[AuthGuard]},
  { path:'payment-transaction',component:PaymentTransactionComponent,canActivate:[AuthGuard]},
  { path:'email-sms-config',component:EmailSmsConfigComponent,canActivate:[AuthGuard]},
  { path:'sms-balance-report',component:SmsBalanceReportComponent,canActivate:[AuthGuard]},
  { path:'block-number',component:BlockNumberListComponent,canActivate:[AuthGuard]},
  { path:'web-lead',component:WebLeadListComponent,canActivate:[AuthGuard]},
  { path:'displaychanel',component:DisplaychanelComponent,canActivate:[AuthGuard]},
  { path:'web-lead',component:CreateChennallistComponent,canActivate:[AuthGuard]},
  { path:'signup-request',component:SignupRequestComponent,canActivate:[AuthGuard]},
  { path:'create-voipcampaign',component:CreateVoipcampaignComponent,canActivate:[AuthGuard]},
  { path:'display-voipcampaign',component:DisplayVoipcampaignComponent,canActivate:[AuthGuard]},
  { path:'manager-login',component:MamagerLoginComponent,canActivate:[AuthGuard]},
  { path:'dialer-dialog',component:DialerDialogComponent,canActivate:[AuthGuard]},
  { path:'call-history',component:CallHistoryComponent,canActivate:[AuthGuard]},
  { path:'feedback-forms',component:FeedbackFormsComponent,canActivate:[AuthGuard]},
  { path: 'softphone', component: SoftphoneComponent,canActivate:[AuthGuard]},
  { path: 'mail-composer', component: MailComposerComponent,canActivate:[AuthGuard]},
  { path: 'create-product', component: CreateProductComponent,canActivate:[AuthGuard]},
  { path: 'products',component:ProductsComponent,canActivate:[AuthGuard]},
  { path: 'products/:id',component:ProductsComponent,canActivate:[AuthGuard]},
  { path: 'mail-composer/:id',component:MailComposerComponent,canActivate:[AuthGuard]},
  { path: 'verification-form', component: VerificationFormComponent,canActivate:[AuthGuard]},
  { path: 'product-images', component: ProductImagesComponent,canActivate:[AuthGuard]},
  { path: 'product-documents', component: ProductDocumentsComponent,canActivate:[AuthGuard]},
  { path: 'schedule-meeting', component: ScheduleMeetingComponent,canActivate:[AuthGuard]},
  { path: 'sadmin-plan-cal-report', component: SadminPlanCalReportComponent,canActivate:[AuthGuard]},
  { path: 'agent-shift-break', component: AgentShiftBreakComponent,canActivate:[AuthGuard]},
  { path: 'voice-mail', component: VoiceMailComponent,canActivate:[AuthGuard]},
  { path: 'manager-request', component: ManagerRequestComponent,canActivate:[AuthGuard]},
  { path: 'agent-login-activity-report', component: AgentLoginActivityReportComponent,canActivate:[AuthGuard]},
  { path: 'telephony-sms', component: TelephonySmsComponent,canActivate:[AuthGuard]},
  { path: 'digital-sms-feedback', component: DigitalSmsFeedbackComponent,canActivate:[AuthGuard]},
  { path: 'create-mailreq-lead', component: CreateMailreqLeadComponent,canActivate:[AuthGuard]},
  { path: 'create-smsreq-lead', component: CreateSmsreqLeadComponent,canActivate:[AuthGuard]},
  { path: 'temp-user-details/:id',component:TempUserDetailsComponent,canActivate:[AuthGuard]},  
  { path: 'create-digitalreq-lead', component: CreateDigitalreqLeadComponent,canActivate:[AuthGuard]},  
  { path: 'create-temp-manager', component: CreateTempManagerComponent,canActivate:[AuthGuard]},
  { path: 'send-email', component: SendEmailComponent,canActivate:[AuthGuard]},  
  { path: 'feedback-report', component: FeedbackReportComponent,canActivate:[AuthGuard]},
  { path: 'view-feedback', component: ViewFeedbackComponent,canActivate:[AuthGuard]},  
  { path: 'copy-send-email', component: CopySendEmailComponent,canActivate:[AuthGuard]},  
  { path: 'requested_report',component:RequestedReportComponent,canActivate:[AuthGuard]},
  { path: 'lead-details/:id',component:LeadDetailsComponent,canActivate:[AuthGuard]},
  { path: 'lead-details',component:LeadDetailsComponent,canActivate:[AuthGuard]},
  { path: 'erp-leadlist',component:ErpLeadlistComponent,canActivate:[AuthGuard]},
  { path: 'recording-download',component:RecordingDownloadComponent,canActivate:[AuthGuard]},
  { path: 'lms',component:ErpModuleComponent,canActivate:[AuthGuard]},
  { path: 'agent-missedcall-report', component: AgentMissedCallReportComponent},
  { path: 'website-chat',component:WebsiteChatComponent,canActivate:[AuthGuard]},
  { path: 'calender',component:CalenderComponent,canActivate:[AuthGuard]},
  { path: 'ticket-list',component:TicketListComponent,canActivate:[AuthGuard]},
  { path: 'lead-config',component:LeadConfigComponent,canActivate:[AuthGuard]},
  { path: 'email-server',component:EmailServerComponent,canActivate:[AuthGuard]},
  { path: 'print', component: PrintPdfComponent, canActivate: [AuthGuard]},
  { path: 'print/:id',component:PrintPdfComponent,canActivate:[AuthGuard]},
  { path: 'create-stage',component:CreateStageComponent,canActivate:[AuthGuard]},
  { path: 'lead-stage',component:LeadStagesComponent,canActivate:[AuthGuard]},
  { path: 'create-lead-stages-status',component:CreateLeadStagesStatusComponent,canActivate:[AuthGuard]},
  { path: 'lead-stages-status',component:LeadStagesStatusComponent,canActivate:[AuthGuard]},
  { path: 'tollfree-package',component:TollfreePackageComponent,canActivate:[AuthGuard]},
  { path: 'OBD-package',component:OBDPackageComponent,canActivate:[AuthGuard]},
  { path: 'manager-calender',component:SchedulerComponent,canActivate:[AuthGuard]},
  { path: 'test-erp',component:ErpModuleNewComponent,canActivate:[AuthGuard]},
  { path: 'appointment/:id',component:AppointmentComponent},
  { path: 'schedule-config',component:ScheduleSmsComponent,canActivate:[AuthGuard]},
  //{ path: 'conference-detail',component:ConferenceDetailComponent,canActivate:[AuthGuard]},
  { path: 'cust-appointment/:id',component:CustAppointmentComponent},
  { path: 'landing-page',component:LandingPageComponent},
  { path: 'conference-details/:id',component:ConferenceDetailsComponent,canActivate:[AuthGuard]},
  { path: 'create-schedule-report',component:CreateScheduleReportComponent,canActivate:[AuthGuard]},
  { path: 'schedule-report',component:ScheduleReportComponent,canActivate:[AuthGuard]},
  { path: 'hold-calling-reason',component:HoldCallingReasonComponent,canActivate:[AuthGuard]},
  { path: 'acw-report',component:AcwReportComponent,canActivate:[AuthGuard]},
  { path: 'digitalads-package',component:TeleDigitaladsPackageComponent,canActivate:[AuthGuard]},
  { path: 'call-review-form',component:CallReviewFormComponent,canActivate:[AuthGuard]},

  { path: 'call-recording-list', component: CallRecordingListComponent },
  { path: 'header-footer-set', component: HeaderFooterSetComponent },
  { path: 'product-grouplist',component:ProductGroupComponent,canActivate:[AuthGuard]},
  { path: 'source-list',component:SourceComponent,canActivate:[AuthGuard]},
  { path: 'review-rate-report',component:ReviewRateReportComponent,canActivate:[AuthGuard]},
  { path: 'untouch-lead-report',component:UntouchLeadReportComponent,canActivate:[AuthGuard]},
  { path: 'lead-stage-report',component:LeadStageReportComponent,canActivate:[AuthGuard]},
  { path: 'lead-source-report',component:LeadSourceReportComponent,canActivate:[AuthGuard]},
  { path: 'lead-opportunityamount-report',component:LeadOpportunityamountReportComponent,canActivate:[AuthGuard]},
  { path: 'lead-timeline-report',component:LeadTimelineReportComponent,canActivate:[AuthGuard]},
  { path: 'access-setting',component:AgentLeadAccessComponent,canActivate:[AuthGuard]},
  { path: 'asterisk-server',component:AsteriskServerComponent,canActivate:[AuthGuard]},
  { path: 'live-channel2',component:LiveChannel2Component,canActivate:[AuthGuard]},
  { path: 'campaign-disposition-report',component:CampaignDispositionReportComponent,canActivate:[AuthGuard]},
  { path: 'more-notification',component:MoreNotificationComponent,canActivate:[AuthGuard]},
  { path: 'custom-api',component:CustomeApiComponent,canActivate:[AuthGuard]},
  { path: 'queue-call',component:QueueCallComponent,canActivate:[AuthGuard]},
  { path: 'call-pulse-report',component:CallPluseReportComponent,canActivate:[AuthGuard]},
  { path: 'agent-break-report',component:AgentsBreakReportComponent,canActivate:[AuthGuard]},
  { path: 'agent-callduration-talktime',component:AgentCallDurationTalktimeReportComponent,canActivate:[AuthGuard]},
  // { path: 'more-notification',component:MoreNotificationComponent,canActivate:[AuthGuard]},
  { path: 'black-list',component:BlackListComponent,canActivate:[AuthGuard]},
  { path: 'zoho-lead',component:ZohoLeadComponent,canActivate:[AuthGuard]},
  { path: 'live-channel3',component:LiveChannel3Component,canActivate:[AuthGuard]},
  { path: 'consultant-list',component:ConsultantListComponent,canActivate:[AuthGuard]},
  { path: 'call-usage-report',component:CallUsageReportComponent,canActivate:[AuthGuard]},
  { path: 'agent-perfomonce-report',component:AgentPerfomonceReportComponent,canActivate:[AuthGuard]},
  { path: 'sms-links',component:SmsLinksComponent,canActivate:[AuthGuard]},
  { path: 'whatsapp-template',component:WhatsappTemplateComponent,canActivate:[AuthGuard]},
  { path: 'create-whatsapp-template',component:CreateWhatsappTemplateComponent,canActivate:[AuthGuard]},
  { path: 'create-whatsapp-template/:id',component:CreateWhatsappTemplateComponent,canActivate:[AuthGuard]},
  {path:'lms-analytics',component:LmsAnalyticComponent,canActivate:[AuthGuard]},
  {path:'call-disposition',component:DispotionCallComponent,canActivate:[AuthGuard]},
  { path: 'call-dispositions-details/:id', component: CallDispositionsDetailsComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'lead-tag', component: LeadTagComponent, canActivate: [AuthGuard]},
  { path: 'lead-tag-assign-agent/:id', component: LeadTagAssignAgentComponent, canActivate: [AuthGuard]},
  { path: 'issue-type', component: IssueTypeComponent, canActivate: [AuthGuard]},
  { path: 'new-caller-report', component: NewCallerReportComponent, canActivate: [AuthGuard]},
  { path: 'incoming-misscall-report', component: IncomingmisscallReportComponent, canActivate: [AuthGuard]},
  { path: 'admin-setting', component: AdminSettingComponent, canActivate: [AuthGuard]},
  { path: 'agent-performance-report', component: XlncAgentPerformanceComponent, canActivate: [AuthGuard]},
  { path: 'ticket-detail/:id', component: TicketDetailComponent, canActivate: [AuthGuard]},

  { path :'deleted-lead-list',component:DeletedLeadListComponent,canActivate:[AuthGuard]},


  {path: 'supervisor-assign-agent/:id', component:SupervisorAssignAgentComponent,canActivate:[AuthGuard]},
  {path: 'supervisor-agents', component:SupervisorAgentsComponent,canActivate:[AuthGuard]},
  {path: 'social-channels',loadChildren: () => import('./components/social-channels/social-channels.module').then(m => m.SocialChannelsModule),canActivate:[AuthGuard]},
  {path: 'brand-management',loadChildren: () => import('./components/brand-management/brand-management.module').then(m => m.BrandManagementModule),canActivate:[AuthGuard]},
  { path: 'chat/chat-message', loadChildren: () => import('./components/chat/chat-message/chat-message.module').then(m => m.ChatMessageModule)},
  { path: 'digital/media-directory', loadChildren: () => import('./components/media-directory/media-directory.module').then(m => m.MediaDirectoryModule)},
  { path: 'digital/media-library/:id', loadChildren: () => import('./components/media-library/media-library.module').then(m => m.MediaLibraryModule),canActivate:[AuthGuard]},
  { path: 'lead-integration', loadChildren: () => import('./components/leads-generation/lead-list.module').then(m => m.LeadListModule),canActivate:[AuthGuard]},
  //{ path: 'leads-generation', loadChildren: () => import('./components/leads-list/leads-generation/leads-generation.module').then(m => m.LeadsGenerationModule),canActivate:[AuthGuard]},
  { path: 'async-cam', loadChildren: () => import('./components/leads-generation/async-campaign/async-campaign.module').then(m => m.AsyncCampaignModule),canActivate:[AuthGuard]},
  { path: 'post-management', loadChildren: () => import('./components/post-management/post-management.module').then(m => m.PostManagementModule),canActivate:[AuthGuard]},
  { path: 'createpost', loadChildren: () => import('./components/post-management/createpost/createpost.module').then(m => m.CreatepostModule),canActivate:[AuthGuard]},
  { path: 'scheduled-post', loadChildren: () => import('./components/post-management/scheduled-post/scheduled-post.module').then(m => m.ScheduledPostModule),canActivate:[AuthGuard]},
  { path: 'account-access', component: AccountAccessComponent,canActivate:[AuthGuard]  },
  { path: 'obdcampaign-detail/:id', component: ObdCampaignDetailComponent, canActivate: [AuthGuard]},
  { path: 'dealdone-list', component: DealDoneListComponent, canActivate: [AuthGuard]},
  { path: 'chat-settings', component: ChatsComponent,canActivate:[AuthGuard]},
  { path: 'segment-wise-call-log',component:SegmentWiseCallLogDetailsComponent,canActivate:[AuthGuard]},
  { path: 'admin-activity-log',component:AdminActivityLogComponent,canActivate:[AuthGuard]},
  
  //SMS
  {path: 'sms-log',loadChildren: () => import('./components/sms/sms-log/sms-log.module').then(m => m.SmsLogModule),canActivate:[AuthGuard]},
  {path: 'sms-campaign',loadChildren: () => import('./components/sms/sms-campaign/sms-campaign.module').then(m => m.SmsCampaignModule),canActivate:[AuthGuard]},  
  {path: 'sms-campaign-detail/:id',loadChildren: () => import('./components/sms/sms-campaign-detail/sms-campaign-detail.module').then(m => m.SmsCampaignDetailModule),canActivate:[AuthGuard]},
  {path: 'triggers',loadChildren: () => import('./components/triggers/triggers.module').then(m => m.TriggersModule),canActivate:[AuthGuard]},

  //Email
  {path: 'email-campaign',loadChildren: () => import('./components/email/email-campaign/email-campaign.module').then(m => m.EmailCampaignModule),canActivate:[AuthGuard]},  
  {path: 'email-campaign-detail/:id',loadChildren: () => import('./components/email/email-campaign-detail/email-campaign-detail.module').then(m => m.EmailCampaignDetailModule),canActivate:[AuthGuard]},  
  {path: 'email-log',loadChildren: () => import('./components/email/email-log/email-log.module').then(m => m.EmailLogModule),canActivate:[AuthGuard]},  

  //Campaigns
  { path: 'campaigns',component:CampaignTypeComponent,canActivate:[AuthGuard]},
  { path: 'voice-campaign',component:CampaignsComponent,canActivate:[AuthGuard]},
  { path: 'obd-campaign', component: ObdCampaignComponent, canActivate: [AuthGuard]},
  { path: 'link-count-report', component: LinkCountReportComponent, canActivate: [AuthGuard]},
  { path: 'obd-pulse-report', component: ObdPulseReportComponent, canActivate: [AuthGuard]},
  { path: 'common-agent-performance-report', component: CommonAgentPerformanceReportComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
