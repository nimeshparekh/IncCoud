import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps'
import { BaseComponent } from './components/base/base.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { DeshboardComponent } from './components/deshboard/deshboard.component';
import { DidRoutingComponent } from './components/did-routing/did-routing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';
import { IvrBuilderComponent,CopyIvrComponent } from './components/ivr-builder/ivr-builder.component';
import { AgentsGroupsComponent,AssignLeadsActiveAgentsComponent } from './components/agents-groups/agents-groups.component';
import { OutboundComponent } from './components/outbound/outbound.component';
import { CallLogComponent, RecordingCallComponent } from './components/call-log/call-log.component';
import { SoundUploadComponent } from './components/sound-upload/sound-upload.component';
import { EditDidConfigComponent } from './components/edit-did-config/edit-did-config.component';
import { CreateSoundComponent } from './components/create-sound/create-sound.component';
import { CreateIvrComponent } from './components/create-ivr/create-ivr.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { TokenInterceptor } from './token.interceptor';
import { CreateAgentsComponent } from './components/create-agents/create-agents.component';
import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';
import { CreateAdminUserComponent } from './components/create-admin-user/create-admin-user.component';
import { ManagerListComponent } from './components/manager-list/manager-list.component';
import { CreateManagerComponent } from './components/create-manager/create-manager.component';
import { ChannelListComponent } from './components/channel-list/channel-list.component';
import { CreateChannelComponent } from './components/create-channel/create-channel.component';
import { ManagerChannelListComponent } from './components/manager-channel-list/manager-channel-list.component';
import { HuntGroupComponent,CopyAgentGroupComponent } from './components/hunt-group/hunt-group.component';
import { CreateHuntGroupComponent } from './components/create-hunt-group/create-hunt-group.component';
import { HuntGroupDetailComponent } from './components/hunt-group-detail/hunt-group-detail.component';
import { AssignAgentsComponent } from './components/assign-agents/assign-agents.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { LoginActivityComponent } from './components/login-activity/login-activity.component';
import { KycDocumentUploadComponent } from './components/kyc-document-upload/kyc-document-upload.component';

import { AgentCallHistoryComponent } from './components/agent-call-history/agent-call-history.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { CreateContactComponent } from './components/create-contact/create-contact.component';
import { SegmentListComponent } from './components/segment-list/segment-list.component';
import { CreateSegmentComponent } from './components/create-segment/create-segment.component';
import { AgentDialerComponent, AgentProductShareComponents } from './components/agent-dialer/agent-dialer.component';
import { AgentCallFeedbackComponent } from './components/agent-call-feedback/agent-call-feedback.component';
import { KycDocumentComponent } from './components/kyc-document/kyc-document.component';
import { KycAprovelComponent } from './components/kyc-aprovel/kyc-aprovel.component';
import { LiveCallComponent } from './components/live-call/live-call.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { ManagerDetailsComponent } from './components/manager-details/manager-details.component';
import { ApproveSoundUploadComponent } from './components/approve-sound-upload/approve-sound-upload.component';
import { ApproveSoundStatusComponent } from './components/approve-sound-status/approve-sound-status.component';
import { ClickToCallComponent } from './components/click-to-call/click-to-call.component';
import { CreateVoipCampaignComponent } from './components/create-voip-campaign/create-voip-campaign.component';
import { AdminSmsTemplateComponent } from './components/admin-sms-template/admin-sms-template.component';
import { CreateAdminSmsComponent } from './components/create-admin-sms/create-admin-sms.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { ConferenceCallComponent } from './components/conference-call/conference-call.component';
import { CreateConferenceCallComponent } from './components/create-conference-call/create-conference-call.component';
import { AdminEmailTemplateComponent } from './components/admin-email-template/admin-email-template.component';
import { CreateAdminEmailComponent } from './components/create-admin-email/create-admin-email.component';

