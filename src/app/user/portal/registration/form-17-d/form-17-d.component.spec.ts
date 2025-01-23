import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form17DComponent } from './form-17-d.component';

describe('Form17DComponent', () => {
  let component: Form17DComponent;
  let fixture: ComponentFixture<Form17DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Form17DComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Form17DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
