import { combineReducers, configureStore } from '@reduxjs/toolkit';
import testReducer from './reducer/test.reducer';
import scheduleReducer from './reducer/schedule.reducer';

const reducers = combineReducers({
    test: testReducer,
    schedule: scheduleReducer,
});
export const store = configureStore({ reducer: reducers, middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }) });
