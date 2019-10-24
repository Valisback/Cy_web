import { Component, OnInit, ViewChild } from '@angular/core';
import { GetVehicleService } from 'src/app/services/get-vehicle.service';
import { GetClustersService } from 'src/app/services/get-clusters.service';
import { Vehicle } from 'src/app/classes/vehicle';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  GEN_ZOOM = 5;
  latitude = 39.8282;
  longitude = -98.5795;
  zoom = 3;
  circleClicked = false;
  statistics = false;
  circleVisible = true;

  // Imported classes
  // Imported from server
  vehicles;
  clusters;

  interval;
  chosenVehicle;
  chosenCluster;
  chosenVehiclebool = false;
  chosenClusterbool = false;

  // Line chart elements
  lineChartLabels;
  lineChartType;
  lineChartLegend;
  lineChartData;
  lineChartOptions;

  // Bar chart elements
  barChartLabels;
  barChartType;
  barChartLegend;
  barChartData;
  barChartOptions;

  // Doughnut chart elements
  doughnutChartLabels;
  doughnutChartType;
  doughnutChartLegend;
  doughnutChartData;
  doughnutChartOptions;

  // Polar chart elements
  polarChartLabels;
  polarChartType;
  polarChartLegend;
  polarChartData;
  polarChartOptions;



  constructor(
    private getVehicleService: GetVehicleService,
    private getClusterService: GetClustersService
  ) {}

  private refreshData() {
    /*this.getVehicleService.retrieveVehicles().subscribe((response: any) => {
      this.vehicles = response.vehicle_list;
    });*/
    this.getClusterService.retrieveClusters().subscribe((response: any) => {
      this.clusters = response.cluster_list;
    });
  }

  ngOnInit() {
    this.refreshData();
    /*this.interval = setInterval(() => {
      this.refreshData();
  }, 5000);*/
  }

  fillCircleColor(circle) {
    if (circle.gen_health > 75) {
      return 'green';
    } else if (circle.gen_health > 50) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  onVehicleChosen(vehicle) {
    this.chosenVehicle = vehicle;
    this.chosenVehiclebool = true;
    this.chosenClusterbool = false;
  }

  onMarkerRightClick(vehicle) {
    console.log(vehicle.model);
  }

  onCircleClicked(circle) {
    this.recenterMap(circle.center_lat, circle.center_lng);
    this.chosenCluster = circle;
    this.chosenClusterbool = true;
    this.chosenVehiclebool = false;
    this.chargeVehicles(circle);
    this.refreshGraphs();
    this.circleClicked = true;
    this.circleVisible = false;
    this.zoom = 6;
  }

  recenterMap(lat, lng) {
    this.latitude = Number(lat);
    this.longitude = Number(lng);
  }

  refreshGraphs() {
    this.statistics = true;
    // Refresh for line chart
    this.lineChartLabels = ['10h', '11h', '12h', '13h', '14h', '15h', '16h'];
    this.lineChartType = 'line';
    this.lineChartLegend = 'test';
    this.lineChartData = [
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Battery Charge' }
    ];
    this.lineChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true
    };

    // Refresh for bar chart
    this.barChartLabels = ['10h', '11h', '12h', '13h', '14h', '15h', '16h'];
    this.barChartType = 'bar';
    this.barChartLegend = 'test';
    this.barChartData = [
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Battery Charge' }
    ];
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true
    };

    // Refresh for doughnut chart
    this.doughnutChartLabels = ['10h', '11h', '12h', '13h', '14h', '15h', '16h'];
    this.doughnutChartType = 'doughnut';
    this.doughnutChartLegend = 'test';
    this.doughnutChartData = [
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Battery Charge' }
    ];
    this.doughnutChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true
    };

    // Refresh for polar chart
    this.polarChartLabels = ['10h', '11h', '12h', '13h', '14h', '15h', '16h'];
    this.polarChartType = 'polarArea';
    this.polarChartLegend = 'test';
    this.polarChartData = [
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Battery Charge' }
    ];
    this.polarChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true
    };
  }

  onMapZoomChange(event) {
    if (event <= this.GEN_ZOOM) {
      this.zoom = event;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = true;
      this.chosenVehiclebool = false;
    } else if (event > this.GEN_ZOOM) {
      this.circleClicked = true;
      this.circleVisible = false;
    }
  }

  chargeVehicles(circle) {
    this.getVehicleService
      .retrieveVehiclesInCluster(circle._id)
      .subscribe((response: any) => {
        this.vehicles = response.vehicle_list;
      });
  }
}
