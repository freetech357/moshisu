import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { departmentAuthGuard } from './department-auth.guard';

describe('departmentAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => departmentAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
