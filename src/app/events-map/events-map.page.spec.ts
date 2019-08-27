import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsMapPage } from './events-map.page';

describe('EventsMapPage', () => {
  let component: EventsMapPage;
  let fixture: ComponentFixture<EventsMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