import { ChartsModule } from 'ng2-charts';
import { CampaignDetailComponent,ReGenerateCampaignComponent } from './components/campaign-detail/campaign-detail.component';
import { DemoRequestComponent } from './components/demo-request/demo-request.component';
import { AdminPackagesComponent } from './components/admin-packages/admin-packages.component';
import { CreatePackagesComponent } from './components/create-packages/create-packages.component';
import { VisitorTrakingComponent } from './components/visitor-traking/visitor-traking.component';
import { DisplayVisitorDataComponent } from './components/display-visitor-data/display-visitor-data.component';
import { LeadListComponent } from './components/lead-list/lead-list.component';
import { SmsServerComponent } from './components/sms-server/sms-server.component';
import { DisplaySmsServerComponent } from './components/display-sms-server/display-sms-server.component';
import { AdminEmailServerComponent } from './components/admin-email-server/admin-email-server.component';
import { CreateEmailServerComponent } from './components/create-email-server/create-email-server.component';
import { MissCallComponent } from './components/miss-call/miss-call.component';
import { ManagerLivecallsComponent } from './components/manager-livecalls/manager-livecalls.component';
import { AdminDisplayGetOfferComponent } from './components/admin-display-get-offer/admin-display-get-offer.component';
import { AdminDisplayCareersDataComponent } from './components/admin-display-careers-data/admin-display-careers-data.component';
import { EmailTemplateComponent,EmailMessageVariables } from './components/email-template/email-template.component';
import { CreateEmailTemplateComponent } from './components/create-email-template/create-email-template.component';
import { CreateSmsTemplateComponent } from './components/create-sms-template/create-sms-template.component';
import { SmsTemplateComponent,SmsMessageVariables } from './components/sms-template/sms-template.component';
import { MasterDataComponent } from './components/master-data/master-data.component';
import { AccountingStatusComponent } from './components/accounting-status/accounting-status.component';
import { AdminSmsTemplateApproveComponent } from './components/admin-sms-template-approve/admin-sms-template-approve.component';
import { ConferenceDetailComponent } from './components/conference-detail/conference-detail.component';
import { CallSummaryReportComponent } from './components/call-summary-report/call-summary-report.component';
import { AgentBreakTimeComponent } from './components/agent-break-time/agent-break-time.component';
import { AgentLoginLogoutComponent } from './components/agent-login-logout/agent-login-logout.component';
import { ZohoUsersComponent } from './components/zoho-users/zoho-users.component';
import { ZohoUserMapComponent } from './components/zoho-user-map/zoho-user-map.component';
import { AgentPerformanceComponent } from './components/agent-performance/agent-performance.component';
import { AgentHourlyComponent } from './components/agent-hourly/agent-hourly.component';
import { ResourcesAvailabilityComponent } from './components/resources-availability/resources-availability.component';
import { HourlyCallReportComponent } from './components/hourly-call-report/hourly-call-report.component';

import { DemoReqFeedbackComponent } from './components/demo-req-feedback/demo-req-feedback.component';
import { DialResultReportComponent } from './components/dial-result-report/dial-result-report.component';
import { BillingReportComponent } from './components/billing-report/billing-report.component';

import { KycDocumentViewComponent } from './components/kyc-document-view/kyc-document-view.component';
import { CampaignSummaryReportComponent } from './components/campaign-summary-report/campaign-summary-report.component';
import { AgentCalldurationReportComponent } from './components/agent-callduration-report/agent-callduration-report.component';
import { MinutesAssignResponseComponent } from './components/minutes-assign-response/minutes-assign-response.component';
import { CallbackSummaryReportComponent } from './components/callback-summary-report/callback-summary-report.component';
import { CallbackDetailedReportComponent } from './components/callback-detailed-report/callback-detailed-report.component';
import { ChannelUtilizationComponent } from './components/channel-utilization/channel-utilization.component';
import { TelephonyDigitalComponent } from './components/telephony-digital/telephony-digital.component';
import { TelephonyMailComponent } from './components/telephony-mail/telephony-mail.component';
import { DigitalMailFeedbackComponent } from './components/digital-mail-feedback/digital-mail-feedback.component';
import { DigitalFeedbackComponent } from './components/digital-feedback/digital-feedback.component';
//import { AdminTelephonyDigitalComponent } from './components/admin-telephony-digital/admin-telephony-digital.component';
import { RenewalReportComponent } from './components/renewal-report/renewal-report.component';
import { SpamDidReportComponent } from './components/spam-did-report/spam-did-report.component';
import { PackageCalldurationReportComponent } from './components/package-callduration-report/package-callduration-report.component';

import { AdminGstComponent } from './components/admin-gst/admin-gst.component';
import { AdminGstDisplayComponent } from './components/admin-gst-display/admin-gst-display.component';

import { GenerateContactComponent } from './components/generate-contact/generate-contact.component';
import { RenewPackageComponent } from './components/renew-package/renew-package.component';
import { AgentLeadListComponent } from './components/agent-lead-list/agent-lead-list.component';
import { AgentLeadFeedbackComponent } from './components/agent-lead-feedback/agent-lead-feedback.component';
import { AgentCallScheduleComponent,RescheduleCallComponent } from './components/agent-call-schedule/agent-call-schedule.component';
import { AgentNumberHistoryComponent } from './components/agent-number-history/agent-number-history.component';
import { InvoiceReportComponent } from './components/invoice-report/invoice-report.component';
import { ManagerNumberHistoryComponent } from './components/manager-number-history/manager-number-history.component';
import { ManagerInvoiceReportComponent } from './components/manager-invoice-report/manager-invoice-report.component';
import { TeleSmsPackageComponent } from './components/tele-sms-package/tele-sms-package.component';
import { CreateTelesmsPackageComponent } from './components/create-telesms-package/create-telesms-package.component';
import { LivechannelsComponent } from './components/livechannels/livechannels.component';
import { TeleMailPackageComponent } from './components/tele-mail-package/tele-mail-package.component';
import { CreateTelemailPackageComponent } from './components/create-telemail-package/create-telemail-package.component';
import { TeleMeetPackageComponent } from './components/tele-meet-package/tele-meet-package.component';
import { CreateTelemeetPackageComponent } from './components/create-telemeet-package/create-telemeet-package.component';
import { TeleDigitalPackageComponent } from './components/tele-digital-package/tele-digital-package.component';
import { CreateTeledigitalPackageComponent } from './components/create-teledigital-package/create-teledigital-package.component';
import { CreateVendorComponent } from './components/create-vendor/create-vendor.component';
import { DisplayVendorComponent } from './components/display-vendor/display-vendor.component';
import { VendorListComponent } from './components/vendor-list/vendor-list.component';
import { IvrInputReportComponent } from './components/ivr-input-report/ivr-input-report.component';
//import { SmsCampaignComponent } from './components/sms-campaign/sms-campaign.component';
//import { CreateSmsCampaignComponent } from './components/create-sms-campaign/create-sms-campaign.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SmsCampaignDetailComponent } from './components/sms-campaign-detail/sms-campaign-detail.component';
import { ManagerSmsServerComponent } from './components/manager-sms-server/manager-sms-server.component';

