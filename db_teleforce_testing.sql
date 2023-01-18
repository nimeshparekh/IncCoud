-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 10.13.1.114
-- Generation Time: Nov 01, 2022 at 11:26 AM
-- Server version: 5.7.40-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_teleforce_testing`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `agent_list`
-- (See below for the actual view)
--
CREATE TABLE `agent_list` (
`agent_id` int(1)
,`account_id` int(1)
,`agent_name` int(1)
);

-- --------------------------------------------------------

--
-- Table structure for table `agent_performance_report`
--

CREATE TABLE `agent_performance_report` (
  `id` int(11) NOT NULL,
  `report_date` date NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `agent_name` varchar(250) DEFAULT NULL,
  `login_time` datetime DEFAULT NULL,
  `logout_time` datetime DEFAULT NULL,
  `total_login_time` time DEFAULT NULL,
  `breaktime` int(11) DEFAULT NULL,
  `totalholdcalltime` int(11) DEFAULT NULL,
  `talktime` int(11) DEFAULT NULL,
  `wrapuptime` float DEFAULT NULL,
  `closetime` time DEFAULT NULL,
  `totalcalls` int(11) DEFAULT NULL,
  `answercalls` int(11) DEFAULT NULL,
  `outboundcalls` int(11) DEFAULT NULL,
  `outboundconnectcalls` int(11) DEFAULT NULL,
  `inboundcalls` int(11) DEFAULT NULL,
  `missedcalls` int(11) DEFAULT NULL,
  `date_time` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `almond_age_negative`
--

CREATE TABLE `almond_age_negative` (
  `id` int(11) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `cdrid` bigint(20) DEFAULT NULL,
  `hit_count` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `almond_caller_registration`
--

CREATE TABLE `almond_caller_registration` (
  `id` int(11) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `cdrid` bigint(20) DEFAULT NULL,
  `hit_count` int(11) NOT NULL DEFAULT '1',
  `customer_credit` float DEFAULT '0',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Billing_data`
--

