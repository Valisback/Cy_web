export class Path {
  time: number;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;

  constructor(time, startlat, startlng, endlat, endlng) {
    this.time = time;
    this.start_lat = startlat;
    this.start_lng = startlng;
    this.end_lat = endlat;
    this.end_lng = endlng;
  }
}
