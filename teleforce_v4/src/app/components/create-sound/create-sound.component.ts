import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { UserService } from '../../user.service';
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-sound',
  templateUrl: './create-sound.component.html',
  styleUrls: ['./create-sound.component.css']
})
export class CreateSoundComponent implements OnInit {

  form: FormGroup;
  soundid='';
  deletemode=false;
  updatemode=false;
  addmode=false;
  progress:number;
  progressbar=false;
  constructor(
    public dialogRef: MatDialogRef<CreateSoundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private toastr: ToastrService,
    private el: ElementRef,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    if(this.data!='' && this.data!=null){
      if(this.data.action=='delete'){
        this.soundid=this.data.id;
        this.deletemode=true;
      }else{
        this.soundid=this.data
        this.updatemode=true;
      }
    }else{
      this.updatemode=true;
    }
    var userid = localStorage.getItem('access_id');
    this.form = this.formBuilder.group({
      
      userid:[userid],
      audiofile: ['', [Validators.required]],
    });
    //this.getDIDdetail(this.data);
  }
  submit(){
    
    if(this.form.invalid == true)
  	{
      // console.log(form.value);
  		return;
  	}
  	else
  	{
      let data: any = Object.assign(this.form.value);
      
      let kycformData = new FormData();
      kycformData.append('userid', data.userid);
      kycformData.append('soundid', this.soundid);
        let identityfrontsideinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#uploadfile');
        if(identityfrontsideinputEl){
          let fileCount1: number = identityfrontsideinputEl.files.length;
          //console.log('sasas==='+fileCount1)
       
          if (fileCount1 > 0) {
              kycformData.append('uploadfile', identityfrontsideinputEl.files.item(0));
          }
        }
      //console.log(kycformData);
      
      this.userservice.uploadsoundfile(kycformData).then(
        (data) => {
          //this.progress=100;
          //console.log(data)
          this.progressbar=false;
          this._snackBar.open('Sound file upload successfully', '', {
            duration: 2000,verticalPosition: 'top'
          });
          this.dialogRef.close({event:'Add'});
      }); 
    }
  }
  audiofileupload(){
    this.progress=1;
    let data: any = Object.assign(this.form.value);
    if (this.form.invalid == true) {
      return;
    } else {
      console.log(data)
      this.progressbar=true;
      let fdata = new FormData();
      let fileItem = data.audiofile._files[0];
      fdata.append('audio', fileItem);
      fdata.append('userid', data.userid);
      // this.http.post(environment.apiUrl+"/mass-voip/uploadcampaignfiles", fdata)
      // .subscribe(res => {
      //     console.log(res)
      //     this.toastr.success("File added successfully.");
      //     this.getCampaignFiles(this.camid)
      // });
      this.userservice.uploadsoundfile(fdata).then(
        (data) => {
          //console.log(data)
          this.progressbar=false;
          this.progress=100;
          this._snackBar.open(data['data'], '', {
            duration: 2000,verticalPosition: 'top'
          });
          this.dialogRef.close({event:'Add'});
          
      });
    }
  }
  readFile(fileEvent: any) {
    const file = fileEvent.target.files[0];
    console.log(file.type)
    if(file.type=="audio/wav"){
    }else{
      this._snackBar.open('File type you trying to upload is not allowed. only wav file allowed.', '', {
        duration: 2000,verticalPosition: 'top'
      });
      //this.toastr.error('File type you trying to upload is not allowed. only png/jpg file allowed.'); 
      fileEvent.srcElement.value = null; 
    }
  }

  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }

  async deleteRequest(id){
   // console.log(id);   
    await this.userservice.deleteSound(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000,verticalPosition: 'top'
        });
       // this.toastr.success(data['data']);
        this.dialogRef.close({event:'Delete'});
      },
      err => {
        console.log('error');
      }
    );
  }
}
