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
  /*lineChartLabels2 = [
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
  }; */
  // Imported from server
  allVehicles;
  vehicles;
  clusters;
  parameters;
  vehicleParameter = []; // Parameters of the vehicle between 2 dates

  interval;
  sliderVisible = true;
  chosenVehicle;
  chosenCluster;
  chosenVehiclebool = false;
  chosenClusterbool = false;

  // Slider elements
  min_slider_date = 1;
  max_slider_date = 8;
  slider_date_value = 5;
  thumbLabel = true;

  // Line chart elements
  @ViewChild('lineChart', { static: false })
  private chartComponent: BaseChartDirective;

  @ViewChild('yearSlider', { static: true })
  private yearSlider: any;

  lineChartLabels = [];
  lineChartType;
  lineChartLegend;
  lineChartData = [];
  lineChartOptions;
  BASELINE = [];


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
    let perf = 100;
    const view = 'clusterView';
    const maxBaseline = this.max_slider_date * 12;
    // Creating the values for the baseline
    for (let month = 0; month <= maxBaseline; month++) {
      this.BASELINE.push(perf);
      perf = perf * ( 1 - Math.random() / 100);
    }

    this.getVehicleService.retrieveVehicles().subscribe((response: any) => {
      this.allVehicles = response.vehicle_list;
      this.vehicles = this.allVehicles;
      this.refreshGraphs(this.allVehicles, view);
    });
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
    const arrayVehicle = [];
    arrayVehicle[0] = vehicle;
    console.log(vehicle);
    // this.getVehicleParameterBetweenDates(vehicle, this.slider_date_value, this.slider_date_value + 1);
    this.chosenVehiclebool = true;
    const view = "vehicleView";
    this.refreshGraphs(arrayVehicle, view);
    this.chosenClusterbool = false;
  }

  sliderEvent() {
    if (this.vehicles) {
      const view = 'clusterView';
      this.refreshGraphs(this.vehicles, view);
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

  async refreshGraphs(vehicles, view) {
    this.lineChartType = 'line';
    const date = new Date();
    if (view === 'clusterView' ) {
      this.loadVehicleParameterAtDate(vehicles, date);
    } else if (view === 'vehicleView') {
      const creationDate = new Date(vehicles[0].date_of_creation);
      this.loadVehicleParameterBetweenDates(vehicles, creationDate, date);
    }

    this.lineChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Performance (in %)',
            },
            ticks : {
              max : 100,
              min : 50
          }
          }
        ],
        xAxes: [{
          ticks: {
              maxTicksLimit: 10,
              autoSkip: false
          }
      }]
      },
      legend: {
        labels: {
          filter: (legendItem, chartData) => {
            if (legendItem.datasetIndex === 0) {
              return true;
            }
            return false;
            // return true or false based on legendItem's datasetIndex (legendItem.datasetIndex)
          }
        }
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
    if (event <= this.GEN_ZOOM && this.chosenClusterbool) {
      this.zoom = event;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = false;
      this.chosenVehiclebool = false;
      this.statistics = false;
      const view = "clusterView";
      this.refreshGraphs(this.allVehicles, view);
      this.vehicles = this.allVehicles;
    } else if (event > this.GEN_ZOOM ) {
      this.zoom = event;
      this.circleClicked = true;
      this.circleVisible = false;
    } else if (event <= this.GEN_ZOOM &&  this.circleVisible === false) {
      this.zoom = event;
      this.circleVisible = true;
      this.circleClicked = false;

    } else {
      this.zoom = event;
    }
  }

  async chargeVehicles(circle) {
    const view = 'clusterView';
    this.getVehicleService
      .retrieveVehiclesInCluster(circle._id)
      .subscribe((response: any) => {
        this.vehicles = response.vehicle_list;
        this.refreshGraphs(this.vehicles, view);
      });
  }

  getVehicleParameters(vehicle) {
    let vhParam = [];
    this.getVehicleService
      .retrieveParametersOfVehicles(vehicle._id)
      .subscribe((response: any) => {
        vhParam = response.parameters;
        return vhParam;
      });
  }

  loadVehicleParameterAtDate(vehicles, date) {
    this.lineChartLabels = [];
    let i;
    for (i = 0; i < this.slider_date_value; i++) {
      this.lineChartLabels.push('' + i);
      for (let j = 0; j < 11; j++) {
        this.lineChartLabels.push('');
      }
    }
    this.lineChartLabels.push('' + i);
    this.lineChartData = [];
    this.lineChartData.push({data: this.BASELINE, label: 'Baseline', fill: false, pointRadius: 0});
    for (const vh of vehicles) {
      const battAge = this.battery_age(date, vh.date_of_creation); // returns current age of battery
      if ( battAge <= (this.slider_date_value * 12)) {
      const dataset = [];
      this.getVehicleService
        .retrieveParametersAtDate(vh._id, date)
        .subscribe((response: any) => {
          let month;
          for (month = 0; month < battAge; month++) {
              dataset.push(empty);
          }
          const lowerThreshold = this.BASELINE[month] * 0.8;
          const upperThreshold = this.BASELINE[month];
          let pointColor;
          if ( response.parameters[0].performance < lowerThreshold ) {
            pointColor = '#ff0000';
          } else if ( response.parameters[0].performance > upperThreshold ) {
            pointColor = '#00ff00';
          } else {
            pointColor = '#ffa500';
          }
          dataset.push(response.parameters[0].performance);
          this.lineChartData.push({data: dataset, label: vh.model, pointBackgroundColor: pointColor});

          this.statistics = true;
        });
      } else {
        // nothing happens
      }
    }

  }

  battery_age(a, b) {
    const dt2 = new Date(b);
    const dt1 = new Date(a);
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60 * 2;
    return Math.abs(Math.round(diff / 365.25));
  }

  loadVehicleParameterBetweenDates(vehicle, date1, date2) {
    this.lineChartLabels = [];
    let i;
    for (i = date1.getFullYear(); i < date2.getFullYear() + 1; i++) {
      let j = 0;
      let label;
      if (i == date1.getFullYear()) {
        j = date1.getMonth() + 1;
        label = i + '-' + j;
      } else {
        j = 0;
        label = '' + i;
      }
      this.lineChartLabels.push(label);
      for (j; j < 11; j++) {
          this.lineChartLabels.push('');
      }
    }
    this.lineChartLabels.push('' + i);
    this.lineChartData = [];
    const dataset = [];
    this.getVehicleService
        .retrieveParametersBetweenDates(vehicle[0]._id, date1, date2)
        .subscribe((response: any) => {
          this.vehicleParameter = response.parameters;
          for (const p of this.vehicleParameter) {
            dataset.push(p.performance);
          }
          this.lineChartData.push({ data: dataset, label: vehicle[0].model + ' details'});
          this.statistics = true;
        });
    this.sliderVisible = false;
  }

  onChartClicked(event) {
    const chart = this.chartComponent.chart;
    const chartElement = chart.getElementAtEvent(event.event);
    const view = 'vehicleView';

    if (chartElement[0]) {
      const indexClicked = chartElement[0]['_datasetIndex'];
      const elemClicked = this.lineChartData[indexClicked];
      const modelElem = elemClicked['label'];
      this.getVehicleService
        .retrieveVehicleWithModel(modelElem)
        .subscribe((response: any) => {
          this.vehicleParameter = response.vehicle;
          console.log('VEHICLE PICKED: ', response.vehicle);
          this.refreshGraphs(response.vehicle, view);
        });
      }
  }

  onBackButton() {
    this.sliderVisible = true;
    const view = 'clusterView';
    this.refreshGraphs(this.vehicles, view);

  }
}
