import { TestBed } from '@angular/core/testing';

import { GetClustersService } from './get-clusters.service';

describe('GetClustersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetClustersService = TestBed.get(GetClustersService);
    expect(service).toBeTruthy();
  });
});
