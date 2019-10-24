export class Marker {
  lat: number;
  long: number;
  label: string;

  constructor(lat, long, label) {
    this.lat = lat;
    this.long = long;
    this.label = label;
  }
}
