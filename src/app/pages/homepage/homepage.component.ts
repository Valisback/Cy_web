import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  bool = false;

  constructor(public nav: NavbarService) { }

  ngOnInit() {
    this.nav.hide();
  }

  clicked() {
    this.bool = true;
  }

}