CREATE TABLE `Billing_data` (
  `Bill_ID` varchar(25) NOT NULL,
  `Bill_Date` date NOT NULL,
  `Account_ID` varchar(20) NOT NULL,
  `Account_GST_NO` varchar(50) DEFAULT NULL,
  `Account_State_Code` varchar(100) NOT NULL,
  `Account_Address` varchar(200) DEFAULT NULL,
  `Company_GST_ID` varchar(25) NOT NULL,
  `Bill_Type` varchar(20) NOT NULL COMMENT 'new,renew',
  `Plan_Type` varchar(25) DEFAULT NULL,
  `Previous_plan` varchar(25) DEFAULT NULL,
  `Previous_expire_date` date DEFAULT NULL,
  `Plan_user` int(11) NOT NULL,
  `Plan_channel` int(11) NOT NULL,
  `plan_minuits` int(11) DEFAULT NULL,
  `free_minuites` int(11) DEFAULT NULL,
  `Plan_Value` int(11) DEFAULT NULL COMMENT 'calculate plantype and no of user',
  `SMS_ID` varchar(25) DEFAULT NULL,
  `SMS_Plan_Value` int(10) DEFAULT NULL,
  `SMS_Pr_No` float DEFAULT NULL,
  `Mail_ID` varchar(25) DEFAULT NULL,
  `Mail_Plan_Value` int(10) DEFAULT NULL,
  `Meet_ID` varchar(25) DEFAULT NULL,
  `Meet_Plan_Value` int(10) DEFAULT NULL,
  `Digital_ID` varchar(25) DEFAULT NULL,
  `Digital_Plan_Value` int(10) DEFAULT NULL,
  `Ads_ID` varchar(25) DEFAULT NULL,
  `Ads_Plan_Value` int(11) DEFAULT NULL,
  `TFree_ID` varchar(50) DEFAULT NULL,
  `TFree_Plan_Value` int(11) DEFAULT NULL,
  `OBD_ID` varchar(50) DEFAULT NULL,
  `OBD_Plan_Value` int(11) DEFAULT NULL,
  `Plan_TotalValue` int(11) NOT NULL,
  `Plan_discount` int(11) DEFAULT NULL,
  `Discount_Type` tinyint(4) DEFAULT NULL COMMENT '0:PERCENTAGE 1:AMOUNT',
  `Discount_Per` int(11) DEFAULT NULL,
  `Value_afterdiscount` int(11) NOT NULL,
  `Plan_CGST` int(11) DEFAULT NULL,
  `Plan_SGST` int(11) DEFAULT NULL,
  `Plan_IGST` int(11) DEFAULT NULL,
  `Total_GST` int(11) NOT NULL,
  `Final_amount` int(11) NOT NULL COMMENT 'Value_afterdiscount+Total_GST',
  `Plan_expire_Date` date DEFAULT NULL,
  `Created_By` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Stand-in structure for view `channel_util`
-- (See below for the actual view)
--
CREATE TABLE `channel_util` (
`total_channel` int(1)
,`total_in_channel` int(1)
,`total_out_channel` int(1)
,`total_dialer_channel` int(1)
);

-- --------------------------------------------------------

--
-- Table structure for table `client_usage_report`
--

CREATE TABLE `client_usage_report` (
  `report_date` date DEFAULT NULL,
  `account_id` int(11) NOT NULL DEFAULT '0',
  `account_name` varchar(250) CHARACTER SET utf8 DEFAULT NULL,
  `total_calls` bigint(20) DEFAULT NULL,
  `incoming_usage` decimal(42,0) NOT NULL DEFAULT '0',
  `outgoing_usage` decimal(42,0) NOT NULL DEFAULT '0',
  `dialer_usage` decimal(23,0) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Company_GST_Master`
--

CREATE TABLE `Company_GST_Master` (
  `GST_ID` varchar(25) NOT NULL,
  `GST_Number` varchar(50) NOT NULL,
  `State` varchar(20) NOT NULL,
  `State_code` varchar(10) NOT NULL,
  `Data_Date` date NOT NULL,
  `Created_By` varchar(25) NOT NULL,
  `Address` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `HuntGroup`
--

CREATE TABLE `HuntGroup` (
  `GroupID` int(11) NOT NULL,
  `GroupName` varchar(50) NOT NULL,
  `GroupDescription` varchar(255) DEFAULT NULL,
  `AccountID` int(10) DEFAULT NULL,
  `CallType` int(10) DEFAULT NULL COMMENT '0-Sequence,1-Parallel,2-RoundRobin',
  `MusicOnHoldID` int(10) DEFAULT NULL COMMENT '0-Default',
  `Sticky` tinyint(1) DEFAULT NULL COMMENT '0-No Sticky 1-Sticky',
  `QueueTimeOut` int(10) DEFAULT NULL COMMENT 'Default-1 Hour Time Out',
  `AgentTimeOut` int(10) DEFAULT NULL COMMENT 'Default-30 Second',
  `WrapUpTime` float DEFAULT NULL COMMENT 'Default-1 minute',
  `CallRecording` tinyint(1) DEFAULT NULL COMMENT '1-Enable 0-Disable',
  `OpenTime` time DEFAULT NULL,
  `CloseTime` time DEFAULT NULL,
  `Closed` tinyint(1) DEFAULT NULL COMMENT '0-No 1-Yes',
  `Mon` tinyint(1) DEFAULT NULL COMMENT '1-Working 0-Non-Working',
  `Tue` tinyint(1) DEFAULT NULL COMMENT '1-Working 0-Non-Working',
  `Wed` tinyint(1) DEFAULT NULL COMMENT '1-Working 0-Non-Working',
  `Thu` tinyint(1) DEFAULT NULL COMMENT '1-Working 0-Non-Working',
  `Fri` tinyint(1) DEFAULT NULL COMMENT '1-Working 0-Non-Working',
  `Sat` tinyint(1) DEFAULT NULL COMMENT '1-Working 0-Non-Working',
  `Sun` tinyint(1) DEFAULT NULL COMMENT '1-Working 0-Non-Working',
  `CloseType` tinyint(1) DEFAULT NULL COMMENT '0-Terminate Call 1-Announcement 2-HuntGroup 3-IVR 4-VoiceMail 5-TimeCondition',
  `CloseAction` int(10) DEFAULT NULL COMMENT '0-HangUp',
  `ApiHit` tinyint(1) DEFAULT NULL COMMENT '0-No 1-Yes',
  `ApiID` varchar(255) DEFAULT NULL,
  `transfer_extesion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `HuntGroupDetail`
--

CREATE TABLE `HuntGroupDetail` (
  `ID` int(11) NOT NULL,
  `HuntGroupID` int(10) NOT NULL COMMENT 'Group ID of Hunt Group Table',
  `UserID` int(10) NOT NULL,
  `AgentID` int(10) NOT NULL COMMENT 'AgentID of',
  `seq_no` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `IvrBuilder`
--

CREATE TABLE `IvrBuilder` (
  `BuilderID` int(11) NOT NULL,
  `UserID` int(10) NOT NULL,
  `IvrName` varchar(40) DEFAULT NULL,
  `IvrDesc` text,
  `AnnouncementID` int(11) DEFAULT NULL,
  `AnnouncementType` tinyint(1) DEFAULT NULL COMMENT '0-PlayFile 1-GetDigit',
  `TimeOut` int(6) DEFAULT NULL COMMENT 'Value in Seconds',
  `InvalidAnnounceMentID` int(10) DEFAULT NULL,
  `InvalidRetryCount` int(4) DEFAULT NULL COMMENT 'Number of Invalid Retry',
  `InvalidRetryAnnouncementID` int(10) DEFAULT NULL,
  `InvalidDestinationType` tinyint(4) DEFAULT NULL COMMENT '0-Terminate Call 1-Announcement 2-HuntGroup 3-IVR 4-VoiceMail 5-TimeCondition 6-MissCall 7-Conference',
  `InvalidDestinationAction` int(10) DEFAULT NULL,
  `MergeInvalidOnAnnounceMent` tinyint(1) DEFAULT NULL COMMENT '0-No 1-YES',
  `NoInputAnnouncementID` int(10) DEFAULT NULL COMMENT 'TimeOut',
  `NoInputRetryCount` int(4) DEFAULT NULL,
  `NoInputRetryAnnouncementID` int(10) DEFAULT NULL,
  `NoInputDestinationType` tinyint(1) DEFAULT NULL COMMENT '0-Terminate Call 1-Announcement 2-HuntGroup 3-IVR 4-VoiceMail 5-TimeCondition 6-MissCall 7-Conference',
  `NoInputDestinationAction` int(10) DEFAULT NULL,
  `DefaultDestinationType` tinyint(1) DEFAULT NULL COMMENT '0-Terminate Call 1-Announcement 2-HuntGroup 3-IVR 4-VoiceMail 5-TimeCondition 6-MissCall 7-Conference',
  `DefaultDestinationAction` int(11) DEFAULT NULL COMMENT '0-HangUp',
  `CreateDate` datetime DEFAULT NULL,
  `ApiHit` tinyint(1) DEFAULT NULL COMMENT '0-No 1-Yes',
  `ApiID` tinyint(4) DEFAULT NULL,
  `noinputdigit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Stand-in structure for view `lead_source`
-- (See below for the actual view)
--
CREATE TABLE `lead_source` (
`lead_source` int(1)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `lead_stage_status`
-- (See below for the actual view)
--
CREATE TABLE `lead_stage_status` (
`user_id` int(1)
,`stage_id` int(1)
,`stage_name` int(1)
,`status_master` int(1)
);

-- --------------------------------------------------------

--
-- Table structure for table `ps_endpoints`
--

CREATE TABLE `ps_endpoints` (
  `id` varchar(255) NOT NULL,
  `transport` varchar(255) NOT NULL,
  `aors` varchar(255) NOT NULL,
  `outbound_auth` varchar(255) NOT NULL,
  `rtp_timeout` varchar(255) DEFAULT '300',
  `context` varchar(255) NOT NULL,
  `disallow` varchar(100) NOT NULL DEFAULT 'all',
  `allow` varchar(255) NOT NULL,
  `direct_media` varchar(255) NOT NULL,
  `rtp_symmetric` varchar(255) NOT NULL,
  `force_rport` varchar(255) NOT NULL,
  `rewrite_contact` varchar(255) NOT NULL,
  `dtls_ca_file` varchar(255) DEFAULT NULL,
  `dtls_cert_file` varchar(255) DEFAULT NULL,
  `from_domain` varchar(100) NOT NULL DEFAULT 'sbc.teleforce.in',
  `preferred_codec_only` varchar(100) NOT NULL DEFAULT 'no',
  `webrtc` varchar(255) NOT NULL,
  `outbound_proxy` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `ser_id` int(11) NOT NULL,
  `circle` varchar(50) DEFAULT NULL,
  `acro` varchar(5) DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  `msc_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `td_ads`
--

CREATE TABLE `td_ads` (
  `Ad_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `adset_id` varchar(100) DEFAULT NULL,
  `file_upload_id` varchar(100) DEFAULT NULL,
  `adcreative_image_hash` varchar(500) DEFAULT NULL,
  `adcreative_page_id` varchar(100) DEFAULT NULL,
  `adcreative_msg_website` varchar(500) DEFAULT NULL,
  `adcreative_msg_message` varchar(500) DEFAULT NULL,
  `adcreative_id` varchar(100) DEFAULT NULL,
  `ads_name` varchar(100) DEFAULT NULL,
  `ads_adset_id` varchar(100) DEFAULT NULL,
  `ads_creative_id` varchar(100) DEFAULT NULL,
  `ads_status` varchar(100) DEFAULT NULL,
  `ads_id` varchar(100) DEFAULT NULL,
  `nativeoffer_page_id` varchar(100) DEFAULT NULL,
  `nativeoffer_text` varchar(500) DEFAULT NULL,
  `nativeoffer_value` varchar(100) DEFAULT NULL,
  `nativeoffer_url` varchar(500) DEFAULT NULL,
  `nativeoffer_details` varchar(100) DEFAULT NULL,
  `nativeoffer_expire` varchar(255) DEFAULT NULL,
  `nativeoffer_generated_offer_id` varchar(255) DEFAULT NULL,
  `leadgen_form_page` varchar(255) DEFAULT NULL,
  `leadgen_form_name` varchar(255) DEFAULT NULL,
  `leadgen_form_follow_up_action_url` varchar(255) DEFAULT NULL,
  `leadgen_form_privacy_url` varchar(500) DEFAULT NULL,
  `leadgen_form_generated_id` varchar(500) DEFAULT NULL,
  `advideo_generate_id` varchar(100) DEFAULT NULL,
  `advideo_thumbnails_uri` varchar(500) DEFAULT NULL,
  `media_type` varchar(255) DEFAULT NULL,
  `voiceCampaignID` varchar(100) DEFAULT NULL,
  `smsCampaignID` varchar(100) DEFAULT NULL,
  `mailCampaignID` varchar(100) DEFAULT NULL,
  `automationSegmentID` varchar(100) DEFAULT NULL,
  `AgentGroupID` varchar(100) DEFAULT NULL,
  `is_automation` enum('no','yes') NOT NULL DEFAULT 'no',
  `last_sync_insights` date DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `per_lead_spend` varchar(100) DEFAULT NULL,
  `effective_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_adset`
--

CREATE TABLE `td_adset` (
  `A_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `adset_name` varchar(100) DEFAULT NULL,
  `adset_optimization_goal` varchar(100) DEFAULT NULL,
  `adset_billing_event` varchar(100) DEFAULT NULL,
  `adset_targeting` varchar(100) DEFAULT NULL,
  `adset_campaign_id` varchar(100) DEFAULT NULL,
  `adset_status` varchar(100) DEFAULT NULL,
  `adset_promoted_object` varchar(100) DEFAULT NULL,
  `adset_custom_event_type` varchar(100) DEFAULT NULL,
  `adset_id` varchar(100) DEFAULT NULL,
  `media_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_ads_insights`
--

CREATE TABLE `td_ads_insights` (
  `i_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `ads_id` varchar(100) NOT NULL,
  `page_id` varchar(100) NOT NULL,
  `reach` varchar(55) DEFAULT NULL,
  `spend` varchar(55) DEFAULT NULL,
  `per_lead_spend` varchar(100) DEFAULT NULL,
  `cost_per_action_type` longtext,
  `social_spend` varchar(55) DEFAULT NULL,
  `inline_post_engagement` varchar(55) DEFAULT NULL,
  `cpm` varchar(55) DEFAULT NULL,
  `cpc` varchar(55) DEFAULT NULL,
  `frequency` varchar(55) DEFAULT NULL,
  `clicks` varchar(55) DEFAULT NULL,
  `unique_ctr` varchar(55) DEFAULT NULL,
  `inline_link_clicks` varchar(55) DEFAULT NULL,
  `impressions` varchar(55) DEFAULT NULL,
  `cost_per_inline_link_click` varchar(55) DEFAULT NULL,
  `date_start` varchar(55) DEFAULT NULL,
  `date_stop` varchar(55) DEFAULT NULL,
  `lead_diffrents` varchar(100) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_ads_leads`
--

CREATE TABLE `td_ads_leads` (
  `lid` int(11) NOT NULL,
  `account_id` bigint(20) DEFAULT NULL,
  `page_id` varchar(100) DEFAULT NULL,
  `ads_id` varchar(100) NOT NULL,
  `form_id` varchar(100) DEFAULT NULL,
  `leadgen_id` varchar(500) DEFAULT NULL,
  `adgroup_id` varchar(100) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `leaddata` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `source` varchar(100) DEFAULT 'facebook',
  `lms_status` int(11) NOT NULL DEFAULT '0' COMMENT '0-fail, 1-duplicate , 2 -success',
  `lead_cost` float NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_audience`
--

CREATE TABLE `td_audience` (
  `A_id` int(11) NOT NULL,
  `User_id` varchar(100) NOT NULL,
  `audience_name` varchar(100) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `age_min` varchar(10) DEFAULT NULL,
  `age_max` varchar(10) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `language_key` varchar(10) DEFAULT NULL,
  `detailed_targeting` text,
  `geo_targeting` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_brand`
--

CREATE TABLE `td_brand` (
  `brand_id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `brand_name` varchar(50) DEFAULT NULL,
  `add_date` date DEFAULT NULL,
  `update_date` date DEFAULT NULL,
  `auto_share` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_bucket`
--

CREATE TABLE `td_bucket` (
  `B_id` int(11) NOT NULL,
  `access_customer_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `temp_name` varchar(100) NOT NULL,
  `temp_path` varchar(200) NOT NULL,
  `status` int(2) NOT NULL DEFAULT '0' COMMENT '0=active,1=inactive',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_bucket_file`
--

CREATE TABLE `td_bucket_file` (
  `F_id` int(11) NOT NULL,
  `bucket_id` int(11) NOT NULL,
  `access_customer_id` int(11) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  `file_size` varchar(100) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_preview` longtext NOT NULL,
  `thumbnail` varchar(1000) DEFAULT NULL,
  `status` int(2) NOT NULL DEFAULT '0' COMMENT '0=active,1=inactive',
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_campaigns`
--

CREATE TABLE `td_campaigns` (
  `cam_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `fb_adaccount_id` varchar(100) DEFAULT NULL,
  `campaign_name` varchar(100) DEFAULT NULL,
  `campaign_special_ad_category` varchar(100) DEFAULT NULL,
  `campaign_objective` varchar(100) DEFAULT NULL,
  `campaign_status` varchar(100) DEFAULT NULL,
  `campaign_budget` varchar(100) DEFAULT NULL,
  `campaign_bid_strategy` varchar(100) DEFAULT NULL,
  `campaign_id` varchar(100) DEFAULT NULL,
  `media_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_category`
--

CREATE TABLE `td_category` (
  `category_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `add_date` date DEFAULT NULL,
  `update_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_channels`
--

CREATE TABLE `td_channels` (
  `channel_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `brand_id` varchar(50) DEFAULT NULL,
  `access_media` varchar(50) DEFAULT NULL,
  `page_id` varchar(500) DEFAULT NULL,
  `channel_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `accessToken` varchar(500) DEFAULT NULL,
  `accessTokenSecret` varchar(100) DEFAULT NULL,
  `channel_thumbnail` varchar(1000) DEFAULT NULL,
  `assign_group` int(11) DEFAULT NULL,
  `access_expiry_date` date DEFAULT NULL,
  `access_refresh_token` varchar(100) DEFAULT NULL,
  `access_refresh_expiry_date` date DEFAULT NULL,
  `user_Token` varchar(500) DEFAULT NULL,
  `updated_date` date DEFAULT NULL,
  `insights_engagement` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running',
  `last_sync_engagement` date DEFAULT NULL,
  `insights_impression` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running',
  `last_sync_impression` date DEFAULT NULL,
  `fb_likes_follow` enum('0','1','2') NOT NULL DEFAULT '0',
  `last_sync_like_follow` date DEFAULT NULL,
  `insights_ctaclicks` enum('0','1') NOT NULL COMMENT '0-pending,1-running',
  `last_sync_ctaclicks` date DEFAULT NULL,
  `insights_post` enum('0','1') NOT NULL COMMENT '0-pending,1-running',
  `last_sync_post` date DEFAULT NULL,
  `insights_reaction` enum('0','1') NOT NULL COMMENT '0-pending,1-running',
  `last_sync_reaction` date DEFAULT NULL,
  `insights_user_demographics` enum('0','1') NOT NULL COMMENT '0-pending,1-running',
  `last_sync_user_demographics` date DEFAULT NULL,
  `insights_video_view` enum('0','1') NOT NULL COMMENT '0-pending,1-running',
  `last_sync_video_view` date DEFAULT NULL,
  `insights_view` enum('0','1') NOT NULL COMMENT '0-pending,1-running',
  `last_sync_view` date DEFAULT NULL,
  `insights_story` enum('0','1') NOT NULL COMMENT '0-pending,1-running',
  `last_sync_story` date DEFAULT NULL,
  `token_expire` varchar(100) DEFAULT NULL,
  `last_post_sync` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_chat`
--

CREATE TABLE `td_chat` (
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT '0',
  `ip` varchar(100) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  `lead_source` text,
  `channel_type` varchar(50) DEFAULT NULL,
  `channel_id` varchar(50) DEFAULT NULL,
  `sender_id` varchar(50) NOT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `profile_pic` text,
  `website` varchar(100) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `ip_location` text,
  `user_agent` text,
  `lead_id` int(11) DEFAULT NULL,
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` datetime DEFAULT CURRENT_TIMESTAMP,
  `live_status` int(2) NOT NULL DEFAULT '0' COMMENT '0=new,1=live'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `td_chat_details`
--

CREATE TABLE `td_chat_details` (
  `detail_id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `a_id` varchar(20) DEFAULT NULL,
  `b_id` varchar(20) DEFAULT NULL,
  `s_no` int(11) DEFAULT NULL,
  `option_type` varchar(10) DEFAULT NULL,
  `chat_text` text CHARACTER SET latin1,
  `message_mid` text NOT NULL,
  `attachement` text CHARACTER SET latin1,
  `is_echo` int(2) NOT NULL DEFAULT '0',
  `message_read` int(1) DEFAULT '0' COMMENT '0=unread,1=read',
  `date_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `message_read_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `td_customer_accesstoken`
--

CREATE TABLE `td_customer_accesstoken` (
  `tid` int(11) NOT NULL,
  `accessToken` text NOT NULL,
  `expiry_date` varchar(100) DEFAULT NULL,
  `userID` varchar(255) DEFAULT NULL,
  `customer_id` varchar(255) NOT NULL,
  `media` varchar(50) NOT NULL,
  `oauth_token` text,
  `oauth_verifier` text,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_CTA_clicks`
--

CREATE TABLE `td_fbpage_CTA_clicks` (
  `cta_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `end_time` date DEFAULT NULL,
  `100990741700178` int(11) DEFAULT NULL,
  `100987621700490` int(11) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_engagement`
--

CREATE TABLE `td_fbpage_engagement` (
  `en_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `end_time` date DEFAULT NULL,
  `link_clicks` int(11) DEFAULT NULL,
  `other_clicks` int(11) DEFAULT NULL,
  `likes` int(11) DEFAULT NULL,
  `comment` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `paid` int(11) DEFAULT NULL,
  `unpaid` int(11) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_impression`
--

CREATE TABLE `td_fbpage_impression` (
  `im_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `end_time` date DEFAULT NULL,
  `page_post` int(11) DEFAULT NULL,
  `other` int(11) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_post`
--

CREATE TABLE `td_fbpage_post` (
  `post_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `end_time` date DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_reactions`
--

CREATE TABLE `td_fbpage_reactions` (
  `reaction_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `likes` int(11) DEFAULT NULL COMMENT 'like keyword is reserved so use likes',
  `end_time` date DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_story`
--

CREATE TABLE `td_fbpage_story` (
  `data_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `fan` int(11) DEFAULT NULL,
  `other` int(11) DEFAULT NULL,
  `end_time` date DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_user_demographics`
--

CREATE TABLE `td_fbpage_user_demographics` (
  `data_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `end_time` date DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_video_views`
--

CREATE TABLE `td_fbpage_video_views` (
  `data_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `total` int(11) DEFAULT NULL,
  `paid` int(11) DEFAULT NULL,
  `unpaid` int(11) DEFAULT NULL,
  `end_time` date DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fbpage_views`
--

CREATE TABLE `td_fbpage_views` (
  `data_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `page_id` varchar(100) NOT NULL,
  `matric_name` varchar(1000) NOT NULL,
  `period` varchar(100) DEFAULT NULL,
  `title` varchar(10000) DEFAULT NULL,
  `description` text,
  `value` text,
  `HOME` int(11) DEFAULT NULL,
  `NEWSFEED` int(11) DEFAULT NULL,
  `OTHER` int(11) DEFAULT NULL,
  `MOBILE` int(11) DEFAULT NULL,
  `end_time` date DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fb_lead_thirdparty`
--

CREATE TABLE `td_fb_lead_thirdparty` (
  `tid` int(11) NOT NULL,
  `accountid` bigint(20) NOT NULL,
  `endpoint_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fb_likes_count`
--

CREATE TABLE `td_fb_likes_count` (
  `F_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `like_count` int(11) DEFAULT NULL,
  `like_count_sync` datetime NOT NULL,
  `follow_count` int(11) DEFAULT NULL,
  `follow_count_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_fb_unique_audience`
--

CREATE TABLE `td_fb_unique_audience` (
  `unique_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `audience_type` varchar(20) NOT NULL,
  `userid` varchar(50) DEFAULT NULL,
  `unique_username` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_gmb_credential`
--

CREATE TABLE `td_gmb_credential` (
  `F_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `file_upload_id` varchar(100) NOT NULL,
  `agent_id` varchar(500) DEFAULT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_gmb_data`
--

CREATE TABLE `td_gmb_data` (
  `g_data` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `primaryPhone` varchar(100) DEFAULT NULL,
  `primaryCategory` longtext,
  `additionalCategories` longtext,
  `websiteUrl` varchar(300) DEFAULT NULL,
  `regularHours` longtext,
  `latlng` varchar(500) DEFAULT NULL,
  `additionalPhones` varchar(100) DEFAULT NULL,
  `priceLists` longtext,
  `address` longtext,
  `averageRating` varchar(100) DEFAULT NULL,
  `totalReviewCount` varchar(100) DEFAULT NULL,
  `reviews_data` longtext,
  `totalMediaItemCount` varchar(100) DEFAULT NULL,
  `mediaItems` longtext,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `metricValues` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_messages`
--

CREATE TABLE `td_messages` (
  `m_id` int(11) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `channeltype` varchar(100) NOT NULL,
  `channelid` varchar(255) NOT NULL,
  `sender` varchar(255) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `timestamp` varchar(200) DEFAULT NULL,
  `message_mid` text,
  `message_text` text,
  `type` varchar(100) DEFAULT NULL,
  `attachment_url` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_messages_user`
--

CREATE TABLE `td_messages_user` (
  `u_id` int(11) NOT NULL,
  `user_id` varchar(200) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `channeltype` varchar(100) NOT NULL,
  `channelid` text NOT NULL,
  `sendepsid` varchar(100) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `locale` varchar(200) NOT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `profilePic` text,
  `email` varchar(100) DEFAULT NULL,
  `mobile_number` varchar(50) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_monitor`
--

CREATE TABLE `td_monitor` (
  `feed_id` int(11) NOT NULL,
  `brand_id` varchar(100) DEFAULT NULL,
  `page_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `created_time` date DEFAULT NULL,
  `updated_time` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_monitor_posts`
--

CREATE TABLE `td_monitor_posts` (
  `p_id` int(11) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `full_picture` longtext,
  `message` longtext CHARACTER SET utf8 COLLATE utf8_bin,
  `shares` int(11) DEFAULT NULL,
  `total_comments` int(11) DEFAULT NULL,
  `total_likes` int(11) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_monitor_posts_attachments`
--

CREATE TABLE `td_monitor_posts_attachments` (
  `a_id` int(11) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `image_src` longtext NOT NULL,
  `image_width` int(11) NOT NULL,
  `image_height` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_monitor_posts_comment`
--

CREATE TABLE `td_monitor_posts_comment` (
  `c_id` int(11) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `comment_id` varchar(255) NOT NULL,
  `message` longtext CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `created_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_publish_posts`
--

CREATE TABLE `td_publish_posts` (
  `p_id` int(11) NOT NULL,
  `account_id` bigint(20) DEFAULT NULL,
  `brand_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `channel_type` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `message` text COLLATE utf8_unicode_ci,
  `full_picture` text COLLATE utf8_unicode_ci,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `publish_time` datetime DEFAULT NULL,
  `post_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `post_link` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `application` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `shares` int(11) DEFAULT '0',
  `likes` int(11) NOT NULL DEFAULT '0',
  `activity` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `td_publish_posts_attachments`
--

CREATE TABLE `td_publish_posts_attachments` (
  `a_id` int(11) NOT NULL,
  `page_id` varchar(255) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `image_src` longtext NOT NULL,
  `image_width` int(11) NOT NULL,
  `image_height` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_publish_posts_comment`
--

CREATE TABLE `td_publish_posts_comment` (
  `c_id` int(11) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `comment_id` varchar(255) NOT NULL,
  `created_time` datetime NOT NULL,
  `message` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `photo_link` text,
  `parent_id` varchar(255) NOT NULL,
  `userid` varchar(100) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_publish_posts_share`
--

CREATE TABLE `td_publish_posts_share` (
  `c_id` int(11) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `share_id` varchar(255) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `link` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `userid` varchar(100) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_request_otp`
--

CREATE TABLE `td_request_otp` (
  `id` int(11) NOT NULL,
  `request_date` datetime NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `otp` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_schedule_post`
--

CREATE TABLE `td_schedule_post` (
  `sid` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `channel_arr` varchar(255) NOT NULL,
  `message` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `media` text,
  `medianame` text,
  `mime` text,
  `videoDesc` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `videotitle` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `schedule_time` varchar(50) DEFAULT NULL,
  `created_time` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `reason` text,
  `youtube_category` varchar(100) DEFAULT NULL,
  `post_type` enum('text','image','video') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_schedule_post_channel`
--

CREATE TABLE `td_schedule_post_channel` (
  `cid` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `response` text,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_schedule_post_file`
--

CREATE TABLE `td_schedule_post_file` (
  `id` int(11) NOT NULL,
  `schedule_post_id` int(11) NOT NULL,
  `bucket_file_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_social_access`
--

CREATE TABLE `td_social_access` (
  `a_id` int(11) NOT NULL,
  `access_customer_id` varchar(100) NOT NULL,
  `accessToken` varchar(500) NOT NULL,
  `expiry_date` varchar(50) DEFAULT NULL,
  `expire_datetime` datetime DEFAULT NULL,
  `scope` varchar(500) DEFAULT NULL,
  `access_media_refresh_token` varchar(255) DEFAULT NULL,
  `access_token_secret` varchar(255) DEFAULT NULL,
  `access_media` varchar(50) NOT NULL,
  `access_brand` varchar(50) DEFAULT NULL,
  `access_status` enum('active','expired') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `id` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_users`
--

CREATE TABLE `td_users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `plan` int(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `expiresIn` varchar(50) DEFAULT NULL,
  `profile_pic` varchar(50) DEFAULT NULL,
  `role` tinyint(4) NOT NULL,
  `parent_id` varchar(50) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_access` varchar(100) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fb_id` varchar(100) DEFAULT NULL,
  `fb_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `fb_acceestoken` text,
  `notify_by` enum('sms','email') DEFAULT NULL,
  `sms_templateid` int(11) DEFAULT NULL,
  `email_templateid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_user_assign_brand`
--

CREATE TABLE `td_user_assign_brand` (
  `assign_id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `assign_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `td_webhook_key`
--

CREATE TABLE `td_webhook_key` (
  `w_key` int(11) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `key` varchar(100) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `temp_email_send`
--

CREATE TABLE `temp_email_send` (
  `id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `test_tab`
--

CREATE TABLE `test_tab` (
  `id` int(11) NOT NULL,
  `f_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tf_account_balance`
--

CREATE TABLE `tf_account_balance` (
  `Account_ID` int(11) NOT NULL,
  `Tele_packageid` varchar(200) DEFAULT NULL,
  `Tele_Plan_Minuites` int(10) DEFAULT NULL,
  `Tele_Plan_Used` int(10) DEFAULT NULL,
  `Tele_Plan_Balance` int(10) DEFAULT NULL,
  `Tele_Expire` date DEFAULT NULL,
  `Tele_Start` date DEFAULT NULL,
  `SMS_ID` varchar(25) DEFAULT NULL,
  `SMS_Startdate` date DEFAULT NULL,
  `SMS_Tr_No` int(10) DEFAULT NULL,
  `SMS_Tr_Used` int(10) DEFAULT NULL,
  `SMS_Tr_Balance` int(10) DEFAULT NULL,
  `SMS_Pr_No` int(10) DEFAULT NULL,
  `SMS_Pr_Used` int(10) DEFAULT NULL,
  `SMS_Pr_Balance` int(10) DEFAULT NULL,
  `SMS_Otp_No` int(10) DEFAULT NULL,
  `SMS_Otp_Used` int(10) DEFAULT NULL,
  `SMS_Otp_Balance` int(10) DEFAULT NULL,
  `Mail_ID` varchar(25) DEFAULT NULL,
  `Max_User_No` int(10) DEFAULT NULL,
  `Mail_No` int(11) DEFAULT NULL,
  `Mail_User_Used` int(10) DEFAULT NULL,
  `Mail_User_Balance` int(10) DEFAULT NULL,
  `Mail_Gb` int(11) DEFAULT NULL,
  `Mail_Startdate` date DEFAULT NULL,
  `Mail_Expire` date DEFAULT NULL,
  `Meet_ID` varchar(25) DEFAULT NULL,
  `Meet_Startdate` date DEFAULT NULL,
  `Meet_Expire` date DEFAULT NULL,
  `Digital_ID` varchar(25) DEFAULT NULL,
  `Digital_Startdate` date DEFAULT NULL,
  `Digital_Expire` date DEFAULT NULL,
  `Ads_ID` varchar(25) DEFAULT NULL,
  `Ads_Startdate` date DEFAULT NULL,
  `Ads_Value` int(11) DEFAULT NULL,
  `Ads_User_Used` int(11) DEFAULT NULL,
  `Ads_User_Balance` int(11) DEFAULT NULL,
  `TFree_ID` varchar(50) DEFAULT NULL,
  `TFree_Startdate` date DEFAULT NULL,
  `TFree_No` int(11) DEFAULT NULL,
  `TFree_User_Used` int(11) DEFAULT NULL,
  `TFree_User_Balance` int(11) DEFAULT NULL,
  `OBD_ID` varchar(50) DEFAULT NULL,
  `OBD_start_date` date DEFAULT NULL,
  `OBD_No` int(11) DEFAULT NULL,
  `OBD_User_Used` int(11) DEFAULT NULL,
  `OBD_User_Balance` int(11) DEFAULT NULL,
  `Tele_Previous_Expire` date DEFAULT NULL,
  `Tele_Startdate` date DEFAULT NULL,
  `Tele_Plusduration` int(11) NOT NULL DEFAULT '30',
  `Tele_Plusrate` decimal(10,0) NOT NULL DEFAULT '1',
  `voip_pulse_charge` int(1) NOT NULL DEFAULT '0' COMMENT '0-yes, 1-No',
  `lead_limit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_account_table`
--

CREATE TABLE `tf_account_table` (
  `account_type` tinyint(4) NOT NULL COMMENT '1 agent, 2 user 3 admin 4 SuperAdmin',
  `account_role` int(11) DEFAULT NULL COMMENT '0 - manager , 1 - agent , 2 - supervisor',
  `account_id` int(11) NOT NULL,
  `did_alloted` varchar(15) DEFAULT NULL,
  `voice_server_id` int(2) DEFAULT '2',
  `emailserver_alloted` int(11) DEFAULT NULL,
  `account_name` varchar(40) DEFAULT NULL,
  `account_password` text,
  `email` char(40) DEFAULT NULL,
  `mobile` varchar(12) DEFAULT NULL,
  `alternate_mobile` varchar(12) DEFAULT NULL,
  `is_mobile_verify` enum('no','yes') NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `show_no_id` int(11) DEFAULT NULL COMMENT '0:mobileno, 1:ID',
  `pulse` int(11) DEFAULT NULL,
  `credits` decimal(10,2) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  `channels` int(5) DEFAULT NULL,
  `incoming_channel` int(11) DEFAULT NULL,
  `outgoing_channel` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `last_modify_date` datetime DEFAULT NULL,
  `current_status` int(11) DEFAULT NULL COMMENT '0:active, 1:inactive',
  `voip_status` int(10) DEFAULT '1',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `last_modify_by` varchar(100) DEFAULT NULL,
  `feedback_vales` text,
  `services` varchar(250) DEFAULT NULL COMMENT '0:IVR 1:Miss Call 2:Conference 3:Dialer 4:Click to Call 5:Campaigns',
  `digital_access` longtext,
  `monitor_agent` int(11) NOT NULL DEFAULT '0',
  `outgoing_call` int(11) NOT NULL DEFAULT '0',
  `kyc_status` tinyint(1) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'UTC +05:30',
  `login_token` text,
  `TollFreeNo` varchar(20) DEFAULT NULL COMMENT '0-demo\r\n1-normal\r\n2-obd\r\n3 expired',
  `login_time` datetime DEFAULT NULL,
  `AccessKey` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `user_limit` int(11) DEFAULT NULL,
  `is_loggedin` enum('no','yes') NOT NULL,
  `is_oncall` enum('no','yes') DEFAULT 'no',
  `package_id` int(11) DEFAULT NULL,
  `zoho_enable` enum('yes','no') NOT NULL,
  `total_renew` int(11) DEFAULT NULL,
  `company_address` text,
  `authorised_person_name` varchar(255) DEFAULT NULL,
  `login_ip` varchar(50) DEFAULT NULL,
  `webtoken` varchar(255) DEFAULT NULL,
  `webhookurl` varchar(500) DEFAULT NULL,
  `erp_email` varchar(100) DEFAULT NULL,
  `erp_userid` varchar(250) DEFAULT 'sbc2.teleforce.in',
  `erp_username` varchar(100) DEFAULT NULL,
  `erp_password` varchar(50) DEFAULT NULL,
  `is_demo` tinyint(1) NOT NULL DEFAULT '0',
  `whatsup_access` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:yes,1:no',
  `is_deleted` enum('no','yes') DEFAULT 'no',
  `assign_to` int(11) DEFAULT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `billing_type` int(1) DEFAULT '0' COMMENT '0-prepaid, 1-postpaid',
  `socket_url` varchar(255) DEFAULT 'agent.(wrong)teleforce.in',
  `renew_account_manager` int(11) DEFAULT NULL,
  `obd_server_id` int(11) DEFAULT NULL,
  `obd_channel` int(11) DEFAULT NULL,
  `supervisor_only` int(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_account_table_04_07_2022`
--

CREATE TABLE `tf_account_table_04_07_2022` (
  `account_type` tinyint(4) NOT NULL COMMENT '1 agent, 2 user 3 admin 4 SuperAdmin',
  `account_role` int(11) DEFAULT NULL COMMENT '0 - manager , 1 - agent , 2 - supervisor',
  `account_id` int(11) NOT NULL,
  `did_alloted` varchar(15) DEFAULT NULL,
  `voice_server_id` int(2) DEFAULT '2',
  `emailserver_alloted` int(11) DEFAULT NULL,
  `account_name` varchar(40) DEFAULT NULL,
  `account_password` text,
  `email` char(40) DEFAULT NULL,
  `mobile` varchar(12) DEFAULT NULL,
  `alternate_mobile` varchar(12) DEFAULT NULL,
  `is_mobile_verify` enum('no','yes') NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `show_no_id` int(11) DEFAULT NULL COMMENT '0:mobileno, 1:ID',
  `pulse` int(11) DEFAULT NULL,
  `credits` decimal(10,2) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `channels` int(5) DEFAULT NULL,
  `incoming_channel` int(11) DEFAULT NULL,
  `outgoing_channel` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `last_modify_date` datetime DEFAULT NULL,
  `current_status` int(11) DEFAULT NULL COMMENT '0:active, 1:inactive',
  `voip_status` int(10) DEFAULT '1',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `last_modify_by` varchar(100) DEFAULT NULL,
  `feedback_vales` text,
  `services` varchar(250) DEFAULT NULL COMMENT '0:IVR 1:Miss Call 2:Conference 3:Dialer 4:Click to Call 5:Campaigns',
  `digital_access` longtext,
  `monitor_agent` int(11) NOT NULL DEFAULT '0',
  `outgoing_call` int(11) NOT NULL DEFAULT '0',
  `kyc_status` tinyint(1) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'UTC +05:30',
  `login_token` text NOT NULL,
  `TollFreeNo` varchar(20) DEFAULT NULL COMMENT '0-demo\r\n1-normal\r\n2-obd\r\n3 expired',
  `login_time` datetime DEFAULT NULL,
  `AccessKey` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `user_limit` int(11) DEFAULT NULL,
  `is_loggedin` enum('no','yes') NOT NULL,
  `is_oncall` enum('no','yes') DEFAULT 'no',
  `package_id` int(11) DEFAULT NULL,
  `zoho_enable` enum('yes','no') NOT NULL,
  `total_renew` int(11) DEFAULT NULL,
  `company_address` text,
  `authorised_person_name` varchar(255) DEFAULT NULL,
  `login_ip` varchar(50) DEFAULT NULL,
  `webtoken` varchar(255) DEFAULT NULL,
  `webhookurl` varchar(500) NOT NULL,
  `erp_email` varchar(100) DEFAULT NULL,
  `erp_userid` varchar(250) DEFAULT 'sbc2.teleforce.in',
  `erp_username` varchar(100) DEFAULT NULL,
  `erp_password` varchar(50) DEFAULT NULL,
  `is_demo` tinyint(1) NOT NULL DEFAULT '0',
  `whatsup_access` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:yes,1:no',
  `is_deleted` enum('no','yes') DEFAULT 'no',
  `assign_to` int(11) DEFAULT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `billing_type` int(1) DEFAULT '0' COMMENT '0-prepaid, 1-postpaid',
  `socket_url` varchar(255) DEFAULT 'agent.(wrong)teleforce.in'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_account_table_13-07-2022`
--

CREATE TABLE `tf_account_table_13-07-2022` (
  `account_type` tinyint(4) NOT NULL COMMENT '1 agent, 2 user 3 admin 4 SuperAdmin',
  `account_role` int(11) DEFAULT NULL COMMENT '0 - manager , 1 - agent , 2 - supervisor',
  `account_id` int(11) NOT NULL,
  `did_alloted` varchar(15) DEFAULT NULL,
  `voice_server_id` int(2) DEFAULT '2',
  `emailserver_alloted` int(11) DEFAULT NULL,
  `account_name` varchar(40) DEFAULT NULL,
  `account_password` text,
  `email` char(40) DEFAULT NULL,
  `mobile` varchar(12) DEFAULT NULL,
  `alternate_mobile` varchar(12) DEFAULT NULL,
  `is_mobile_verify` enum('no','yes') NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `show_no_id` int(11) DEFAULT NULL COMMENT '0:mobileno, 1:ID',
  `pulse` int(11) DEFAULT NULL,
  `credits` decimal(10,2) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `channels` int(5) DEFAULT NULL,
  `incoming_channel` int(11) DEFAULT NULL,
  `outgoing_channel` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `last_modify_date` datetime DEFAULT NULL,
  `current_status` int(11) DEFAULT NULL COMMENT '0:active, 1:inactive',
  `voip_status` int(10) DEFAULT '1',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `last_modify_by` varchar(100) DEFAULT NULL,
  `feedback_vales` text,
  `services` varchar(250) DEFAULT NULL COMMENT '0:IVR 1:Miss Call 2:Conference 3:Dialer 4:Click to Call 5:Campaigns',
  `digital_access` longtext,
  `monitor_agent` int(11) NOT NULL DEFAULT '0',
  `outgoing_call` int(11) NOT NULL DEFAULT '0',
  `kyc_status` tinyint(1) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'UTC +05:30',
  `login_token` text NOT NULL,
  `TollFreeNo` varchar(20) DEFAULT NULL COMMENT '0-demo\r\n1-normal\r\n2-obd\r\n3 expired',
  `login_time` datetime DEFAULT NULL,
  `AccessKey` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `user_limit` int(11) DEFAULT NULL,
  `is_loggedin` enum('no','yes') NOT NULL,
  `is_oncall` enum('no','yes') DEFAULT 'no',
  `package_id` int(11) DEFAULT NULL,
  `zoho_enable` enum('yes','no') NOT NULL,
  `total_renew` int(11) DEFAULT NULL,
  `company_address` text,
  `authorised_person_name` varchar(255) DEFAULT NULL,
  `login_ip` varchar(50) DEFAULT NULL,
  `webtoken` varchar(255) DEFAULT NULL,
  `webhookurl` varchar(500) NOT NULL,
  `erp_email` varchar(100) DEFAULT NULL,
  `erp_userid` varchar(250) DEFAULT 'sbc2.teleforce.in',
  `erp_username` varchar(100) DEFAULT NULL,
  `erp_password` varchar(50) DEFAULT NULL,
  `is_demo` tinyint(1) NOT NULL DEFAULT '0',
  `whatsup_access` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:yes,1:no',
  `is_deleted` enum('no','yes') DEFAULT 'no',
  `assign_to` int(11) DEFAULT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `billing_type` int(1) DEFAULT '0' COMMENT '0-prepaid, 1-postpaid',
  `socket_url` varchar(255) DEFAULT 'agent.(wrong)teleforce.in'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_account_table_14_07_2022`
--

CREATE TABLE `tf_account_table_14_07_2022` (
  `account_type` tinyint(4) NOT NULL COMMENT '1 agent, 2 user 3 admin 4 SuperAdmin',
  `account_role` int(11) DEFAULT NULL COMMENT '0 - manager , 1 - agent , 2 - supervisor',
  `account_id` int(11) NOT NULL,
  `did_alloted` varchar(15) DEFAULT NULL,
  `voice_server_id` int(2) DEFAULT '2',
  `emailserver_alloted` int(11) DEFAULT NULL,
  `account_name` varchar(40) DEFAULT NULL,
  `account_password` text,
  `email` char(40) DEFAULT NULL,
  `mobile` varchar(12) DEFAULT NULL,
  `alternate_mobile` varchar(12) DEFAULT NULL,
  `is_mobile_verify` enum('no','yes') NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `show_no_id` int(11) DEFAULT NULL COMMENT '0:mobileno, 1:ID',
  `pulse` int(11) DEFAULT NULL,
  `credits` decimal(10,2) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `channels` int(5) DEFAULT NULL,
  `incoming_channel` int(11) DEFAULT NULL,
  `outgoing_channel` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `last_modify_date` datetime DEFAULT NULL,
  `current_status` int(11) DEFAULT NULL COMMENT '0:active, 1:inactive',
  `voip_status` int(10) DEFAULT '1',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `last_modify_by` varchar(100) DEFAULT NULL,
  `feedback_vales` text,
  `services` varchar(250) DEFAULT NULL COMMENT '0:IVR 1:Miss Call 2:Conference 3:Dialer 4:Click to Call 5:Campaigns',
  `digital_access` longtext,
  `monitor_agent` int(11) NOT NULL DEFAULT '0',
  `outgoing_call` int(11) NOT NULL DEFAULT '0',
  `kyc_status` tinyint(1) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'UTC +05:30',
  `login_token` text NOT NULL,
  `TollFreeNo` varchar(20) DEFAULT NULL COMMENT '0-demo\r\n1-normal\r\n2-obd\r\n3 expired',
  `login_time` datetime DEFAULT NULL,
  `AccessKey` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `user_limit` int(11) DEFAULT NULL,
  `is_loggedin` enum('no','yes') NOT NULL,
  `is_oncall` enum('no','yes') DEFAULT 'no',
  `package_id` int(11) DEFAULT NULL,
  `zoho_enable` enum('yes','no') NOT NULL,
  `total_renew` int(11) DEFAULT NULL,
  `company_address` text,
  `authorised_person_name` varchar(255) DEFAULT NULL,
  `login_ip` varchar(50) DEFAULT NULL,
  `webtoken` varchar(255) DEFAULT NULL,
  `webhookurl` varchar(500) NOT NULL,
  `erp_email` varchar(100) DEFAULT NULL,
  `erp_userid` varchar(250) DEFAULT 'sbc2.teleforce.in',
  `erp_username` varchar(100) DEFAULT NULL,
  `erp_password` varchar(50) DEFAULT NULL,
  `is_demo` tinyint(1) NOT NULL DEFAULT '0',
  `whatsup_access` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:yes,1:no',
  `is_deleted` enum('no','yes') DEFAULT 'no',
  `assign_to` int(11) DEFAULT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `billing_type` int(1) DEFAULT '0' COMMENT '0-prepaid, 1-postpaid',
  `socket_url` varchar(255) DEFAULT 'agent.(wrong)teleforce.in'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_activity_logs`
--

CREATE TABLE `tf_activity_logs` (
  `log_id` bigint(20) NOT NULL,
  `account_id` int(10) DEFAULT NULL,
  `user_type` varchar(20) DEFAULT NULL,
  `action` text,
  `ip` varchar(20) DEFAULT NULL,
  `action_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `old_req` text,
  `new_req` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agentlead`
--

CREATE TABLE `tf_agentlead` (
  `id` int(11) NOT NULL,
  `agent_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `segment` varchar(255) DEFAULT NULL,
  `contact_id` text,
  `Created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_assignlead`
--

CREATE TABLE `tf_agent_assignlead` (
  `assign_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `mobile` varchar(12) NOT NULL,
  `email` varchar(20) NOT NULL,
  `add_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_assignleadsms`
--

CREATE TABLE `tf_agent_assignleadsms` (
  `assign_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `mobile` varchar(12) NOT NULL,
  `email` varchar(20) NOT NULL,
  `add_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_assignmaillead`
--

CREATE TABLE `tf_agent_assignmaillead` (
  `assign_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `mobile` varchar(12) NOT NULL,
  `email` varchar(20) NOT NULL,
  `add_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_details`
--

CREATE TABLE `tf_agent_details` (
  `agent_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `agent_status` int(1) DEFAULT NULL,
  `cdr_id` bigint(20) DEFAULT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_digitalassignlead`
--

CREATE TABLE `tf_agent_digitalassignlead` (
  `assign_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `mobile` varchar(12) NOT NULL,
  `email` varchar(20) NOT NULL,
  `add_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_location`
--

CREATE TABLE `tf_agent_location` (
  `location_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `agent_name` varchar(50) NOT NULL,
  `agent_mobile` varchar(12) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `number` varchar(20) DEFAULT NULL,
  `full_address` longtext NOT NULL,
  `area_name` text,
  `city` varchar(20) NOT NULL,
  `state` varchar(20) NOT NULL,
  `country` varchar(30) NOT NULL,
  `pincode` varchar(20) NOT NULL,
  `created_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_loginlogout_report`
--

CREATE TABLE `tf_agent_loginlogout_report` (
  `report_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `report_date` date NOT NULL,
  `login_time` datetime DEFAULT NULL,
  `logout_time` datetime DEFAULT NULL,
  `logged_time` float DEFAULT NULL,
  `break_time` float DEFAULT NULL,
  `working_time` float DEFAULT NULL,
  `add_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_missedcall`
--

CREATE TABLE `tf_agent_missedcall` (
  `mid` int(11) NOT NULL,
  `agentid` int(11) NOT NULL,
  `cdrid` int(11) NOT NULL,
  `callstatus` varchar(100) NOT NULL,
  `calldate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_agent_sip_account`
--

CREATE TABLE `tf_agent_sip_account` (
  `id` int(11) NOT NULL,
  `agent_id` bigint(20) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `realm` varchar(20) NOT NULL DEFAULT 'kamalio.teleforce.in'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_assign_sms_server`
--

CREATE TABLE `tf_assign_sms_server` (
  `assign_id` int(11) NOT NULL,
  `server_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `assign_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_asterisk_server`
--

CREATE TABLE `tf_asterisk_server` (
  `server_id` int(11) NOT NULL,
  `server_name` varchar(255) NOT NULL,
  `server_ip` varchar(100) NOT NULL,
  `server_username` varchar(100) DEFAULT NULL,
  `server_password` varchar(100) DEFAULT NULL,
  `server_mysql_username` varchar(200) DEFAULT NULL,
  `server_mysql_password` varchar(200) DEFAULT NULL,
  `server_database_name` varchar(200) DEFAULT NULL,
  `server_mysql_host` varchar(200) DEFAULT NULL,
  `sip_host` varchar(200) DEFAULT NULL,
  `ari_url` varchar(100) DEFAULT NULL,
  `ari_username` varchar(100) DEFAULT NULL,
  `ari_password` varchar(100) DEFAULT NULL,
  `live_domain` varchar(100) DEFAULT NULL,
  `server_endpoint` varchar(20) NOT NULL DEFAULT 'SMNOIDA'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_block_number`
--

CREATE TABLE `tf_block_number` (
  `num_id` int(11) NOT NULL,
  `number` varchar(12) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `add_date` date NOT NULL,
  `update_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_breaktime`
--

CREATE TABLE `tf_breaktime` (
  `break_id` int(11) NOT NULL,
  `account_id` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `start_time` datetime NOT NULL,
  `stop_time` datetime DEFAULT NULL,
  `dif_time` int(11) DEFAULT NULL,
  `break_status` tinyint(4) NOT NULL COMMENT '0:start\n1:stop',
  `break_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_bulkupload_calender_request`
--

CREATE TABLE `tf_bulkupload_calender_request` (
  `fid` int(11) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` varchar(11) NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `agentid` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `finish_time` datetime DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running,2-completed',
  `file_path` varchar(200) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_bulkupload_request`
--

CREATE TABLE `tf_bulkupload_request` (
  `fid` int(11) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` varchar(11) NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `segment` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `finish_time` datetime DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running,2-completed',
  `file_path` varchar(200) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL,
  `remove_duplicate` enum('no','yes') NOT NULL DEFAULT 'no',
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_callingpausetime`
--

CREATE TABLE `tf_callingpausetime` (
  `pause_id` int(11) NOT NULL,
  `account_id` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `start_time` datetime NOT NULL,
  `stop_time` datetime DEFAULT NULL,
  `dif_time` int(11) DEFAULT NULL,
  `reason_id` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '0:start1:stop'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_call_disposition_manager`
--

CREATE TABLE `tf_call_disposition_manager` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `disposition` varchar(30) DEFAULT NULL,
  `sub_disposition` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_call_disposition_supervisor`
--

CREATE TABLE `tf_call_disposition_supervisor` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `supervisor_id` int(11) DEFAULT NULL,
  `disposition_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_call_hold_duration`
--

CREATE TABLE `tf_call_hold_duration` (
  `h_id` int(11) NOT NULL,
  `cdrid` bigint(20) NOT NULL,
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` datetime DEFAULT NULL,
  `dif_time` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:start1:stop	'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_call_review_form`
--

CREATE TABLE `tf_call_review_form` (
  `form_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `form_parameter` text NOT NULL,
  `create_date` date NOT NULL,
  `update_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_call_status`
--

CREATE TABLE `tf_call_status` (
  `id` int(11) NOT NULL,
  `call_status` varchar(200) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_call_summary_report`
--

CREATE TABLE `tf_call_summary_report` (
  `report_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `report_date` date NOT NULL,
  `answer` int(11) DEFAULT NULL,
  `noanswer` int(11) DEFAULT NULL,
  `incoming` int(11) DEFAULT NULL,
  `outgoing` int(11) DEFAULT NULL,
  `dialer` int(11) DEFAULT NULL,
  `add_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_campaigns`
--

CREATE TABLE `tf_campaigns` (
  `camid` int(11) NOT NULL,
  `cam_name` varchar(200) NOT NULL,
  `account_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  `cam_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-Outbound Calling,1-Agent Lead',
  `cam_method` tinyint(4) DEFAULT '0' COMMENT '0-Live agent,1-IVR',
  `cam_agentgroup` varchar(255) DEFAULT NULL,
  `cam_ivrid` int(11) DEFAULT NULL,
  `dialer_type` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 -Progressive , 1- Predictive',
  `call_ratio` int(11) DEFAULT NULL,
  `cam_status` enum('0','1','2') NOT NULL COMMENT '0-Schedule,1-Running,2-Completed',
  `cam_action` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:default\r\n1:start\r\n2:stop',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pules` float DEFAULT NULL,
  `pulesrate` float DEFAULT NULL,
  `manager` int(11) DEFAULT NULL,
  `cam_feedback_form` int(11) DEFAULT NULL,
  `retry` enum('no','yes') DEFAULT 'no',
  `retrytime` int(11) DEFAULT '0',
  `maxretry` int(11) DEFAULT '3',
  `lms_agentid` int(11) NOT NULL DEFAULT '0',
  `totalagent` int(11) NOT NULL DEFAULT '0',
  `created_by` int(11) DEFAULT NULL,
  `sms_call_answered` int(1) DEFAULT NULL,
  `sms_template_id` int(11) DEFAULT NULL,
  `is_deleted` enum('no','yes') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_campaigns_agent`
--

CREATE TABLE `tf_campaigns_agent` (
  `camagid` int(11) NOT NULL,
  `cam_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_campaigns_did`
--

CREATE TABLE `tf_campaigns_did` (
  `cam_did` int(11) NOT NULL,
  `did` varchar(100) NOT NULL,
  `cam_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_campaigns_numbers`
--

CREATE TABLE `tf_campaigns_numbers` (
  `numid` int(11) NOT NULL,
  `cam_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `cont_id` varchar(100) NOT NULL,
  `segment_id` varchar(50) DEFAULT NULL,
  `totaltry` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `r_status` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_campaigns_numbers_warehouse`
--

CREATE TABLE `tf_campaigns_numbers_warehouse` (
  `numid` int(11) NOT NULL,
  `cam_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `cont_id` varchar(100) NOT NULL,
  `segment_id` varchar(50) DEFAULT NULL,
  `totaltry` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `r_status` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_campaigns_warehouse`
--

CREATE TABLE `tf_campaigns_warehouse` (
  `camid` int(11) NOT NULL,
  `cam_name` varchar(200) NOT NULL,
  `account_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  `cam_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-Outbound Calling,1-Agent Lead',
  `cam_method` tinyint(4) DEFAULT '0' COMMENT '0-Live agent,1-IVR',
  `cam_agentgroup` varchar(255) DEFAULT NULL,
  `cam_ivrid` int(11) DEFAULT NULL,
  `dialer_type` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 -Progressive , 1- Predictive',
  `call_ratio` int(11) DEFAULT NULL,
  `cam_status` enum('0','1','2') NOT NULL COMMENT '0-Schedule,1-Running,2-Completed',
  `cam_action` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:default\r\n1:start\r\n2:stop',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pules` float DEFAULT NULL,
  `pulesrate` float DEFAULT NULL,
  `manager` int(11) DEFAULT NULL,
  `cam_feedback_form` int(11) DEFAULT NULL,
  `retry` enum('no','yes') DEFAULT 'no',
  `retrytime` int(11) DEFAULT '0',
  `maxretry` int(11) DEFAULT '3',
  `lms_agentid` int(11) NOT NULL DEFAULT '0',
  `totalagent` int(11) NOT NULL DEFAULT '0',
  `created_by` int(11) DEFAULT NULL,
  `sms_call_answered` int(1) DEFAULT NULL,
  `sms_template_id` int(11) DEFAULT NULL,
  `is_deleted` enum('no','yes') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_campaign_schedule`
--

CREATE TABLE `tf_campaign_schedule` (
  `id` int(11) NOT NULL,
  `campaignid` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `OpenTime` time DEFAULT NULL,
  `CloseTime` time DEFAULT NULL,
  `Mon` enum('0','1') DEFAULT NULL,
  `Tue` enum('0','1') DEFAULT NULL,
  `Wed` enum('0','1') DEFAULT NULL,
  `Thu` enum('0','1') DEFAULT NULL,
  `Fri` enum('0','1') DEFAULT NULL,
  `Sat` enum('0','1') DEFAULT NULL,
  `Sun` enum('0','1') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_careers`
--

CREATE TABLE `tf_careers` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobile` varchar(200) NOT NULL,
  `msg` text NOT NULL,
  `address` varchar(255) NOT NULL,
  `uploadfile` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_cdr`
--

CREATE TABLE `tf_cdr` (
  `id` int(11) NOT NULL,
  `uniqueid` varchar(100) DEFAULT NULL,
  `accountid` bigint(20) DEFAULT NULL,
  `DID` bigint(20) NOT NULL,
  `channel` varchar(200) DEFAULT NULL,
  `channelid` varchar(50) DEFAULT NULL,
  `bridgeid` varchar(100) DEFAULT NULL,
  `serviceid` int(11) DEFAULT NULL,
  `servicevalue` int(11) DEFAULT NULL,
  `CallerType` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-User 1-Agent',
  `AgentID` int(10) DEFAULT NULL,
  `AgentName` varchar(100) DEFAULT NULL,
  `AgentNumber` varchar(15) DEFAULT NULL,
  `CallerNumber` varchar(30) DEFAULT NULL,
  `CallerName` varchar(255) DEFAULT 'NA',
  `CIRCLE` varchar(200) NOT NULL DEFAULT 'NA',
  `OPERATOR` varchar(200) NOT NULL DEFAULT 'NA',
  `HangupCause` varchar(200) NOT NULL DEFAULT 'NA',
  `GroupID` int(10) DEFAULT '0',
  `GroupName` varchar(30) NOT NULL DEFAULT 'NA',
  `CallTypeID` int(10) NOT NULL DEFAULT '2' COMMENT '0-Manual,1-Dialer,2-Incoming',
  `CallType` varchar(15) DEFAULT NULL,
  `CallStartTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CallAnswerTime` datetime DEFAULT '0000-00-00 00:00:00',
  `CallEndTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CallDuration` int(10) NOT NULL DEFAULT '0',
  `CallTalkTime` int(10) NOT NULL DEFAULT '0',
  `AgentCallStartTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `AgentCallAnswerTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `AgentCallEndTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `AgentTalkTime` int(10) NOT NULL DEFAULT '0',
  `HoldTime` int(11) DEFAULT NULL,
  `WrapTime` int(11) DEFAULT NULL,
  `CallStatus` varchar(200) NOT NULL DEFAULT 'NA',
  `AgentStatus` varchar(200) DEFAULT NULL,
  `CustomerStatus` varchar(200) NOT NULL DEFAULT 'NA',
  `CallPluse` int(11) NOT NULL DEFAULT '0',
  `DisconnectedBy` varchar(10) NOT NULL DEFAULT 'NA',
  `LastDestination` varchar(200) NOT NULL DEFAULT 'NA',
  `RecPath` varchar(255) DEFAULT NULL,
  `CdrStatus` tinyint(1) NOT NULL DEFAULT '0',
  `feedback` varchar(100) DEFAULT NULL,
  `note` text,
  `scheduledate` datetime DEFAULT NULL,
  `auto_numid` int(11) NOT NULL DEFAULT '0',
  `HangupCauseID` bigint(20) DEFAULT NULL,
  `LastExtension` int(11) DEFAULT NULL,
  `in_queue` int(11) DEFAULT '0' COMMENT '0-no, 1-yes',
  `cont_id` varchar(200) DEFAULT NULL,
  `is_s3` enum('no','yes') NOT NULL,
  `agent_connect` int(1) DEFAULT NULL COMMENT '0-nonVOIP, 1-VOIP',
  `billing_pulse` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_cdr_live_request`
--

CREATE TABLE `tf_cdr_live_request` (
  `rid` int(11) NOT NULL,
  `callernumber` varchar(100) NOT NULL,
  `callername` varchar(255) NOT NULL,
  `did` varchar(20) NOT NULL,
  `numid` varchar(100) DEFAULT NULL,
  `manager_id` int(11) NOT NULL,
  `camivrid` int(11) DEFAULT NULL,
  `camid` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `totaltry` int(11) NOT NULL DEFAULT '0',
  `type` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_cdr_request`
--

CREATE TABLE `tf_cdr_request` (
  `rid` int(11) NOT NULL,
  `callernumber` varchar(100) NOT NULL,
  `callername` varchar(255) NOT NULL,
  `did` varchar(20) NOT NULL,
  `numid` varchar(100) DEFAULT NULL,
  `manager_id` int(11) NOT NULL,
  `camivrid` int(11) DEFAULT NULL,
  `camid` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_cdr_request_nexxbase`
--

CREATE TABLE `tf_cdr_request_nexxbase` (
  `rid` int(11) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `did` varchar(20) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `ivrid` int(11) NOT NULL,
  `inputcode` int(11) DEFAULT NULL,
  `ticketdata` longtext,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_cdr_warehouse`
--

CREATE TABLE `tf_cdr_warehouse` (
  `id` int(11) NOT NULL,
  `uniqueid` varchar(100) DEFAULT NULL,
  `accountid` bigint(20) DEFAULT NULL,
  `DID` bigint(20) NOT NULL,
  `channel` varchar(200) DEFAULT NULL,
  `channelid` varchar(50) DEFAULT NULL,
  `bridgeid` varchar(100) DEFAULT NULL,
  `serviceid` int(11) DEFAULT NULL,
  `servicevalue` int(11) DEFAULT NULL,
  `CallerType` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-User 1-Agent',
  `AgentID` int(10) DEFAULT NULL,
  `AgentName` varchar(100) DEFAULT NULL,
  `AgentNumber` varchar(15) DEFAULT NULL,
  `CallerNumber` varchar(30) DEFAULT NULL,
  `CallerName` varchar(255) DEFAULT 'NA',
  `CIRCLE` varchar(200) NOT NULL DEFAULT 'NA',
  `OPERATOR` varchar(200) NOT NULL DEFAULT 'NA',
  `HangupCause` varchar(200) NOT NULL DEFAULT 'NA',
  `GroupID` int(10) DEFAULT '0',
  `GroupName` varchar(30) NOT NULL DEFAULT 'NA',
  `CallTypeID` int(10) NOT NULL DEFAULT '2' COMMENT '0-Manual,1-Dialer,2-Incoming',
  `CallType` varchar(15) DEFAULT NULL,
  `CallStartTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CallAnswerTime` datetime DEFAULT '0000-00-00 00:00:00',
  `CallEndTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CallDuration` int(10) NOT NULL DEFAULT '0',
  `CallTalkTime` int(10) NOT NULL DEFAULT '0',
  `AgentCallStartTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `AgentCallAnswerTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `AgentCallEndTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `AgentTalkTime` int(10) NOT NULL DEFAULT '0',
  `HoldTime` int(11) DEFAULT NULL,
  `WrapTime` int(11) DEFAULT NULL,
  `CallStatus` varchar(15) NOT NULL DEFAULT 'NOANSWER',
  `AgentStatus` varchar(15) DEFAULT NULL,
  `CustomerStatus` varchar(15) NOT NULL DEFAULT 'NOANSWER',
  `CallPluse` int(11) NOT NULL DEFAULT '0',
  `DisconnectedBy` varchar(10) NOT NULL DEFAULT 'NA',
  `LastDestination` varchar(200) NOT NULL DEFAULT 'NA',
  `RecPath` varchar(255) DEFAULT NULL,
  `CdrStatus` tinyint(1) NOT NULL DEFAULT '0',
  `feedback` varchar(100) DEFAULT NULL,
  `note` text,
  `scheduledate` datetime DEFAULT NULL,
  `auto_numid` int(11) NOT NULL DEFAULT '0',
  `HangupCauseID` bigint(20) DEFAULT NULL,
  `LastExtension` int(11) DEFAULT NULL,
  `in_queue` int(11) DEFAULT '0' COMMENT '0-no, 1-yes',
  `cont_id` varchar(200) DEFAULT NULL,
  `is_s3` enum('no','yes') NOT NULL,
  `agent_connect` int(1) DEFAULT NULL,
  `billing_pulse` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_channel`
--

CREATE TABLE `tf_channel` (
  `ID` int(11) NOT NULL,
  `Channel_Name` varchar(10) NOT NULL,
  `Created_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_channelusages`
--

CREATE TABLE `tf_channelusages` (
  `count` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_channelusages_airtel`
--

CREATE TABLE `tf_channelusages_airtel` (
  `count` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_channelusages_new`
--

CREATE TABLE `tf_channelusages_new` (
  `count` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_clicktocall`
--

CREATE TABLE `tf_clicktocall` (
  `clickid` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `script_name` varchar(200) NOT NULL,
  `domain` varchar(200) NOT NULL,
  `agentgroup` int(11) DEFAULT NULL,
  `button_position` enum('left','right') NOT NULL DEFAULT 'right',
  `tag_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_conference`
--

CREATE TABLE `tf_conference` (
  `conf_id` int(11) NOT NULL,
  `conf_name` varchar(200) NOT NULL,
  `manager_mobile` varchar(100) DEFAULT NULL,
  `conf_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-Inbound , 1-Outbound',
  `conf_membertype` tinyint(1) NOT NULL COMMENT '0-Agent, 1-Contact',
  `conf_did` varchar(100) DEFAULT NULL,
  `conf_start` tinyint(1) NOT NULL COMMENT '0-Now, 1-Schedule',
  `conf_date` datetime NOT NULL,
  `conf_pin` bigint(11) NOT NULL,
  `conf_autoid` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `conf_max_user` int(11) NOT NULL DEFAULT '10',
  `conf_sms_campaign` int(11) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_conference_member`
--

CREATE TABLE `tf_conference_member` (
  `member_id` int(11) NOT NULL,
  `conference_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `member_name` varchar(100) NOT NULL,
  `contact_no` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `sendsms_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_conference_member_record`
--

CREATE TABLE `tf_conference_member_record` (
  `rid` int(11) NOT NULL,
  `confid` int(11) NOT NULL,
  `memberid` int(11) NOT NULL,
  `cdrid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_configuration`
--

CREATE TABLE `tf_configuration` (
  `cid` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `metakey` varchar(200) NOT NULL,
  `metavalue` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_configuration_calender`
--

CREATE TABLE `tf_configuration_calender` (
  `cid` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `metakey` varchar(200) NOT NULL,
  `metavalue` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_contacts`
--

CREATE TABLE `tf_contacts` (
  `cont_id` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `is_mobile_dnd` enum('no','yes') NOT NULL DEFAULT 'no',
  `lead_source` varchar(100) DEFAULT NULL,
  `lead_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `is_valid_email` tinyint(1) NOT NULL DEFAULT '0',
  `emm_customerid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_contacts_meta`
--

CREATE TABLE `tf_contacts_meta` (
  `meta_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `cont_id` varchar(100) NOT NULL,
  `meta_key` varchar(100) NOT NULL,
  `meta_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_contacts_warehouse`
--

CREATE TABLE `tf_contacts_warehouse` (
  `cont_id` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `is_mobile_dnd` enum('no','yes') NOT NULL DEFAULT 'no',
  `lead_source` varchar(100) DEFAULT NULL,
  `lead_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `is_valid_email` tinyint(1) NOT NULL DEFAULT '0',
  `emm_customerid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_currency`
--

CREATE TABLE `tf_currency` (
  `currency_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_destination`
--

CREATE TABLE `tf_destination` (
  `dest_id` int(3) NOT NULL,
  `dest_name` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_dholera_company`
--

CREATE TABLE `tf_dholera_company` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_dholera_company_project`
--

CREATE TABLE `tf_dholera_company_project` (
  `id` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  `projectname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_dholera_dealer`
--

CREATE TABLE `tf_dholera_dealer` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `officialmobile` varchar(20) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `joiningdate` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `parent` int(11) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_dholera_leadgenerator`
--

CREATE TABLE `tf_dholera_leadgenerator` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `officialmobile` varchar(20) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `joiningdate` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `parent` int(11) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_dholera_leads_upload_file`
--

CREATE TABLE `tf_dholera_leads_upload_file` (
  `F_id` int(11) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `upload_by` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `agentgroup_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `segmentid` varchar(100) DEFAULT NULL,
  `remove_duplicate` enum('no','yes') NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `finish_time` datetime DEFAULT NULL,
  `file_status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running,2-completed',
  `file_path` varchar(200) DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_did`
--

CREATE TABLE `tf_did` (
  `id` int(11) NOT NULL,
  `did_name` varchar(100) NOT NULL,
  `did_number` varchar(100) NOT NULL,
  `did` varchar(100) NOT NULL,
  `did_prefix` varchar(10) DEFAULT 'SM',
  `is_spam` enum('no','yes') NOT NULL,
  `spam_date` date DEFAULT NULL,
  `status` enum('inactive','active') NOT NULL,
  `is_mobile` enum('no','yes') NOT NULL DEFAULT 'no',
  `server_url` varchar(100) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `did_privacy` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0:public,1:private'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_did_numbers`
--

CREATE TABLE `tf_did_numbers` (
  `id` int(11) NOT NULL,
  `vmn` varchar(15) DEFAULT NULL,
  `did` varchar(50) NOT NULL,
  `Type` tinyint(1) NOT NULL COMMENT '0-Terminate Call 1-Announcement\n2-HuntGroup 3-IVR 4-VoiceMail 5-TimeCondition 6-MissCall 7-Conference 8- Click to Call\n9-Outbound 10-SIPHardPhone',
  `Action` int(11) NOT NULL COMMENT '0-HangUp',
  `assign` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `assginDate` datetime NOT NULL,
  `unassignDate` datetime NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `Description` varchar(200) DEFAULT NULL,
  `did_description` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_emailsms_configuration`
--

CREATE TABLE `tf_emailsms_configuration` (
  `config_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `smsserver_id` int(11) NOT NULL,
  `emailserver_id` int(11) NOT NULL,
  `event` text NOT NULL,
  `smstemp_id` int(11) NOT NULL,
  `emailtemp_id` int(11) NOT NULL,
  `created_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_emailtemplate`
--

CREATE TABLE `tf_emailtemplate` (
  `email_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `email_title` text,
  `email_subject` text,
  `email_description` longtext,
  `add_date` timestamp NULL DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `email_design` longtext,
  `email_html` longtext,
  `email_image` varchar(100) DEFAULT NULL,
  `email_designdata` longtext,
  `status` tinyint(1) DEFAULT '1',
  `isschedulemeeting` tinyint(1) DEFAULT '0',
  `attach_file` varchar(50) DEFAULT NULL,
  `sub_var1` varchar(30) DEFAULT NULL,
  `sub_var2` varchar(30) DEFAULT NULL,
  `desc_var1` varchar(30) DEFAULT NULL,
  `desc_var2` varchar(30) DEFAULT NULL,
  `desc_var3` varchar(30) DEFAULT NULL,
  `desc_var4` varchar(30) DEFAULT NULL,
  `desc_var5` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_emailtemplate_attachment`
--

CREATE TABLE `tf_emailtemplate_attachment` (
  `attach_id` int(11) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  `email_id` int(11) NOT NULL,
  `file_name` varchar(50) CHARACTER SET latin1 NOT NULL,
  `file_path` text CHARACTER SET latin1 NOT NULL,
  `fileoriginal_name` varchar(50) CHARACTER SET latin1 NOT NULL,
  `mime_type` tinytext CHARACTER SET latin1 NOT NULL,
  `add_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tf_email_camapgin_number`
--

CREATE TABLE `tf_email_camapgin_number` (
  `numid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `emm_cid` int(11) DEFAULT NULL,
  `account_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_date` datetime NOT NULL,
  `hit_count` varchar(255) NOT NULL,
  `opener_event` enum('no','yes') NOT NULL DEFAULT 'no',
  `open_date` datetime DEFAULT NULL,
  `email_title` varchar(255) DEFAULT NULL,
  `email_subject` varchar(255) DEFAULT NULL,
  `email_design` longtext,
  `email_html` longtext,
  `emailid` varchar(255) DEFAULT NULL,
  `cont_id` varchar(255) NOT NULL,
  `shorturl_link` varchar(255) DEFAULT NULL,
  `response` varchar(255) DEFAULT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `email_status` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(255) DEFAULT NULL,
  `form_id` int(11) DEFAULT NULL,
  `form_shortlink` varchar(255) DEFAULT NULL,
  `cam_type` enum('0','1') NOT NULL,
  `attach_file` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tf_email_campagin`
--

CREATE TABLE `tf_email_campagin` (
  `cid` int(11) NOT NULL,
  `cam_name` varchar(255) NOT NULL,
  `sendername` varchar(255) DEFAULT NULL,
  `senderaddress` varchar(255) DEFAULT NULL,
  `replyname` varchar(255) DEFAULT NULL,
  `replyaddress` varchar(255) DEFAULT NULL,
  `cam_temp_id` int(11) NOT NULL,
  `cam_link` int(11) DEFAULT NULL,
  `cam_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cam_status` enum('0','1') NOT NULL DEFAULT '0',
  `account_id` int(11) NOT NULL,
  `emm_mailingid` int(11) DEFAULT NULL,
  `cam_type` enum('0','1') NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `scheduled` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_email_campaign_links`
--

CREATE TABLE `tf_email_campaign_links` (
  `id` int(11) NOT NULL,
  `c_numid` int(11) NOT NULL DEFAULT '0',
  `c_cid` int(11) NOT NULL DEFAULT '0',
  `c_url` varchar(250) DEFAULT NULL,
  `c_short_url` varchar(250) DEFAULT NULL,
  `c_hit_count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_email_links`
--

CREATE TABLE `tf_email_links` (
  `sl_id` int(11) NOT NULL,
  `sl_name` varchar(200) DEFAULT NULL,
  `sl_url` varchar(255) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_email_server`
--

CREATE TABLE `tf_email_server` (
  `server_id` int(11) NOT NULL,
  `account_id` varchar(100) NOT NULL,
  `smtp_server` varchar(100) NOT NULL,
  `smtp_port` varchar(100) NOT NULL,
  `smtp_username` varchar(100) NOT NULL,
  `smtp_password` text NOT NULL,
  `perday_limit` varchar(100) NOT NULL,
  `attachment_size` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Table structure for table `tf_erp_taxes`
--

CREATE TABLE `tf_erp_taxes` (
  `taxes_id` int(11) NOT NULL,
  `account_head` varchar(255) DEFAULT NULL,
  `base_tax_amount` int(11) DEFAULT NULL,
  `base_tax_amount_after_discount_amount` int(11) DEFAULT NULL,
  `base_total` int(11) DEFAULT NULL,
  `charge_type` varchar(100) DEFAULT NULL,
  `cost_center` varchar(255) DEFAULT NULL,
  `creation` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `docstatus` int(11) DEFAULT NULL,
  `doctype` varchar(100) DEFAULT NULL,
  `idx` int(11) DEFAULT NULL,
  `included_in_print_rate` int(11) DEFAULT NULL,
  `item_wise_tax_detail` varchar(255) DEFAULT NULL,
  `modified` varchar(255) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `parent` varchar(255) DEFAULT NULL,
  `parentfield` varchar(255) DEFAULT NULL,
  `parenttype` varchar(255) DEFAULT NULL,
  `rate` int(11) DEFAULT NULL,
  `tax_amount` int(11) DEFAULT NULL,
  `tax_amount_after_discount_amount` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `is_sync` enum('no','yes') DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_erp_whatsapp`
--

CREATE TABLE `tf_erp_whatsapp` (
  `w_id` int(11) NOT NULL,
  `lead_id` varchar(255) DEFAULT NULL,
  `cdrid` int(11) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `message` varchar(900) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_feedbackforms`
--

CREATE TABLE `tf_feedbackforms` (
  `fid` int(11) NOT NULL,
  `form_name` varchar(200) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `manager_id` int(11) NOT NULL,
  `form_type` enum('survey','lead') DEFAULT NULL,
  `form_code` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_feedbackform_data`
--

CREATE TABLE `tf_feedbackform_data` (
  `fdid` int(11) NOT NULL,
  `fmetaid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `form_title` varchar(255) NOT NULL,
  `form_value` varchar(255) NOT NULL,
  `cdrid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_feedbackform_meta`
--

CREATE TABLE `tf_feedbackform_meta` (
  `mid` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `form_title` varchar(255) NOT NULL,
  `form_type` varchar(100) NOT NULL,
  `form_value` varchar(255) DEFAULT NULL,
  `manager_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_fileupload_request`
--

CREATE TABLE `tf_fileupload_request` (
  `fid` int(11) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` varchar(11) NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `segment` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `finish_time` datetime DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running,2-completed',
  `file_path` varchar(200) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_fileupload_request_email`
--

CREATE TABLE `tf_fileupload_request_email` (
  `fid` int(11) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` varchar(11) NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `segment` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `finish_time` datetime DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running,2-completed',
  `file_path` varchar(200) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_fileupload_request_sms`
--

CREATE TABLE `tf_fileupload_request_sms` (
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` varchar(11) NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `segment` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `finish_time` datetime DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running,2-completed',
  `file_path` varchar(200) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL,
  `fid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_getivrinput`
--

CREATE TABLE `tf_getivrinput` (
  `id` int(11) NOT NULL,
  `ivrid` int(11) DEFAULT NULL,
  `extension` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `cdrid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_get_offers`
--

CREATE TABLE `tf_get_offers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(200) NOT NULL,
  `count` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_header_footer_setting`
--

CREATE TABLE `tf_header_footer_setting` (
  `setting_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `letter_head` varchar(100) DEFAULT NULL,
  `header_image` text,
  `header_html` longtext,
  `footer_image` text,
  `footer_html` longtext,
  `uploaded_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_hold_calling_reason`
--

CREATE TABLE `tf_hold_calling_reason` (
  `reason_id` int(11) NOT NULL,
  `ACW` int(11) NOT NULL,
  `reason_name` varchar(50) NOT NULL,
  `add_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_issue_type`
--

CREATE TABLE `tf_issue_type` (
  `issue_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `issue_name` varchar(100) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_IvrBuilderExtension`
--

CREATE TABLE `tf_IvrBuilderExtension` (
  `IvrBuilderID` int(10) NOT NULL,
  `Extension` int(3) DEFAULT NULL,
  `DestinationType` tinyint(1) NOT NULL COMMENT '0-Terminate Call 1-Announcement 2-HuntGroup 3-IVR 4-VoiceMail 5-TimeCondition 6-MissCall 7-Conference',
  `DestinationAction` int(11) NOT NULL COMMENT '0-HangUp',
  `DestinationSMS` int(11) DEFAULT NULL,
  `DestinationEmail` int(11) DEFAULT NULL,
  `DestinationAPI` int(11) DEFAULT NULL,
  `DestinationStatus` varchar(255) DEFAULT NULL,
  `call_status` int(1) DEFAULT NULL COMMENT '1-answer, 2-noanswer'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_kyc`
--

CREATE TABLE `tf_kyc` (
  `kyc_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `registration_certi` varchar(200) DEFAULT NULL,
  `gst_certificate` varchar(200) DEFAULT NULL,
  `agreement` varchar(200) DEFAULT NULL,
  `pan_card` varchar(200) DEFAULT NULL,
  `authorized_person_proof` varchar(200) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '0' COMMENT '0:upload, 1:approve, 2:reject',
  `note` text,
  `approved_by` int(11) DEFAULT NULL,
  `uploaded_date` datetime DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_landing_page`
--

CREATE TABLE `tf_landing_page` (
  `landing_pageid` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `landing_page_name` varchar(255) NOT NULL,
  `landing_page_formid` int(11) NOT NULL,
  `landing_page_html` longtext NOT NULL,
  `landing_page_design` longtext NOT NULL,
  `is_deleted` enum('no','yes') NOT NULL DEFAULT 'no',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_last_extension`
--

CREATE TABLE `tf_last_extension` (
  `ext_id` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Table structure for table `tf_leads_email`
--

CREATE TABLE `tf_leads_email` (
  `e_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `lead_name` varchar(255) DEFAULT NULL,
  `email_to` varchar(255) DEFAULT NULL,
  `text_description` text,
  `subject` varchar(255) DEFAULT NULL,
  `frommail` varchar(100) NOT NULL,
  `accepted` varchar(255) DEFAULT NULL,
  `rejected` varchar(255) DEFAULT NULL,
  `envelopeTime` int(11) DEFAULT NULL,
  `messageTime` int(11) DEFAULT NULL,
  `messageSize` int(11) DEFAULT NULL,
  `response` varchar(255) DEFAULT NULL,
  `envelope` varchar(255) DEFAULT NULL,
  `messageId` varchar(255) DEFAULT NULL,
  `cc` varchar(255) DEFAULT NULL,
  `bcc` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attachment_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_leads_upload_file`
--

CREATE TABLE `tf_leads_upload_file` (
  `F_id` int(11) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `upload_by` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `agentgroup_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `segmentid` varchar(100) DEFAULT NULL,
  `remove_duplicate` enum('no','yes') NOT NULL DEFAULT 'no',
  `file_name` varchar(200) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `finish_time` datetime DEFAULT NULL,
  `file_status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-pending,1-running,2-completed',
  `file_path` varchar(200) DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_comment`
--

CREATE TABLE `tf_lead_comment` (
  `comment_id` int(11) NOT NULL,
  `lead_id` int(11) DEFAULT NULL,
  `title` varchar(250) DEFAULT NULL,
  `comment` text,
  `c_date` datetime DEFAULT NULL,
  `lead_com_id` varchar(50) DEFAULT NULL,
  `comment_by` varchar(100) DEFAULT NULL,
  `is_sync` enum('yes','no') NOT NULL DEFAULT 'no',
  `customer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_country`
--

CREATE TABLE `tf_lead_country` (
  `country_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_deal_done`
--

CREATE TABLE `tf_lead_deal_done` (
  `deal_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `lead_id` int(11) NOT NULL,
  `deal_date` date NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `birthdate` date NOT NULL,
  `address` text NOT NULL,
  `city` varchar(20) NOT NULL,
  `pincode` varchar(50) NOT NULL,
  `country` varchar(20) NOT NULL,
  `company` int(11) NOT NULL,
  `dealerid` int(11) DEFAULT NULL,
  `refclient` int(11) DEFAULT NULL,
  `project` int(11) NOT NULL,
  `proposal` int(11) DEFAULT NULL,
  `phaseno` varchar(2) DEFAULT NULL,
  `plot_number` int(11) DEFAULT NULL,
  `plot_area` varchar(30) DEFAULT NULL,
  `plot_rate` int(11) DEFAULT NULL,
  `plot_value` int(11) DEFAULT NULL,
  `discount_value` int(11) DEFAULT NULL,
  `booking_amount` int(11) DEFAULT NULL,
  `payment_mode` varchar(20) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `nominee_name` varchar(30) DEFAULT NULL,
  `nominee_relation` varchar(25) DEFAULT NULL,
  `nominee_phoneno` varchar(20) DEFAULT NULL,
  `add_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `error` varchar(10) DEFAULT NULL,
  `errormsg` varchar(50) DEFAULT NULL,
  `success` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_master_status`
--

CREATE TABLE `tf_lead_master_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_quotation`
--

CREATE TABLE `tf_lead_quotation` (
  `quotation_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `lead_id` int(11) DEFAULT NULL,
  `quotation_name` varchar(50) DEFAULT NULL,
  `validity` int(11) NOT NULL COMMENT '0:monthly,1:quaterly,2:half yearly,3:yearly',
  `total_quantity` int(11) DEFAULT NULL,
  `grand_total` float(10,2) DEFAULT NULL,
  `grand_total_inword` text,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_discount` int(11) NOT NULL,
  `total_gstamount` int(11) NOT NULL,
  `total_amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_quotation_item`
--

CREATE TABLE `tf_lead_quotation_item` (
  `item_id` int(11) NOT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `product_price` int(11) DEFAULT NULL,
  `gst` int(11) NOT NULL DEFAULT '0',
  `gst_amount` int(11) NOT NULL DEFAULT '0',
  `product_amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_stage`
--

CREATE TABLE `tf_lead_stage` (
  `s_id` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `stage_name` varchar(255) DEFAULT NULL,
  `color_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_stage_status`
--

CREATE TABLE `tf_lead_stage_status` (
  `St_id` int(11) NOT NULL,
  `stage_id` int(11) NOT NULL,
  `stage_status` varchar(100) DEFAULT NULL,
  `status_master` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_tags`
--

CREATE TABLE `tf_lead_tags` (
  `tag_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `tag_name` varchar(50) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_tag_supervisor`
--

CREATE TABLE `tf_lead_tag_supervisor` (
  `assign_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_lead_timeline`
--

CREATE TABLE `tf_lead_timeline` (
  `t_id` int(11) NOT NULL,
  `lead_id` int(11) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `account_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `notes` text,
  `previous_status` varchar(255) DEFAULT NULL,
  `current_status` varchar(255) DEFAULT NULL,
  `form_id` int(11) DEFAULT NULL,
  `action_type` varchar(20) DEFAULT NULL,
  `action_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_loginactivity`
--

CREATE TABLE `tf_loginactivity` (
  `id` int(11) NOT NULL,
  `uid` int(10) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `logout_time` datetime DEFAULT NULL,
  `dif_time` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `deviceType` varchar(100) DEFAULT NULL,
  `device` varchar(100) DEFAULT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_managerotp`
--

CREATE TABLE `tf_managerotp` (
  `otp_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `mobile` varchar(12) NOT NULL,
  `otp` int(6) NOT NULL,
  `sendsms_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_manager_api`
--

CREATE TABLE `tf_manager_api` (
  `api_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `api_name` varchar(255) NOT NULL,
  `api_endpoint` text NOT NULL,
  `api_payload` json DEFAULT NULL,
  `api_header` json DEFAULT NULL,
  `api_header_type` enum('json','form') NOT NULL DEFAULT 'json',
  `api_method` varchar(50) NOT NULL,
  `status` enum('active','inactive') NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_manager_api_data`
--

CREATE TABLE `tf_manager_api_data` (
  `a_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `input_digit` int(11) NOT NULL,
  `cdr_id` int(11) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_manager_email_server`
--

CREATE TABLE `tf_manager_email_server` (
  `server_id` int(11) NOT NULL,
  `account_id` varchar(100) NOT NULL,
  `smtp_server` varchar(100) NOT NULL,
  `server_name` varchar(247) DEFAULT NULL,
  `smtp_port` varchar(100) NOT NULL,
  `smtp_username` varchar(100) NOT NULL,
  `smtp_password` text NOT NULL,
  `perday_limit` varchar(100) DEFAULT NULL,
  `attachment_size` varchar(200) DEFAULT NULL,
  `imap_server` varchar(100) DEFAULT NULL,
  `imap_port` int(11) DEFAULT NULL,
  `imap_username` varchar(100) DEFAULT NULL,
  `imap_password` varchar(100) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_manager_review_rate`
--

CREATE TABLE `tf_manager_review_rate` (
  `rate_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `cdrid` varchar(100) DEFAULT NULL,
  `review_formid` int(11) NOT NULL,
  `review_rate` int(11) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_manager_settings`
--

CREATE TABLE `tf_manager_settings` (
  `setting_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `setting_name` varchar(100) NOT NULL,
  `setting_value` varchar(50) NOT NULL COMMENT '0:No, 1:Yes',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_market_segement`
--

CREATE TABLE `tf_market_segement` (
  `m_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_master_data`
--

CREATE TABLE `tf_master_data` (
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(200) DEFAULT NULL,
  `Pincode` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_notifications`
--

CREATE TABLE `tf_notifications` (
  `noti_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_status` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_obd_account`
--

CREATE TABLE `tf_obd_account` (
  `id` int(11) NOT NULL,
  `accountid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_obd_asterisk_server`
--

CREATE TABLE `tf_obd_asterisk_server` (
  `server_id` int(11) NOT NULL,
  `server_name` varchar(255) NOT NULL,
  `server_ip` varchar(100) NOT NULL,
  `server_username` varchar(100) DEFAULT NULL,
  `server_password` varchar(100) DEFAULT NULL,
  `server_mysql_username` varchar(200) DEFAULT NULL,
  `server_mysql_password` varchar(200) DEFAULT NULL,
  `server_database_name` varchar(200) DEFAULT NULL,
  `server_mysql_host` varchar(200) DEFAULT NULL,
  `sip_host` varchar(200) DEFAULT NULL,
  `ari_url` varchar(100) DEFAULT NULL,
  `ari_username` varchar(100) DEFAULT NULL,
  `ari_password` varchar(100) DEFAULT NULL,
  `live_domain` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_obd_did`
--

CREATE TABLE `tf_obd_did` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `did` varchar(100) NOT NULL,
  `is_spam` enum('no','yes') NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_OBD_Package`
--

CREATE TABLE `tf_OBD_Package` (
  `OBD_id` varchar(25) NOT NULL,
  `OBD_Plan` varchar(10) NOT NULL,
  `OBD_Rate` float NOT NULL,
  `OBD_No` float NOT NULL,
  `OBD_Value` float NOT NULL,
  `OBD_Pulserate` int(11) DEFAULT NULL,
  `Created_Date` date NOT NULL,
  `Created_By` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_opportunity`
--

CREATE TABLE `tf_opportunity` (
  `op_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `opportunity_type` varchar(100) DEFAULT NULL,
  `party_name` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `converted_by` varchar(255) DEFAULT NULL,
  `sales_stage` varchar(100) DEFAULT NULL,
  `expected_closing` varchar(100) DEFAULT NULL,
  `contact_by` varchar(255) DEFAULT NULL,
  `contact_date` varchar(100) DEFAULT NULL,
  `to_discuss` varchar(255) DEFAULT NULL,
  `currency` varchar(100) DEFAULT NULL,
  `probability` varchar(100) DEFAULT NULL,
  `opportunity_amount` varchar(100) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `transaction_date` varchar(255) DEFAULT NULL,
  `creation` varchar(255) DEFAULT NULL,
  `customer_group` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `docstatus` int(10) DEFAULT NULL,
  `doctype` varchar(100) DEFAULT NULL,
  `idx` int(10) DEFAULT NULL,
  `lost_reasons` varchar(255) DEFAULT NULL,
  `mins_to_first_response` int(10) DEFAULT NULL,
  `modified` varchar(100) DEFAULT NULL,
  `modified_by` varchar(100) DEFAULT NULL,
  `naming_series` varchar(100) DEFAULT NULL,
  `opportunity_from` varchar(100) DEFAULT NULL,
  `territory` varchar(255) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `with_items` int(11) DEFAULT NULL,
  `items` varchar(100) DEFAULT NULL,
  `parent` varchar(10) DEFAULT NULL,
  `parentfield` varchar(100) DEFAULT NULL,
  `parenttype` varchar(255) DEFAULT NULL,
  `order_lost_reason` varchar(255) DEFAULT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `address_display` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `contact_display` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_mobile` varchar(255) DEFAULT NULL,
  `campaign` varchar(255) DEFAULT NULL,
  `amended_from` varchar(255) DEFAULT NULL,
  `is_sync` enum('no','yes') DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_packages`
--

CREATE TABLE `tf_packages` (
  `package_id` int(11) NOT NULL,
  `package_name` text,
  `package_price` float NOT NULL,
  `package_validity` tinyint(4) NOT NULL COMMENT '0:monthly \n1:yearly',
  `package_userlimit` int(11) NOT NULL,
  `package_channels` int(11) NOT NULL,
  `package_type` int(11) NOT NULL COMMENT '0:incoming\n1:outgoing',
  `package_service` text COMMENT '0:IVR\n1:Miss Call\n2:Conference\n3:Dialer\n4:Click to Call\n5:Campaigns\n',
  `minute_type` int(11) DEFAULT NULL,
  `minutes` varchar(100) DEFAULT NULL,
  `published_web` int(11) NOT NULL COMMENT '0:not in web ,1:in web',
  `package_description` varchar(255) DEFAULT NULL,
  `add_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_payment_transaction`
--

CREATE TABLE `tf_payment_transaction` (
  `pay_id` int(11) NOT NULL,
  `txnid` varchar(200) NOT NULL,
  `bank_ref_num` varchar(200) NOT NULL,
  `payuMoneyId` varchar(200) NOT NULL,
  `date` datetime NOT NULL,
  `amount` varchar(100) NOT NULL,
  `mihpayid` varchar(100) NOT NULL,
  `productinfo` varchar(255) DEFAULT 'Teleforce Telephony Solution',
  `firstname` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `resphash` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `user` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_pixceldata`
--

CREATE TABLE `tf_pixceldata` (
  `pid` int(11) NOT NULL,
  `id` varchar(100) DEFAULT NULL,
  `uid` varchar(100) DEFAULT NULL,
  `ev` varchar(100) DEFAULT NULL,
  `ed` text,
  `v` varchar(50) DEFAULT NULL,
  `dl` text,
  `rl` varchar(200) DEFAULT NULL,
  `ts` varchar(100) DEFAULT NULL,
  `de` varchar(50) DEFAULT NULL,
  `sr` varchar(100) DEFAULT NULL,
  `vp` varchar(100) DEFAULT NULL,
  `cd` varchar(100) DEFAULT NULL,
  `dt` text,
  `bn` varchar(100) DEFAULT NULL,
  `md` varchar(50) DEFAULT NULL,
  `ua` text,
  `tz` varchar(50) DEFAULT NULL,
  `utm_source` varchar(200) DEFAULT NULL,
  `utm_medium` varchar(200) DEFAULT NULL,
  `utm_term` varchar(200) DEFAULT NULL,
  `utm_content` varchar(200) DEFAULT NULL,
  `utm_campaign` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_products`
--

CREATE TABLE `tf_products` (
  `productid` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `product_code` varchar(100) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_desc` text,
  `hsn` varchar(100) DEFAULT NULL,
  `product_long_desc` text,
  `sms_template` int(11) DEFAULT NULL,
  `email_template` int(11) DEFAULT NULL,
  `product_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-InActive,1-Active',
  `product_thumbnail` text NOT NULL,
  `product_document` varchar(100) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_id` int(11) NOT NULL,
  `whatsapp_template` int(11) DEFAULT NULL,
  `unit` varchar(45) NOT NULL,
  `price` varchar(45) NOT NULL,
  `actual_qty` int(11) DEFAULT NULL,
  `against_blanket_order` int(11) DEFAULT NULL,
  `amount` int(30) DEFAULT NULL,
  `gst` int(2) NOT NULL DEFAULT '0',
  `base_amount` int(30) DEFAULT NULL,
  `base_net_amount` int(30) DEFAULT NULL,
  `base_net_rate` int(30) DEFAULT NULL,
  `base_price_list_rate` int(30) DEFAULT NULL,
  `base_rate` int(30) DEFAULT NULL,
  `base_rate_with_margin` int(30) DEFAULT NULL,
  `blanket_order_rate` int(30) DEFAULT NULL,
  `conversion_factor` int(11) DEFAULT NULL,
  `creation` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_amount` int(11) DEFAULT NULL,
  `discount_percentage` int(11) DEFAULT NULL,
  `docstatus` int(11) DEFAULT NULL,
  `doctype` varchar(100) DEFAULT NULL,
  `gross_profit` int(11) DEFAULT NULL,
  `idx` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_free_item` int(11) DEFAULT NULL,
  `is_nil_exempt` int(11) DEFAULT NULL,
  `is_non_gst` int(11) DEFAULT NULL,
  `landing` varchar(100) DEFAULT NULL,
  `web_url` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_products_catalogue`
--

CREATE TABLE `tf_products_catalogue` (
  `c_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `catalogue_name` varchar(255) NOT NULL,
  `catalogue_file` varchar(255) DEFAULT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_products_docs`
--

CREATE TABLE `tf_products_docs` (
  `product_doc_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_doc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_products_images`
--

CREATE TABLE `tf_products_images` (
  `product_image_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_product_attributes`
--

CREATE TABLE `tf_product_attributes` (
  `attribute_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `product_id` varchar(100) NOT NULL,
  `attribute_key` varchar(100) NOT NULL,
  `attribute_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_product_email`
--

CREATE TABLE `tf_product_email` (
  `emailid` int(11) NOT NULL,
  `email_to` varchar(100) NOT NULL,
  `edate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `template_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_product_group`
--

CREATE TABLE `tf_product_group` (
  `pg_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_product_sms`
--

CREATE TABLE `tf_product_sms` (
  `smsid` int(11) NOT NULL,
  `sms_to` varchar(25) NOT NULL,
  `template_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `smsdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_product_whatsapp`
--

CREATE TABLE `tf_product_whatsapp` (
  `smsid` int(11) NOT NULL,
  `sms_to` varchar(25) NOT NULL,
  `template_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `smsdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_promo_code`
--

CREATE TABLE `tf_promo_code` (
  `id` int(11) NOT NULL,
  `codename` varchar(255) NOT NULL,
  `codevalue` varchar(255) NOT NULL,
  `codetype` varchar(255) NOT NULL,
  `expirydate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_queuecall`
--

CREATE TABLE `tf_queuecall` (
  `qid` int(11) NOT NULL,
  `agentid` int(11) DEFAULT NULL,
  `accountid` int(11) DEFAULT NULL,
  `cdrid` int(11) NOT NULL,
  `did` varchar(50) DEFAULT NULL,
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` datetime DEFAULT NULL,
  `times` int(11) NOT NULL DEFAULT '1',
  `status` enum('0','1') NOT NULL DEFAULT '0',
  `action` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0-None,1 - Hangup,2- Transfer',
  `transfer_agent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_quotation`
--

CREATE TABLE `tf_quotation` (
  `q_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `parent` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_group` varchar(255) DEFAULT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `currency` varchar(100) DEFAULT NULL,
  `creation` varchar(255) DEFAULT NULL,
  `conversion_rate` int(11) DEFAULT NULL,
  `contact_mobile` varchar(50) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_display` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `additional_discount_percentage` int(11) DEFAULT NULL,
  `address_display` varchar(255) DEFAULT NULL,
  `apply_discount_on` varchar(255) DEFAULT NULL,
  `base_discount_amount` int(11) DEFAULT NULL,
  `base_grand_total` int(30) DEFAULT NULL,
  `base_in_words` varchar(255) DEFAULT NULL,
  `base_net_total` int(30) DEFAULT NULL,
  `base_rounded_total` int(30) DEFAULT NULL,
  `base_rounding_adjustment` int(30) DEFAULT NULL,
  `base_total` int(30) DEFAULT NULL,
  `base_total_taxes_and_charges` int(30) DEFAULT NULL,
  `discount_amount` int(30) DEFAULT NULL,
  `docstatus` int(11) DEFAULT NULL,
  `doctype` varchar(100) DEFAULT NULL,
  `grand_total` varchar(255) DEFAULT NULL,
  `group_same_items` int(11) DEFAULT NULL,
  `idx` int(11) DEFAULT NULL,
  `ignore_pricing_rule` int(11) DEFAULT NULL,
  `in_words` varchar(255) DEFAULT NULL,
  `letter_head` varchar(255) DEFAULT NULL,
  `modified` varchar(255) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `order_type` varchar(255) DEFAULT NULL,
  `naming_series` varchar(255) DEFAULT NULL,
  `net_total` int(30) DEFAULT NULL,
  `other_charges_calculation` varchar(700) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `party_name` varchar(255) DEFAULT NULL,
  `plc_conversion_rate` int(11) DEFAULT NULL,
  `price_list_currency` varchar(100) DEFAULT NULL,
  `quotation_to` varchar(100) DEFAULT NULL,
  `rounded_total` int(30) DEFAULT NULL,
  `rounding_adjustment` int(11) DEFAULT NULL,
  `selling_price_list` varchar(255) DEFAULT NULL,
  `shipping_address_name` varchar(255) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `tax_category` varchar(255) DEFAULT NULL,
  `taxes_and_charges` varchar(255) DEFAULT NULL,
  `tc_name` varchar(255) DEFAULT NULL,
  `terms` varchar(255) DEFAULT NULL,
  `territory` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `total` varchar(255) DEFAULT NULL,
  `total_net_weight` int(11) DEFAULT NULL,
  `total_qty` int(11) DEFAULT NULL,
  `total_taxes_and_charges` int(11) DEFAULT NULL,
  `transaction_date` varchar(255) DEFAULT NULL,
  `valid_till` varchar(255) DEFAULT NULL,
  `parentfield` varchar(255) DEFAULT NULL,
  `parenttype` varchar(255) DEFAULT NULL,
  `amended_from` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `shipping_rule` varchar(255) DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `referral_sales_partner` varchar(255) DEFAULT NULL,
  `payment_terms_template` varchar(255) DEFAULT NULL,
  `select_print_heading` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `auto_repeat` varchar(255) DEFAULT NULL,
  `campaign` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `order_lost_reason` varchar(255) DEFAULT NULL,
  `enq_det` varchar(255) DEFAULT NULL,
  `supplier_quotation` varchar(255) DEFAULT NULL,
  `opportunity` varchar(255) DEFAULT NULL,
  `item` text,
  `items` text,
  `taxes` text,
  `payment_schedule` text,
  `lost_reasons` text,
  `pricing_rules` text,
  `__islocal` varchar(100) DEFAULT NULL,
  `__unsaved` varchar(100) DEFAULT NULL,
  `is_sync` enum('no','yes') DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_recordingrequest`
--

CREATE TABLE `tf_recordingrequest` (
  `r_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `finish_time` datetime DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `filepath` varchar(200) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_recordingrequest_number`
--

CREATE TABLE `tf_recordingrequest_number` (
  `nid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `number` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_report_master`
--

CREATE TABLE `tf_report_master` (
  `id` int(11) NOT NULL,
  `report_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_report_req`
--

CREATE TABLE `tf_report_req` (
  `reqid` int(11) NOT NULL,
  `managerid` int(11) NOT NULL,
  `reportname` varchar(250) NOT NULL,
  `startdate` date NOT NULL,
  `enddate` date NOT NULL,
  `requestdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `downliad_link` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_contact`
--

CREATE TABLE `tf_request_contact` (
  `id` int(11) NOT NULL,
  `request_date` datetime NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `intrest` varchar(255) DEFAULT NULL,
  `sms_send` enum('no','yes') NOT NULL,
  `email_send` enum('no','yes') NOT NULL,
  `auto_call` enum('no','yes') NOT NULL,
  `push_erp` enum('no','yes') DEFAULT 'no',
  `deleted` enum('no','yes') NOT NULL,
  `status` enum('created','not answer','answer','not interested','proposal','demo','sale close') DEFAULT 'created',
  `opix_uid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_contact_feedback`
--

CREATE TABLE `tf_request_contact_feedback` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `feedback` text NOT NULL,
  `requestid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_otp`
--

CREATE TABLE `tf_request_otp` (
  `id` int(11) NOT NULL,
  `request_date` datetime NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `otp` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_signup`
--

CREATE TABLE `tf_request_signup` (
  `rid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(100) NOT NULL,
  `services` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_teledigital`
--

CREATE TABLE `tf_request_teledigital` (
  `id` int(11) NOT NULL,
  `request_date` datetime NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `intrest` varchar(255) DEFAULT NULL,
  `sms_send` enum('no','yes') NOT NULL DEFAULT 'no',
  `email_send` enum('no','yes') NOT NULL DEFAULT 'no',
  `auto_call` enum('no','yes') NOT NULL DEFAULT 'no',
  `push_erp` enum('no','yes') DEFAULT 'no',
  `deleted` enum('no','yes') NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_teledigital_feedback`
--

CREATE TABLE `tf_request_teledigital_feedback` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `feedback` text NOT NULL,
  `requestid` varchar(244) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_telemail`
--

CREATE TABLE `tf_request_telemail` (
  `id` int(11) NOT NULL,
  `request_date` datetime NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `intrest` varchar(255) DEFAULT NULL,
  `sms_send` enum('no','yes') NOT NULL DEFAULT 'no',
  `email_send` enum('no','yes') NOT NULL DEFAULT 'no',
  `auto_call` enum('no','yes') NOT NULL DEFAULT 'no',
  `push_erp` enum('no','yes') DEFAULT 'no',
  `deleted` enum('no','yes') NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_telemail_feedback`
--

CREATE TABLE `tf_request_telemail_feedback` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `feedback` text NOT NULL,
  `requestid` varchar(244) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_telesms`
--

CREATE TABLE `tf_request_telesms` (
  `id` int(11) NOT NULL,
  `request_date` datetime NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `intrest` varchar(255) DEFAULT NULL,
  `sms_send` enum('no','yes') NOT NULL DEFAULT 'no',
  `email_send` enum('no','yes') NOT NULL DEFAULT 'no',
  `auto_call` enum('no','yes') NOT NULL DEFAULT 'no',
  `push_erp` enum('no','yes') DEFAULT 'no',
  `deleted` enum('no','yes') NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_request_telesms_feedback`
--

CREATE TABLE `tf_request_telesms_feedback` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `feedback` text NOT NULL,
  `requestid` varchar(244) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_scheduler`
--

CREATE TABLE `tf_scheduler` (
  `s_id` int(11) NOT NULL,
  `meeting_type` varchar(25) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `Description` text,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `StartTime` datetime DEFAULT NULL,
  `EndTime` datetime DEFAULT NULL,
  `IsAllDay` int(11) DEFAULT NULL,
  `StartTimezone` varchar(50) DEFAULT NULL,
  `EndTimezone` varchar(50) DEFAULT NULL,
  `RecurrenceRule` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `meeting_link` varchar(100) DEFAULT NULL,
  `email_status` int(2) NOT NULL DEFAULT '0',
  `sms_status` int(2) NOT NULL DEFAULT '0',
  `agent_email_status` int(2) NOT NULL DEFAULT '0',
  `agent_sms_status` int(2) NOT NULL DEFAULT '0',
  `customer_id` varchar(100) DEFAULT NULL,
  `schedule_type` varchar(100) DEFAULT NULL,
  `original_meeting_link` varchar(255) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_call` int(2) NOT NULL DEFAULT '0',
  `account_id` int(11) DEFAULT NULL,
  `conf_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_schedule_meeting`
--

CREATE TABLE `tf_schedule_meeting` (
  `meetingid` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `link` varchar(500) NOT NULL,
  `shared_link` varchar(500) DEFAULT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `startdate` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `customer_id` varchar(250) DEFAULT NULL,
  `email_status` int(2) NOT NULL DEFAULT '0',
  `sms_status` int(2) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_schedule_report`
--

CREATE TABLE `tf_schedule_report` (
  `id` int(11) NOT NULL,
  `report_name` varchar(255) NOT NULL,
  `email` text NOT NULL,
  `frequency` varchar(255) NOT NULL,
  `account_id` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_segments`
--

CREATE TABLE `tf_segments` (
  `cont_id` varchar(255) NOT NULL,
  `customer_id` varchar(2555) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `emm_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `is_deleted` enum('no','yes') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_segments_warehouse`
--

CREATE TABLE `tf_segments_warehouse` (
  `cont_id` varchar(255) NOT NULL,
  `customer_id` varchar(2555) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `emm_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `is_deleted` enum('no','yes') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sendemail`
--

CREATE TABLE `tf_sendemail` (
  `send_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `expire_day` int(11) NOT NULL,
  `sendemail_date` date NOT NULL,
  `sendemail_status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sendsms`
--

CREATE TABLE `tf_sendsms` (
  `send_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `expire_day` int(11) DEFAULT NULL,
  `sendsms_date` date DEFAULT NULL,
  `sendsms_status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_services`
--

CREATE TABLE `tf_services` (
  `s_id` int(11) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_rate` float NOT NULL,
  `service_qty` int(11) NOT NULL,
  `service_duration` int(11) NOT NULL COMMENT 'duration in months, 0 - for unlimited',
  `service_type` varchar(100) NOT NULL,
  `service_desc` text,
  `mode` enum('limited','unlimited') NOT NULL,
  `sub_service` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_settings`
--

CREATE TABLE `tf_settings` (
  `s_id` int(11) NOT NULL,
  `setting_name` varchar(255) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `account_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_shifttime`
--

CREATE TABLE `tf_shifttime` (
  `shift_id` int(11) NOT NULL,
  `account_id` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `start_time` datetime NOT NULL,
  `stop_time` datetime DEFAULT NULL,
  `shift_status` tinyint(4) NOT NULL COMMENT '0:start\n1:stop'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_smscampagis`
--

CREATE TABLE `tf_smscampagis` (
  `cid` int(11) NOT NULL,
  `cam_name` varchar(255) NOT NULL,
  `cam_temp_id` int(11) NOT NULL,
  `cam_link` int(11) DEFAULT NULL,
  `cam_date` datetime NOT NULL,
  `cam_enddate` datetime DEFAULT NULL,
  `cam_status` enum('0','1','2','3') NOT NULL,
  `account_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `cam_type` enum('0','1') NOT NULL,
  `cams_type` enum('Bulk','Single') DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '0:sms,1:whatsup',
  `form_id` int(11) DEFAULT NULL,
  `var1` varchar(20) DEFAULT NULL,
  `var2` varchar(20) DEFAULT NULL,
  `var3` varchar(20) DEFAULT NULL,
  `var4` varchar(20) DEFAULT NULL,
  `var5` varchar(20) DEFAULT NULL,
  `customvar1` varchar(30) DEFAULT NULL,
  `customvar2` varchar(30) DEFAULT NULL,
  `customvar3` varchar(30) DEFAULT NULL,
  `customvar4` varchar(30) DEFAULT NULL,
  `customvar5` varchar(30) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_smstemplate`
--

CREATE TABLE `tf_smstemplate` (
  `sms_id` int(11) NOT NULL,
  `account_id` varchar(50) DEFAULT NULL,
  `sms_title` text,
  `sms_text` longtext CHARACTER SET utf8 COLLATE utf8_bin,
  `sms_credits` int(11) DEFAULT NULL,
  `text_length` int(11) DEFAULT NULL,
  `text_limit` int(11) DEFAULT NULL,
  `add_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_date` datetime DEFAULT NULL,
  `approve_status` int(11) DEFAULT '0' COMMENT '0- Pending, 1- Approve ,2- Reject',
  `approved_by` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL,
  `smsserver` varchar(100) DEFAULT NULL,
  `track` tinyint(4) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'inactive',
  `templateid` varchar(255) DEFAULT NULL,
  `contentid` varchar(255) DEFAULT NULL,
  `senderid` varchar(100) DEFAULT NULL,
  `templatetype` varchar(100) DEFAULT NULL,
  `isgeneric` tinyint(1) DEFAULT '0',
  `isschedulemeeting` tinyint(1) DEFAULT '0',
  `entityid` varchar(255) DEFAULT NULL,
  `var1` varchar(30) DEFAULT NULL,
  `var2` varchar(30) DEFAULT NULL,
  `var3` varchar(30) DEFAULT NULL,
  `var4` varchar(30) DEFAULT NULL,
  `var5` varchar(30) DEFAULT NULL,
  `customvar1` varchar(30) DEFAULT NULL,
  `customvar2` varchar(30) DEFAULT NULL,
  `customvar3` varchar(30) DEFAULT NULL,
  `customvar4` varchar(30) DEFAULT NULL,
  `customvar5` varchar(30) DEFAULT NULL,
  `form_id` int(11) DEFAULT NULL,
  `link_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sms_campagins_number`
--

CREATE TABLE `tf_sms_campagins_number` (
  `numid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `p_status` enum('0','1') NOT NULL DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_date` datetime DEFAULT NULL,
  `hit_count` int(11) DEFAULT '0',
  `message` longtext NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `cont_id` varchar(255) DEFAULT NULL,
  `shorturl_link` varchar(255) DEFAULT NULL,
  `response` varchar(255) DEFAULT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `sms_status` varchar(50) DEFAULT 'PENDING',
  `sms_credit` int(11) NOT NULL DEFAULT '0',
  `form_id` int(11) DEFAULT NULL,
  `form_shortlink` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sms_configuration`
--

CREATE TABLE `tf_sms_configuration` (
  `config_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `smsserver_id` int(11) NOT NULL,
  `event` varchar(100) DEFAULT NULL,
  `agent_smstemp_id` int(11) DEFAULT NULL,
  `caller_smstemp_id` int(11) DEFAULT NULL,
  `created_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sms_links`
--

CREATE TABLE `tf_sms_links` (
  `sl_id` int(11) NOT NULL,
  `sl_name` varchar(200) DEFAULT NULL,
  `sl_url` varchar(255) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sms_report`
--

CREATE TABLE `tf_sms_report` (
  `sms_id` int(11) NOT NULL,
  `cdr_id` bigint(20) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `text` text,
  `sms_status` varchar(50) DEFAULT NULL,
  `sms_uid` varchar(255) DEFAULT NULL,
  `sms_credit` int(11) DEFAULT NULL,
  `sentdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sms_server`
--

CREATE TABLE `tf_sms_server` (
  `sid` int(11) NOT NULL,
  `server_name` varchar(255) NOT NULL,
  `server_url` varchar(255) DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `auth_key` varchar(100) DEFAULT NULL,
  `senderid` varchar(20) DEFAULT NULL,
  `server_type` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_socket_server`
--

CREATE TABLE `tf_socket_server` (
  `server_id` int(11) NOT NULL,
  `server_name` varchar(30) NOT NULL,
  `server_url` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_sound_library`
--

CREATE TABLE `tf_sound_library` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `fileid` varchar(100) CHARACTER SET latin1 NOT NULL,
  `filename` varchar(100) CHARACTER SET latin1 NOT NULL,
  `originalfilename` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `filesize` varchar(10) CHARACTER SET latin1 NOT NULL,
  `duration` float DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `approved` int(11) DEFAULT NULL,
  `sorter` tinyint(2) NOT NULL,
  `status` tinyint(4) DEFAULT '0' COMMENT '0:Upload,1:Approve,2:Reject',
  `note` text CHARACTER SET latin1,
  `default` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:no,1:yes',
  `approved_date` datetime DEFAULT NULL,
  `addDate` datetime NOT NULL,
  `updateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_source_master`
--

CREATE TABLE `tf_source_master` (
  `s_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_state`
--

CREATE TABLE `tf_state` (
  `state_id` int(11) NOT NULL,
  `state_code` varchar(50) NOT NULL,
  `state_name` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_subscription`
--

CREATE TABLE `tf_subscription` (
  `s_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `manager_id` varchar(100) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` varchar(5) DEFAULT '0' COMMENT '0-active,1-inactive,2-cancel',
  `plans` text NOT NULL,
  `plans_discription` text,
  `plan_value` varchar(100) DEFAULT NULL,
  `services` text,
  `taxes` text,
  `discount` varchar(100) DEFAULT NULL,
  `amount` varchar(100) DEFAULT NULL,
  `created_by` varchar(100) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_supervisor_agents`
--

CREATE TABLE `tf_supervisor_agents` (
  `ID` int(11) NOT NULL,
  `supervisor_account_id` int(10) NOT NULL COMMENT 'account_id from account table',
  `UserID` int(10) NOT NULL COMMENT 'login manager id',
  `AgentID` int(10) NOT NULL COMMENT 'AgentID of'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tf_support`
--

CREATE TABLE `tf_support` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `msg` text,
  `mobile` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_Tele_Digital_Ads_Package`
--

CREATE TABLE `tf_Tele_Digital_Ads_Package` (
  `Adspackage_id` varchar(50) NOT NULL,
  `Adspackage_name` varchar(50) NOT NULL,
  `Adspackage_value` int(11) NOT NULL,
  `created_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_Tele_Digital_Package`
--

CREATE TABLE `tf_Tele_Digital_Package` (
  `Digital_ID` varchar(25) NOT NULL,
  `Digital_Plan` varchar(10) NOT NULL,
  `brand_no` int(10) DEFAULT '1',
  `channel_no` int(11) DEFAULT '4',
  `member_no` int(11) DEFAULT '0',
  `group_no` int(11) DEFAULT '0',
  `monitor_no` int(11) DEFAULT '0',
  `hashtag_no` int(11) DEFAULT '0',
  `messanger` int(11) DEFAULT '0',
  `user` int(11) DEFAULT '1',
  `bot` int(11) DEFAULT '0',
  `mediaspace` int(11) DEFAULT '5' COMMENT 'in GB',
  `Package_Validity` tinyint(4) DEFAULT NULL COMMENT '0:monthly,1:yearly,2:quarterly,3:half yearly',
  `Package_Value` int(11) DEFAULT NULL,
  `Created_Date` date NOT NULL,
  `Created_By` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_Tele_Mail_Package`
--

CREATE TABLE `tf_Tele_Mail_Package` (
  `Mail_ID` varchar(25) NOT NULL,
  `hosting_service` int(11) DEFAULT NULL COMMENT '0:false,1:true',
  `bulk_email` int(11) DEFAULT NULL COMMENT '0:false,1:true',
  `Mail_Plan` varchar(10) NOT NULL,
  `Mail_Rate` int(10) DEFAULT NULL,
  `Max_User_No` int(10) DEFAULT NULL,
  `Mail_Plan_Value` int(10) DEFAULT NULL,
  `package_validity` tinyint(4) DEFAULT NULL,
  `Mail_Gb` int(11) DEFAULT NULL,
  `Bulk_Mail_Name` varchar(100) DEFAULT NULL,
  `Bulk_Mail_Rate` float DEFAULT NULL,
  `Bulk_Mail_No` int(11) DEFAULT NULL,
  `Bulk_Mail_Value` int(11) DEFAULT NULL,
  `Created_Date` date DEFAULT NULL,
  `Created_By` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_Tele_Meet_Package`
--

CREATE TABLE `tf_Tele_Meet_Package` (
  `Meet_ID` varchar(25) NOT NULL,
  `Meet_Plan` varchar(10) NOT NULL,
  `Meet_Rate` float DEFAULT NULL,
  `Max_User_No` int(10) NOT NULL,
  `Meet_Plan_Value` int(10) NOT NULL,
  `package_validity` tinyint(4) NOT NULL,
  `Meet_Gb` float DEFAULT NULL,
  `Created_Date` date NOT NULL,
  `Created_By` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_Tele_SMS_Package`
--

CREATE TABLE `tf_Tele_SMS_Package` (
  `SMS_ID` varchar(25) NOT NULL,
  `SMS_Plan` varchar(30) NOT NULL,
  `SMS_TR_Rate` float NOT NULL,
  `SMS_TR_No` float NOT NULL,
  `SMS_Pr_Rate` float NOT NULL,
  `SMS_Pr_No` float NOT NULL,
  `SMS_otp_Rate` float DEFAULT NULL,
  `SMS_otp_No` float DEFAULT NULL,
  `SMS_Plan_Value` float NOT NULL,
  `Created_Date` date NOT NULL,
  `Created_By` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_temp_login_logout`
--

CREATE TABLE `tf_temp_login_logout` (
  `id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `login` datetime NOT NULL,
  `logout` datetime NOT NULL,
  `shiftin` datetime NOT NULL,
  `shiftout` datetime NOT NULL,
  `curr_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_temp_payment_transaction`
--

CREATE TABLE `tf_temp_payment_transaction` (
  `pay_id` int(11) NOT NULL,
  `txnid` varchar(200) NOT NULL,
  `bank_ref_num` varchar(200) DEFAULT NULL,
  `payuMoneyId` varchar(200) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` varchar(100) NOT NULL,
  `mihpayid` varchar(100) DEFAULT NULL,
  `productinfo` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `resphash` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_textaudio_numbers`
--

CREATE TABLE `tf_textaudio_numbers` (
  `nid` int(11) NOT NULL,
  `accountid` bigint(20) NOT NULL,
  `mobile` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `script_text` text COLLATE utf8_unicode_ci NOT NULL,
  `language` varchar(10) CHARACTER SET latin1 NOT NULL,
  `input` text COLLATE utf8_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tf_thirdpartyapi_log`
--

CREATE TABLE `tf_thirdpartyapi_log` (
  `aid` int(11) NOT NULL,
  `accountid` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `cdrid` int(11) NOT NULL,
  `event` varchar(100) NOT NULL,
  `req_data` text NOT NULL,
  `res_data` text,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_tickets`
--

CREATE TABLE `tf_tickets` (
  `ticket_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `subject` varchar(100) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `issue_type` varchar(50) DEFAULT NULL,
  `contact_no` varchar(12) NOT NULL,
  `email` varchar(30) NOT NULL,
  `raised_by` int(11) NOT NULL,
  `description` longtext,
  `ticket_image` text,
  `assign_to` int(11) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_ticket_timeline`
--

CREATE TABLE `tf_ticket_timeline` (
  `t_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `account_id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `assign_to` int(11) DEFAULT NULL,
  `notes` text,
  `current_status` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `ticket_image` varchar(100) DEFAULT NULL,
  `ticket_description` varchar(255) DEFAULT NULL,
  `action_type` varchar(10) DEFAULT NULL,
  `action_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tf_tmp_agent`
--

CREATE TABLE `tf_tmp_agent` (
  `tid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `lastdate` datetime DEFAULT NULL,
  `aid` int(11) DEFAULT NULL,
  `account_name` varchar(100) NOT NULL,
  `mobile` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_tmp_user`
--

CREATE TABLE `tf_tmp_user` (
  `userid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `state` varchar(100) NOT NULL,
  `totalusers` int(11) NOT NULL,
  `amount` varchar(30) NOT NULL,
  `gst` varchar(10) NOT NULL,
  `totalamount` varchar(50) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `username` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `totalsms` int(11) DEFAULT NULL,
  `isconvert` tinyint(1) NOT NULL DEFAULT '0',
  `pay_status` enum('unpaid','paid','failed') NOT NULL DEFAULT 'unpaid',
  `pay_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_tmp_user_kyc`
--

CREATE TABLE `tf_tmp_user_kyc` (
  `kycid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `registration_certi` varchar(200) NOT NULL,
  `gst_certificate` varchar(200) NOT NULL,
  `agreement` varchar(200) NOT NULL,
  `pan_card` varchar(200) NOT NULL,
  `authorized_person_proof` varchar(200) NOT NULL,
  `approval_status` tinyint(4) NOT NULL DEFAULT '0',
  `approved_by` int(11) NOT NULL,
  `uploaded_date` timestamp NULL DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_Tollfree_Package`
--

CREATE TABLE `tf_Tollfree_Package` (
  `TFree_id` varchar(25) NOT NULL,
  `TFree_Plan` varchar(100) NOT NULL,
  `TFree_Rate` float NOT NULL,
  `TFree_No` float NOT NULL,
  `TFree_Value` float NOT NULL,
  `Created_Date` date NOT NULL,
  `Created_By` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_transfer_agent_log`
--

CREATE TABLE `tf_transfer_agent_log` (
  `id` int(11) NOT NULL,
  `channelid` varchar(100) NOT NULL,
  `callrefid` int(11) DEFAULT NULL,
  `Date` datetime NOT NULL,
  `AgentID` varchar(100) NOT NULL,
  `AgentName` varchar(200) NOT NULL,
  `AgentNumber` varchar(50) NOT NULL,
  `CallerNumber` varchar(50) NOT NULL,
  `zohouser` varchar(100) NOT NULL,
  `accountid` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_trans_otp_campaigns`
--

CREATE TABLE `tf_trans_otp_campaigns` (
  `sms_camid` int(11) NOT NULL,
  `smstemp_id` int(11) NOT NULL,
  `sms_camname` varchar(255) DEFAULT NULL,
  `smscam_type` tinyint(4) NOT NULL,
  `account_id` int(11) NOT NULL,
  `SMSText` text NOT NULL,
  `smscam_status` tinyint(4) NOT NULL,
  `smsserver_id` int(11) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `create_date` datetime NOT NULL,
  `text_length` int(11) DEFAULT NULL,
  `text_limit` int(11) DEFAULT NULL,
  `sms_credits` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tf_triggers`
--

CREATE TABLE `tf_triggers` (
  `t_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `column_name` varchar(100) NOT NULL,
  `condition_name` varchar(100) NOT NULL,
  `condition_value` varchar(100) NOT NULL,
  `action_name` varchar(100) DEFAULT NULL,
  `action_value` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_triggers_action`
--

CREATE TABLE `tf_triggers_action` (
  `a_id` int(11) NOT NULL,
  `t_id` int(11) NOT NULL,
  `lead_id` bigint(20) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_unsubscribe_email`
--

CREATE TABLE `tf_unsubscribe_email` (
  `id` int(11) NOT NULL,
  `email_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_url_shortner`
--

CREATE TABLE `tf_url_shortner` (
  `uid` int(11) NOT NULL,
  `url` varchar(200) DEFAULT NULL,
  `short_code` varchar(50) NOT NULL,
  `visitor` int(11) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_url_shortner_analytics`
--

CREATE TABLE `tf_url_shortner_analytics` (
  `pid` int(11) NOT NULL,
  `id` varchar(100) DEFAULT NULL,
  `uid` varchar(100) DEFAULT NULL,
  `ev` varchar(100) DEFAULT NULL,
  `ed` text,
  `v` varchar(50) DEFAULT NULL,
  `dl` varchar(200) DEFAULT NULL,
  `rl` varchar(200) DEFAULT NULL,
  `ts` varchar(100) DEFAULT NULL,
  `de` varchar(50) DEFAULT NULL,
  `sr` varchar(100) DEFAULT NULL,
  `vp` varchar(100) DEFAULT NULL,
  `cd` varchar(100) DEFAULT NULL,
  `dt` text,
  `bn` varchar(100) DEFAULT NULL,
  `md` varchar(50) DEFAULT NULL,
  `ua` text,
  `tz` varchar(50) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `utm_source` varchar(200) DEFAULT NULL,
  `utm_medium` varchar(200) DEFAULT NULL,
  `utm_term` varchar(200) DEFAULT NULL,
  `utm_content` varchar(200) DEFAULT NULL,
  `utm_campaign` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Triggers `tf_url_shortner_analytics`
--
DELIMITER $$
CREATE TRIGGER `tf_url_shortner_analytics_insert` AFTER INSERT ON `tf_url_shortner_analytics` FOR EACH ROW BEGIN
    
DECLARE cnt INT(5);
DECLARE hcnt INT(5);
	SELECT count(*) into cnt FROM tf_sms_campagins_number WHERE shorturl_link =new.id; 
		if(cnt>0)then
		
		select hit_count into hcnt FROM tf_sms_campagins_number WHERE shorturl_link =new.id; 
		set hcnt=hcnt+1;
			update tf_sms_campagins_number set hit_count=hcnt WHERE shorturl_link =new.id;
		
		end if;	
    END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tf_vendor`
--

CREATE TABLE `tf_vendor` (
  `ven_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `ven_name` varchar(50) NOT NULL,
  `ven_email` varchar(50) DEFAULT NULL,
  `ven_mobile` varchar(12) DEFAULT NULL,
  `ven_city` varchar(50) DEFAULT NULL,
  `ven_pincode` varchar(50) DEFAULT NULL,
  `ven_state` varchar(20) DEFAULT NULL,
  `ven_address` text,
  `ven_status` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_verify_mobile`
--

CREATE TABLE `tf_verify_mobile` (
  `id` int(11) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `did` varchar(50) NOT NULL,
  `channelid` varchar(100) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verify` enum('no','yes') NOT NULL DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_visitor_traking`
--

CREATE TABLE `tf_visitor_traking` (
  `id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip` varchar(100) DEFAULT NULL,
  `regionName` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `countryCode` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `lat` varchar(100) DEFAULT NULL,
  `lon` varchar(100) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `isp` varchar(100) DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_wallet_transaction`
--

CREATE TABLE `tf_wallet_transaction` (
  `trans_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trans_type` enum('credit','debit') NOT NULL,
  `trans_desc` varchar(255) NOT NULL,
  `pay_ref_id` int(11) NOT NULL,
  `rate` decimal(10,0) DEFAULT NULL,
  `qty` decimal(10,0) DEFAULT NULL,
  `basic_amt` decimal(10,0) DEFAULT NULL,
  `discount` decimal(10,0) DEFAULT NULL,
  `tax_amt` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Triggers `tf_wallet_transaction`
--
DELIMITER $$
CREATE TRIGGER `Wallet Balance On Add` AFTER INSERT ON `tf_wallet_transaction` FOR EACH ROW UPDATE tf_account_table SET balance = (COALESCE((SELECT SUM(amount) FROM tf_wallet_transaction WHERE trans_type='credit' AND account_id=NEW.account_id),0) - COALESCE((SELECT SUM(amount) FROM tf_wallet_transaction WHERE trans_type='debit' AND account_id=NEW.account_id),0)) WHERE account_id=NEW.account_id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `Wallet Balance On Delete` AFTER DELETE ON `tf_wallet_transaction` FOR EACH ROW UPDATE tf_account_table SET balance = (COALESCE((SELECT SUM(amount) FROM tf_wallet_transaction WHERE trans_type='credit' AND account_id=OLD.account_id),0) - COALESCE((SELECT SUM(amount) FROM tf_wallet_transaction WHERE trans_type='debit' AND account_id=OLD.account_id),0)) WHERE account_id=OLD.account_id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `Wallet Balance On Update` AFTER UPDATE ON `tf_wallet_transaction` FOR EACH ROW UPDATE tf_account_table SET balance = (COALESCE((SELECT SUM(amount) FROM tf_wallet_transaction WHERE trans_type='credit' AND account_id=NEW.account_id),0) - COALESCE((SELECT SUM(amount) FROM tf_wallet_transaction WHERE trans_type='debit' AND account_id=NEW.account_id),0)) WHERE account_id=NEW.account_id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tf_whatsapp_template`
--

CREATE TABLE `tf_whatsapp_template` (
  `wtemp_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `wtemp_title` text NOT NULL,
  `wtemp_subject` text,
  `wtemp_description` longtext NOT NULL,
  `add_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL,
  `wtemp_design` longtext,
  `wtemp_html` longtext,
  `wtemp_image` varchar(100) DEFAULT NULL,
  `wtemp_designdata` longtext,
  `status` tinyint(1) DEFAULT '1',
  `isschedulemeeting` tinyint(1) DEFAULT '0',
  `attach_file` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_zoho_access_code`
--

CREATE TABLE `tf_zoho_access_code` (
  `id` int(11) NOT NULL,
  `accountid` bigint(20) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `api_domain` varchar(200) NOT NULL,
  `token_type` varchar(50) NOT NULL,
  `expires_in` varchar(10) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `zoho_integration` enum('enable','disable') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_zoho_code`
--

CREATE TABLE `tf_zoho_code` (
  `id` int(11) NOT NULL,
  `accountid` bigint(20) NOT NULL,
  `code` varchar(200) NOT NULL,
  `location` varchar(20) NOT NULL,
  `state` varchar(100) NOT NULL,
  `accountsserver` varchar(100) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tf_zoho_user`
--

CREATE TABLE `tf_zoho_user` (
  `uid` int(11) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  `zohouserid` varchar(50) NOT NULL,
  `zohousername` varchar(100) DEFAULT NULL,
  `zohouseremail` varchar(50) DEFAULT NULL,
  `mapuser_id` bigint(20) NOT NULL,
  `push_zoho` enum('no','yes') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wf_user`
--

CREATE TABLE `wf_user` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure for view `agent_list`
--
DROP TABLE IF EXISTS `agent_list`;

CREATE ALGORITHM=UNDEFINED DEFINER=`admin_user`@`%` SQL SECURITY DEFINER VIEW `agent_list`  AS SELECT 1 AS `agent_id`, 1 AS `account_id`, 1 AS `agent_name``agent_name`  ;

-- --------------------------------------------------------

--
-- Structure for view `channel_util`
--
DROP TABLE IF EXISTS `channel_util`;

CREATE ALGORITHM=UNDEFINED DEFINER=`admin_user`@`%` SQL SECURITY DEFINER VIEW `channel_util`  AS SELECT 1 AS `total_channel`, 1 AS `total_in_channel`, 1 AS `total_out_channel`, 1 AS `total_dialer_channel``total_dialer_channel`  ;

-- --------------------------------------------------------

--
-- Structure for view `lead_source`
--
DROP TABLE IF EXISTS `lead_source`;

CREATE ALGORITHM=UNDEFINED DEFINER=`admin_user`@`%` SQL SECURITY DEFINER VIEW `lead_source`  AS SELECT 1 AS `lead_source``lead_source`  ;

-- --------------------------------------------------------

--
-- Structure for view `lead_stage_status`
--
DROP TABLE IF EXISTS `lead_stage_status`;

CREATE ALGORITHM=UNDEFINED DEFINER=`admin_user`@`%` SQL SECURITY DEFINER VIEW `lead_stage_status`  AS SELECT 1 AS `user_id`, 1 AS `stage_id`, 1 AS `stage_name`, 1 AS `status_master``status_master`  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agent_performance_report`
--
ALTER TABLE `agent_performance_report`
  ADD KEY `rep_dt` (`report_date`),
  ADD KEY `ac_id` (`account_id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `almond_age_negative`
--
ALTER TABLE `almond_age_negative`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `almond_caller_registration`
--
ALTER TABLE `almond_caller_registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Billing_data`
--
ALTER TABLE `Billing_data`
  ADD PRIMARY KEY (`Bill_ID`);

--
-- Indexes for table `client_usage_report`
--
ALTER TABLE `client_usage_report`
  ADD KEY `ind_rep_date` (`report_date`),
  ADD KEY `ind_accountId` (`account_id`);

--
-- Indexes for table `Company_GST_Master`
--
ALTER TABLE `Company_GST_Master`
  ADD PRIMARY KEY (`GST_ID`);

--
-- Indexes for table `HuntGroup`
--
ALTER TABLE `HuntGroup`
  ADD PRIMARY KEY (`GroupID`),
  ADD KEY `AccountID` (`AccountID`),
  ADD KEY `CallType` (`CallType`),
  ADD KEY `OpenTime` (`OpenTime`),
  ADD KEY `CloseTime` (`CloseTime`);

--
-- Indexes for table `HuntGroupDetail`
--
ALTER TABLE `HuntGroupDetail`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `HuntGroupID` (`HuntGroupID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `AgentID` (`AgentID`),
  ADD KEY `seq_no` (`seq_no`);

--
-- Indexes for table `IvrBuilder`
--
ALTER TABLE `IvrBuilder`
  ADD PRIMARY KEY (`BuilderID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `ps_endpoints`
--
ALTER TABLE `ps_endpoints`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`ser_id`),
  ADD KEY `inx_series_acro` (`acro`);

--
-- Indexes for table `td_ads`
--
ALTER TABLE `td_ads`
  ADD PRIMARY KEY (`Ad_id`),
  ADD KEY `access_customer_id` (`access_customer_id`),
  ADD KEY `ads_id` (`ads_id`),
  ADD KEY `leadgen_form_page` (`leadgen_form_page`),
  ADD KEY `AgentGroupID` (`AgentGroupID`);

--
-- Indexes for table `td_adset`
--
ALTER TABLE `td_adset`
  ADD PRIMARY KEY (`A_id`);

--
-- Indexes for table `td_ads_insights`
--
ALTER TABLE `td_ads_insights`
  ADD PRIMARY KEY (`i_id`);

--
-- Indexes for table `td_ads_leads`
--
ALTER TABLE `td_ads_leads`
  ADD PRIMARY KEY (`lid`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `ads_id` (`ads_id`),
  ADD KEY `form_id` (`form_id`),
  ADD KEY `leadgen_id` (`leadgen_id`),
  ADD KEY `created_time` (`created_time`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `email` (`email`),
  ADD KEY `source` (`source`),
  ADD KEY `lms_status` (`lms_status`);

--
-- Indexes for table `td_audience`
--
ALTER TABLE `td_audience`
  ADD PRIMARY KEY (`A_id`);

--
-- Indexes for table `td_brand`
--
ALTER TABLE `td_brand`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `td_bucket`
--
ALTER TABLE `td_bucket`
  ADD PRIMARY KEY (`B_id`);

--
-- Indexes for table `td_bucket_file`
--
ALTER TABLE `td_bucket_file`
  ADD PRIMARY KEY (`F_id`);

--
-- Indexes for table `td_campaigns`
--
ALTER TABLE `td_campaigns`
  ADD PRIMARY KEY (`cam_id`);

--
-- Indexes for table `td_category`
--
ALTER TABLE `td_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `td_channels`
--
ALTER TABLE `td_channels`
  ADD PRIMARY KEY (`channel_id`);

--
-- Indexes for table `td_chat`
--
ALTER TABLE `td_chat`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `inx_uid` (`user_id`),
  ADD KEY `inx_s_date` (`start_time`);

--
-- Indexes for table `td_chat_details`
--
ALTER TABLE `td_chat_details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `inx_ch_id` (`chat_id`),
  ADD KEY `inx_date` (`date_time`);

--
-- Indexes for table `td_customer_accesstoken`
--
ALTER TABLE `td_customer_accesstoken`
  ADD PRIMARY KEY (`tid`);

--
-- Indexes for table `td_fbpage_CTA_clicks`
--
ALTER TABLE `td_fbpage_CTA_clicks`
  ADD PRIMARY KEY (`cta_id`);

--
-- Indexes for table `td_fbpage_engagement`
--
ALTER TABLE `td_fbpage_engagement`
  ADD PRIMARY KEY (`en_id`);

--
-- Indexes for table `td_fbpage_impression`
--
ALTER TABLE `td_fbpage_impression`
  ADD PRIMARY KEY (`im_id`);

--
-- Indexes for table `td_fbpage_post`
--
ALTER TABLE `td_fbpage_post`
  ADD PRIMARY KEY (`post_id`);

--
-- Indexes for table `td_fbpage_reactions`
--
ALTER TABLE `td_fbpage_reactions`
  ADD PRIMARY KEY (`reaction_id`);

--
-- Indexes for table `td_fbpage_story`
--
ALTER TABLE `td_fbpage_story`
  ADD PRIMARY KEY (`data_id`);

--
-- Indexes for table `td_fbpage_user_demographics`
--
ALTER TABLE `td_fbpage_user_demographics`
  ADD PRIMARY KEY (`data_id`);

--
-- Indexes for table `td_fbpage_video_views`
--
ALTER TABLE `td_fbpage_video_views`
  ADD PRIMARY KEY (`data_id`);

--
-- Indexes for table `td_fbpage_views`
--
ALTER TABLE `td_fbpage_views`
  ADD PRIMARY KEY (`data_id`);

--
-- Indexes for table `td_fb_lead_thirdparty`
--
ALTER TABLE `td_fb_lead_thirdparty`
  ADD PRIMARY KEY (`tid`);

--
-- Indexes for table `td_fb_likes_count`
--
ALTER TABLE `td_fb_likes_count`
  ADD PRIMARY KEY (`F_id`);

--
-- Indexes for table `td_fb_unique_audience`
--
ALTER TABLE `td_fb_unique_audience`
  ADD PRIMARY KEY (`unique_id`);

--
-- Indexes for table `td_gmb_credential`
--
ALTER TABLE `td_gmb_credential`
  ADD PRIMARY KEY (`F_id`);

--
-- Indexes for table `td_gmb_data`
--
ALTER TABLE `td_gmb_data`
  ADD PRIMARY KEY (`g_data`),
  ADD UNIQUE KEY `channel_id` (`channel_id`);

--
-- Indexes for table `td_messages`
--
ALTER TABLE `td_messages`
  ADD PRIMARY KEY (`m_id`);

--
-- Indexes for table `td_messages_user`
--
ALTER TABLE `td_messages_user`
  ADD PRIMARY KEY (`u_id`);

--
-- Indexes for table `td_monitor`
--
ALTER TABLE `td_monitor`
  ADD PRIMARY KEY (`feed_id`);

--
-- Indexes for table `td_monitor_posts`
--
ALTER TABLE `td_monitor_posts`
  ADD PRIMARY KEY (`p_id`);

--
-- Indexes for table `td_monitor_posts_attachments`
--
ALTER TABLE `td_monitor_posts_attachments`
  ADD PRIMARY KEY (`a_id`);

--
-- Indexes for table `td_monitor_posts_comment`
--
ALTER TABLE `td_monitor_posts_comment`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `td_publish_posts`
--
ALTER TABLE `td_publish_posts`
  ADD PRIMARY KEY (`p_id`),
  ADD KEY `channel_id` (`channel_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `channel_type` (`channel_type`);

--
-- Indexes for table `td_publish_posts_attachments`
--
ALTER TABLE `td_publish_posts_attachments`
  ADD PRIMARY KEY (`a_id`);

--
-- Indexes for table `td_publish_posts_comment`
--
ALTER TABLE `td_publish_posts_comment`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `td_publish_posts_share`
--
ALTER TABLE `td_publish_posts_share`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `td_request_otp`
--
ALTER TABLE `td_request_otp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `td_schedule_post`
--
ALTER TABLE `td_schedule_post`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `td_schedule_post_channel`
--
ALTER TABLE `td_schedule_post_channel`
  ADD PRIMARY KEY (`cid`);

--
-- Indexes for table `td_schedule_post_file`
--
ALTER TABLE `td_schedule_post_file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `td_social_access`
--
ALTER TABLE `td_social_access`
  ADD PRIMARY KEY (`a_id`),
  ADD KEY `access_customer_id` (`access_customer_id`),
  ADD KEY `access_status` (`access_status`),
  ADD KEY `access_brand` (`access_brand`),
  ADD KEY `access_media` (`access_media`);

--
-- Indexes for table `td_users`
--
ALTER TABLE `td_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `td_user_assign_brand`
--
ALTER TABLE `td_user_assign_brand`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `td_webhook_key`
--
ALTER TABLE `td_webhook_key`
  ADD PRIMARY KEY (`w_key`);

--
-- Indexes for table `temp_email_send`
--
ALTER TABLE `temp_email_send`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_tab`
--
ALTER TABLE `test_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_account_balance`
--
ALTER TABLE `tf_account_balance`
  ADD PRIMARY KEY (`Account_ID`);

--
-- Indexes for table `tf_account_table`
--
ALTER TABLE `tf_account_table`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account name` (`account_name`),
  ADD KEY `account_type` (`account_type`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `current_status` (`current_status`),
  ADD KEY `is_loggedin` (`is_loggedin`),
  ADD KEY `channels` (`channels`),
  ADD KEY `show_no_id` (`show_no_id`),
  ADD KEY `zoho_enable` (`zoho_enable`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `AccessKey` (`AccessKey`),
  ADD KEY `voip_status` (`voip_status`),
  ADD KEY `outgoing_channel` (`outgoing_channel`),
  ADD KEY `expiry_date` (`expiry_date`),
  ADD KEY `create_date` (`create_date`),
  ADD KEY `did_alloted` (`did_alloted`),
  ADD KEY `kyc_status` (`kyc_status`),
  ADD KEY `login_ip` (`login_ip`),
  ADD KEY `erp_userid` (`erp_userid`),
  ADD KEY `whatsup_access` (`whatsup_access`),
  ADD KEY `is_deleted` (`is_deleted`),
  ADD KEY `assign_to` (`assign_to`),
  ADD KEY `account_role` (`account_role`);

--
-- Indexes for table `tf_account_table_04_07_2022`
--
ALTER TABLE `tf_account_table_04_07_2022`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account name` (`account_name`),
  ADD KEY `account_type` (`account_type`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `current_status` (`current_status`),
  ADD KEY `is_loggedin` (`is_loggedin`),
  ADD KEY `channels` (`channels`),
  ADD KEY `show_no_id` (`show_no_id`),
  ADD KEY `zoho_enable` (`zoho_enable`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `AccessKey` (`AccessKey`),
  ADD KEY `voip_status` (`voip_status`),
  ADD KEY `outgoing_channel` (`outgoing_channel`),
  ADD KEY `expiry_date` (`expiry_date`),
  ADD KEY `create_date` (`create_date`),
  ADD KEY `did_alloted` (`did_alloted`),
  ADD KEY `kyc_status` (`kyc_status`),
  ADD KEY `login_ip` (`login_ip`),
  ADD KEY `erp_userid` (`erp_userid`),
  ADD KEY `whatsup_access` (`whatsup_access`),
  ADD KEY `is_deleted` (`is_deleted`),
  ADD KEY `assign_to` (`assign_to`),
  ADD KEY `account_role` (`account_role`);

--
-- Indexes for table `tf_account_table_13-07-2022`
--
ALTER TABLE `tf_account_table_13-07-2022`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account name` (`account_name`),
  ADD KEY `account_type` (`account_type`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `current_status` (`current_status`),
  ADD KEY `is_loggedin` (`is_loggedin`),
  ADD KEY `channels` (`channels`),
  ADD KEY `show_no_id` (`show_no_id`),
  ADD KEY `zoho_enable` (`zoho_enable`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `AccessKey` (`AccessKey`),
  ADD KEY `voip_status` (`voip_status`),
  ADD KEY `outgoing_channel` (`outgoing_channel`),
  ADD KEY `expiry_date` (`expiry_date`),
  ADD KEY `create_date` (`create_date`),
  ADD KEY `did_alloted` (`did_alloted`),
  ADD KEY `kyc_status` (`kyc_status`),
  ADD KEY `login_ip` (`login_ip`),
  ADD KEY `erp_userid` (`erp_userid`),
  ADD KEY `whatsup_access` (`whatsup_access`),
  ADD KEY `is_deleted` (`is_deleted`),
  ADD KEY `assign_to` (`assign_to`),
  ADD KEY `account_role` (`account_role`);

--
-- Indexes for table `tf_account_table_14_07_2022`
--
ALTER TABLE `tf_account_table_14_07_2022`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account name` (`account_name`),
  ADD KEY `account_type` (`account_type`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `current_status` (`current_status`),
  ADD KEY `is_loggedin` (`is_loggedin`),
  ADD KEY `channels` (`channels`),
  ADD KEY `show_no_id` (`show_no_id`),
  ADD KEY `zoho_enable` (`zoho_enable`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `AccessKey` (`AccessKey`),
  ADD KEY `voip_status` (`voip_status`),
  ADD KEY `outgoing_channel` (`outgoing_channel`),
  ADD KEY `expiry_date` (`expiry_date`),
  ADD KEY `create_date` (`create_date`),
  ADD KEY `did_alloted` (`did_alloted`),
  ADD KEY `kyc_status` (`kyc_status`),
  ADD KEY `login_ip` (`login_ip`),
  ADD KEY `erp_userid` (`erp_userid`),
  ADD KEY `whatsup_access` (`whatsup_access`),
  ADD KEY `is_deleted` (`is_deleted`),
  ADD KEY `assign_to` (`assign_to`),
  ADD KEY `account_role` (`account_role`);

--
-- Indexes for table `tf_activity_logs`
--
ALTER TABLE `tf_activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `action_date` (`action_date`);

--
-- Indexes for table `tf_agentlead`
--
ALTER TABLE `tf_agentlead`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_agent_assignlead`
--
ALTER TABLE `tf_agent_assignlead`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `tf_agent_assignleadsms`
--
ALTER TABLE `tf_agent_assignleadsms`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `tf_agent_assignmaillead`
--
ALTER TABLE `tf_agent_assignmaillead`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `tf_agent_details`
--
ALTER TABLE `tf_agent_details`
  ADD PRIMARY KEY (`agent_id`),
  ADD KEY `accId` (`account_id`);

--
-- Indexes for table `tf_agent_digitalassignlead`
--
ALTER TABLE `tf_agent_digitalassignlead`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `tf_agent_location`
--
ALTER TABLE `tf_agent_location`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `tf_agent_loginlogout_report`
--
ALTER TABLE `tf_agent_loginlogout_report`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `tf_agent_missedcall`
--
ALTER TABLE `tf_agent_missedcall`
  ADD PRIMARY KEY (`mid`),
  ADD KEY `agentid` (`agentid`),
  ADD KEY `calldate` (`calldate`),
  ADD KEY `cdrid` (`cdrid`);

--
-- Indexes for table `tf_agent_sip_account`
--
ALTER TABLE `tf_agent_sip_account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_assign_sms_server`
--
ALTER TABLE `tf_assign_sms_server`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `tf_asterisk_server`
--
ALTER TABLE `tf_asterisk_server`
  ADD PRIMARY KEY (`server_id`);

--
-- Indexes for table `tf_block_number`
--
ALTER TABLE `tf_block_number`
  ADD PRIMARY KEY (`num_id`);

--
-- Indexes for table `tf_breaktime`
--
ALTER TABLE `tf_breaktime`
  ADD PRIMARY KEY (`break_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `date` (`date`),
  ADD KEY `break_status` (`break_status`);

--
-- Indexes for table `tf_bulkupload_calender_request`
--
ALTER TABLE `tf_bulkupload_calender_request`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `tf_bulkupload_request`
--
ALTER TABLE `tf_bulkupload_request`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `tf_callingpausetime`
--
ALTER TABLE `tf_callingpausetime`
  ADD PRIMARY KEY (`pause_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `status` (`status`),
  ADD KEY `ind_start` (`start_time`),
  ADD KEY `ind_stop` (`stop_time`),
  ADD KEY `ind_reason` (`reason_id`);

--
-- Indexes for table `tf_call_disposition_manager`
--
ALTER TABLE `tf_call_disposition_manager`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_call_disposition_supervisor`
--
ALTER TABLE `tf_call_disposition_supervisor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_call_hold_duration`
--
ALTER TABLE `tf_call_hold_duration`
  ADD PRIMARY KEY (`h_id`),
  ADD KEY `cdrid` (`cdrid`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `tf_call_review_form`
--
ALTER TABLE `tf_call_review_form`
  ADD PRIMARY KEY (`form_id`);

--
-- Indexes for table `tf_call_status`
--
ALTER TABLE `tf_call_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_call_summary_report`
--
ALTER TABLE `tf_call_summary_report`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `tf_campaigns`
--
ALTER TABLE `tf_campaigns`
  ADD PRIMARY KEY (`camid`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cam_action` (`cam_action`),
  ADD KEY `cam_status` (`cam_status`),
  ADD KEY `cam_agentgroup` (`cam_agentgroup`),
  ADD KEY `cam_method` (`cam_method`),
  ADD KEY `cam_type` (`cam_type`),
  ADD KEY `lms_agentid` (`lms_agentid`);

--
-- Indexes for table `tf_campaigns_agent`
--
ALTER TABLE `tf_campaigns_agent`
  ADD PRIMARY KEY (`camagid`);

--
-- Indexes for table `tf_campaigns_did`
--
ALTER TABLE `tf_campaigns_did`
  ADD PRIMARY KEY (`cam_did`);

--
-- Indexes for table `tf_campaigns_numbers`
--
ALTER TABLE `tf_campaigns_numbers`
  ADD PRIMARY KEY (`numid`),
  ADD KEY `r_status` (`r_status`),
  ADD KEY `status` (`status`),
  ADD KEY `totaltry` (`totaltry`),
  ADD KEY `cam_id` (`cam_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `cont_id` (`cont_id`),
  ADD KEY `segment_id` (`segment_id`);

--
-- Indexes for table `tf_campaigns_numbers_warehouse`
--
ALTER TABLE `tf_campaigns_numbers_warehouse`
  ADD PRIMARY KEY (`numid`),
  ADD KEY `r_status` (`r_status`),
  ADD KEY `status` (`status`),
  ADD KEY `totaltry` (`totaltry`),
  ADD KEY `cam_id` (`cam_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `cont_id` (`cont_id`),
  ADD KEY `segment_id` (`segment_id`);

--
-- Indexes for table `tf_campaigns_warehouse`
--
ALTER TABLE `tf_campaigns_warehouse`
  ADD PRIMARY KEY (`camid`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cam_action` (`cam_action`),
  ADD KEY `cam_status` (`cam_status`),
  ADD KEY `cam_agentgroup` (`cam_agentgroup`),
  ADD KEY `cam_method` (`cam_method`),
  ADD KEY `cam_type` (`cam_type`),
  ADD KEY `lms_agentid` (`lms_agentid`);

--
-- Indexes for table `tf_campaign_schedule`
--
ALTER TABLE `tf_campaign_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_careers`
--
ALTER TABLE `tf_careers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_cdr`
--
ALTER TABLE `tf_cdr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountid` (`accountid`),
  ADD KEY `uniqueid` (`uniqueid`),
  ADD KEY `serviceid` (`serviceid`),
  ADD KEY `CallTypeID` (`CallTypeID`),
  ADD KEY `auto_numid` (`auto_numid`),
  ADD KEY `feedback` (`feedback`),
  ADD KEY `CdrStatus` (`CdrStatus`),
  ADD KEY `LastDestination` (`LastDestination`),
  ADD KEY `CallStatus` (`CallStatus`),
  ADD KEY `GroupID` (`GroupID`),
  ADD KEY `channel` (`channel`),
  ADD KEY `AgentID` (`AgentID`),
  ADD KEY `scheduledate` (`scheduledate`),
  ADD KEY `AgentStatus` (`AgentStatus`),
  ADD KEY `CallAnswerTime` (`CallAnswerTime`),
  ADD KEY `CallEndTime` (`CallEndTime`),
  ADD KEY `AgentCallEndTime` (`AgentCallEndTime`),
  ADD KEY `CallTalkTime` (`CallTalkTime`),
  ADD KEY `CallStartTime` (`CallStartTime`),
  ADD KEY `DID` (`DID`),
  ADD KEY `bridgeid` (`bridgeid`),
  ADD KEY `channelid` (`channelid`),
  ADD KEY `AgentNumber` (`AgentNumber`),
  ADD KEY `CallerNumber` (`CallerNumber`),
  ADD KEY `CallType` (`CallType`),
  ADD KEY `LastExtension` (`LastExtension`),
  ADD KEY `DisconnectedBy` (`DisconnectedBy`),
  ADD KEY `CallDuration` (`CallDuration`),
  ADD KEY `in_queue` (`in_queue`),
  ADD KEY `cont_id` (`cont_id`),
  ADD KEY `CallPluse` (`CallPluse`),
  ADD KEY `is_s3` (`is_s3`),
  ADD KEY `RecPath` (`RecPath`);

--
-- Indexes for table `tf_cdr_live_request`
--
ALTER TABLE `tf_cdr_live_request`
  ADD PRIMARY KEY (`rid`);

--
-- Indexes for table `tf_cdr_request`
--
ALTER TABLE `tf_cdr_request`
  ADD PRIMARY KEY (`rid`);

--
-- Indexes for table `tf_cdr_request_nexxbase`
--
ALTER TABLE `tf_cdr_request_nexxbase`
  ADD PRIMARY KEY (`rid`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `tf_cdr_warehouse`
--
ALTER TABLE `tf_cdr_warehouse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountid` (`accountid`),
  ADD KEY `uniqueid` (`uniqueid`),
  ADD KEY `serviceid` (`serviceid`),
  ADD KEY `CallTypeID` (`CallTypeID`),
  ADD KEY `auto_numid` (`auto_numid`),
  ADD KEY `feedback` (`feedback`),
  ADD KEY `CdrStatus` (`CdrStatus`),
  ADD KEY `LastDestination` (`LastDestination`),
  ADD KEY `CallStatus` (`CallStatus`),
  ADD KEY `GroupID` (`GroupID`),
  ADD KEY `channel` (`channel`),
  ADD KEY `AgentID` (`AgentID`),
  ADD KEY `scheduledate` (`scheduledate`),
  ADD KEY `AgentStatus` (`AgentStatus`),
  ADD KEY `CallAnswerTime` (`CallAnswerTime`),
  ADD KEY `CallEndTime` (`CallEndTime`),
  ADD KEY `AgentCallEndTime` (`AgentCallEndTime`),
  ADD KEY `CallTalkTime` (`CallTalkTime`),
  ADD KEY `CallStartTime` (`CallStartTime`),
  ADD KEY `DID` (`DID`),
  ADD KEY `bridgeid` (`bridgeid`),
  ADD KEY `channelid` (`channelid`),
  ADD KEY `AgentNumber` (`AgentNumber`),
  ADD KEY `CallerNumber` (`CallerNumber`),
  ADD KEY `CallType` (`CallType`),
  ADD KEY `LastExtension` (`LastExtension`),
  ADD KEY `DisconnectedBy` (`DisconnectedBy`),
  ADD KEY `CallDuration` (`CallDuration`),
  ADD KEY `in_queue` (`in_queue`),
  ADD KEY `cont_id` (`cont_id`),
  ADD KEY `CallPluse` (`CallPluse`),
  ADD KEY `is_s3` (`is_s3`),
  ADD KEY `RecPath` (`RecPath`);

--
-- Indexes for table `tf_channel`
--
ALTER TABLE `tf_channel`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `tf_channelusages`
--
ALTER TABLE `tf_channelusages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `date` (`date`);

--
-- Indexes for table `tf_channelusages_airtel`
--
ALTER TABLE `tf_channelusages_airtel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `date` (`date`);

--
-- Indexes for table `tf_channelusages_new`
--
ALTER TABLE `tf_channelusages_new`
  ADD PRIMARY KEY (`id`),
  ADD KEY `date` (`date`);

--
-- Indexes for table `tf_clicktocall`
--
ALTER TABLE `tf_clicktocall`
  ADD PRIMARY KEY (`clickid`);

--
-- Indexes for table `tf_conference`
--
ALTER TABLE `tf_conference`
  ADD PRIMARY KEY (`conf_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `conf_pin` (`conf_pin`),
  ADD KEY `conf_did` (`conf_did`),
  ADD KEY `conf_start` (`conf_start`);

--
-- Indexes for table `tf_conference_member`
--
ALTER TABLE `tf_conference_member`
  ADD PRIMARY KEY (`member_id`);

--
-- Indexes for table `tf_conference_member_record`
--
ALTER TABLE `tf_conference_member_record`
  ADD PRIMARY KEY (`rid`);

--
-- Indexes for table `tf_configuration`
--
ALTER TABLE `tf_configuration`
  ADD PRIMARY KEY (`cid`);

--
-- Indexes for table `tf_configuration_calender`
--
ALTER TABLE `tf_configuration_calender`
  ADD PRIMARY KEY (`cid`);

--
-- Indexes for table `tf_contacts`
--
ALTER TABLE `tf_contacts`
  ADD PRIMARY KEY (`cont_id`),
  ADD KEY `category` (`category`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `created_date` (`created_date`),
  ADD KEY `name` (`name`),
  ADD KEY `email` (`email`),
  ADD KEY `city` (`city`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `is_mobile_dnd` (`is_mobile_dnd`),
  ADD KEY `lead_id` (`lead_id`),
  ADD KEY `emm_customerid` (`emm_customerid`);

--
-- Indexes for table `tf_contacts_meta`
--
ALTER TABLE `tf_contacts_meta`
  ADD PRIMARY KEY (`meta_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cont_id` (`cont_id`),
  ADD KEY `meta_key` (`meta_key`);

--
-- Indexes for table `tf_contacts_warehouse`
--
ALTER TABLE `tf_contacts_warehouse`
  ADD PRIMARY KEY (`cont_id`),
  ADD KEY `category` (`category`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `created_date` (`created_date`),
  ADD KEY `name` (`name`),
  ADD KEY `email` (`email`),
  ADD KEY `city` (`city`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `is_mobile_dnd` (`is_mobile_dnd`),
  ADD KEY `lead_id` (`lead_id`),
  ADD KEY `emm_customerid` (`emm_customerid`);

--
-- Indexes for table `tf_currency`
--
ALTER TABLE `tf_currency`
  ADD PRIMARY KEY (`currency_id`);

--
-- Indexes for table `tf_destination`
--
ALTER TABLE `tf_destination`
  ADD PRIMARY KEY (`dest_id`);

--
-- Indexes for table `tf_dholera_leads_upload_file`
--
ALTER TABLE `tf_dholera_leads_upload_file`
  ADD PRIMARY KEY (`F_id`);

--
-- Indexes for table `tf_did`
--
ALTER TABLE `tf_did`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_did_numbers`
--
ALTER TABLE `tf_did_numbers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`did`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `Type` (`Type`),
  ADD KEY `active` (`active`);

--
-- Indexes for table `tf_emailsms_configuration`
--
ALTER TABLE `tf_emailsms_configuration`
  ADD PRIMARY KEY (`config_id`);

--
-- Indexes for table `tf_emailtemplate`
--
ALTER TABLE `tf_emailtemplate`
  ADD PRIMARY KEY (`email_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `status` (`status`),
  ADD KEY `add_date` (`add_date`);

--
-- Indexes for table `tf_emailtemplate_attachment`
--
ALTER TABLE `tf_emailtemplate_attachment`
  ADD PRIMARY KEY (`attach_id`);

--
-- Indexes for table `tf_email_camapgin_number`
--
ALTER TABLE `tf_email_camapgin_number`
  ADD PRIMARY KEY (`numid`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cid` (`cid`),
  ADD KEY `cont_id` (`cont_id`),
  ADD KEY `emm_cid` (`emm_cid`),
  ADD KEY `email_status` (`email_status`),
  ADD KEY `opener_event` (`opener_event`);

--
-- Indexes for table `tf_email_campagin`
--
ALTER TABLE `tf_email_campagin`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cam_type` (`cam_type`),
  ADD KEY `cam_temp_id` (`cam_temp_id`),
  ADD KEY `cam_status` (`cam_status`),
  ADD KEY `category` (`category`),
  ADD KEY `scheduled` (`scheduled`),
  ADD KEY `cam_date` (`cam_date`);

--
-- Indexes for table `tf_email_campaign_links`
--
ALTER TABLE `tf_email_campaign_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_email_links`
--
ALTER TABLE `tf_email_links`
  ADD PRIMARY KEY (`sl_id`);

--
-- Indexes for table `tf_email_server`
--
ALTER TABLE `tf_email_server`
  ADD PRIMARY KEY (`server_id`);


-- --------------------------------------------------------

--
-- Table structure for table `tf_erp_customer`
--

CREATE TABLE `tf_erp_customer` (
  `c_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `lead_name` varchar(255) DEFAULT NULL,
  `creation` varchar(255) DEFAULT NULL,
  `credit_limits` varchar(255) DEFAULT NULL,
  `accounts` varchar(255) DEFAULT NULL,
  `companies` varchar(255) DEFAULT NULL,
  `customer_group` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_type` varchar(255) DEFAULT NULL,
  `default_commission_rate` int(11) DEFAULT NULL,
  `disabled` int(11) DEFAULT NULL,
  `dn_required` int(11) DEFAULT NULL,
  `docstatus` int(11) DEFAULT NULL,
  `doctype` varchar(100) DEFAULT NULL,
  `export_type` varchar(255) DEFAULT NULL,
  `gst_category` varchar(255) DEFAULT NULL,
  `idx` int(11) DEFAULT NULL,
  `is_frozen` int(11) DEFAULT NULL,
  `is_internal_customer` int(11) DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `modified` varchar(255) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `naming_series` varchar(100) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `sales_team` varchar(255) DEFAULT NULL,
  `so_required` int(11) DEFAULT NULL,
  `territory` varchar(255) DEFAULT NULL,
  `parent` varchar(100) DEFAULT NULL,
  `parentfield` varchar(100) DEFAULT NULL,
  `parenttype` varchar(100) DEFAULT NULL,
  `salutation` varchar(100) DEFAULT NULL,
  `gender` varchar(100) DEFAULT NULL,
  `default_bank_account` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `account_manager` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `tax_category` varchar(100) DEFAULT NULL,
  `represents_company` varchar(255) DEFAULT NULL,
  `default_currency` int(255) DEFAULT NULL,
  `default_price_list` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `customer_primary_contact` int(255) DEFAULT NULL,
  `mobile_no` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `customer_primary_address` varchar(255) DEFAULT NULL,
  `primary_address` varchar(255) DEFAULT NULL,
  `payment_terms` varchar(255) DEFAULT NULL,
  `customer_details` varchar(255) DEFAULT NULL,
  `market_segment` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `loyalty_program` varchar(255) DEFAULT NULL,
  `loyalty_program_tier` varchar(255) DEFAULT NULL,
  `default_sales_partner` varchar(255) DEFAULT NULL,
  `customer_pos_id` varchar(255) DEFAULT NULL,
  `is_sync` enum('no','yes') DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for table `tf_erp_customer`
--
ALTER TABLE `tf_erp_customer`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `tf_erp_taxes`
--
ALTER TABLE `tf_erp_taxes`
  ADD PRIMARY KEY (`taxes_id`);

--
-- Indexes for table `tf_erp_whatsapp`
--
ALTER TABLE `tf_erp_whatsapp`
  ADD PRIMARY KEY (`w_id`);

--
-- Indexes for table `tf_feedbackforms`
--
ALTER TABLE `tf_feedbackforms`
  ADD PRIMARY KEY (`fid`),
  ADD KEY `manager_id` (`manager_id`),
  ADD KEY `created_date` (`created_date`),
  ADD KEY `form_type` (`form_type`);

--
-- Indexes for table `tf_feedbackform_data`
--
ALTER TABLE `tf_feedbackform_data`
  ADD PRIMARY KEY (`fdid`);

--
-- Indexes for table `tf_feedbackform_meta`
--
ALTER TABLE `tf_feedbackform_meta`
  ADD PRIMARY KEY (`mid`);

--
-- Indexes for table `tf_fileupload_request`
--
ALTER TABLE `tf_fileupload_request`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `tf_fileupload_request_email`
--
ALTER TABLE `tf_fileupload_request_email`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `tf_fileupload_request_sms`
--
ALTER TABLE `tf_fileupload_request_sms`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `tf_getivrinput`
--
ALTER TABLE `tf_getivrinput`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `extension` (`extension`),
  ADD KEY `ivrid` (`ivrid`),
  ADD KEY `cdrid` (`cdrid`);

--
-- Indexes for table `tf_get_offers`
--
ALTER TABLE `tf_get_offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_header_footer_setting`
--
ALTER TABLE `tf_header_footer_setting`
  ADD PRIMARY KEY (`setting_id`);

--
-- Indexes for table `tf_hold_calling_reason`
--
ALTER TABLE `tf_hold_calling_reason`
  ADD PRIMARY KEY (`reason_id`);

--
-- Indexes for table `tf_issue_type`
--
ALTER TABLE `tf_issue_type`
  ADD PRIMARY KEY (`issue_id`);

--
-- Indexes for table `tf_IvrBuilderExtension`
--
ALTER TABLE `tf_IvrBuilderExtension`
  ADD UNIQUE KEY `IvrBuilderID` (`IvrBuilderID`,`Extension`);

--
-- Indexes for table `tf_kyc`
--
ALTER TABLE `tf_kyc`
  ADD PRIMARY KEY (`kyc_id`);

--
-- Indexes for table `tf_landing_page`
--
ALTER TABLE `tf_landing_page`
  ADD PRIMARY KEY (`landing_pageid`);

--
-- Indexes for table `tf_last_extension`
--
ALTER TABLE `tf_last_extension`
  ADD PRIMARY KEY (`ext_id`);
--
-- Indexes for table `tf_leads_email`
--
ALTER TABLE `tf_leads_email`
  ADD PRIMARY KEY (`e_id`),
  ADD KEY `User_id` (`User_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `lead_name` (`lead_name`);

--
-- Indexes for table `tf_leads_upload_file`
--
ALTER TABLE `tf_leads_upload_file`
  ADD PRIMARY KEY (`F_id`);

--
-- Indexes for table `tf_lead_comment`
--
ALTER TABLE `tf_lead_comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `ind_leadID` (`lead_id`),
  ADD KEY `ind_commentDate` (`c_date`);

--
-- Indexes for table `tf_lead_country`
--
ALTER TABLE `tf_lead_country`
  ADD PRIMARY KEY (`country_id`);

--
-- Indexes for table `tf_lead_deal_done`
--
ALTER TABLE `tf_lead_deal_done`
  ADD PRIMARY KEY (`deal_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `lead_id` (`lead_id`),
  ADD KEY `deal_date` (`deal_date`),
  ADD KEY `add_date` (`add_date`);

--
-- Indexes for table `tf_lead_master_status`
--
ALTER TABLE `tf_lead_master_status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `tf_lead_quotation`
--
ALTER TABLE `tf_lead_quotation`
  ADD PRIMARY KEY (`quotation_id`);

--
-- Indexes for table `tf_lead_quotation_item`
--
ALTER TABLE `tf_lead_quotation_item`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `tf_lead_stage`
--
ALTER TABLE `tf_lead_stage`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `tf_lead_stage_status`
--
ALTER TABLE `tf_lead_stage_status`
  ADD PRIMARY KEY (`St_id`),
  ADD KEY `stage_id` (`stage_id`);

--
-- Indexes for table `tf_lead_tags`
--
ALTER TABLE `tf_lead_tags`
  ADD PRIMARY KEY (`tag_id`);

--
-- Indexes for table `tf_lead_tag_supervisor`
--
ALTER TABLE `tf_lead_tag_supervisor`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `tf_lead_timeline`
--
ALTER TABLE `tf_lead_timeline`
  ADD PRIMARY KEY (`t_id`),
  ADD KEY `lead_id` (`lead_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `created_time` (`created_time`);

--
-- Indexes for table `tf_loginactivity`
--
ALTER TABLE `tf_loginactivity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `date` (`date`),
  ADD KEY `logout_time` (`logout_time`),
  ADD KEY `action` (`action`);

--
-- Indexes for table `tf_managerotp`
--
ALTER TABLE `tf_managerotp`
  ADD PRIMARY KEY (`otp_id`);

--
-- Indexes for table `tf_manager_api`
--
ALTER TABLE `tf_manager_api`
  ADD PRIMARY KEY (`api_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `tf_manager_api_data`
--
ALTER TABLE `tf_manager_api_data`
  ADD PRIMARY KEY (`a_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cdr_id` (`cdr_id`),
  ADD KEY `input_digit` (`input_digit`);

--
-- Indexes for table `tf_manager_email_server`
--
ALTER TABLE `tf_manager_email_server`
  ADD PRIMARY KEY (`server_id`);

--
-- Indexes for table `tf_manager_review_rate`
--
ALTER TABLE `tf_manager_review_rate`
  ADD PRIMARY KEY (`rate_id`);

--
-- Indexes for table `tf_manager_settings`
--
ALTER TABLE `tf_manager_settings`
  ADD PRIMARY KEY (`setting_id`);

--
-- Indexes for table `tf_market_segement`
--
ALTER TABLE `tf_market_segement`
  ADD PRIMARY KEY (`m_id`);

--
-- Indexes for table `tf_master_data`
--
ALTER TABLE `tf_master_data`
  ADD KEY `name` (`name`),
  ADD KEY `city` (`city`),
  ADD KEY `Pincode` (`Pincode`),
  ADD KEY `mobile` (`mobile`);

--
-- Indexes for table `tf_notifications`
--
ALTER TABLE `tf_notifications`
  ADD PRIMARY KEY (`noti_id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `created_date` (`created_date`),
  ADD KEY `read_status` (`read_status`);

--
-- Indexes for table `tf_obd_account`
--
ALTER TABLE `tf_obd_account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_obd_asterisk_server`
--
ALTER TABLE `tf_obd_asterisk_server`
  ADD PRIMARY KEY (`server_id`);

--
-- Indexes for table `tf_obd_did`
--
ALTER TABLE `tf_obd_did`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_OBD_Package`
--
ALTER TABLE `tf_OBD_Package`
  ADD PRIMARY KEY (`OBD_id`);

--
-- Indexes for table `tf_opportunity`
--
ALTER TABLE `tf_opportunity`
  ADD PRIMARY KEY (`op_id`);

--
-- Indexes for table `tf_packages`
--
ALTER TABLE `tf_packages`
  ADD PRIMARY KEY (`package_id`);

--
-- Indexes for table `tf_payment_transaction`
--
ALTER TABLE `tf_payment_transaction`
  ADD PRIMARY KEY (`pay_id`);

--
-- Indexes for table `tf_pixceldata`
--
ALTER TABLE `tf_pixceldata`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `tf_products`
--
ALTER TABLE `tf_products`
  ADD PRIMARY KEY (`productid`);

--
-- Indexes for table `tf_products_catalogue`
--
ALTER TABLE `tf_products_catalogue`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `tf_products_docs`
--
ALTER TABLE `tf_products_docs`
  ADD PRIMARY KEY (`product_doc_id`);

--
-- Indexes for table `tf_products_images`
--
ALTER TABLE `tf_products_images`
  ADD PRIMARY KEY (`product_image_id`);

--
-- Indexes for table `tf_product_attributes`
--
ALTER TABLE `tf_product_attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cont_id` (`product_id`),
  ADD KEY `meta_key` (`attribute_key`);

--
-- Indexes for table `tf_product_email`
--
ALTER TABLE `tf_product_email`
  ADD PRIMARY KEY (`emailid`);

--
-- Indexes for table `tf_product_group`
--
ALTER TABLE `tf_product_group`
  ADD PRIMARY KEY (`pg_id`);

--
-- Indexes for table `tf_product_sms`
--
ALTER TABLE `tf_product_sms`
  ADD PRIMARY KEY (`smsid`);

--
-- Indexes for table `tf_product_whatsapp`
--
ALTER TABLE `tf_product_whatsapp`
  ADD PRIMARY KEY (`smsid`);

--
-- Indexes for table `tf_promo_code`
--
ALTER TABLE `tf_promo_code`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_queuecall`
--
ALTER TABLE `tf_queuecall`
  ADD PRIMARY KEY (`qid`),
  ADD KEY `agentid` (`agentid`),
  ADD KEY `cdrid` (`cdrid`),
  ADD KEY `accountid` (`accountid`),
  ADD KEY `status` (`status`),
  ADD KEY `action` (`action`),
  ADD KEY `start_time` (`start_time`);

--
-- Indexes for table `tf_quotation`
--
ALTER TABLE `tf_quotation`
  ADD PRIMARY KEY (`q_id`);

--
-- Indexes for table `tf_recordingrequest`
--
ALTER TABLE `tf_recordingrequest`
  ADD PRIMARY KEY (`r_id`),
  ADD KEY `status` (`status`),
  ADD KEY `userid` (`userid`),
  ADD KEY `date` (`date`),
  ADD KEY `startdate` (`startdate`),
  ADD KEY `enddate` (`enddate`);

--
-- Indexes for table `tf_recordingrequest_number`
--
ALTER TABLE `tf_recordingrequest_number`
  ADD PRIMARY KEY (`nid`),
  ADD KEY `rid` (`rid`);

--
-- Indexes for table `tf_report_master`
--
ALTER TABLE `tf_report_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_report_req`
--
ALTER TABLE `tf_report_req`
  ADD PRIMARY KEY (`reqid`);

--
-- Indexes for table `tf_request_contact`
--
ALTER TABLE `tf_request_contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_contact_feedback`
--
ALTER TABLE `tf_request_contact_feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_otp`
--
ALTER TABLE `tf_request_otp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_signup`
--
ALTER TABLE `tf_request_signup`
  ADD PRIMARY KEY (`rid`);

--
-- Indexes for table `tf_request_teledigital`
--
ALTER TABLE `tf_request_teledigital`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_teledigital_feedback`
--
ALTER TABLE `tf_request_teledigital_feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_telemail`
--
ALTER TABLE `tf_request_telemail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_telemail_feedback`
--
ALTER TABLE `tf_request_telemail_feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_telesms`
--
ALTER TABLE `tf_request_telesms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_request_telesms_feedback`
--
ALTER TABLE `tf_request_telesms_feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_scheduler`
--
ALTER TABLE `tf_scheduler`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `tf_schedule_meeting`
--
ALTER TABLE `tf_schedule_meeting`
  ADD PRIMARY KEY (`meetingid`);

--
-- Indexes for table `tf_schedule_report`
--
ALTER TABLE `tf_schedule_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_segments`
--
ALTER TABLE `tf_segments`
  ADD PRIMARY KEY (`cont_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `tf_segments_warehouse`
--
ALTER TABLE `tf_segments_warehouse`
  ADD PRIMARY KEY (`cont_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `tf_sendemail`
--
ALTER TABLE `tf_sendemail`
  ADD PRIMARY KEY (`send_id`);

--
-- Indexes for table `tf_sendsms`
--
ALTER TABLE `tf_sendsms`
  ADD PRIMARY KEY (`send_id`);

--
-- Indexes for table `tf_services`
--
ALTER TABLE `tf_services`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `tf_settings`
--
ALTER TABLE `tf_settings`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `tf_shifttime`
--
ALTER TABLE `tf_shifttime`
  ADD PRIMARY KEY (`shift_id`);

--
-- Indexes for table `tf_smscampagis`
--
ALTER TABLE `tf_smscampagis`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cam_type` (`cam_type`),
  ADD KEY `cams_type` (`cams_type`),
  ADD KEY `cam_status` (`cam_status`),
  ADD KEY `cam_date` (`cam_date`);

--
-- Indexes for table `tf_smstemplate`
--
ALTER TABLE `tf_smstemplate`
  ADD PRIMARY KEY (`sms_id`);

--
-- Indexes for table `tf_sms_campagins_number`
--
ALTER TABLE `tf_sms_campagins_number`
  ADD PRIMARY KEY (`numid`),
  ADD KEY `cid` (`cid`),
  ADD KEY `status` (`status`),
  ADD KEY `cont_id` (`cont_id`),
  ADD KEY `transactionId` (`transactionId`);

--
-- Indexes for table `tf_sms_configuration`
--
ALTER TABLE `tf_sms_configuration`
  ADD PRIMARY KEY (`config_id`);

--
-- Indexes for table `tf_sms_links`
--
ALTER TABLE `tf_sms_links`
  ADD PRIMARY KEY (`sl_id`);

--
-- Indexes for table `tf_sms_report`
--
ALTER TABLE `tf_sms_report`
  ADD PRIMARY KEY (`sms_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `cdr_id` (`cdr_id`),
  ADD KEY `mobile` (`mobile`),
  ADD KEY `sentdate` (`sentdate`);

--
-- Indexes for table `tf_sms_server`
--
ALTER TABLE `tf_sms_server`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `tf_socket_server`
--
ALTER TABLE `tf_socket_server`
  ADD PRIMARY KEY (`server_id`);

--
-- Indexes for table `tf_sound_library`
--
ALTER TABLE `tf_sound_library`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_source_master`
--
ALTER TABLE `tf_source_master`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `tf_state`
--
ALTER TABLE `tf_state`
  ADD PRIMARY KEY (`state_id`);

--
-- Indexes for table `tf_subscription`
--
ALTER TABLE `tf_subscription`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `tf_supervisor_agents`
--
ALTER TABLE `tf_supervisor_agents`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `HuntGroupID` (`supervisor_account_id`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `AgentID` (`AgentID`);

--
-- Indexes for table `tf_support`
--
ALTER TABLE `tf_support`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_Tele_Digital_Ads_Package`
--
ALTER TABLE `tf_Tele_Digital_Ads_Package`
  ADD PRIMARY KEY (`Adspackage_id`);

--
-- Indexes for table `tf_Tele_Digital_Package`
--
ALTER TABLE `tf_Tele_Digital_Package`
  ADD PRIMARY KEY (`Digital_ID`);

--
-- Indexes for table `tf_Tele_Mail_Package`
--
ALTER TABLE `tf_Tele_Mail_Package`
  ADD PRIMARY KEY (`Mail_ID`);

--
-- Indexes for table `tf_Tele_Meet_Package`
--
ALTER TABLE `tf_Tele_Meet_Package`
  ADD PRIMARY KEY (`Meet_ID`);

--
-- Indexes for table `tf_Tele_SMS_Package`
--
ALTER TABLE `tf_Tele_SMS_Package`
  ADD PRIMARY KEY (`SMS_ID`);

--
-- Indexes for table `tf_temp_login_logout`
--
ALTER TABLE `tf_temp_login_logout`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_temp_payment_transaction`
--
ALTER TABLE `tf_temp_payment_transaction`
  ADD PRIMARY KEY (`pay_id`);

--
-- Indexes for table `tf_textaudio_numbers`
--
ALTER TABLE `tf_textaudio_numbers`
  ADD PRIMARY KEY (`nid`),
  ADD KEY `status` (`status`),
  ADD KEY `accountid` (`accountid`);

--
-- Indexes for table `tf_thirdpartyapi_log`
--
ALTER TABLE `tf_thirdpartyapi_log`
  ADD PRIMARY KEY (`aid`);

--
-- Indexes for table `tf_tickets`
--
ALTER TABLE `tf_tickets`
  ADD PRIMARY KEY (`ticket_id`);

--
-- Indexes for table `tf_ticket_timeline`
--
ALTER TABLE `tf_ticket_timeline`
  ADD PRIMARY KEY (`t_id`),
  ADD KEY `lead_id` (`ticket_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `created_time` (`created_time`);

--
-- Indexes for table `tf_tmp_agent`
--
ALTER TABLE `tf_tmp_agent`
  ADD PRIMARY KEY (`tid`),
  ADD KEY `uid` (`uid`),
  ADD KEY `lastdate` (`lastdate`),
  ADD KEY `aid` (`aid`),
  ADD KEY `account_name` (`account_name`);

--
-- Indexes for table `tf_tmp_user`
--
ALTER TABLE `tf_tmp_user`
  ADD PRIMARY KEY (`userid`);

--
-- Indexes for table `tf_tmp_user_kyc`
--
ALTER TABLE `tf_tmp_user_kyc`
  ADD PRIMARY KEY (`kycid`);

--
-- Indexes for table `tf_Tollfree_Package`
--
ALTER TABLE `tf_Tollfree_Package`
  ADD PRIMARY KEY (`TFree_id`);

--
-- Indexes for table `tf_transfer_agent_log`
--
ALTER TABLE `tf_transfer_agent_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_trans_otp_campaigns`
--
ALTER TABLE `tf_trans_otp_campaigns`
  ADD PRIMARY KEY (`sms_camid`);

--
-- Indexes for table `tf_triggers`
--
ALTER TABLE `tf_triggers`
  ADD PRIMARY KEY (`t_id`);

--
-- Indexes for table `tf_triggers_action`
--
ALTER TABLE `tf_triggers_action`
  ADD PRIMARY KEY (`a_id`);

--
-- Indexes for table `tf_unsubscribe_email`
--
ALTER TABLE `tf_unsubscribe_email`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_url_shortner`
--
ALTER TABLE `tf_url_shortner`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `tf_url_shortner_analytics`
--
ALTER TABLE `tf_url_shortner_analytics`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `tf_vendor`
--
ALTER TABLE `tf_vendor`
  ADD PRIMARY KEY (`ven_id`);

--
-- Indexes for table `tf_verify_mobile`
--
ALTER TABLE `tf_verify_mobile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_visitor_traking`
--
ALTER TABLE `tf_visitor_traking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_wallet_transaction`
--
ALTER TABLE `tf_wallet_transaction`
  ADD PRIMARY KEY (`trans_id`);

--
-- Indexes for table `tf_whatsapp_template`
--
ALTER TABLE `tf_whatsapp_template`
  ADD PRIMARY KEY (`wtemp_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `status` (`status`),
  ADD KEY `add_date` (`add_date`);

--
-- Indexes for table `tf_zoho_access_code`
--
ALTER TABLE `tf_zoho_access_code`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_zoho_code`
--
ALTER TABLE `tf_zoho_code`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tf_zoho_user`
--
ALTER TABLE `tf_zoho_user`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `wf_user`
--
ALTER TABLE `wf_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agent_performance_report`
--
ALTER TABLE `agent_performance_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `almond_age_negative`
--
ALTER TABLE `almond_age_negative`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `almond_caller_registration`
--
ALTER TABLE `almond_caller_registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `HuntGroup`
--
ALTER TABLE `HuntGroup`
  MODIFY `GroupID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `HuntGroupDetail`
--
ALTER TABLE `HuntGroupDetail`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `IvrBuilder`
--
ALTER TABLE `IvrBuilder`
  MODIFY `BuilderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `series`
--
ALTER TABLE `series`
  MODIFY `ser_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_ads`
--
ALTER TABLE `td_ads`
  MODIFY `Ad_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_adset`
--
ALTER TABLE `td_adset`
  MODIFY `A_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_ads_insights`
--
ALTER TABLE `td_ads_insights`
  MODIFY `i_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_ads_leads`
--
ALTER TABLE `td_ads_leads`
  MODIFY `lid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_audience`
--
ALTER TABLE `td_audience`
  MODIFY `A_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_brand`
--
ALTER TABLE `td_brand`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_bucket`
--
ALTER TABLE `td_bucket`
  MODIFY `B_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_bucket_file`
--
ALTER TABLE `td_bucket_file`
  MODIFY `F_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_campaigns`
--
ALTER TABLE `td_campaigns`
  MODIFY `cam_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_category`
--
ALTER TABLE `td_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_channels`
--
ALTER TABLE `td_channels`
  MODIFY `channel_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_chat`
--
ALTER TABLE `td_chat`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_chat_details`
--
ALTER TABLE `td_chat_details`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_customer_accesstoken`
--
ALTER TABLE `td_customer_accesstoken`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_CTA_clicks`
--
ALTER TABLE `td_fbpage_CTA_clicks`
  MODIFY `cta_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_engagement`
--
ALTER TABLE `td_fbpage_engagement`
  MODIFY `en_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_impression`
--
ALTER TABLE `td_fbpage_impression`
  MODIFY `im_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_post`
--
ALTER TABLE `td_fbpage_post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_reactions`
--
ALTER TABLE `td_fbpage_reactions`
  MODIFY `reaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_story`
--
ALTER TABLE `td_fbpage_story`
  MODIFY `data_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_user_demographics`
--
ALTER TABLE `td_fbpage_user_demographics`
  MODIFY `data_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_video_views`
--
ALTER TABLE `td_fbpage_video_views`
  MODIFY `data_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fbpage_views`
--
ALTER TABLE `td_fbpage_views`
  MODIFY `data_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fb_lead_thirdparty`
--
ALTER TABLE `td_fb_lead_thirdparty`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fb_likes_count`
--
ALTER TABLE `td_fb_likes_count`
  MODIFY `F_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_fb_unique_audience`
--
ALTER TABLE `td_fb_unique_audience`
  MODIFY `unique_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_gmb_credential`
--
ALTER TABLE `td_gmb_credential`
  MODIFY `F_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_gmb_data`
--
ALTER TABLE `td_gmb_data`
  MODIFY `g_data` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_messages`
--
ALTER TABLE `td_messages`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_messages_user`
--
ALTER TABLE `td_messages_user`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_monitor`
--
ALTER TABLE `td_monitor`
  MODIFY `feed_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_monitor_posts`
--
ALTER TABLE `td_monitor_posts`
  MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_monitor_posts_attachments`
--
ALTER TABLE `td_monitor_posts_attachments`
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_monitor_posts_comment`
--
ALTER TABLE `td_monitor_posts_comment`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_publish_posts`
--
ALTER TABLE `td_publish_posts`
  MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_publish_posts_attachments`
--
ALTER TABLE `td_publish_posts_attachments`
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_publish_posts_comment`
--
ALTER TABLE `td_publish_posts_comment`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_publish_posts_share`
--
ALTER TABLE `td_publish_posts_share`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_request_otp`
--
ALTER TABLE `td_request_otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_schedule_post`
--
ALTER TABLE `td_schedule_post`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_schedule_post_channel`
--
ALTER TABLE `td_schedule_post_channel`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_schedule_post_file`
--
ALTER TABLE `td_schedule_post_file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_social_access`
--
ALTER TABLE `td_social_access`
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_users`
--
ALTER TABLE `td_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_user_assign_brand`
--
ALTER TABLE `td_user_assign_brand`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `td_webhook_key`
--
ALTER TABLE `td_webhook_key`
  MODIFY `w_key` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `temp_email_send`
--
ALTER TABLE `temp_email_send`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test_tab`
--
ALTER TABLE `test_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_account_table`
--
ALTER TABLE `tf_account_table`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_account_table_04_07_2022`
--
ALTER TABLE `tf_account_table_04_07_2022`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_account_table_13-07-2022`
--
ALTER TABLE `tf_account_table_13-07-2022`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_account_table_14_07_2022`
--
ALTER TABLE `tf_account_table_14_07_2022`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_activity_logs`
--
ALTER TABLE `tf_activity_logs`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agentlead`
--
ALTER TABLE `tf_agentlead`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_assignlead`
--
ALTER TABLE `tf_agent_assignlead`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_assignleadsms`
--
ALTER TABLE `tf_agent_assignleadsms`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_assignmaillead`
--
ALTER TABLE `tf_agent_assignmaillead`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_digitalassignlead`
--
ALTER TABLE `tf_agent_digitalassignlead`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_location`
--
ALTER TABLE `tf_agent_location`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_loginlogout_report`
--
ALTER TABLE `tf_agent_loginlogout_report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_missedcall`
--
ALTER TABLE `tf_agent_missedcall`
  MODIFY `mid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_agent_sip_account`
--
ALTER TABLE `tf_agent_sip_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_assign_sms_server`
--
ALTER TABLE `tf_assign_sms_server`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_asterisk_server`
--
ALTER TABLE `tf_asterisk_server`
  MODIFY `server_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_block_number`
--
ALTER TABLE `tf_block_number`
  MODIFY `num_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_breaktime`
--
ALTER TABLE `tf_breaktime`
  MODIFY `break_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_bulkupload_calender_request`
--
ALTER TABLE `tf_bulkupload_calender_request`
  MODIFY `fid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_bulkupload_request`
--
ALTER TABLE `tf_bulkupload_request`
  MODIFY `fid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_callingpausetime`
--
ALTER TABLE `tf_callingpausetime`
  MODIFY `pause_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_call_disposition_manager`
--
ALTER TABLE `tf_call_disposition_manager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_call_disposition_supervisor`
--
ALTER TABLE `tf_call_disposition_supervisor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_call_hold_duration`
--
ALTER TABLE `tf_call_hold_duration`
  MODIFY `h_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_call_review_form`
--
ALTER TABLE `tf_call_review_form`
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_call_summary_report`
--
ALTER TABLE `tf_call_summary_report`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_campaigns`
--
ALTER TABLE `tf_campaigns`
  MODIFY `camid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_campaigns_agent`
--
ALTER TABLE `tf_campaigns_agent`
  MODIFY `camagid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_campaigns_did`
--
ALTER TABLE `tf_campaigns_did`
  MODIFY `cam_did` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_campaigns_numbers`
--
ALTER TABLE `tf_campaigns_numbers`
  MODIFY `numid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_campaigns_numbers_warehouse`
--
ALTER TABLE `tf_campaigns_numbers_warehouse`
  MODIFY `numid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_campaigns_warehouse`
--
ALTER TABLE `tf_campaigns_warehouse`
  MODIFY `camid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_campaign_schedule`
--
ALTER TABLE `tf_campaign_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_careers`
--
ALTER TABLE `tf_careers`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_cdr`
--
ALTER TABLE `tf_cdr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_cdr_live_request`
--
ALTER TABLE `tf_cdr_live_request`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_cdr_request`
--
ALTER TABLE `tf_cdr_request`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_cdr_request_nexxbase`
--
ALTER TABLE `tf_cdr_request_nexxbase`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_cdr_warehouse`
--
ALTER TABLE `tf_cdr_warehouse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_channel`
--
ALTER TABLE `tf_channel`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_channelusages`
--
ALTER TABLE `tf_channelusages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_channelusages_airtel`
--
ALTER TABLE `tf_channelusages_airtel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_channelusages_new`
--
ALTER TABLE `tf_channelusages_new`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_clicktocall`
--
ALTER TABLE `tf_clicktocall`
  MODIFY `clickid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_conference`
--
ALTER TABLE `tf_conference`
  MODIFY `conf_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_conference_member`
--
ALTER TABLE `tf_conference_member`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_conference_member_record`
--
ALTER TABLE `tf_conference_member_record`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_configuration`
--
ALTER TABLE `tf_configuration`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_configuration_calender`
--
ALTER TABLE `tf_configuration_calender`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_contacts_meta`
--
ALTER TABLE `tf_contacts_meta`
  MODIFY `meta_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_currency`
--
ALTER TABLE `tf_currency`
  MODIFY `currency_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_destination`
--
ALTER TABLE `tf_destination`
  MODIFY `dest_id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_dholera_leads_upload_file`
--
ALTER TABLE `tf_dholera_leads_upload_file`
  MODIFY `F_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_did`
--
ALTER TABLE `tf_did`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_did_numbers`
--
ALTER TABLE `tf_did_numbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_emailsms_configuration`
--
ALTER TABLE `tf_emailsms_configuration`
  MODIFY `config_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_emailtemplate`
--
ALTER TABLE `tf_emailtemplate`
  MODIFY `email_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_emailtemplate_attachment`
--
ALTER TABLE `tf_emailtemplate_attachment`
  MODIFY `attach_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_email_camapgin_number`
--
ALTER TABLE `tf_email_camapgin_number`
  MODIFY `numid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_email_campagin`
--
ALTER TABLE `tf_email_campagin`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_email_campaign_links`
--
ALTER TABLE `tf_email_campaign_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_email_links`
--
ALTER TABLE `tf_email_links`
  MODIFY `sl_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_email_server`
--
ALTER TABLE `tf_email_server`
  MODIFY `server_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_erp_customer`
--
ALTER TABLE `tf_erp_customer`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_erp_taxes`
--
ALTER TABLE `tf_erp_taxes`
  MODIFY `taxes_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_erp_whatsapp`
--
ALTER TABLE `tf_erp_whatsapp`
  MODIFY `w_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_feedbackforms`
--
ALTER TABLE `tf_feedbackforms`
  MODIFY `fid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_feedbackform_data`
--
ALTER TABLE `tf_feedbackform_data`
  MODIFY `fdid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_feedbackform_meta`
--
ALTER TABLE `tf_feedbackform_meta`
  MODIFY `mid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_fileupload_request`
--
ALTER TABLE `tf_fileupload_request`
  MODIFY `fid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_fileupload_request_email`
--
ALTER TABLE `tf_fileupload_request_email`
  MODIFY `fid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_fileupload_request_sms`
--
ALTER TABLE `tf_fileupload_request_sms`
  MODIFY `fid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_getivrinput`
--
ALTER TABLE `tf_getivrinput`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_get_offers`
--
ALTER TABLE `tf_get_offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_header_footer_setting`
--
ALTER TABLE `tf_header_footer_setting`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_hold_calling_reason`
--
ALTER TABLE `tf_hold_calling_reason`
  MODIFY `reason_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_issue_type`
--
ALTER TABLE `tf_issue_type`
  MODIFY `issue_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_kyc`
--
ALTER TABLE `tf_kyc`
  MODIFY `kyc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_landing_page`
--
ALTER TABLE `tf_landing_page`
  MODIFY `landing_pageid` int(11) NOT NULL AUTO_INCREMENT;


-- --------------------------------------------------------

--
-- Table structure for table `tf_leads`
--

CREATE TABLE `tf_leads` (
  `l_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `owner` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `lead_owner` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `lead_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `modified_by` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `description` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `expected_closing` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `priority` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `company_name` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `status` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `salutation` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `email_id` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `designation` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `gender` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `source` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `campaign_name` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `contact_by` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `contact_date` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `ends_on` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `address_type` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `state` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `address` text COLLATE utf8_unicode_ci,
  `address_title` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `country` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `address_line1` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `pincode` int(11) DEFAULT NULL,
  `address_line2` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `city` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `county` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `phone` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `mobile_no` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `fax` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `type` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `company` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `market_segment` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `notes` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `website` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `industry` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `request_type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `product` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_sync` enum('no','yes') CHARACTER SET latin1 DEFAULT 'no',
  `customer` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `image` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `doctype` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `title` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `currency` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `probability` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `opportunity_amount` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `sales_order_id` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `sales_order_name` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `ads_id` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `ads_name` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `ads_keyword` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `ad_leadid` int(11) DEFAULT NULL,
  `is_done` int(2) DEFAULT '0',
  `is_deleted` enum('no','yes') CHARACTER SET latin1 DEFAULT NULL,
  `zohoid` varchar(30) CHARACTER SET latin1 DEFAULT NULL,
  `whatsapp_number` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL,
  `completed_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Indexes for table `tf_leads`
--
ALTER TABLE `tf_leads`
  ADD PRIMARY KEY (`l_id`),
  ADD KEY `User_id` (`User_id`),
  ADD KEY `agent_id` (`agent_id`),
  ADD KEY `lead_owner` (`lead_owner`),
  ADD KEY `status` (`status`),
  ADD KEY `is_sync` (`is_sync`),
  ADD KEY `name` (`name`),
  ADD KEY `mobile_no` (`mobile_no`),
  ADD KEY `lead_name` (`lead_name`),
  ADD KEY `creation` (`creation`),
  ADD KEY `email_id` (`email_id`),
  ADD KEY `source` (`source`),
  ADD KEY `city` (`city`),
  ADD KEY `ads_id` (`ads_id`),
  ADD KEY `is_done` (`is_done`),
  ADD KEY `modified` (`modified`),
  ADD KEY `doctype` (`doctype`),
  ADD KEY `opportunity_amount` (`opportunity_amount`),
  ADD KEY `ad_leadid` (`ad_leadid`),
  ADD KEY `is_deleted` (`is_deleted`);


--
-- AUTO_INCREMENT for table `tf_leads`
--
ALTER TABLE `tf_leads`
  MODIFY `l_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_leads_email`
--
ALTER TABLE `tf_leads_email`
  MODIFY `e_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_leads_upload_file`
--
ALTER TABLE `tf_leads_upload_file`
  MODIFY `F_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_comment`
--
ALTER TABLE `tf_lead_comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_country`
--
ALTER TABLE `tf_lead_country`
  MODIFY `country_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_deal_done`
--
ALTER TABLE `tf_lead_deal_done`
  MODIFY `deal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_master_status`
--
ALTER TABLE `tf_lead_master_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_quotation`
--
ALTER TABLE `tf_lead_quotation`
  MODIFY `quotation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_quotation_item`
--
ALTER TABLE `tf_lead_quotation_item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_stage`
--
ALTER TABLE `tf_lead_stage`
  MODIFY `s_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_stage_status`
--
ALTER TABLE `tf_lead_stage_status`
  MODIFY `St_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_tags`
--
ALTER TABLE `tf_lead_tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_tag_supervisor`
--
ALTER TABLE `tf_lead_tag_supervisor`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_lead_timeline`
--
ALTER TABLE `tf_lead_timeline`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_loginactivity`
--
ALTER TABLE `tf_loginactivity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_managerotp`
--
ALTER TABLE `tf_managerotp`
  MODIFY `otp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_manager_api`
--
ALTER TABLE `tf_manager_api`
  MODIFY `api_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_manager_api_data`
--
ALTER TABLE `tf_manager_api_data`
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_manager_email_server`
--
ALTER TABLE `tf_manager_email_server`
  MODIFY `server_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_manager_review_rate`
--
ALTER TABLE `tf_manager_review_rate`
  MODIFY `rate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_manager_settings`
--
ALTER TABLE `tf_manager_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_market_segement`
--
ALTER TABLE `tf_market_segement`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_notifications`
--
ALTER TABLE `tf_notifications`
  MODIFY `noti_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_obd_account`
--
ALTER TABLE `tf_obd_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_obd_asterisk_server`
--
ALTER TABLE `tf_obd_asterisk_server`
  MODIFY `server_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_obd_did`
--
ALTER TABLE `tf_obd_did`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_opportunity`
--
ALTER TABLE `tf_opportunity`
  MODIFY `op_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_packages`
--
ALTER TABLE `tf_packages`
  MODIFY `package_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_payment_transaction`
--
ALTER TABLE `tf_payment_transaction`
  MODIFY `pay_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_pixceldata`
--
ALTER TABLE `tf_pixceldata`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_products`
--
ALTER TABLE `tf_products`
  MODIFY `productid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_products_catalogue`
--
ALTER TABLE `tf_products_catalogue`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_products_docs`
--
ALTER TABLE `tf_products_docs`
  MODIFY `product_doc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_products_images`
--
ALTER TABLE `tf_products_images`
  MODIFY `product_image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_product_attributes`
--
ALTER TABLE `tf_product_attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_product_email`
--
ALTER TABLE `tf_product_email`
  MODIFY `emailid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_product_group`
--
ALTER TABLE `tf_product_group`
  MODIFY `pg_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_product_sms`
--
ALTER TABLE `tf_product_sms`
  MODIFY `smsid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_product_whatsapp`
--
ALTER TABLE `tf_product_whatsapp`
  MODIFY `smsid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_promo_code`
--
ALTER TABLE `tf_promo_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_queuecall`
--
ALTER TABLE `tf_queuecall`
  MODIFY `qid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_quotation`
--
ALTER TABLE `tf_quotation`
  MODIFY `q_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_recordingrequest`
--
ALTER TABLE `tf_recordingrequest`
  MODIFY `r_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_recordingrequest_number`
--
ALTER TABLE `tf_recordingrequest_number`
  MODIFY `nid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_report_master`
--
ALTER TABLE `tf_report_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_report_req`
--
ALTER TABLE `tf_report_req`
  MODIFY `reqid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_contact`
--
ALTER TABLE `tf_request_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_contact_feedback`
--
ALTER TABLE `tf_request_contact_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_otp`
--
ALTER TABLE `tf_request_otp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_signup`
--
ALTER TABLE `tf_request_signup`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_teledigital`
--
ALTER TABLE `tf_request_teledigital`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_teledigital_feedback`
--
ALTER TABLE `tf_request_teledigital_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_telemail`
--
ALTER TABLE `tf_request_telemail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_telemail_feedback`
--
ALTER TABLE `tf_request_telemail_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_telesms`
--
ALTER TABLE `tf_request_telesms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_request_telesms_feedback`
--
ALTER TABLE `tf_request_telesms_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_scheduler`
--
ALTER TABLE `tf_scheduler`
  MODIFY `s_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_schedule_meeting`
--
ALTER TABLE `tf_schedule_meeting`
  MODIFY `meetingid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_schedule_report`
--
ALTER TABLE `tf_schedule_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sendemail`
--
ALTER TABLE `tf_sendemail`
  MODIFY `send_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sendsms`
--
ALTER TABLE `tf_sendsms`
  MODIFY `send_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_services`
--
ALTER TABLE `tf_services`
  MODIFY `s_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_settings`
--
ALTER TABLE `tf_settings`
  MODIFY `s_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_shifttime`
--
ALTER TABLE `tf_shifttime`
  MODIFY `shift_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_smscampagis`
--
ALTER TABLE `tf_smscampagis`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_smstemplate`
--
ALTER TABLE `tf_smstemplate`
  MODIFY `sms_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sms_campagins_number`
--
ALTER TABLE `tf_sms_campagins_number`
  MODIFY `numid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sms_configuration`
--
ALTER TABLE `tf_sms_configuration`
  MODIFY `config_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sms_links`
--
ALTER TABLE `tf_sms_links`
  MODIFY `sl_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sms_report`
--
ALTER TABLE `tf_sms_report`
  MODIFY `sms_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sms_server`
--
ALTER TABLE `tf_sms_server`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_socket_server`
--
ALTER TABLE `tf_socket_server`
  MODIFY `server_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_sound_library`
--
ALTER TABLE `tf_sound_library`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_source_master`
--
ALTER TABLE `tf_source_master`
  MODIFY `s_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_state`
--
ALTER TABLE `tf_state`
  MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_subscription`
--
ALTER TABLE `tf_subscription`
  MODIFY `s_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_supervisor_agents`
--
ALTER TABLE `tf_supervisor_agents`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_support`
--
ALTER TABLE `tf_support`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_temp_login_logout`
--
ALTER TABLE `tf_temp_login_logout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_temp_payment_transaction`
--
ALTER TABLE `tf_temp_payment_transaction`
  MODIFY `pay_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_textaudio_numbers`
--
ALTER TABLE `tf_textaudio_numbers`
  MODIFY `nid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_thirdpartyapi_log`
--
ALTER TABLE `tf_thirdpartyapi_log`
  MODIFY `aid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_tickets`
--
ALTER TABLE `tf_tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_ticket_timeline`
--
ALTER TABLE `tf_ticket_timeline`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_tmp_agent`
--
ALTER TABLE `tf_tmp_agent`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_tmp_user`
--
ALTER TABLE `tf_tmp_user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_tmp_user_kyc`
--
ALTER TABLE `tf_tmp_user_kyc`
  MODIFY `kycid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_transfer_agent_log`
--
ALTER TABLE `tf_transfer_agent_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_trans_otp_campaigns`
--
ALTER TABLE `tf_trans_otp_campaigns`
  MODIFY `sms_camid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_triggers`
--
ALTER TABLE `tf_triggers`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_triggers_action`
--
ALTER TABLE `tf_triggers_action`
  MODIFY `a_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_unsubscribe_email`
--
ALTER TABLE `tf_unsubscribe_email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_url_shortner`
--
ALTER TABLE `tf_url_shortner`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_url_shortner_analytics`
--
ALTER TABLE `tf_url_shortner_analytics`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_vendor`
--
ALTER TABLE `tf_vendor`
  MODIFY `ven_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_verify_mobile`
--
ALTER TABLE `tf_verify_mobile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_visitor_traking`
--
ALTER TABLE `tf_visitor_traking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_wallet_transaction`
--
ALTER TABLE `tf_wallet_transaction`
  MODIFY `trans_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_whatsapp_template`
--
ALTER TABLE `tf_whatsapp_template`
  MODIFY `wtemp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_zoho_access_code`
--
ALTER TABLE `tf_zoho_access_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_zoho_code`
--
ALTER TABLE `tf_zoho_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tf_zoho_user`
--
ALTER TABLE `tf_zoho_user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wf_user`
--
ALTER TABLE `wf_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
