import { combineReducers, configureStore } from '@reduxjs/toolkit';
import testReducer from './reducer/test.reducer';
import scheduleReducer from './reducer/schedule.reducer';
import compareReducer from './reducer/compare.reducer';
import triggerReducer from './reducer/trigger.reducer';
import userReducer from './reducer/user.reducer';

const reducers = combineReducers({
    test: testReducer,
    schedule: scheduleReducer,
    compare: compareReducer,
    trigger: triggerReducer,
    user: userReducer,
});
export const store = configureStore({ reducer: reducers, middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }) });
