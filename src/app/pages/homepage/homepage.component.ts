import { Component, OnInit, Inject } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  login: string;
  password: string;
}

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})

export class DialogLoginComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSignInClick(): void {
    if ( this.data.login.includes('tablet') || this.data.login.includes('Tablet') || this.data.login.includes('desktop')) {
      console.log('tablet');
      location.href = '/home';
    } else if ( this.data.login.includes('mobile') || this.data.login.includes('Mobile') || this.data.login.includes('phone') ) {
      console.log('user');
      location.href = '/dashboard';
    }
    // this.dialogRef.close();
  }
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  bool = false;
  login: string;
  password: string;

  constructor(public nav: NavbarService, public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogLoginComponent, {
      width: '450px',
      height: 'fit-content',
      maxHeight: '50vh',
      data: {login: this.login, password: this.password},
      backdropClass: 'backdropBackground'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.password = result;
    });
  }
    ngOnInit() {
    this.nav.hide();
  }
}


