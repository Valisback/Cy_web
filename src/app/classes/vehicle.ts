import { Cluster } from './cluster';
import { Battery } from './battery';
import { Path } from './path';

export class Vehicle {
  pos_lat: number;
  pos_lng: number;
  model: string;
  clusterId: string;
  battery: Battery;
  date_of_creation: Date;
  path: Path;

  constructor(poslat, poslng, model, cluster, battery, datecreation, path) {
    this.pos_lat = poslat;
    this.pos_lng = poslng;
    this.model = model;
    this.clusterId = cluster;
    this.battery = battery;
    this.date_of_creation = datecreation;
    this.path = path;
  }


}
