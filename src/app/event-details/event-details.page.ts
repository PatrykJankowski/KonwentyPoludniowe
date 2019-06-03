import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDetails } from '../models/events.model';

@Component({
  selector: 'ngx-event-details',
  templateUrl: 'event-details.page.html',
  styleUrls: ['event-details.page.scss']
})
export class EventDetailsPage {

  private readonly eventDetails: EventDetails;

  constructor(private activatedRoute: ActivatedRoute) {
    this.eventDetails = this.activatedRoute.snapshot.data.eventDetails[0];
  }
}
