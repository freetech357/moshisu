import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form17AbComponent } from './form-17-ab.component';

describe('Form17AbComponent', () => {
  let component: Form17AbComponent;
  let fixture: ComponentFixture<Form17AbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Form17AbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Form17AbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