import { UserReportComponent } from './components/user-report/user-report.component';

import { SmsConfigComponent } from './components/sms-config/sms-config.component';
import { LiveAgentLocationComponent } from './components/live-agent-location/live-agent-location.component';
import { ManagerUserReportComponent } from './components/manager-user-report/manager-user-report.component';
import { ManagerAgentListComponent } from './components/manager-agent-list/manager-agent-list.component';
import { AnswerLeadChartComponent } from './components/answer-lead-chart/answer-lead-chart.component';
import { LeadAgentChartComponent } from './components/lead-agent-chart/lead-agent-chart.component';
import { HourlyLeadChartComponent } from './components/hourly-lead-chart/hourly-lead-chart.component';
import { HourlyAgentChartComponent } from './components/hourly-agent-chart/hourly-agent-chart.component';
import { CampaignLeadChartComponent } from './components/campaign-lead-chart/campaign-lead-chart.component';
import { CampaignAgentChartComponent } from './components/campaign-agent-chart/campaign-agent-chart.component';
import { PaymentTransactionComponent } from './components/payment-transaction/payment-transaction.component';
import { CreateAssignLeadComponent } from './components/create-assign-lead/create-assign-lead.component';
import { EmailSmsConfigComponent } from './components/email-sms-config/email-sms-config.component';

import { SocketioService } from './socketio.service';
import { SmsBalanceReportComponent } from './components/sms-balance-report/sms-balance-report.component';
import { BlockNumberListComponent } from './components/block-number-list/block-number-list.component';
import { CreateBlockNumberComponent } from './components/create-block-number/create-block-number.component';
import { CreateDemoreqLeadComponent } from './components/create-demoreq-lead/create-demoreq-lead.component';
import { WebLeadListComponent } from './components/web-lead-list/web-lead-list.component';
import { DisplaychanelComponent,CreateNewchannelComponent } from './components/displaychanel/displaychanel.component';
import { CreateChennallistComponent } from './components/create-chennallist/create-chennallist.component';
import { SignupRequestComponent } from './components/signup-request/signup-request.component';
import { CreateVoipcampaignComponent } from './components/create-voipcampaign/create-voipcampaign.component';
import { DisplayVoipcampaignComponent } from './components/display-voipcampaign/display-voipcampaign.component';
import { MamagerLoginComponent } from './components/mamager-login/mamager-login.component';
import { DialerDialogComponent } from './components/dialer-dialog/dialer-dialog.component';
import { ProductsComponent } from './components/products/products.component';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './messaging.service';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { CallQueueComponent } from './components/call-queue/call-queue.component';
import { CallHistoryComponent } from './components/call-history/call-history.component';
import { ShareWhatsappComponent } from './components/share-whatsapp/share-whatsapp.component';
import { CallTransferComponent } from './components/call-transfer/call-transfer.component';
import { FeedbackFormsComponent } from './components/feedback-forms/feedback-forms.component';
import { ContactInformationComponent } from './components/contact-information/contact-information.component';
import { CreateFeedbackFormComponent } from './components/create-feedback-form/create-feedback-form.component';
import { FeedbackFormFillComponent } from './components/feedback-form-fill/feedback-form-fill.component';
import { SoftphoneComponent } from './components/softphone/softphone.component';
import { MailComposerComponent } from './components/mail-composer/mail-composer.component';
import { EmailEditorModule } from 'angular-email-editor';
import { ChatsComponent } from './components/chats/chats.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { VerificationFormComponent } from './components/verification-form/verification-form.component';
import { ProductImagesComponent } from './components/product-images/product-images.component';
import { ProductDocumentsComponent } from './components/product-documents/product-documents.component';
import { ScheduleMeetingComponent } from './components/schedule-meeting/schedule-meeting.component';
import { SadminPlanCalReportComponent } from './components/sadmin-plan-cal-report/sadmin-plan-cal-report.component';
import { AgentShiftBreakComponent } from './components/agent-shift-break/agent-shift-break.component';
import { VoiceMailComponent } from './components/voice-mail/voice-mail.component';
import { ManagerRequestComponent } from './components/manager-request/manager-request.component';
import { AgentLiveStatusComponent } from './components/agent-live-status/agent-live-status.component';
import { AgentLoginActivityReportComponent } from './components/agent-login-activity-report/agent-login-activity-report.component';
import { TelephonySmsComponent } from './components/telephony-sms/telephony-sms.component';
import { DigitalSmsFeedbackComponent } from './components/digital-sms-feedback/digital-sms-feedback.component';
import { CreateMailreqLeadComponent } from './components/create-mailreq-lead/create-mailreq-lead.component';
import { CreateSmsreqLeadComponent } from './components/create-smsreq-lead/create-smsreq-lead.component';
import { TempUserDetailsComponent } from './components/temp-user-details/temp-user-details.component';
import { CreateDigitalreqLeadComponent } from './components/create-digitalreq-lead/create-digitalreq-lead.component';
import { CreateTempManagerComponent } from './components/create-temp-manager/create-temp-manager.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { FeedbackReportComponent } from './components/feedback-report/feedback-report.component';
import { ViewFeedbackComponent } from './components/view-feedback/view-feedback.component';
import { CopySendEmailComponent } from './components/copy-send-email/copy-send-email.component';
import { RequestedReportComponent } from './components/requested-report/requested-report.component';
import { LeadDetailsComponent,CreateSaleorderComponent, LeadEmailSendComponent, LeadSmsSendComponent,LeadQuoatationComponent,LeadFeedbackFormComponent} from './components/lead-details/lead-details.component';
import { ErpLeadlistComponent,AssignToAgentComponent ,AllDeletedLeadComponent} from './components/erp-leadlist/erp-leadlist.component';
import { RecordingDownloadComponent } from './components/recording-download/recording-download.component';
import { ErpModuleComponent,erpassignComponent,CreateLeadErpComponent,CreateOpportunityErpComponent,CreatequotationErpComponent } from './components/erp-module/erp-module.component';
import { DurationPipe } from './duration.pipe';


