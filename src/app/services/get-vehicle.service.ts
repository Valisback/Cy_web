import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';


@Injectable({
  providedIn: 'root'
})
export class GetVehicleService {
  constructor(private webReqService: WebRequestService) {}

    retrieveVehicles() {
      return this.webReqService.get('vehicles');
    }

    retrieveVehiclesInCluster(cluster_id) {
      return this.webReqService.get('vehicles/cluster/' + cluster_id);
    }

    retrieveVehicleWithModel(model) {
      return this.webReqService.get('vehicles/model/' + model);
    }

    retrieveParametersOfVehicles(vehicle_id) {
      return this.webReqService.get('parameters/vehicle/' + vehicle_id);
    }

    retrieveParametersAtDate(vehicle_id, date) {
      return this.webReqService.get('parameters/vehicle/' + vehicle_id + '/' + date);
    }

    retrieveParametersBetweenDates(vehicle_id, date1, date2) {
      return this.webReqService.get('parameters/vehicle/' + vehicle_id + '/' + date1 + '/' + date2);
    }
}
