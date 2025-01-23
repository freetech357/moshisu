import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form17GhijklmnComponent } from './form-17-ghijklmn.component';

describe('Form17GhijklmnComponent', () => {
  let component: Form17GhijklmnComponent;
  let fixture: ComponentFixture<Form17GhijklmnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Form17GhijklmnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Form17GhijklmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
