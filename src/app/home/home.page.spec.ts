/*
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from '../services/data.service';
import { HomePage } from './home.page';

// mock the service
class MockDummyService extends DataService {
  // mock everything used by the component
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [HomePage],
      providers: [{
        provide: DataService,
        useClass: MockDummyService
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });
});
*/
