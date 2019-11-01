import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GetVehicleService } from 'src/app/services/get-vehicle.service';
import { GetClustersService } from 'src/app/services/get-clusters.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import { Vehicle } from 'src/app/classes/vehicle';
import * as moment from 'moment';
import { ChartsModule } from 'ng2-charts';
import * as Chart from 'chart.js';
import { empty } from 'rxjs';
import { all } from 'q';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  GEN_ZOOM = 4;
  GEN_LAT = 39.8282;
  GEN_LNG = -98.5795;
  latitude = this.GEN_LAT;
  longitude = this.GEN_LNG;
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
  viewGeneral = true;
  viewCluster = false;
  viewVehicle = false;
  sliderVisible = true;
  chosenVehicle;
  chosenCluster;
  chosenVehiclebool = false;
  chosenClusterbool = false;
  panelOpenState;

  // Elements displayed on top cards
  numberOfVehicles;
  tcoSavings;
  criticalBatteries;
  numberOfAlerts;

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

  displayedColumns: string[] = ['position', 'name', 'weight'];


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
      this.viewGeneral = true;
      this.viewVehicle = false;
      this.viewCluster = false;
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
    this.viewVehicle = true;
    this.viewGeneral = false;
    this.viewCluster = false;
    this.chosenVehicle = vehicle;
    this.chosenCluster = vehicle.cluster;
    const arrayVehicle = [];
    arrayVehicle[0] = vehicle;
    console.log(vehicle);
    // this.getVehicleParameterBetweenDates(vehicle, this.slider_date_value, this.slider_date_value + 1);
    this.chosenVehiclebool = true;
    const view = 'vehicleView';
    this.refreshGraphs(arrayVehicle, view);
    this.chosenClusterbool = false;
    this.recenterMap(vehicle.position_lat, vehicle.position_lng);
    this.zoom = this.GEN_ZOOM + 2;

  }

  sliderEvent() {
    if (this.vehicles) {
      const view = 'clusterView';
      this.refreshGraphs(this.vehicles, view);
    }
    // console.log(this.getVehicleParameterBetweenDates(this.vehicles[0], this.slider_date_value, this.slider_date_value + 1));
  }

  async onCircleClicked(circle) {
    this.viewCluster = true;
    this.viewGeneral = false;
    this.viewVehicle = false;
    this.recenterMap(circle.center_lat, circle.center_lng);
    this.chosenCluster = circle;
    this.chosenClusterbool = true;
    this.chosenVehiclebool = false;
    await this.chargeVehicles(circle);
    this.circleClicked = true;
    this.circleVisible = false;
    this.zoom = this.GEN_ZOOM + 1;
  }

  recenterMap(lat, lng) {
    this.latitude = Number(lat);
    this.longitude = Number(lng);
  }

  async refreshGraphs(vehicles, view) {
    this.lineChartType = 'line';
    const date = new Date();
    if (view === 'clusterView' ) {
      if ( vehicles === this.allVehicles) {
        this.viewCluster = false;
        this.viewGeneral = true;
      } else {
        this.viewCluster = true;
        this.viewGeneral = false;
      }
      this.viewVehicle = false;
      this.numberOfVehicles = vehicles.length;
      this.loadVehicleParameterAtDate(vehicles, date);
    } else if (view === 'vehicleView') {
      this.viewVehicle = true;
      this.viewGeneral = false;
      this.viewCluster = false;
      const creationDate = new Date(vehicles[0].date_of_creation);
      this.loadVehicleParameterBetweenDates(vehicles, creationDate, date);
    }

    this.lineChartOptions = {
      scaleFontColor: '#8c99af',
      scaleShowVerticalLines: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Performance (in %)',
              fontColor: '#8c99af'
            },
            ticks : {
              max : 100,
              min : 50,
              fontColor: '#8c99af'
          },
          gridLines: {
            display: true,
            color: '#8c99af'
          },
          }
        ],
        xAxes: [{
          scaleLabel: {
            display: true,
            fontColor: '#8c99af'
          },
          ticks: {
              maxTicksLimit: 10,
              autoSkip: false,
              fontColor: '#8c99af'
          },
          gridLines: {
            display: false
          },
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
          },
          fontColor: '#728098'
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
    console.log('Cluster: ' + this.viewCluster + 'General: ' + this.viewGeneral + 'Vehicle: ' + this.viewVehicle + 'EVENT: ' + event);
    if (event <= this.GEN_ZOOM && this.viewCluster) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle =  false;
      this.zoom = event;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = false;
      this.chosenVehiclebool = false;
      const view = 'clusterView';
      this.refreshGraphs(this.allVehicles, view);
      this.vehicles = this.allVehicles;
    } else if (event <= this.GEN_ZOOM && this.viewVehicle) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle =  false;
      this.zoom = event;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = false;
      this.chosenVehiclebool = false;
      const view = 'clusterView';
      this.refreshGraphs(this.allVehicles, view);
      this.vehicles = this.allVehicles;
    }  else if (event > this.GEN_ZOOM + 1 && this.viewVehicle) {
      this.zoom = event;
      this.viewCluster = false;
      this.viewVehicle = true;
      this.viewGeneral = false;
      this.circleClicked = true;
      this.circleVisible = false;
    } else if (event > this.GEN_ZOOM ) {
      this.zoom = event;
      this.viewCluster = true;
      this.viewVehicle = false;
      this.viewGeneral = false;
      this.circleClicked = true;
      this.circleVisible = false;
      const view = 'clusterView';
      //this.refreshGraphs(this.vehicles, view);

    } else if (event <= this.GEN_ZOOM &&  this.viewVehicle) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle = false;
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
    this.criticalBatteries = 0;
    this.numberOfAlerts = 0;
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
    // tslint:disable-next-line: max-line-length
    this.lineChartData.push({data: this.BASELINE, label: 'Baseline', backgroundColor: "#283040", borderColor: '#0794ff', fill: false, pointRadius: 0});
    for (const vh of vehicles) {
      console.log(vh);
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
          console.log(response);
          if ( response.parameters[0].performance < lowerThreshold ) {
            pointColor = '#ff0000';
            this.criticalBatteries++;
          } else if ( response.parameters[0].performance > upperThreshold ) {
            pointColor = '#ffffff';
          } else {
            pointColor = '#ffa500';
            this.numberOfAlerts++;
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
    // tslint:disable-next-line: max-line-length
    this.lineChartData.push({data: this.BASELINE, label: 'Baseline', backgroundColor: "#283040", borderColor: '#0794ff', fill: false, pointRadius: 0});
    const dataset = [];
    this.getVehicleService
        .retrieveParametersBetweenDates(vehicle[0]._id, date1, date2)
        .subscribe((response: any) => {
          this.vehicleParameter = response.parameters;
          let i = 0;
          const pointColor = [];

          for (const p of this.vehicleParameter) {
            dataset.push(p.performance);
            const lowerThreshold = this.BASELINE[i] * 0.8;
            const upperThreshold = this.BASELINE[i];
            if ( p.performance < lowerThreshold ) {
            pointColor.push('#ff0000');
          } else if ( p.performance > upperThreshold ) {
            pointColor.push('#ffffff');
          } else {
            pointColor.push('#ffa500');
          }
            i++;
          }
          this.lineChartData.push({ data: dataset, label: vehicle[0].model + ' details', fill: false, pointBackgroundColor: pointColor});
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
      if (indexClicked != 0) {
        const elemClicked = this.lineChartData[indexClicked];
        const modelElem = elemClicked['label'];
        this.getVehicleService
          .retrieveVehicleWithModel(modelElem)
          .subscribe((response: any) => {
            this.onVehicleChosen(response.vehicle[0]);
            console.log('VEHICLE PICKED: ', response.vehicle);
          });
        }
    }
  }

  onBackButton() {
    const view = 'clusterView';
    if (this.viewVehicle) {
      if ( this.chosenCluster ) {
        console.log("BACK FROM Vehicle view w Cluster");
        this.viewVehicle = false;
        this.viewCluster = true;
        this.viewGeneral = false;
        this.refreshGraphs(this.vehicles, view);
        this.zoom = this.GEN_ZOOM + 1;
        this.recenterMap(this.chosenCluster.center_lat, this.chosenCluster.center_lng);
      } else {
        console.log("BACK FROM Vehicle view");

        this.viewVehicle = false;
        this.viewCluster = false;
        this.viewGeneral = true;
        this.circleClicked = false;
        this.circleVisible = true;
        this.chosenClusterbool = false;
        this.chosenVehiclebool = false;
        this.refreshGraphs(this.allVehicles, view);
        this.vehicles = this.allVehicles;
        this.recenterMap(this.GEN_LAT, this.GEN_LNG);
        this.zoom = this.GEN_ZOOM - 1;
      }

      //this.panelOpenState = false;
    } else if (this.viewCluster) {
      console.log("BACK FROM Cluster view", this.clusters);
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle =  false;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = false;
      this.chosenVehiclebool = false;
      this.refreshGraphs(this.allVehicles, view);
      this.vehicles = this.allVehicles;
      this.zoom = this.GEN_ZOOM - 1;
      this.recenterMap(this.GEN_LAT, this.GEN_LNG);
    }

  }
}
