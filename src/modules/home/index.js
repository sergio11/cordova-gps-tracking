export * from './actions';

const initialState = {
    region: null,
    locations: [],
    stationaries: [],
    isRunning: false
}

export default function home(state=initialState, action){ 
    console.log("Reducer Called -> ACTION:" , action, " State:", state);
    return status;
}
