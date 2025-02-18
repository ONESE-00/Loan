import { TestBed } from '@angular/core/testing';

import { RepaymentsService } from './repayments.service';

describe('RepaymentsService', () => {
  let service: RepaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
