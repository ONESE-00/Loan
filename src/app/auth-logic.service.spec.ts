import { TestBed } from '@angular/core/testing';

import { AuthLogicService } from './auth-logic.service';

describe('AuthLogicService', () => {
  let service: AuthLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
