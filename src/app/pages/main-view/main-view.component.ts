import { Component, OnInit, ViewChild, ElementRef, ɵConsole, Output } from '@angular/core';
import { GetVehicleService } from 'src/app/services/get-vehicle.service';
import { GetClustersService } from 'src/app/services/get-clusters.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { NavbarService } from 'src/app/services/navbar.service';

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
  allLastParams = [];
  allVehicles;
  clusterVehicles;
  currentVehicles;
  filteredVehicles;
  clusters;
  ageChosenVehicle;
  parameters;
  vehicleParameter = []; // Parameters of the vehicle between 2 dates

  interval;
  viewGeneral = true;
  viewCluster = false;
  viewVehicle = false;
  sliderVisible = true;
  chosenVehicle;
  chosenCluster;
  panelOpenState;

  // Elements displayed on top cards
  numberOfVehicles;
  tcoSavings = '0';
  criticalBatteries;
  numberOfAlerts;

  // Slider elements
  min_slider_date = 1;
  max_slider_date = 8;
  slider_date_value = 8;
  thumbLabel = true;

  // Line chart elements
  @ViewChild('lineChart', { static: false })
  private chartComponent: BaseChartDirective;


  @ViewChild('yearSlider', { static: true })
  private yearSlider: any;

  lineChartLabels = [];
  lineChartType;
  lineChartLegend;

  // Parameters per view
  allVehiclesChartData = [];
  allVehiclesChartLabels = [];
  clusterVehiclesChartData = [];
  clusterVehiclesChartLabels = [];
  chosenVehicleChartData = [];
  chosenVehicleChartLabels = [];
  genLineChartData = [];
  lineChartData = [];
  lineChartOptions;
  BASELINE = [];

  //Portfolio parameters for each cluster:
  texasPortfolio;
  californiaPortfolio;
  georgiaPortfolio;
  newyorkPorftolio;
  wyomingPortfolio;
  generalPortfolio;

  // tslint:disable: variable-name
  battery_health_top20;
  battery_value_top20;
  energy_cost_top20;
  grid_service_revnue_top20;
  battery_health_portfolio;
  battery_value_portfolio;
  energy_cost_portfolio;
  grid_service_revnue_portfolio;
  battery_health_bottom20;
  battery_value_bottom20;
  energy_cost_bottom20;
  grid_service_revnue_bottom20;

  allinterventions = [];
  chosenVehicleInterventions = [];
  interventionBtnValues = [];

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
            },
            {
                visibility: 'simplified'
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
            },
            {
                visibility: 'simplified'
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
            },
            {
                weight: 0.79
            }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
            {
                visibility: 'off'
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
                visibility: 'simplified'
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
    private getClusterService: GetClustersService,
    public nav: NavbarService,
  ) {}

  private refreshData() {
    this.getClusterService.retrieveClusters().subscribe((response: any) => {
      this.clusters = response.cluster_list;
      let totalTCO = 0;
      for ( const cl of this.clusters) {
        totalTCO += cl.tco_savings;
      }
      this.tcoSavings = (totalTCO / 1000000).toPrecision(2) + 'M';
    });
  }

  ngOnInit() {
    this.nav.show();
    this.refreshData();

    // Generating each cluster portfolio:
    // tslint:disable: max-line-length
    this.texasPortfolio = new PortfolioVals('+14.2%', '15K (+11%)', '7 cents/mi (-22%)', '9K (+14%)', '+2%', '10.2K (+3%)', '10 cents/mi (+2%)', '7K (+1%)', '-14%' , '6K (-10%)', '12ccents/mi (+25%)', '5K (-22%)');
    this.californiaPortfolio = new PortfolioVals('+13.6%', '14K (+10%)', '9 cents/mi (-17%)', '12K (+16%)', '+1%', '9.4K (+2%)', '12 cents/mi (0%)', '9K (+3%)', '-16%' , '4K (-12%)', '14 cents/mi (+25%)', '2K (-30%)');
    this.georgiaPortfolio = new PortfolioVals('+10%', '13K (+10%)', '8 cents/mi (-20%)', '7K (+11%)', '+5%', '11.9K (+5%)', '11 cents/mi (+1%)', '5K (-1%)', '-7%' , '9K (-6%)', '13 cents/mi (+25%)', '3.5K (-27%)');
    this.newyorkPorftolio = new PortfolioVals('+3%', '11K (+8%)', '9 cents/mi (-17%)', '13K (+17%)', '+4%', '11.6K (+5%)', '12 cents/mi (0%)', '10K (+4%)', '-8%' , '9K (-6%)', '14 cents/mi (+25%)', '2K (-30%)');
    this.wyomingPortfolio = new PortfolioVals('+12%', '17K (+12%)', '7 cents/mi (-22%)', '8K (+12%)', '+3%', '11K (+4%)', '10 cents/mi (+2%)', '6K (+0%)', '-11%' , '7K (-8%)', '12 cents/mi (+25%)', '5K (-22%)');
    this.generalPortfolio = new PortfolioVals('+7%', '12K (+9%)', '8 cents/mi (-20%)', '10K (+15%)', '+2%', '10K (+3%)', '12 cents/mi (0%)', '8K (+2%)', '-10%' , '8K (-7%)', '14 cents/mi (+25%)', '2K (-30%)');

    this.allinterventions.push(new Intervention('Limit daily mileage: 47 miles', 'USD 1000 (+1%)', 1));
    this.allinterventions.push(new Intervention('Trim vehicles performance', 'USD 2000 (+2%)', 2));
    this.allinterventions.push(new Intervention('Prioritize low duty routes', 'USD 300 (+0.3%)', 3));
    this.allinterventions.push(new Intervention('Limit charging speed: 35kW', 'USD 1000 (+1%)', 4));
    this.allinterventions.push(new Intervention('Change Location: Orlando, FL', 'USD 100 (+0.1%)', 5));

    this.updatePortfolioParameters(null);

    let perf = 100;
    const view = 'clusterView';
    const maxBaseline = (this.max_slider_date + 2) * 12;
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

    this.lineChartOptions = {
      scaleFontColor: '#8c99af',
      scaleFontStyle: 'normal',
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
              fontColor: '#8c99af',
            },
            ticks: {
              suggestedMax: 105,
              suggesteMin: 70,
              fontColor: '#8c99af',
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
              fontColor: '#8c99af',
              fontStyle: 'normal'

            },
            ticks: {
              maxTicksLimit: 10,
              autoSkip: false,
              fontColor: '#8c99af',
              fixedStepSize: 1,
              maxRotation: 0,
              minRotation: 0,
              fontStyle: 'normal',

            },
            gridLines: {
              display: false
            }
          }
        ]
      },
      legend: {
        position: 'bottom',
        labels: {
          padding: -25,
          useLineStyle: true,
          filter: (legendItem, chartData) => {
            if (legendItem.datasetIndex === 0) {
              return true;
            }
            return false;
            // return true or false based on legendItem's datasetIndex (legendItem.datasetIndex)
          },
          fontColor: '#728098',
          fontSize: 11
        }
      }
    };
  }

  fillCircleColor(circle) {
    return '#0795ff';
    // if (circle.gen_health > 75) {
    //   return 'green';
    // } else if (circle.gen_health > 50) {
    //   return 'orange';
    // } else {
    //   return 'red';
    // }
  }

  getColor(vehicle) {
    const today = Date.now();
    const age = this.battery_age(today, vehicle.date_of_creation);
    const vhPerf = vehicle.parameters[0].performance;
    if (vhPerf >= this.BASELINE[age] * 0.98) {
      return '#ffffff';
    } else if (vhPerf >= this.BASELINE[age] * 0.85) {
      return '#ff8d04';
    } else {
      return '#fc376e';
    }
  }

  calculateAge(vehicle) {
    const today = Date.now();
    const age = this.battery_age(today, vehicle.date_of_creation);
    this.ageChosenVehicle = Math.floor(age / 12);
    if (this.ageChosenVehicle < 1 ) {
      this.ageChosenVehicle = age;
    }
  }

  changeButtonColor(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    const value = idAttr.nodeValue;
    if (this.interventionBtnValues[value]) {
      this.interventionBtnValues[value] = false;
    } else {
      this.interventionBtnValues[value] = true;
    }
  }

  refreshCurrentView(refreshedView) {
    if (refreshedView === 'general') {
      this.currentVehicles = this.allVehicles;
      this.lineChartData = this.allVehiclesChartData;
      this.regionOrder = null;
      this.updateTCOSsavings(null);
      this.updatePortfolioParameters(null);
      this.sliderEvent();
    } else if (refreshedView === 'cluster') {
      this.currentVehicles = this.clusterVehicles;
      this.lineChartData = this.clusterVehiclesChartData;
      this.regionOrder = 'region' + this.chosenCluster.name;
      this.updatePortfolioParameters( this.chosenCluster.name);
      this.sliderEvent();
    } else if (refreshedView === 'vehicle') {
      this.lineChartData = this.chosenVehicleChartData;
      this.lineChartLabels = this.chosenVehicleChartLabels;
    }
  }

  onVehicleChosen(vehicle) {
    let tco_savings;
    if (this.chosenVehicle === vehicle) {
      this.chosenCluster = vehicle.cluster;
      const refreshedView = 'vehicle';
      this.refreshCurrentView(refreshedView);
      this.tcoSavings = vehicle.tco_savings + 'k';
    } else {
      // Shuffle array
      const shuffled = this.allinterventions.sort(() => 0.5 - Math.random());

      // Get sub-array of first 3 elements after shuffled
      this.chosenVehicleInterventions = shuffled.slice(0, 3);
      this.chosenVehicle = vehicle;
      const today = Date.now();
      const age = this.battery_age(today, vehicle.date_of_creation);
      const distance = age * Math.random() * 1000 + 300;
      const vhPerf = vehicle.parameters[0].performance;
      if (vhPerf < this.BASELINE[age] ) {
        tco_savings = - (((120 - vhPerf) * Math.random() * (1 + age)) / 1000).toFixed(1);

      } else {
        tco_savings = ((vhPerf * Math.random() * (1 + age)) / 1000).toFixed(1);

      }
      this.tcoSavings = tco_savings + 'k';
      vehicle.age = age;
      vehicle.tco_savings = tco_savings;
      vehicle.distance = (distance.toFixed(1));
      console.log(vehicle.distance);
      this.chosenCluster = vehicle.cluster;
      const arrayVehicle = [];
      arrayVehicle.push(vehicle);
      const view = 'vehicleView';
      this.refreshGraphs(arrayVehicle, view);
    }
    this.recenterMap(vehicle.position_lat, vehicle.position_lng);
    this.zoom = this.GEN_ZOOM + 2;
    this.numberOfVehicles = 1;

  }

  sliderEvent() {
    if (this.viewGeneral || !this.chosenCluster) {
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
            if (dataset.data[i] < this.BASELINE[i] * 0.85) {
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
    this.ageOrder = null;
    if (this.regionOrder !== ('region' + circle.name)){
      this.regionOrder = 'region' + circle.name;
    }
    this.healthOrder = null;
    if (this.clusterVehicles && circle === this.clusterVehicles._id) {
      const refreshedView = 'cluster';
      this.refreshCurrentView(refreshedView);
    } else {
      this.chosenCluster = circle;
      await this.chargeVehicles(circle);
    }
    this.recenterMap(circle.center_lat, circle.center_lng);
    this.circleVisible = false;
    this.zoom = this.GEN_ZOOM + 1;
    this.updatePortfolioParameters(circle.name);
    this.updateTCOSsavings(circle);
  }

  updateTCOSsavings(cluster) {
    if ( cluster === null ) {
      let totalTCO = 0;
      for ( const cl of this.clusters) {
        totalTCO += cl.tco_savings;
      }
      this.tcoSavings = (totalTCO / 1000000).toPrecision(2) + 'M';
    } else {
      this.tcoSavings = (cluster.tco_savings / 1000000).toPrecision(2) + 'M';
    }

  }

  updatePortfolioParameters(cluster_name) {
    let selectedPortfolio;
    if (cluster_name === null) {
      selectedPortfolio = this.generalPortfolio;
    } else {
      console.log(cluster_name);

      switch (cluster_name) {
        case 'Texas' : selectedPortfolio = this.texasPortfolio;
                       break;
        case 'New York' : selectedPortfolio = this.newyorkPorftolio;
                          break;
        case 'California' : selectedPortfolio = this.californiaPortfolio;
                            break;
        case 'Georgia' : selectedPortfolio = this.georgiaPortfolio;
                         break;
        case 'Wyoming' : selectedPortfolio = this.wyomingPortfolio;
                         break;
        default: selectedPortfolio = this.generalPortfolio;
                 break;
      }
    }
    this.battery_health_top20 = selectedPortfolio.battery_health_top20;
    this.battery_value_top20 = selectedPortfolio.battery_value_top20;
    this.energy_cost_top20 = selectedPortfolio.energy_cost_top20;
    this.grid_service_revnue_top20 = selectedPortfolio.grid_service_revnue_top20;
    this.battery_health_portfolio = selectedPortfolio.battery_health_portfolio;
    this.battery_value_portfolio = selectedPortfolio.battery_value_portfolio;
    this.energy_cost_portfolio = selectedPortfolio.energy_cost_portfolio;
    this.grid_service_revnue_portfolio = selectedPortfolio.grid_service_revnue_portfolio;
    this.battery_health_bottom20 = selectedPortfolio.battery_health_bottom20;
    this.battery_value_bottom20 = selectedPortfolio.battery_value_bottom20;
    this.energy_cost_bottom20 = selectedPortfolio.energy_cost_bottom20;
    this.grid_service_revnue_bottom20 = selectedPortfolio.grid_service_revnue_bottom20;
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
      const projectionTime = new Date(date.setFullYear(date.getFullYear() + 2)); // Creating projection 2 years ahead from now
      this.viewVehicle = true;
      this.viewGeneral = false;
      this.viewCluster = false;
      const creationDate = new Date(vehicles[0].date_of_creation);
      this.loadVehicleParameterBetweenDates(vehicles, creationDate, projectionTime);
    }
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
      this.circleVisible = true;
      const refreshedview = 'general';
      this.refreshCurrentView(refreshedview);
    } else if (event <= this.GEN_ZOOM && this.viewVehicle) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle = false;
      this.zoom = event;
      this.circleVisible = true;
      const refreshedview = 'general';
      this.refreshCurrentView(refreshedview);
    } else if (event > this.GEN_ZOOM + 1 && this.viewVehicle) {
      this.zoom = event;
      this.viewCluster = false;
      this.viewVehicle = true;
      this.viewGeneral = false;
      this.circleVisible = false;
      // const arrayVehicle = [];
      // arrayVehicle.push(this.chosenVehicle);
      // this.currentVehicles = arrayVehicle;
    } else if (event > this.GEN_ZOOM) {
      this.zoom = event;
      this.viewCluster = true;
      this.viewVehicle = false;
      this.viewGeneral = false;
      this.circleVisible = false;
      if (this.clusterVehicles) {
        const refreshedview = 'cluster';
        this.refreshCurrentView(refreshedview);
      }
      console.log(this.currentVehicles);
    } else if (event <= this.GEN_ZOOM && this.viewVehicle) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle = false;
      this.zoom = event;
      this.circleVisible = true;
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
        this.sliderEvent();
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
    if (vehicles === this.allVehicles) {
      this.getVehicleService
          .retrieveAllVehicleParametersAtDate(date)
          .subscribe((response: any) => {
            this.allLastParams = response.parameters;
            this.allLastParams.pop();
            for (const pm of this.allLastParams) {
              const dataset = [];
              const battAge = this.battery_age(date, pm.vehicle.date_of_creation); // returns current age of battery
              let month;
              for (month = 0; month < battAge; month++) {
                dataset.push(empty);
              }
              const lowerThreshold = this.BASELINE[month] * 0.85;
              const upperThreshold = this.BASELINE[month];
              let pointColor;
              if (pm.performance < lowerThreshold) {
                pointColor = '#fc376e';
                this.criticalBatteries++;
              } else if (pm.performance > upperThreshold) {
                pointColor = '#ffffff';
              } else {
                pointColor = '#ff8d04';
                this.numberOfAlerts++;
              }
              dataset.push(pm.performance);
              this.lineChartData.push({
                data: dataset,
                label: pm.vehicle.model,
                pointBackgroundColor: pointColor,
                pointBorderColor: false,
              });
              //console.log(this.lineChartData);
            }
            this.statistics = true;
            this.allVehiclesChartData = this.lineChartData;
            this.allVehiclesChartLabels = this.lineChartLabels;
          });
    } else {
      for (const pm of this.allLastParams) {
        const idCluster = this.clusterVehicles[0].cluster._id;
        if (pm.vehicle.cluster === idCluster) {
          const dataset = [];
          const battAge = this.battery_age(date, pm.vehicle.date_of_creation); // returns current age of battery
          let month;
          for (month = 0; month < battAge; month++) {
            dataset.push(empty);
          }
          const lowerThreshold = this.BASELINE[month] * 0.85;
          const upperThreshold = this.BASELINE[month];
          let pointColor;
          if (pm.performance < lowerThreshold) {
            pointColor = '#fc376e';
            this.criticalBatteries++;
          } else if (pm.performance > upperThreshold) {
            pointColor = '#ffffff';
          } else {
            pointColor = '#ff8d04';
            this.numberOfAlerts++;
          }
          dataset.push(pm.performance);
          this.lineChartData.push({
            data: dataset,
            label: pm.vehicle.model,
            pointBackgroundColor: pointColor,
            pointBorderColor: false,
          });
        }
      }
      this.statistics = true;
      this.clusterVehiclesChartData = this.lineChartData;
      this.clusterVehiclesChartLabels = this.lineChartLabels;
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
        if( j < 7 ) {
          label = i + '-' + j;
        } else {
          label = '';
        }

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
    const dataset1 = [];
    const dataset2 = [];
    this.getVehicleService
      .retrieveParametersBetweenDates(vehicle[0]._id, date1, date2)
      .subscribe((response: any) => {
        this.vehicleParameter = response.parameters;
        let p;
        for (p of this.vehicleParameter) {
          const paramDate = new Date(p.time);
          if (paramDate <= new Date()) {
          dataset1.push(p.performance);

          } else {
            break;
          }
          i++;
        }
        this.chosenVehicle.performance = p.performance;
        this.chosenVehicle.batteryValue = p.cost_value;
        const today = new Date();
        const age = this.battery_age(today, this.chosenVehicle.date_of_creation)
        const vhPerf = this.chosenVehicle.parameters[0].performance;
        let borderColor;
        if (vhPerf >= this.BASELINE[age] * 0.98) {
          borderColor = '#ffffff';
        } else if (vhPerf >= this.BASELINE[age] * 0.85) {
          borderColor = '#ff8d04';
        } else {
          borderColor = '#fc376e';
        }
        this.lineChartData.push({
          data: dataset1,
          label: vehicle[0].model,
          fill: false,
          borderDash: [0, 0],
          pointRadius: 0,
          // pointBackgroundColor: pointColor,
          borderColor: borderColor,
        });
        let d;
        for (d of this.vehicleParameter) { // For the projection
          const paramDate = new Date(d.time);
          if (paramDate > new Date()) {
          dataset2.push(d.performance);
          const lowerThreshold = this.BASELINE[i] * 0.8;
          const upperThreshold = this.BASELINE[i];
          // if (d.performance < lowerThreshold) {
          //     pointColor.push('#ff0000');
          //   } else if (d.performance > upperThreshold) {
          //     pointColor.push('#b1c3e2');
          //   } else {
          //     pointColor.push('#fc376e');
          //   }
          } else {
            dataset2.push(empty);
          }
          i++;
        }
        this.lineChartData.push({
          data: dataset2,
          label: vehicle[0].model,
          fill: false,
          borderDash: [5, 5],
          pointRadius: 0,
          // pointBackgroundColor: pointColor,
          borderColor: '#b1c3e2',
        });
        this.genLineChartData = this.lineChartData;
        this.chosenVehicleChartData = this.lineChartData;
        this.chosenVehicleChartLabels = this.lineChartLabels;
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
    if (this.viewVehicle) {
      if (this.chosenCluster) {
        console.log('back from CHOSEN CLUSTER', this.chosenCluster);
        this.viewVehicle = false;
        this.viewCluster = true;
        this.viewGeneral = false;
        this.onCircleClicked(this.chosenCluster);
        this.regionOrder = 'region' + this.chosenCluster.name;
      } else {
        this.viewVehicle = false;
        this.viewCluster = false;
        this.viewGeneral = true;
        this.circleVisible = true;
        const refreshedview = 'general';
        this.refreshCurrentView(refreshedview);
        this.recenterMap(this.GEN_LAT, this.GEN_LNG);
        this.zoom = this.GEN_ZOOM - 1;
      }
    } else if (this.viewCluster) {
      this.viewGeneral = true;
      this.viewCluster = false;
      this.viewVehicle = false;
      this.circleVisible = true;
      const refreshedview = 'general';
      this.refreshCurrentView(refreshedview);
      this.zoom = this.GEN_ZOOM - 1;
      this.recenterMap(this.GEN_LAT, this.GEN_LNG);
    }
    this.ageOrder = null;
    this.healthOrder = null;
  }

  topCardClicked(id) {
    if (this.viewGeneral) {
      this.genLineChartData = this.allVehiclesChartData;
    } else if (this.viewCluster) {
      this.genLineChartData = this.clusterVehiclesChartData;
    } else {
      this.genLineChartData = this.chosenVehicleChartData;
    }
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
                pointColor = '#ff8d04';
                this.numberOfAlerts++;
              } else if (id === '4') {
                // For Critical Issues
                lowerThreshold = this.BASELINE[i] * 0.85;
                pointColor = '#fc376e';
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
              fill: false,
              label: dataset.label,
              pointBackgroundColor: pointColor,
              pointBorderColor: false
            });
          }
        }
      }
      this.lineChartData = newLineChartData;
    }
    this.calculateTopParameters();

  }

  onFilterChanged(value) {
    if (!value) {
      return;
    }
    if (this.viewGeneral || value.includes('region')) {
      this.currentVehicles = this.allVehicles;
    } else if (this.viewCluster) {
      this.currentVehicles = this.clusterVehicles;
    } else {
      const arrayVehicle = [];
      arrayVehicle.push(this.chosenVehicle);
      this.currentVehicles = arrayVehicle;
    }

    let newVehicles = [];
    let bool = true;
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
        const vhPerf = vh.parameters[0].performance;
        if (vhPerf > min_health && vhPerf <= max_health) {
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
          this.zoom = this.GEN_ZOOM - 1;
          this.recenterMap(this.GEN_LAT, this.GEN_LNG);
        } else {
          const clname = value.slice(6, value.length);
          if (vh.cluster.name === clname) {
            newVehicles.push(vh);
            if (bool) {
            for ( const cl of this.clusters) {
              if (cl.name === clname) {
                this.onCircleClicked(cl);
              }
            }
            bool = false;
          }
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
    this.currentVehicles.sort(this.propComparator('performance'));
  }

  propComparator(prop) {
    return (a, b) => a['parameters'][0][prop] - b['parameters'][0][prop];
  }
}



class PortfolioVals {
  battery_health_top20: string;
  battery_value_top20: string;
  energy_cost_top20: string;
  grid_service_revnue_top20: string;
  battery_health_portfolio: string;
  battery_value_portfolio: string;
  energy_cost_portfolio: string;
  grid_service_revnue_portfolio: string;
  battery_health_bottom20: string;
  battery_value_bottom20: string;
  energy_cost_bottom20: string;
  grid_service_revnue_bottom20: string;

  constructor(battery_health_top20, battery_value_top20, energy_cost_top20, grid_service_revnue_top20, battery_health_portfolio, battery_value_portfolio,
              energy_cost_portfolio,
              grid_service_revnue_portfolio,
              battery_health_bottom20,
              battery_value_bottom20,
              energy_cost_bottom20,
              grid_service_revnue_bottom20) {
     this.battery_health_top20 = battery_health_top20;
     this.battery_value_top20 = battery_value_top20;
     this.energy_cost_top20 = energy_cost_top20;
     this.grid_service_revnue_top20 = grid_service_revnue_top20;
     this.battery_health_portfolio = battery_health_portfolio;
     this.battery_value_portfolio = battery_value_portfolio;
     this.energy_cost_portfolio = energy_cost_portfolio;
     this.grid_service_revnue_portfolio = grid_service_revnue_portfolio;
     this.battery_health_bottom20 = battery_health_bottom20;
     this.battery_value_bottom20 = battery_value_bottom20;
     this.energy_cost_bottom20 = energy_cost_bottom20;
     this.grid_service_revnue_bottom20 = grid_service_revnue_bottom20;

  }
}

class Intervention {
  options: string;
  tco_savings: string;
  id: number;

  constructor(options, tco_savings, id) {
    this.options = options;
    this.tco_savings = tco_savings;
    this.id = id;
  }
}
