const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive' , 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const FILTER_TYPES = {
  Everything: 'Everything',
  Future: 'Future',
  Present: 'Present',
  Past: 'Past',
};

const SORT_TYPES = {
  Day: 'Day',
  Event: 'Event',
  Time: 'Time',
  Price: 'Price',
  Offers: 'Offers',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const ApiMethod = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export {EVENT_TYPES, FILTER_TYPES, SORT_TYPES, UserAction, UpdateType, ApiMethod};
