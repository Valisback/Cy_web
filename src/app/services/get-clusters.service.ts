import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class GetClustersService {
  constructor(private webReqService: WebRequestService) {}

    retrieveClusters() {
      return this.webReqService.get('clusters');
    }
}
