import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErpService } from '../../erp.service';

@Component({
  selector: 'app-deal-done',
  templateUrl: './deal-done.component.html',
  styleUrls: ['./deal-done.component.css']
})
export class DealDoneComponent implements OnInit {
  public addForm: FormGroup;
  companies = [];
  projects = [];
  dealers = [];
  leadgenerators = [];
  plotnumbers = [];
  projectname = '';
  schemes = [];
  private debouncedTimeout;
  leaddetail = [];
  disabled = false;
  constructor(
    public dialogRef: MatDialogRef<DealDoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ManagerService: ManagerService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private erpservice: ErpService
  ) { }

  ngOnInit(): void {
    this.getCompany()
    this.getDealers()
    this.getLeadGenerator()
    this.addForm = this.fb.group({
      lead_id: [this.data['leadid']],
      dealdonedate: [new Date(), [Validators.required]],
      name: ['', [Validators.required]],
      email: [''],
      dob: [''],
      address: [''],
      city: [''],
      pincode: [''],
      country: [''],
      dealerid: [''],
      refclient: [''],
      company: [''],
      project: ['', [Validators.required]],
      proposal: [''],
      scheme: [''],
      plotnumber: [''],
      plotarea: [''],
      plotrate: [''],
      plotvalue: [''],
      discountvalue: [''],
      bookingamount: ['', [Validators.required]],
      paymentmode: [''],
      paymentdate: [''],
      nomineename: [''],
      nomineerelation: [''],
      nomineephoneno: [''],
      phaseno: ['']
    });
    this.getlead();
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
  getCompany() {
    this.ManagerService.getDholaraCompany().then(
      data => {
        this.companies = (data['data'].data);
      },
      err => {
        console.log('error');
      }
    );
  }
  getProject(id) {
    //console.log(id)
    this.ManagerService.getDholeraProjects(id).then(
      data => {
        // console.log(data['data'].data);
        this.projects = (data['data'].data);
      },
      err => {
        console.log('error');
      }
    );
  }
  getlead() {
    this.erpservice.getLeadDetail(this.data['leadid']).then(
      data => {
        if (data['data'].length > 0) {
          this.leaddetail = data['data'][0];
          this.addForm = this.fb.group({
            lead_id: [this.data['leadid']],
            dealdonedate: [new Date(), [Validators.required]],
            name: [data['data'][0]['lead_name']],
            email: [data['data'][0]['email_id']],
            dob: [''],
            address: [data['data'][0]['address_line1']],
            city: [data['data'][0]['city']],
            pincode: [data['data'][0]['pincode']],
            country: [data['data'][0]['county']],
            dealerid: [''],
            refclient: [''],
            company: [''],
            project: ['', [Validators.required]],
            proposal: [''],
            scheme: [''],
            plotnumber: [''],
            plotarea: [''],
            plotrate: [''],
            plotvalue: [''],
            discountvalue: [''],
            bookingamount: ['', [Validators.required]],
            paymentmode: [''],
            paymentdate: [''],
            nomineename: [''],
            nomineerelation: [''],
            nomineephoneno: [''],
            phaseno: ['']
          });

        }
      },
      err => {
        console.log('error');
      }
    );
  }

  getPlotNumber(id) {
    var idstring = id.split("-");
    var id = idstring[0];
    this.projectname = idstring[1];
    //console.log(id);
    this.ManagerService.getDholeraPlotNumbers(id).then(
      data => {
        //console.log(data['data'].data);
        this.plotnumbers = (data['data'].data);
      },
      err => {
        console.log('error');
      }
    );
    this.ManagerService.getDholeraPlotProposals(idstring[1]).then(
      data => {
        //console.log(data['data'].data);
        this.schemes = (data['data'].data);
      },
      err => {
        console.log('error');
      }
    );
  }

  getDealers() {
    this.ManagerService.getDholeraDealers().then(
      data => {
        this.dealers = (data['data'].data);
      },
      err => {
        console.log('error');
      }
    );
  }

  getLeadGenerator() {
    this.ManagerService.getLeadGenerator().then(
      data => {
        //console.log(data['data'].data);
        this.leadgenerators = (data['data'].data);
      },
      err => {
        console.log('error');
      }
    );
  }


  submit() {
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      this.disabled = true;
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); //console.log(data);
      data.projectname = this.projectname;
      this.ManagerService.saveLeadDealDoneData(data).then(
        data => {
          //console.log(data['data']);
          this.disabled=false;

          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.dialogRef.close({ event: 'Add' });
        },
        err => {
          console.log('error');
        }
      );
    }
  }
}
