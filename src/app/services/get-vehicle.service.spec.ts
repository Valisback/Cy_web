import { TestBed } from '@angular/core/testing';

import { GetVehicleService } from './get-vehicle.service';

describe('GetVehicleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetVehicleService = TestBed.get(GetVehicleService);
    expect(service).toBeTruthy();
  });
});
