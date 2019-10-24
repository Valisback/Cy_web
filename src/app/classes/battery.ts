export class Battery {
  name: string;
  charge: number;
  life_span: number;
  status: string;
  date_of_creation: Date;

  constructor(name, charge, lifespan, status, dateofcreation) {
    this.name = name;
    this.charge = charge;
    this.life_span = lifespan;
    this.status = status;
    this.date_of_creation = dateofcreation;
  }
}
