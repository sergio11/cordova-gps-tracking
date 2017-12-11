import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { location  } from './modules/location';

export default function configureStore() {
    console.log("Combine Reducer, create store")
    const appReducer = combineReducers({
        location
    });
    return createStore(appReducer, applyMiddleware(thunk));
};