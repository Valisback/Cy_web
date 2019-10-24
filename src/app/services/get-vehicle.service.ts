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
}
