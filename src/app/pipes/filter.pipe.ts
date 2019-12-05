import { Pipe, PipeTransform } from '@angular/core';

import { Event } from '@models/event.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  public transform(events: Array<Event>, date: string, location: string, category: string, search: string): Array<any> {
    if (events === null) {
      return [];
    }

    const todayDate: Date = new Date();
    let futureEvents: boolean = false;

    if (!date) {
      futureEvents = true;
    }

    return events.filter((event: Event) => (
      event.event_type.indexOf(category) > -1 &&
      event.location.indexOf(location) > -1 &&
      ((futureEvents && new Date(event.date_end) >= todayDate) || (!futureEvents && (event.date_begin.includes(date) || event.date_end.includes(date))))) &&

      (event.name
          .toLowerCase()
          .indexOf(search.toLowerCase()) > -1
      ));
  }
}