import { LOCALE_ID } from '@angular/core';
import { AgentMissedCallReportComponent } from './components/agent-missed-call-report/agent-missed-call-report.component';
import { WebsiteChatComponent } from './components/website-chat/website-chat.component';
import { CalenderComponent } from './components/calender/calender.component';

import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { TicketListComponent,CreateSupportIssueComponent } from './components/ticket-list/ticket-list.component';
import { ScheduleSmsTemplateComponent } from './components/schedule-sms-template/schedule-sms-template.component';
import { ScheduleEmailTemplateComponent } from './components/schedule-email-template/schedule-email-template.component';
import { LeadConfigComponent } from './components/lead-config/lead-config.component';
import { EmailServerComponent,CreateMemailServerComponent } from './components/email-server/email-server.component';
import { PrintPdfComponent } from './components/print-pdf/print-pdf.component';
import { CreateStageComponent } from './components/create-stage/create-stage.component';
import { LeadStagesComponent,CreateLeadStatusComponent } from './components/lead-stages/lead-stages.component';
import { LeadStagesStatusComponent } from './components/lead-stages-status/lead-stages-status.component';
import { CreateLeadStagesStatusComponent } from './components/create-lead-stages-status/create-lead-stages-status.component';
import { TollfreePackageComponent,CreateTollfreePackageComponent } from './components/tollfree-package/tollfree-package.component';
import { OBDPackageComponent,CreateOBDPackageComponent } from './components/obd-package/obd-package.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { ErpModuleNewComponent } from './components/erp-module-new/erp-module-new.component';
import { MeetingNotesComponent } from './components/meeting-notes/meeting-notes.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ScheduleSmsComponent } from './components/schedule-sms/schedule-sms.component';
import { AgentFileListComponent } from './components/agent-file-list/agent-file-list.component';
import { ManagerFileListComponent } from './components/manager-file-list/manager-file-list.component';
import { CustAppointmentComponent } from './components/cust-appointment/cust-appointment.component';
import { ConferenceDetailsComponent } from './components/conference-details/conference-details.component';
import { LandingPageComponent,GetTouchSalesComponents } from './components/landing-page/landing-page.component';
import { ScheduleReportComponent } from './components/schedule-report/schedule-report.component';
import { CreateScheduleReportComponent } from './components/create-schedule-report/create-schedule-report.component';
import { HoldCallingReasonComponent,CreateReasonComponent } from './components/hold-calling-reason/hold-calling-reason.component';
import { ImportLeadCsvComponent } from './components/import-lead-csv/import-lead-csv.component';
import { AcwReportComponent } from './components/acw-report/acw-report.component';
import { TeleDigitaladsPackageComponent,CreateDigitaladsPackageComponent } from './components/tele-digitalads-package/tele-digitalads-package.component';
import { CallReviewFormComponent,CreateReviewFormComponent } from './components/call-review-form/call-review-form.component';
//import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgxEditInlineModule } from 'ngx-edit-inline';
import { CallRecordingListComponent } from './components/call-recording-list/call-recording-list.component';
import { HeaderFooterSetComponent } from './components/header-footer-set/header-footer-set.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { ManagerReportsDashboardComponent } from './components/manager-reports-dashboard/manager-reports-dashboard.component';
import {  WavesModule } from 'angular-bootstrap-md';
import { ProductGroupComponent } from './components/product-group/product-group.component';
import { CreateProductGroupComponent } from './components/create-product-group/create-product-group.component';
import { SourceComponent } from './components/source/source.component';
import { CreateSourceComponent } from './components/create-source/create-source.component';
import { ReviewRateReportComponent } from './components/review-rate-report/review-rate-report.component';
import { UntouchLeadReportComponent } from './components/untouch-lead-report/untouch-lead-report.component';
import { LeadStageReportComponent } from './components/lead-stage-report/lead-stage-report.component'
import { LeadSourceReportComponent } from './components/lead-source-report/lead-source-report.component';
import { LeadOpportunityamountReportComponent } from './components/lead-opportunityamount-report/lead-opportunityamount-report.component';
import { LeadTimelineReportComponent } from './components/lead-timeline-report/lead-timeline-report.component';
import { AgentLeadAccessComponent } from './components/agent-lead-access/agent-lead-access.component';
import { AsteriskServerComponent,CreateAsteriskServerComponent } from './components/asterisk-server/asterisk-server.component';
import { LiveChannel2Component } from './components/live-channel2/live-channel2.component';
import { CampaignDispositionReportComponent } from './components/campaign-disposition-report/campaign-disposition-report.component';
import { MoreNotificationComponent } from './components/more-notification/more-notification.component';
import { CustomeApiComponent } from './components/custome-api/custome-api.component';
import { CreateCustomeApiComponent } from './components/create-custome-api/create-custome-api.component';
import { QueueCallComponent } from './components/queue-call/queue-call.component';
import { CallPluseReportComponent } from './components/call-pluse-report/call-pluse-report.component';

