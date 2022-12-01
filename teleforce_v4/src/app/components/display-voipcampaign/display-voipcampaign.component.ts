import { Component, OnInit , ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateVoipcampaignComponent } from '../create-voipcampaign/create-voipcampaign.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ThrowStmt } from '@angular/compiler';
import { CampaignService } from '../../campaign.service';
import { ManagerService } from '../../manager.service';
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import { UserService } from '../../user.service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-display-voipcampaign',
  templateUrl: './display-voipcampaign.component.html',
  styleUrls: ['./display-voipcampaign.component.css']
})
export class DisplayVoipcampaignComponent implements OnInit {

  collection = { count: 0, data: [] };
  public dataSource: MatTableDataSource<any>;
  displayedColumns = ["id", "date", "name", "type", "method", "status" , "action"];
  contactLength = 0;
  isLoadingcon = true;
  isLoading = true;
  campaigns = [];
  progressivedialer=false;
  kyc;
  constructor(public dialog: MatDialog, private http: HttpClient,
    private toastr: ToastrService,
    private campaignservice: CampaignService,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private userservice: UserService,
    private router: Router
  ) { }
  @ViewChild(MatSort) sort: MatSort;


  ngOnInit(): void {
  
  var userid = localStorage.getItem('access_id');
  this.checkkyc(userid);
  this.getCampaigns();
  this.dataSource = new MatTableDataSource();
  this.getManagerDetail(userid);

  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateVoipcampaignComponent, {
      width: '640px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getCampaigns();
      }
    });

  }

  async getCampaigns() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.getallcampaign(userinfo).then(data => {
      if (data) {
        this.collection.count = data['count'];
        this.collection.data = data['data'];
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  changeaction(camid, action) {
    if (confirm("Are you sure to perform action ?")) {
      let formData = { camid: camid, action: action };
      this.http.post(environment.apiUrl + "/contacts/changeaction", formData)
        .subscribe(res => {
          this._snackBar.open('Campaign action updated succesfully.', '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getCampaigns();
        });
    }
  }

  async deleteagentdialog(cont_id) {
    if (confirm("Are you sure to delete?")) {
      await this.campaignservice.deletecampaignlist(cont_id).then(data => {
        this._snackBar.open('Campaign Delete succesfully.', '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.getCampaigns();
      },
        err => {
          console.log('error');
        })
    }
  }

  async getManagerDetail(userid){
    await this.managerservice.getManagerDetail(userid).then(
      data => {
       if (data['data']['services'].length > 1) {
        //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for(var i=0;i<data['data']['services'].length;i++ ){            
            if(serviceArr[i]=='6'){
              this.progressivedialer = true;
            }
          }
        }else{
          var service = data['data']['services'];
          if(service=='6'){
            this.progressivedialer = true;
          }
        }  
      },
      err => {
        console.log('error');
      }
    );
  }

  async checkkyc(id){
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
        }else{
          this.router.navigate(['/kyc-document-upload']);
        }        
      },
      err => {
        console.log('error');
      }
    );
  }


}
