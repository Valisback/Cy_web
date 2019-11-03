import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainPageComponent } from './pages/main-page/main-page.component';


const routes: Routes = [
  { path: '', component: MainViewComponent},
  { path: 'home', component: MainViewComponent},
  { path: 'dashboard', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
