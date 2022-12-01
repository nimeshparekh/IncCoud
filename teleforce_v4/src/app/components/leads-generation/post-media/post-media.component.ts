import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DigitalService } from '../../../digital.service';

@Component({ 
  selector: 'app-post-media',
  templateUrl: './post-media.component.html',
  styleUrls: ['./post-media.component.css']
})
export class PostMediaComponent implements OnInit {
  loadingfile = false
  filedata = []
  media_checked= [];
  media_link = []
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PostMediaComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private digitalService: DigitalService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadingfile = true
    this.getmedia()
  }

  close(){
    this.dialogRef.close({ event: 'Cancel' });
  }

  getmedia(){
    this.digitalService.getmedia().then(
      data=>{
        //console.log(data);
        if(data['files']){
          this.filedata = data['files']
        }else{
          this._snackBar.open(data['msg'],'Close',{
            duration: 5000,
          });
        }
        this.loadingfile = false
      },
      err=>{
        this.loadingfile = false
        //console.log(err);
        this._snackBar.open('Something went wrong.please try again!','Close',{
          duration: 5000,
        });
      }
    )
  }
  geturl(data,type){
    return window.URL.createObjectURL(new Blob(data, {type: type}))
  }

  add_media(){
    this.media_checked.map((element,i)=>{
      console.log(i)
      console.log(this.media_checked.length)
      if (element){
        //console.log(this.filedata[i])
        this.media_link.push(this.filedata[i])
      }
    })
    this.dialogRef.close({ event: 'Add',filesdata:this.media_link});
  }
}
