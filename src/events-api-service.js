import  ApiService  from './framework/api-service.js'
import { ApiMethod } from './const.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class  EventsApiServiceextends extends ApiService {
  get events() {
    return this._load({url: 'events'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `events/${event.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async addEvent(event) {
    const response = await this._load({
      url: `events/${event.id}`,
      method: ApiMethod.POST,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deleteEvent(event) {
    await this._load({
      url: 'events',
      method: ApiMethod.DELETE,
    })
  }

  #adaptEventToServer(event) {
    const newEvent = {
      ...event,
      'basePrise': parseInt(event.basePrise, 10),
      'dateTo': event.dateTo,
      'dateFrom': event.dateFrom,
      'isFavorite': event.isFavorite,
    };
    delete newEvent.basePrise;
    delete newEvent.dateTo;
    delete newEvent.dateFrom;
    delete newEvent.isFavorite;
    return newEvent;
  }
}
