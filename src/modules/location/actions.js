import * as actionTypes from './actionTypes';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';


export function toggleTrackingAsyncAction() {

    return (dispatch) => { 
       
        console.log("toggleTrackingAsyncAction called ...");

        BackgroundGeolocation.checkStatus(({ isRunning, authorization }) => {
            
            if (!isRunning) {
    
                if (authorization == BackgroundGeolocation.AUTHORIZED) {
                    console.log("Start Background Geolocation");
                    BackgroundGeolocation.start();

                } else {
                    console.log("Location services are disabled");
                    // Location services are disabled
                    dispatch({
                        type: actionTypes.LOCATION_SERVICES_ARE_DISABLED
                    });

                    /*Alert.alert(
                      'Location services disabled',
                      'Would you like to open location settings?',
                      [
                        {
                          text: 'Yes',
                          onPress: () => BackgroundGeolocation.showLocationSettings()
                        },
                        {
                          text: 'No',
                          onPress: () => console.log('No Pressed'),
                          style: 'cancel'
                        }
                      ]
                    );*/
                }
            } else {
                console.log("Stop Background Geolocation");
                BackgroundGeolocation.stop();
            }
        });
    }
}

export function getValidLocationsAsyncAction() {

    return (dispatch) => {

        console.log("getValidLocationsAsyncAction called ...");

        BackgroundGeolocation.getValidLocations(
            (locations) => {

                console.log("Locations -> ", locations);
    
                let region = null;
                const now = Date.now();
                const latitudeDelta = 0.01;
                const longitudeDelta = 0.01;
                const durationOfDayInMillis = 24 * 3600 * 1000;
            
                const locationsPast24Hours = locations.filter(location => {
                  return now - location.time <= durationOfDayInMillis;
                });
            
                if (locationsPast24Hours.length > 0) {
                  // asume locations are already sorted
                  const lastLocation =
                    locationsPast24Hours[locationsPast24Hours.length - 1];
                  region = Object.assign({}, lastLocation, {
                    latitudeDelta,
                    longitudeDelta
                  });
                }

                console.log("Locations Past 24 Hours -> ", locationsPast24Hours);
                console.log("Region -> " , region);

                dispatch({
                    type: actionTypes.VALID_LOCATIONS_LOADED,
                    payload: {
                        locations: locationsPast24Hours,
                        region: region
                    }
                });
            },
            (msg) => console.log(`[ERROR] getLocations: ${msg}`)
        );


    };
}





