import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServererrComponent } from './servererr.component';

describe('ServererrComponent', () => {
  let component: ServererrComponent;
  let fixture: ComponentFixture<ServererrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServererrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServererrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
