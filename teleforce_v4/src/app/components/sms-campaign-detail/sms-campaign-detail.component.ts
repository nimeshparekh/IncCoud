import { Component, OnInit, ViewChild } from '@angular/core';
import { SmscampaignService } from "../../smscampaign.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sms-campaign-detail',
  templateUrl: './sms-campaign-detail.component.html',
  styleUrls: ['./sms-campaign-detail.component.css']
})
export class SmsCampaignDetailComponent implements OnInit {

  campaignid = this.route.snapshot.paramMap.get('id');
  campaignname = '';
  campaigndetail;
  segments = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'segment', 'name', 'email', 'mobile', 'action'];
  Length = 0;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private smscampaignservice: SmscampaignService,
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.getCampaignName(this.campaignid);
    this.getSMSCampaignSegment(this.campaignid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getSMSCampaignContactList(this.campaignid);
  }

  async getCampaignName(campaignid) {
    await this.smscampaignservice.getSMSCampaignDetail(campaignid).then(
      data => {
        this.campaigndetail = data['data'];
        this.campaignname = data['data']['sms_title'];
      },
      err => {
        console.log('error');
      })
  }

  async getSMSCampaignSegment(campaignid) {
    await this.smscampaignservice.getSMSCampaignSegment(campaignid).then(
      data => {
        this.segments = data['data'];
      },
      err => {
        console.log('error');
      })
  }

  async getSMSCampaignContactList(campaignid) {
    await this.smscampaignservice.getSMSCampaignContactList(campaignid).then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      })
  }
  async deleteData(numid) {
    if (confirm('Are you sure to delete this?')) {
      await this.smscampaignservice.deleteCampaignContact(numid).then(
        data => {
          this.getSMSCampaignContactList(this.campaignid);
        },
        err => {
          console.log('error');
        })
    }

  }



}
