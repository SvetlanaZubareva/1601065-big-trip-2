import EventFormView from '../view/event-form-view.js';
import EventView from '../view/event-view.js';
import { replace, render, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsModel = null;
  #destinations = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #eventContainer = null;
  #handleDataChange = null;
  #event = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({eventsModel, eventContainer, onDataChange, onModeChange}) {
    this.#eventsModel = eventsModel;
    this.#destinations = eventsModel.destinations;
    this.#eventContainer = eventContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event) {
    this.#event = event;
    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event,
      allDestinations: this.#destinations,
      offersByType: this.#eventsModel.getOffersByType(event.type),
      onFavoriteClick: this.#handleFavoriteClick,
      onEditClick: this.#handleEditClick,
    });

    this.#eventEditComponent = new EventFormView({
      event,
      allDestinations: this.#destinations,
      offersByType: this.#eventsModel.getOffersByType(event.type),
      onEditClick:  this.#closeForm,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToCard();
    }
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #closeForm = () => {
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#closeForm();
    }
  };

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  };


    #handleFormSubmit = (update) => {
      const isMinorUpdate =
      this.#event.dateFrom === update.dateFrom ||
      this.#event.dateTo === update.dateTo ||
      this.#event.basePrise === update.basePrise

    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      false ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (event) => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };
}
