import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form17EfComponent } from './form-17-ef.component';

describe('Form17EfComponent', () => {
  let component: Form17EfComponent;
  let fixture: ComponentFixture<Form17EfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Form17EfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Form17EfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
