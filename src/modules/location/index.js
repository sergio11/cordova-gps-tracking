
import { 
    GEOLOCATION_TRACKING_IS_RUNNING, 
    GEOLOCATION_TRACKING_HAS_BEEN_STOPED,
    VALID_LOCATIONS_LOADED,
    GEOLOCATION_ERROR_OCURRED,
    LOCATION_SERVICES_ARE_DISABLED,
    LOCATION_SERVICES_ARE_ENABLED,
    NEW_LOCATION_OBTAINED } from './actionTypes';

export * from './actions';

import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

const initialState = {
    region: null,
    locations: [],
    stationaries: [],
    isRunning: false,
    authorized: true,
    error: null
}


// Main Module Reducer
export function location(state=initialState, action){
    switch(action.type){
        case GEOLOCATION_TRACKING_IS_RUNNING:
            return {
                ...state,
                isRunning: true
            }
        case GEOLOCATION_TRACKING_HAS_BEEN_STOPED:
            return {
                ...state,
                isRunning: false
            }
        case VALID_LOCATIONS_LOADED:
            return {
                ...state,
                locations: action.payload.locations,
                region: action.payload.region
            }
        case LOCATION_SERVICES_ARE_DISABLED:
            return {
                ...state,
                authorized: false
            }
        case LOCATION_SERVICES_ARE_ENABLED:
            return {
                ...state,
                authorized: true
            }
        case GEOLOCATION_ERROR_OCURRED:
            return {
                ...state,
                error: action.payload.message
            }
        case NEW_LOCATION_OBTAINED:

            let newState;

            const longitudeDelta = 0.01;
            const latitudeDelta = 0.01;
            if (location.radius) {
                const region = Object.assign({}, location, {
                    latitudeDelta,
                    longitudeDelta
                });
                const stationaries = state.stationaries.slice(0);
                stationaries.push(location);
                newState = {
                    ...state,
                    stationaries: stationaries,
                    region: region
                };
            } else {
                const region = Object.assign({}, location, {
                    latitudeDelta,
                    longitudeDelta
                });
                const locations = state.locations.slice(0);
                locations.push(location);
                newState = {
                    ...state,
                    locations: locations,
                    region: region
                };
            }

            return newState;
        default:
            return state;
    }
}

export default function configureBackgroundTrackingService(store) {

    BackgroundGeolocation.on('start', () => {
        console.log('[DEBUG] BackgroundGeolocation has been started');
        store.dispatch({
            type: GEOLOCATION_TRACKING_IS_RUNNING
        });
    });
    
    BackgroundGeolocation.on('stop', () => {
        console.log('[DEBUG] BackgroundGeolocation has been stopped');
        store.dispatch({
            type: GEOLOCATION_TRACKING_HAS_BEEN_STOPED
        });
    });

    BackgroundGeolocation.on('error', ({ message }) => {
        console.log('BackgroundGeolocation error', message);
        store.dispatch({
            type: GEOLOCATION_ERROR_OCURRED,
            payload: {
                message: message
            }
        });
    });


    BackgroundGeolocation.on('authorization', status => { 
        console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
        
        if (status !== BackgroundGeolocation.AUTHORIZED) {
            dispatch({
                type: LOCATION_SERVICES_ARE_DISABLED
            });
        } else {
            dispatch({
                type: LOCATION_SERVICES_ARE_ENABLED
            });
        }

    });

    BackgroundGeolocation.on('location', newLocation => {
        console.log('[DEBUG] BackgroundGeolocation location', location);
        dispatch({
            type: NEW_LOCATION_OBTAINED,
            payload: {
                location: newLocation
            }
        });
    });

  
    BackgroundGeolocation.on('foreground', () => {
        console.log('[INFO] App is in foreground');
    });
  
    BackgroundGeolocation.on('background', () => {
        console.log('[INFO] App is in background');
    });

}