// import { ChartsModule, WavesModule } from 'angular-bootstrap-md'
import { BlackListComponent } from './components/black-list/black-list.component';
import { DealDoneComponent } from './components/deal-done/deal-done.component';
import { ZohoLeadComponent } from './components/zoho-lead/zoho-lead.component';
import { LiveChannel3Component } from './components/live-channel3/live-channel3.component';
import { ConsultantListComponent,CreateConsultantComponent } from './components/consultant-list/consultant-list.component';
import { AssignAgentCampaginComponent } from './components/assign-agent-campagin/assign-agent-campagin.component';
import { CallUsageReportComponent } from './components/call-usage-report/call-usage-report.component';
import { AgentPerfomonceReportComponent } from './components/agent-perfomonce-report/agent-perfomonce-report.component';
import { SupervisorAssignAgentComponent } from './components/supervisor-assign-agent/supervisor-assign-agent.component';
import { SupervisorAgentsComponent } from './components/supervisor-agents/supervisor-agents.component';
import { AgentsBreakReportComponent } from './components/agents-break-report/agents-break-report.component';
import { SmsLinksComponent,CreateLinkComponent } from './components/sms-links/sms-links.component';
import { SupvisiorDashboardComponent } from './components/supvisior-dashboard/supvisior-dashboard.component';
import { WhatsappTemplateComponent } from './components/whatsapp-template/whatsapp-template.component';
import { CreateWhatsappTemplateComponent } from './components/create-whatsapp-template/create-whatsapp-template.component';
import { AccountAccessComponent } from './components/account-access/account-access.component'; 
import { LmsAnalyticComponent } from './components/lms-analytic/lms-analytic.component';
import { DispotionCallComponent } from './components/dispotion-call/dispotion-call.component';
import { CreateDispotionCallComponent } from './components/create-dispotion-call/create-dispotion-call.component';
import { CallDispositionsDetailsComponent } from './components/call-dispositions-details/call-dispositions-details.component';
import { AssignSupervisiorComponent } from './components/assign-supervisior/assign-supervisior.component';
import { ObdCampaignComponent,CreateOBDCampaignComponent } from './components/obd-campaign/obd-campaign.component';
import { ObdCampaignDetailComponent,ReGenerateOBDCampaignComponent } from './components/obd-campaign-detail/obd-campaign-detail.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LeadTagComponent,CreateLeadTagComponent } from './components/lead-tag/lead-tag.component';
import { LeadTagAssignAgentComponent } from './components/lead-tag-assign-agent/lead-tag-assign-agent.component';
import { AgentCallDurationTalktimeReportComponent } from './components/agent-call-duration-talktime-report/agent-call-duration-talktime-report.component';
import { DealDoneListComponent } from './components/deal-done-list/deal-done-list.component';
import { CampaignTypeComponent } from './components/campaign-type/campaign-type.component';
import { TicketRaisedComponent } from './components/ticket-raised/ticket-raised.component';
import { SegmentWiseCallLogDetailsComponent } from './components/segment-wise-call-log-details/segment-wise-call-log-details.component';
import { IssueTypeComponent,CreateIssueTypeComponent } from './components/issue-type/issue-type.component';
import { IncomingmisscallReportComponent } from './components/incomingmisscall-report/incomingmisscall-report.component';
import { NewCallerReportComponent } from './components/new-caller-report/new-caller-report.component';
import { AdminSettingComponent } from './components/admin-setting/admin-setting.component';
import { XlncAgentPerformanceComponent } from './components/xlnc-agent-performance/xlnc-agent-performance.component';
import { DeletedLeadListComponent } from './components/deleted-lead-list/deleted-lead-list.component';
import { TicketDetailComponent,SmsSendComponent,EmailSendComponent,TicketShareWhatsappComponent,TicketAssignAgentComponent } from './components/ticket-detail/ticket-detail.component';
import { AdminActivityLogComponent } from './components/admin-activity-log/admin-activity-log.component';
import { LinkCountReportComponent } from './components/link-count-report/link-count-report.component';
import { ShareWhatsappCallLogComponent } from './components/share-whatsapp-call-log/share-whatsapp-call-log.component';
import { ObdPulseReportComponent } from './components/obd-pulse-report/obd-pulse-report.component';
import { CommonAgentPerformanceReportComponent } from './components/common-agent-performance-report/common-agent-performance-report.component';


