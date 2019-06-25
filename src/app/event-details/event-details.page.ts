import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDetails } from '../models/events.model';

@Component({
  selector: 'ngx-event-details',
  templateUrl: 'event-details.page.html',
  styleUrls: ['event-details.page.scss']
})
export class EventDetailsPage {

  private eventDetails: EventDetails;

  constructor(private activatedRoute: ActivatedRoute) {
    this.eventDetails = this.activatedRoute.snapshot.data.eventDetails;
    if (this.eventDetails.description) {
      this.eventDetails.description = this.eventDetails.description.replace(/<[^>]*>/g, '');
    }
    if (this.eventDetails.price) {
      this.eventDetails.price = this.eventDetails.price.replace(/<[^>]*>/g, '');
    }
  }
}
