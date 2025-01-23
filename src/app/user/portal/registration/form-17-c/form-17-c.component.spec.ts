import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form17CComponent } from './form-17-c.component';

describe('Form17CComponent', () => {
  let component: Form17CComponent;
  let fixture: ComponentFixture<Form17CComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Form17CComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Form17CComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
