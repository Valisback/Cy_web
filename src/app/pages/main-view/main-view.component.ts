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

  // Variables for filters
  ageOrder;
  regionOrder;
  healthOrder;

  // Imported from server
  allVehicles;
  clusterVehicles;
  currentVehicles;
  filteredVehicles;
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
  tcoSavings = '$1.2M';
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
  genLineChartData = [];
  lineChartData = [];
  lineChartOptions;
  BASELINE = [];

  displayedColumns: string[] = ['position', 'name', 'weight'];

  // Google map style
  public darkStyle: google.maps.MapTypeStyle[] = [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [
        {
          color: '#63b5e5'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [
        {
          gamma: 0.01
        },
        {
          lightness: 20
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          saturation: -31
        },
        {
          lightness: -33
        },
        {
          weight: 2
        },
        {
          gamma: 0.8
        }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'all',
      stylers: [
        {
          color: '#b1c3e2'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'administrative.country',
      elementType: 'all',
      stylers: [
        {
          color: '#32364f'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#b1c3e2'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        {
          color: '#242634'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        {
          lightness: 30
        },
        {
          saturation: 30
        },
        {
          color: '#242634'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        {
          color: '#b1c3e2'
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          saturation: 20
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          lightness: 20
        },
        {
          saturation: -20
        },
        {
          color: '#32364f'
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [
        {
          color: '#90a4c2'
        },
        {
          saturation: 12
        },
        {
          lightness: -77
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          lightness: 10
        },
        {
          saturation: -30
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          saturation: 25
        },
        {
          lightness: -40
        },
        {
          color: '#32364f'
        },
        {
          weight: 0.22
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'simplified'
        },
        {
          color: '#b1c3e2'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off'
        },
        {
          hue: '#ff0000'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off'
        },
        {
          color: '#444f79'
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [
        {
          lightness: -20
        },
        {
          color: '#2b3548'
        },
        {
          saturation: 0
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
      perf = -Math.pow(month / 12, 1.7) + 100;
    }

    this.getVehicleService.retrieveVehicles().subscribe((response: any) => {
      this.viewGeneral = true;
      this.viewVehicle = false;
      this.viewCluster = false;
      this.allVehicles = response.vehicle_list;
      this.currentVehicles = this.allVehicles;
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
    // this.viewVehicle = true;
    // this.viewGeneral = false;
    // this.viewCluster = false;
    this.chosenVehicle = vehicle;
    const today = Date.now();
    const age = this.battery_age(today, vehicle.date_of_creation);
    const distance = age * Math.random() * 1000 + 300;
    vehicle.age = age;
    vehicle.distance = distance.toPrecision(2);
    this.chosenCluster = vehicle.cluster;
    const arrayVehicle = [];
    arrayVehicle.push(vehicle);
    //this.currentVehicles = arrayVehicle;
    // this.getVehicleParameterBetweenDates(vehicle, this.slider_date_value, this.slider_date_value + 1);
    this.chosenVehiclebool = true;
    const view = 'vehicleView';
    this.refreshGraphs(arrayVehicle, view);
    this.chosenClusterbool = false;
    this.recenterMap(vehicle.position_lat, vehicle.position_lng);
    this.zoom = this.GEN_ZOOM + 2;
  }

  sliderEvent() {
    if (this.viewGeneral) {
      this.currentVehicles = this.allVehicles;
    } else if (this.viewCluster) {
      this.currentVehicles = this.clusterVehicles;
    } else {
      // Safety: this should never happen
      return;
    }
    this.lineChartLabels = [];
    let i;
    for (i = 0; i < this.slider_date_value; i++) {
      this.lineChartLabels.push('' + i);
      for (let j = 0; j < 11; j++) {
        this.lineChartLabels.push('');
      }
    }
    this.lineChartLabels.push('' + i);
    this.calculateTopParameters();
    const newVehicles = [];
    for (const vh of this.currentVehicles) {
      const today = new Date();
      const age = this.battery_age(today, vh.date_of_creation);
      if (age <= this.slider_date_value * 12) {
        newVehicles.push(vh);
      }
    }
    this.currentVehicles = newVehicles;
  }

  calculateTopParameters() {
    this.numberOfVehicles = 0;
    this.criticalBatteries = 0;
    this.numberOfAlerts = 0;
    for (const dataset of this.lineChartData) {
      if (dataset.label !== 'Baseline') {
        let bool = true;
        let i = 0;
        for (i; i < this.lineChartLabels.length; i++) {
          if (dataset.data[i] && typeof dataset.data[i] !== 'function') {
            if (bool) {
              this.numberOfVehicles++;
              bool = false;
            }
            if (dataset.data[i] < this.BASELINE[i]) {
              this.numberOfAlerts++;
            }
            if (dataset.data[i] < this.BASELINE[i] * 0.8) {
              this.criticalBatteries++;
            }
          }
        }
      }
    }
  }

  async onCircleClicked(circle) {
    this.viewCluster = true;
    this.viewGeneral = false;
    this.viewVehicle = false;
    this.recenterMap(circle.center_lat, circle.center_lng);
    this.chosenCluster = circle;
    this.chosenClusterbool = true;
    this.chosenVehiclebool = false;
    this.ageOrder = null;
    this.regionOrder = 'region' + circle.name;
    this.healthOrder = null;
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
    if (view === 'clusterView') {
      if (vehicles === this.allVehicles) {
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
              position: 'right',
              labelString: 'Battery State of Health (%)',
              fontColor: '#8c99af'
            },
            ticks: {
              max: 105,
              min: 60,
              fontColor: '#8c99af'
            },
            gridLines: {
              display: true,
              color: '#8c99af'
            }
          }
        ],
        xAxes: [
          {
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
            }
          }
        ]
      },
      legend: {
        labels: {
          useLineStyle: true,
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
    const result = [];
    if (endDate.isBefore(startDate)) {
    }

    while (startDate.isBefore(endDate)) {
      result.push(startDate.format('YYYY-MM'));
      startDate.add(1, 'month');
    }
    return result;
  }

  onMapZoomChange(event) {
    if (event <= this.GEN_ZOOM && this.viewCluster) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle = false;
      this.zoom = event;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = false;
      this.chosenVehiclebool = false;
      const view = 'clusterView';
      this.currentVehicles = this.allVehicles;
      this.refreshGraphs(this.currentVehicles, view);
    } else if (event <= this.GEN_ZOOM && this.viewVehicle) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle = false;
      this.zoom = event;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = false;
      this.chosenVehiclebool = false;
      const view = 'clusterView';
      this.currentVehicles = this.allVehicles;
      this.refreshGraphs(this.currentVehicles, view);
    } else if (event > this.GEN_ZOOM + 1 && this.viewVehicle) {
      this.zoom = event;
      this.viewCluster = false;
      this.viewVehicle = true;
      this.viewGeneral = false;
      this.circleClicked = true;
      this.circleVisible = false;
      // const arrayVehicle = [];
      // arrayVehicle.push(this.chosenVehicle);
      // this.currentVehicles = arrayVehicle;
    } else if (event > this.GEN_ZOOM) {
      this.zoom = event;
      this.viewCluster = true;
      this.viewVehicle = false;
      this.viewGeneral = false;
      this.circleClicked = true;
      this.circleVisible = false;
      const view = 'clusterView';
      //this.currentVehicles = this.clusterVehicles;
      //this.refreshGraphs(this.vehicles, view);
    } else if (event <= this.GEN_ZOOM && this.viewVehicle) {
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
        this.clusterVehicles = response.vehicle_list;
        this.currentVehicles = this.clusterVehicles;
        this.refreshGraphs(this.currentVehicles, view);
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
    this.lineChartData.push({
      data: this.BASELINE,
      label: 'Baseline',
      backgroundColor: '#283040',
      borderColor: '#0794ff',
      fill: false,
      pointRadius: 0
    });
    for (const vh of vehicles) {
      const battAge = this.battery_age(date, vh.date_of_creation); // returns current age of battery
      if (battAge <= this.max_slider_date * 12) {
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
            if (response.parameters[0].performance < lowerThreshold) {
              pointColor = '#ff0000';
              this.criticalBatteries++;
            } else if (response.parameters[0].performance > upperThreshold) {
              pointColor = '#b1c3e2';
            } else {
              pointColor = '#fc376e';
              this.numberOfAlerts++;
            }
            dataset.push(response.parameters[0].performance);
            this.lineChartData.push({
              data: dataset,
              label: vh.model,
              pointBackgroundColor: pointColor
            });

            this.statistics = true;
          });
      } else {
        // nothing happens
      }
    }
    this.genLineChartData = this.lineChartData;
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
    this.lineChartData.push({
      data: this.BASELINE,
      label: 'Baseline',
      backgroundColor: '#283040',
      borderColor: '#0794ff',
      fill: false,
      pointRadius: 0
    });
    const dataset = [];
    this.getVehicleService
      .retrieveParametersBetweenDates(vehicle[0]._id, date1, date2)
      .subscribe((response: any) => {
        this.vehicleParameter = response.parameters;
        let i = 0;
        const pointColor = [];
        let p;
        for (p of this.vehicleParameter) {
          dataset.push(p.performance);
          const lowerThreshold = this.BASELINE[i] * 0.8;
          const upperThreshold = this.BASELINE[i];
          if (p.performance < lowerThreshold) {
            pointColor.push('#ff0000');
          } else if (p.performance > upperThreshold) {
            pointColor.push('#b1c3e2');
          } else {
            pointColor.push('#fc376e');
          }
          i++;
        }
        this.chosenVehicle.performance = p.performance;
        this.chosenVehicle.batteryValue = p.cost_value;
        this.lineChartData.push({
          data: dataset,
          label: vehicle[0].model,
          fill: false,
          pointBackgroundColor: pointColor
        });
        this.genLineChartData = this.lineChartData;
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
          });
      }
    }
  }

  onBackButton() {
    const view = 'clusterView';
    if (this.viewVehicle) {
      if (this.chosenCluster) {
        this.viewVehicle = false;
        this.viewCluster = true;
        this.viewGeneral = false;
        this.onCircleClicked(this.chosenCluster);
      } else {
        this.viewVehicle = false;
        this.viewCluster = false;
        this.viewGeneral = true;
        this.circleClicked = false;
        this.circleVisible = true;
        this.chosenClusterbool = false;
        this.chosenVehiclebool = false;
        this.currentVehicles = this.allVehicles;
        this.refreshGraphs(this.currentVehicles, view);
        this.recenterMap(this.GEN_LAT, this.GEN_LNG);
        this.zoom = this.GEN_ZOOM - 1;
      }

      //this.panelOpenState = false;
    } else if (this.viewCluster) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle = false;
      this.circleClicked = false;
      this.circleVisible = true;
      this.chosenClusterbool = false;
      this.chosenVehiclebool = false;
      this.currentVehicles = this.allVehicles;
      this.refreshGraphs(this.currentVehicles, view);
      this.zoom = this.GEN_ZOOM - 1;
      this.recenterMap(this.GEN_LAT, this.GEN_LNG);
    }
    this.slider_date_value = 5;
    this.ageOrder = null;
    this.regionOrder = null;
    this.healthOrder = null;
  }

  topCardClicked(id) {
    if (this.lineChartData !== this.genLineChartData) {
      this.lineChartData = this.genLineChartData;
    } else {
      const newLineChartData = [];
      // tslint:disable-next-line: max-line-length
      newLineChartData.push({
        data: this.BASELINE,
        label: 'Baseline',
        backgroundColor: '#283040',
        borderColor: '#0794ff',
        fill: false,
        pointRadius: 0
      });
      for (const dataset of this.genLineChartData) {
        if (dataset.label !== 'Baseline') {
          const newDataset = [];
          let pointColor;
          let i = 0;
          for (const datapoint of dataset.data) {
            if (typeof datapoint !== 'function') {
              let lowerThreshold;

              if (id === '5') {
                // For Actions
                lowerThreshold = this.BASELINE[i];
                pointColor = '#fc376e';
                this.numberOfAlerts++;
              } else if (id === '4') {
                // For Critical Issues
                lowerThreshold = this.BASELINE[i] * 0.8;
                pointColor = '#ff0000';
                this.criticalBatteries++;
              }
              if (datapoint < lowerThreshold) {
                newDataset[i] = datapoint;
              }
            }
            i++;
          }
          if (newDataset.length > 0) {
            newLineChartData.push({
              data: newDataset,
              label: dataset.label,
              pointBackgroundColor: pointColor
            });
          }
        }
      }
      this.calculateTopParameters();
      this.lineChartData = newLineChartData;
    }
  }

  onFilterChanged(value) {
    if (!value) {
      return;
    }
    if (this.viewGeneral) {
      this.currentVehicles = this.allVehicles;
    } else if (this.viewCluster) {
      this.currentVehicles = this.clusterVehicles;
    } else {
      const arrayVehicle = [];
      arrayVehicle.push(this.chosenVehicle);
      this.currentVehicles = arrayVehicle;
    }

    let newVehicles = [];
    for (const vh of this.currentVehicles) {
      if (value.includes('age')) {
        const today = new Date();
        const age = this.battery_age(today, vh.date_of_creation);
        // tslint:disable: variable-name
        let min_age = 0;
        let max_age = 0;
        if (value === 'age1') {
          max_age = 1;
        } else if (value === 'age2') {
          max_age = 3;
        } else if (value === 'age3') {
          max_age = 5;
        } else if (value === 'age0') {
          max_age = 8;
        }
        if (!this.viewVehicle) {
          this.slider_date_value = max_age;
          this.sliderEvent();
        }
        if (age >= min_age * 12 && age < max_age * 12) {
          newVehicles.push(vh);
        }

        if (this.healthOrder) {
          this.healthOrder = 'health0';
        }
        if (this.regionOrder) {
          this.regionOrder = 'region0';
        }
      } else if (value.includes('health')) {
        let min_health = 0;
        let max_health = 0;
        if (value === 'health1') {
          max_health = 20;
        } else if (value === 'health2') {
          max_health = 50;
          min_health = 20;
        } else if (value === 'health3') {
          max_health = 80;
          min_health = 50;
        } else if (value === 'health4') {
          max_health = 100;
          min_health = 80;
        } else if (value === 'health0') {
          max_health = 100;
          min_health = 0;
        }
        const charge = vh._battery_id.life_span;
        if (charge > min_health && charge <= max_health) {
          newVehicles.push(vh);
        }
        if (this.ageOrder) {
          this.ageOrder = 'age0';
        }
        if (this.regionOrder) {
          this.regionOrder = 'region0';
        }
      } else if (value.includes('region')) {
        if (value === 'region0') {
          newVehicles = this.currentVehicles;
        } else {
          if (vh.cluster.name === value.slice(6, value.lenth)) {
            newVehicles.push(vh);
          }
        }
      }
      if (this.healthOrder) {
        this.healthOrder = 'health0';
      }
      if (this.ageOrder) {
        this.ageOrder = 'age0';
      }
    }
    this.currentVehicles = newVehicles;
    this.filteredVehicles = this.currentVehicles;
    this.currentVehicles.sort(this.propComparator('life_span'));
  }

  propComparator(prop) {
    return (a, b) => a['_battery_id'][prop] - b['_battery_id'][prop];
  }
}
