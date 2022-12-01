import { Component, OnInit, Inject, ViewChild,ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateAdminEmailComponent } from '../create-admin-email/create-admin-email.component'
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-consultant-list',
  templateUrl: './consultant-list.component.html',
  styleUrls: ['./consultant-list.component.css']
})
export class ConsultantListComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'email', 'mobile', 'joindate', 'gender', 'action'];
  Length = 0;
  isLoading = true;
  constructor(private userservice: UserService, public dialog: MatDialog) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;


  /*constructor(
    private fb: FormBuilder,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient) { }*/

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.getdata();
    /*this.dataSource.data = [{"id":"186","name":"Pc -Suraj P Jain","email":"jainsuraj29@gmail.com","mobile":"9687796144","officialmobile":"","area":"","city":"Ahmedabad","gender":"Male","username":"9687796144","password":"9687796144","joiningdate":"2018-04-02","status":"Active","parent":"0","state":"","acrmemployeeid":""}];
        this.Length = 1;
        this.isLoading = false;*/
  }

  Createdialog() {
    const dialogRef = this.dialog.open(CreateConsultantComponent, {
      width: '1200px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }
  updatedialog(id) {
    const dialogRef = this.dialog.open(CreateConsultantComponent, {
      width: '1200px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  getdata() {
    this.userservice.getAgentConsultantData().then(
      data => {
        //console.log(data['data']['data']);
        if(data['data']['data']){
          this.dataSource.data = data['data']['data'];
          this.Length = data['data']['data'].length;
          this.isLoading = false;
        }
       
      },
      err => {
        console.log('error');
      }
    );
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}

@Component({
  selector: 'create-consultant',
  templateUrl: 'create-consultant.component.html',
  styleUrls: ['./consultant-list.component.css']
})
export class CreateConsultantComponent {
  agentgroup = [];
  public addForm: FormGroup;
  feedback;
  formname = '';
  agents = [];
  addmode = true;
  editmode = false;
  photoimage;
  old_photoimage;
  isLoading=false;
  constructor(
    public dialogRef: MatDialogRef<CreateConsultantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConsultantListComponent,
    public userservice: UserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    //console.log(this.data);
    //this.getGroup();
    console.log(this.data);
    let userid = localStorage.getItem('access_id');

    this.addForm = this.fb.group({
      joiningdate: [new Date()],
      name: [null],
      mobile: [null],
      email: [null],
      officialmobile: [null],
      area: [null],
      city: [null],
      gender: [null],
      username: [null],
      password: [null],
      state: [null],
      agentid: [userid]
    });
    //console.log(this.addmode+"::"+this.editmode);
    if (this.data) {
      this.addmode = false;
      this.editmode = true;
      this.getDetail(this.data);
    }
  }

  onNoClick1(): void {
    this.dialogRef.close();
  }

  getDetail(id) {
    this.userservice.getAgentConsultantDetail(id).then(
      data => {
        console.log();
        if(data['data']['data'][0]['joiningdate']!="0000-00-00" || data['data']['data'][0]['joiningdate']!=null){
          var joindate='';
        }else{
          var joindate=data['data']['data'][0]['joiningdate'];
        }
        this.addForm = this.fb.group({
          joiningdate: [joindate],
          name: [data['data']['data'][0]['name']],
          mobile: [data['data']['data'][0]['mobile']],
          email: [data['data']['data'][0]['email']],
          officialmobile: [data['data']['data'][0]['officialmobile']],
          area: [data['data']['data'][0]['area']],
          city: [data['data']['data'][0]['city']],
          gender: [data['data']['data'][0]['gender']],
          username: [data['data']['data'][0]['username']],
          password: [data['data']['data'][0]['password']],
          state: [data['data']['data'][0]['state']],
          agentid: [data['data']['data'][0]['agentid']]
        });
        

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
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); //console.log(data);
      //console.log(data);
      if (this.data) {
        data.consultantid=this.data;
        this.userservice.updateAgentConsultantData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close();
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.userservice.saveAgentConsultantData(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close();
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }

  /*onUploadPhoto(){
    this.isLoading = true;
    const uploadphoto = document.getElementById('uploadphoto') as HTMLInputElement;
    uploadphoto.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#uploadphoto')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          formData.append('photoimage', headerinputEl.files.item(0));
          this.photoimage = headerinputEl.files.item(0).name;
            this.userservice.uploadConsultantPhotoImage(formData).then(
              (tdata) => {
                this.isLoading = false;
                //data.thimage = tdata['data'];
                this.photoimage = tdata['data'];
              });
          
        }
      }
      
    };

    uploadphoto.click();
  }
  onUploadPan(){
    this.isLoading = true;
    const uploadphoto = document.getElementById('uploadphoto') as HTMLInputElement;
    uploadphoto.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          formData.append('photoimage', headerinputEl.files.item(0));
          this.photoimage = headerinputEl.files.item(0).name;
            this.userservice.uploadConsultantPhotoImage(formData).then(
              (tdata) => {
                this.isLoading = false;
                //data.thimage = tdata['data'];
                this.photoimage = tdata['data'];
              });
          
        }
      }
      
    };

    uploadphoto.click();
  }
  onUploadAdharFront(){
    this.isLoading = true;
    const uploadphoto = document.getElementById('uploadphoto') as HTMLInputElement;
    uploadphoto.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          formData.append('photoimage', headerinputEl.files.item(0));
          this.photoimage = headerinputEl.files.item(0).name;
            this.userservice.uploadConsultantPhotoImage(formData).then(
              (tdata) => {
                this.isLoading = false;
                //data.thimage = tdata['data'];
                this.photoimage = tdata['data'];
              });
          
        }
      }
      
    };

    uploadphoto.click();
  }
  onUploadAdharBack(){
    this.isLoading = true;
    const uploadphoto = document.getElementById('uploadphoto') as HTMLInputElement;
    uploadphoto.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          formData.append('photoimage', headerinputEl.files.item(0));
          this.photoimage = headerinputEl.files.item(0).name;
            this.userservice.uploadConsultantPhotoImage(formData).then(
              (tdata) => {
                this.isLoading = false;
                //data.thimage = tdata['data'];
                this.photoimage = tdata['data'];
              });
          
        }
      }
      
    };

    uploadphoto.click();
  }*/

}