@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    SigninComponent,
    SignupComponent,
    PasswordResetComponent,
    DeshboardComponent,
    DidRoutingComponent,
    IvrBuilderComponent,CopyIvrComponent,
    AgentsGroupsComponent,
    OutboundComponent,
    CallLogComponent,RecordingCallComponent,
    SoundUploadComponent,
    EditDidConfigComponent,
    CreateSoundComponent,
    CreateIvrComponent,
    CreateAgentsComponent,
    AdminUserListComponent,
    CreateAdminUserComponent,
    ManagerListComponent,
    CreateManagerComponent,
    ChannelListComponent,
    CreateChannelComponent,
    ManagerChannelListComponent,
    HuntGroupComponent,CopyAgentGroupComponent,
    CreateHuntGroupComponent,
    HuntGroupDetailComponent,
    AssignAgentsComponent,
    ViewProfileComponent,
    LoginActivityComponent,
    KycDocumentUploadComponent,

    AgentCallHistoryComponent,
    ContactListComponent,
    CreateContactComponent,
    SegmentListComponent,
    CreateSegmentComponent,
    AgentDialerComponent,
    AgentProductShareComponents,
    AgentCallFeedbackComponent,    
    RescheduleCallComponent,
    KycDocumentComponent,
    KycAprovelComponent,
    LiveCallComponent,
    FileListComponent,
    ManagerDetailsComponent,
    ApproveSoundUploadComponent,
    ApproveSoundStatusComponent,
    ClickToCallComponent,
    CreateVoipCampaignComponent,
    AdminSmsTemplateComponent,
    CreateAdminSmsComponent,
    CampaignsComponent,
    ConferenceCallComponent,
    CreateConferenceCallComponent,
    AdminEmailTemplateComponent,
    CreateAdminEmailComponent,
    CampaignDetailComponent,
    DemoRequestComponent,
    AdminPackagesComponent,
    CreatePackagesComponent,
    VisitorTrakingComponent,
    DisplayVisitorDataComponent,
    LeadListComponent,
    SmsServerComponent,
    DisplaySmsServerComponent,
    AdminEmailServerComponent,
    CreateEmailServerComponent,
    MissCallComponent,
    ManagerLivecallsComponent,
    AdminDisplayGetOfferComponent,
    AdminDisplayCareersDataComponent,
    EmailTemplateComponent,
    CreateEmailTemplateComponent,
    CreateSmsTemplateComponent,  
    SmsTemplateComponent,
    SmsMessageVariables,
    MasterDataComponent,
  
    AccountingStatusComponent,
    AdminSmsTemplateApproveComponent,
    ConferenceDetailComponent,
    CallSummaryReportComponent,
    AgentBreakTimeComponent,
    AgentLoginLogoutComponent,
    ZohoUsersComponent,
    ZohoUserMapComponent,
    AgentPerformanceComponent,
    AgentHourlyComponent,
    ResourcesAvailabilityComponent,
    HourlyCallReportComponent,
    DemoReqFeedbackComponent,
    DialResultReportComponent,
    BillingReportComponent,

    KycDocumentViewComponent,

    CampaignSummaryReportComponent,
    AgentCalldurationReportComponent,
    MinutesAssignResponseComponent,
    CallbackSummaryReportComponent,
    CallbackDetailedReportComponent,
    ChannelUtilizationComponent,

    TelephonyDigitalComponent,
    TelephonyMailComponent,
    DigitalMailFeedbackComponent,
    DigitalFeedbackComponent,
   // AdminTelephonyDigitalComponent,

    RenewalReportComponent,
   SpamDidReportComponent,
   PackageCalldurationReportComponent,

   AdminGstComponent,
   AdminGstDisplayComponent,

   GenerateContactComponent,

   RenewPackageComponent,

   AgentLeadListComponent,

   AgentLeadFeedbackComponent,

   AgentCallScheduleComponent,

   AgentNumberHistoryComponent,

   InvoiceReportComponent,

   ManagerNumberHistoryComponent,
   ManagerInvoiceReportComponent,
   TeleSmsPackageComponent,
   CreateTelesmsPackageComponent,
   LivechannelsComponent,
   TeleMailPackageComponent,
   CreateTelemailPackageComponent,
   TeleMeetPackageComponent,
   CreateTelemeetPackageComponent,
   TeleDigitalPackageComponent,
   CreateTeledigitalPackageComponent,
   CreateVendorComponent,
   DisplayVendorComponent,
   VendorListComponent,
   IvrInputReportComponent,
   //SmsCampaignComponent,
   //CreateSmsCampaignComponent,
   SmsCampaignDetailComponent,
   ManagerSmsServerComponent,
   UserReportComponent,
   SmsConfigComponent,
   LiveAgentLocationComponent,
   ManagerUserReportComponent,
   ManagerAgentListComponent,
   AnswerLeadChartComponent,
   LeadAgentChartComponent,
   HourlyLeadChartComponent,
   HourlyAgentChartComponent,
   CampaignLeadChartComponent,
   CampaignAgentChartComponent,
   PaymentTransactionComponent,
   CreateAssignLeadComponent,
   EmailSmsConfigComponent,
   SmsBalanceReportComponent,
   BlockNumberListComponent,
   CreateBlockNumberComponent,
   CreateDemoreqLeadComponent,
   WebLeadListComponent,
   DisplaychanelComponent,CreateNewchannelComponent,
   CreateChennallistComponent,
   SignupRequestComponent,
   CreateVoipcampaignComponent,
   DisplayVoipcampaignComponent,
   MamagerLoginComponent,
   DialerDialogComponent,
   ProductsComponent,
   CallQueueComponent,
   CallHistoryComponent,
   ShareWhatsappComponent,
   CallTransferComponent,
   FeedbackFormsComponent,
   ContactInformationComponent,
   CreateFeedbackFormComponent,
   FeedbackFormFillComponent,
   SoftphoneComponent,
   MailComposerComponent,
   ChatsComponent,
   CreateProductComponent,
   VerificationFormComponent,
   ProductImagesComponent,
   ProductDocumentsComponent,
   ScheduleMeetingComponent,
   SadminPlanCalReportComponent,
   AgentShiftBreakComponent,
   VoiceMailComponent,
   ManagerRequestComponent,
   AgentLiveStatusComponent,
   AgentLoginActivityReportComponent,
   TelephonySmsComponent,
   DigitalSmsFeedbackComponent,
   CreateMailreqLeadComponent,
   CreateSmsreqLeadComponent,
   TempUserDetailsComponent,
   CreateDigitalreqLeadComponent,
   CreateTempManagerComponent,
   SendEmailComponent,
   FeedbackReportComponent,
   ViewFeedbackComponent,
   CopySendEmailComponent,
   RequestedReportComponent,
   LeadDetailsComponent,
   ErpLeadlistComponent,AllDeletedLeadComponent,
   CreateOpportunityErpComponent,
   CreatequotationErpComponent,
   CreateLeadErpComponent,
   CreateSupportIssueComponent,
   CreateLeadErpComponent,
   RecordingDownloadComponent,
   ErpModuleComponent,
   DurationPipe,
   erpassignComponent,
   CreateSaleorderComponent,
   LeadEmailSendComponent,
   LeadSmsSendComponent,
   LeadQuoatationComponent,LeadFeedbackFormComponent,
   AgentMissedCallReportComponent,
   WebsiteChatComponent,
   CalenderComponent,
   TicketListComponent,
   ScheduleSmsTemplateComponent,
   ScheduleEmailTemplateComponent,
   LeadConfigComponent,
   EmailServerComponent,
   CreateMemailServerComponent,
   PrintPdfComponent,
   CreateStageComponent,
   LeadStagesComponent,
   CreateLeadStatusComponent,
   LeadStagesStatusComponent,
   CreateLeadStagesStatusComponent,
   TollfreePackageComponent,
   CreateTollfreePackageComponent,
   OBDPackageComponent,
   CreateOBDPackageComponent,
   SchedulerComponent,
   ErpModuleNewComponent,
   MeetingNotesComponent,
   AppointmentComponent,
   ScheduleSmsComponent,
   AgentFileListComponent,
   ManagerFileListComponent,
   CustAppointmentComponent,
   ConferenceDetailsComponent,
   LandingPageComponent,
   GetTouchSalesComponents,
    ScheduleReportComponent,
    CreateScheduleReportComponent, 
    HoldCallingReasonComponent,
    CreateReasonComponent,
    ImportLeadCsvComponent,
    AcwReportComponent,
    TeleDigitaladsPackageComponent,
    CreateDigitaladsPackageComponent,
    CallReviewFormComponent,
    CreateReviewFormComponent,
    CallRecordingListComponent,
    HeaderFooterSetComponent,
    ManagerReportsDashboardComponent,
    ProductGroupComponent,
    CreateProductGroupComponent,
    SourceComponent,
    CreateSourceComponent,
    ReviewRateReportComponent,
    UntouchLeadReportComponent,
    LeadStageReportComponent,
    LeadSourceReportComponent,
    LeadOpportunityamountReportComponent,
    LeadTimelineReportComponent,
    AgentLeadAccessComponent,
    AsteriskServerComponent,
    CreateAsteriskServerComponent,
    LiveChannel2Component,
    AccountAccessComponent,
    ReGenerateCampaignComponent,AssignToAgentComponent, CampaignDispositionReportComponent, MoreNotificationComponent, CustomeApiComponent, CreateCustomeApiComponent, QueueCallComponent, CallPluseReportComponent, 
    BlackListComponent, DealDoneComponent, ZohoLeadComponent, LiveChannel3Component, ConsultantListComponent,CreateConsultantComponent, AssignAgentCampaginComponent, CallUsageReportComponent, AgentPerfomonceReportComponent, SupervisorAssignAgentComponent, SupervisorAgentsComponent, AgentsBreakReportComponent,
     SmsLinksComponent,CreateLinkComponent, SupvisiorDashboardComponent,WhatsappTemplateComponent,CreateWhatsappTemplateComponent, LmsAnalyticComponent,AssignLeadsActiveAgentsComponent, DispotionCallComponent, CreateDispotionCallComponent, CallDispositionsDetailsComponent, AssignSupervisiorComponent,
     EmailMessageVariables,
     ObdCampaignComponent,
     CreateOBDCampaignComponent,
     ObdCampaignDetailComponent,
     ReGenerateOBDCampaignComponent,
     SettingsComponent,
     LeadTagComponent,
     CreateLeadTagComponent,
     LeadTagAssignAgentComponent,
     AgentCallDurationTalktimeReportComponent,
     DealDoneListComponent,
     CampaignTypeComponent,
     TicketRaisedComponent,
     SegmentWiseCallLogDetailsComponent,
     IssueTypeComponent,
     CreateIssueTypeComponent,
     IncomingmisscallReportComponent,
     NewCallerReportComponent,
     AdminSettingComponent,
     XlncAgentPerformanceComponent,
     DeletedLeadListComponent,
     TicketDetailComponent,
     SmsSendComponent,
     EmailSendComponent,
     TicketShareWhatsappComponent,
     TicketAssignAgentComponent,
     AdminActivityLogComponent,
     LinkCountReportComponent,
     ShareWhatsappCallLogComponent,
     ObdPulseReportComponent,
     CommonAgentPerformanceReportComponent,
      ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    AngularEditorModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MaterialFileInputModule,
    ChartsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    EmailEditorModule ,
    ScheduleAllModule, RecurrenceEditorAllModule,NgxMatColorPickerModule,
    NgxChartsModule,
    ChartAllModule,
    AccumulationChartAllModule,
    RangeNavigatorAllModule,
    WavesModule,
    //NgxStarRatingModule,
    NgxEditInlineModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    {provide: LOCALE_ID, useValue: 'en-US' },
    SocketioService,
    MessagingService,
    AsyncPipe
  ],
  entryComponents:  [
    AgentCallHistoryComponent,
    AgentCallFeedbackComponent,
    CreateOpportunityErpComponent,
    CreatequotationErpComponent,
    erpassignComponent,
    CreateSupportIssueComponent,
    CreateLeadErpComponent,
    CreateSaleorderComponent,
    LeadEmailSendComponent,
    LeadSmsSendComponent,
    LeadQuoatationComponent,
    LeadFeedbackFormComponent,
    GetTouchSalesComponents,
    RecordingCallComponent,
    CreateReasonComponent,
    AssignToAgentComponent,AllDeletedLeadComponent,
    CreateConsultantComponent,
    AssignLeadsActiveAgentsComponent,
    SmsMessageVariables,
    EmailMessageVariables,
    CreateOBDCampaignComponent,
    ReGenerateOBDCampaignComponent,
    CreateLeadTagComponent,
    CreateLeadStatusComponent,
    RescheduleCallComponent,
    CreateIssueTypeComponent,
    SmsSendComponent,
    EmailSendComponent,
    TicketShareWhatsappComponent,
    TicketAssignAgentComponent,CopyIvrComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
