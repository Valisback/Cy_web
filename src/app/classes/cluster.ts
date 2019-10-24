export class Cluster {
  name: string;
  lat: number;
  lng: number;
  radius: number;
  health: number;

  constructor(name, lat, lng, radius, health) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.radius = radius;
    this.health = health;
  }
}
