import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GetVehicleService } from 'src/app/services/get-vehicle.service';
import { GetClustersService } from 'src/app/services/get-clusters.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import { Vehicle } from 'src/app/classes/vehicle';
import * as moment from 'moment';
import { ChartsModule } from 'ng2-charts';
import * as Chart from 'chart.js';
import { empty } from 'rxjs';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  GEN_ZOOM = 5;
  latitude = 39.8282;
  longitude = -98.5795;
  zoom = 3;
  circleClicked = false;
  statistics = false;
  circleVisible = true;

  // For tests, to be deleted
  lineChartLabels2 = [
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November'
  ];
  lineChartType2 = 'line';
  lineChartLegend2 = 'test';
  lineChartData2 = [
    { data: [98, 92, 88, 72, 51, 27, 11], label: 'Benchmark life-span' },
    { data: [, 21, , , 89], label: 'Portfolio life-span' }
  ];
  lineChartOptions2 = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  // Imported from server
  vehicles;
  clusters;
  parameters;
  vehicleParameter = []; // Parameters of the vehicle between 2 dates

  interval;
  chosenVehicle;
  chosenCluster;
  chosenVehiclebool = false;
  chosenClusterbool = false;

  // Slider elements
  min_slider_date = 2016;
  max_slider_date = 2024;
  slider_date_value = 2019;
  thumbLabel = true;

  // Line chart elements
  @ViewChild('lineChart', { static: false })
  private chartComponent: BaseChartDirective;

  lineChartLabels = [];
  lineChartType;
  lineChartLegend;
  lineChartData = [];
  lineChartOptions;

  // Google map style
  public darkStyle: google.maps.MapTypeStyle[] = [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#000000'
        },
        {
          lightness: 13
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#000000'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#144b53'
        },
        {
          lightness: 14
        },
        {
          weight: 1.4
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        {
          color: '#08304b'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#0c4152'
        },
        {
          lightness: 5
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#000000'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#0b434f'
        },
        {
          lightness: 25
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#000000'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#0b3d51'
        },
        {
          lightness: 16
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [
        {
          color: '#000000'
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          color: '#146474'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [
        {
          color: '#021019'
        }
      ]
    }
  ];

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
    console.log(this.getVehicleParameters(vehicle));
    // this.getVehicleParameterBetweenDates(vehicle, this.slider_date_value, this.slider_date_value + 1);
    this.chosenVehiclebool = true;
    this.chosenClusterbool = false;
  }

  sliderEvent() {
    if (this.vehicles) {
      this.refreshGraphs(this.vehicles);
    }
    // console.log(this.getVehicleParameterBetweenDates(this.vehicles[0], this.slider_date_value, this.slider_date_value + 1));
  }

  async onCircleClicked(circle) {
    this.recenterMap(circle.center_lat, circle.center_lng);
    this.chosenCluster = circle;
    this.chosenClusterbool = true;
    this.chosenVehiclebool = false;
    await this.chargeVehicles(circle);
    this.circleClicked = true;
    this.circleVisible = false;
    this.zoom = 6;
  }

  recenterMap(lat, lng) {
    this.latitude = Number(lat);
    this.longitude = Number(lng);
  }

  async refreshGraphs(vehicles) {
    this.lineChartType = 'line';
    // this.loadVehicleParameterBetweenDates(vehicles, this.slider_date_value, this.slider_date_value + 1);
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), 1);
    this.loadVehicleParameterAtDate(vehicles, today);

    // Refresh for line chart
    /*this.lineChartLabels = ['10h', '11h', '12h', '13h', '14h', '15h', '16h'];
    this.lineChartLegend = 'test';
    this.lineChartData = [
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Battery Charge' }
    ];*/
    this.lineChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Performance (in %)'
            }
          }
        ]
      }
    };
  }

  getMonthsBetweenRange(date1, date2) {
    const dateFormat = 'YYYY-MM';
    const startDate = moment('' + date1, dateFormat);
    const endDate = moment('' + date2, dateFormat);
    console.log(' Start: ' + startDate.format('YYYY-MM') + 'date1: ' + date1);
    const result = [];
    if (endDate.isBefore(startDate)) {
      console.log('End date must be greated than start date.');
    }

    while (startDate.isBefore(endDate)) {
      result.push(startDate.format('YYYY-MM'));
      startDate.add(1, 'month');
    }
    return result;
  }

  onMapZoomChange(event) {
    if (event <= this.GEN_ZOOM) {
      this.zoom = event;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = true;
      this.chosenVehiclebool = false;
      this.statistics = false;
    } else if (event > this.GEN_ZOOM) {
      this.circleClicked = true;
      this.circleVisible = false;
    }
  }

  async chargeVehicles(circle) {
    this.getVehicleService
      .retrieveVehiclesInCluster(circle._id)
      .subscribe((response: any) => {
        this.vehicles = response.vehicle_list;
        this.refreshGraphs(this.vehicles);
      });
  }

  getVehicleParameters(vehicle) {
    let vhParam = [];
    this.getVehicleService
      .retrieveParametersOfVehicles(vehicle._id)
      .subscribe((response: any) => {
        vhParam = response.parameters;
        console.log(vhParam);
        return vhParam;
      });
  }

  loadVehicleParameterAtDate(vehicles, date) {
    this.lineChartLabels = [];
    for (let i = 0; i < 5; i++) {
      this.lineChartLabels.push("" + i);
      for (let j = 0; j < 11; j++) {
        this.lineChartLabels.push("");
      }
    }
    console.log(this.lineChartLabels);
    this.lineChartData = [];
    for (const vh of vehicles) {
      const dataset = [];
      this.getVehicleService
        .retrieveParametersAtDate(vh._id, date)
        .subscribe((response: any) => {
          console.log("date: ", date);
          console.log('Response: ', response);
          const battAge = this.battery_age(date, vh.date_of_creation); // returns current age of battery
          for (let i = 0; i < battAge; i++) {
              dataset.push(empty);
          }
          dataset.push(response.parameters[0].performance);
          console.log(dataset);
          this.lineChartData.push({data: dataset, label: vh.model});
          this.statistics = true;
          console.log(response.parameters[0].performance);
        });
    }
  }

  battery_age(a, b) {
    const dt2 = new Date(b);
    const dt1 = new Date(a);
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60 * 2;
    return Math.abs(Math.round(diff / 365.25));
  }

  loadVehicleParameterBetweenDates(vehicles, date1, date2) {
    this.lineChartLabels = this.getMonthsBetweenRange(
      this.slider_date_value,
      this.slider_date_value + 1
    );
    this.lineChartData = [];
    for (const vh of vehicles) {
      const dataset = [];
      this.getVehicleService
        .retrieveParametersBetweenDates(vh._id, date1, date2)
        .subscribe((response: any) => {
          this.vehicleParameter = response.parameters;
          for (const p of this.vehicleParameter) {
            dataset.push(p.performance);
          }
          this.lineChartData.push({ data: dataset, label: vh.model });
          this.statistics = true;
        });
    }
  }

  onChartClicked(event) {
    const chart = this.chartComponent.chart;
    const b = chart.getElementAtEvent(event.event);
    const label = this.lineChartData[0];
    console.log('Event clicked', b[0]);
    console.log('Label', label);
  }
}
