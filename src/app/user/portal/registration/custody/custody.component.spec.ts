import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodyComponent } from './custody.component';

describe('CustodyComponent', () => {
  let component: CustodyComponent;
  let fixture: ComponentFixture<CustodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
