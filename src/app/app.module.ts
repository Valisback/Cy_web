import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import { AgmCoreModule } from '@agm/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { ChartsModule } from 'ng2-charts';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import {MatBadgeModule} from '@angular/material/badge';
import { MainNavComponent } from './pages/main-nav/main-nav.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { NavbarService } from 'src/app/services/navbar.service';


@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    DashboardComponent,
    MainNavComponent,
    MainPageComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatRippleModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSliderModule,
    MatGridListModule,
    VirtualScrollerModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    ChartsModule,
    MatSelectModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAuIQbKeVA2tp8bNMIlyDJomvXzm75XOrE'
    })
  ],
  providers: [NavbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
