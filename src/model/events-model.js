// import { mockEvents } from '../mock/events.js';
// import { mockDestinations } from '../mock/destinations.js';
// import { mockOffers } from '../mock/offers.js';
import Observable from '../framework/observable.js';
import { EVENT_TYPES, UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #apiService = null;
  #events = [];
  #destinations = null;
  #offers = null;

  constructor({apiService, destinations, offers}) {
    super();
    this.#apiService = apiService;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  async init() {
    try{
      const events = await this.#apiService.events;
      this.#events = events.map(this.#adaptEventToClient);
      this.#destinations = await this.#apiService.destinations;
      this.#offers = await this.#apiService.offers;
      this._notify(UpdateType.INIT)
    } catch {
      this.#events = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.ERROR);
    }
  }

  #adaptEventToClient(event) {
    const newEvent = {
      ...event,
      basePrice: event['basePrice'],
      dateTo: event['dateTo'],
      dateFrom: event['dateFrom'],
      isFavorite: event['isFavorite'],
    }
    delete newEvent['basePrice'];
    delete newEvent['dateTo'];
    delete newEvent['dateFrom'];
    delete newEvent['isFavorite'];

    return newEvent
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updateEvent(updateType, update) {
    const index = this.#events.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, event) {
    this.#events = this.#events.filter((item) => item.id !== event.id)

    this._notify(updateType);
  }


  getOffersByType(type = EVENT_TYPES[0].toLocaleLowerCase()) {
    return this.#offers.find((offer) => (offer.type === type)).offers
  }
}
