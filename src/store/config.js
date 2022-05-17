import { combineReducers, configureStore } from '@reduxjs/toolkit';
import testReducer from './reducer/test.reducer';
import scheduleReducer from './reducer/schedule.reducer';
import triggerReducer from './reducer/trigger.reducer';

const reducers = combineReducers({
    test: testReducer,
    schedule: scheduleReducer,
    trigger: triggerReducer,
});
export const store = configureStore({ reducer: reducers, middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }) });
