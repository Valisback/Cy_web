import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
/**
 * Purpose: this file regroups all the requests methods we will use in the web app
 */
@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL: string;

  constructor(private http: HttpClient) {
    this.ROOT_URL = environment.api.url; // Address of server
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  post(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }
}
