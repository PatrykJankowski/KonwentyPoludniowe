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
    this.eventDetails = JSON.parse(this.activatedRoute.snapshot.data.eventDetails.data)[0];
    this.eventDetails.description = this.eventDetails.description.replace(/<[^>]*>/g, '');
  }
}
