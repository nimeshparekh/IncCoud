import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentDialerComponent } from '../agent-dialer/agent-dialer.component';

@Component({
  selector: 'app-dialer-dialog',
  templateUrl: './dialer-dialog.component.html',
  styleUrls: ['./dialer-dialog.component.css']
})
export class DialerDialogComponent implements OnInit {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AgentDialerComponent) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
