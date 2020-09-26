import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [];

export default function (state = initialState, action) {
    const { type, payload } = action;//destructuring, do not need to do action.type or action.payload
    switch (type) {
        //depending on type, need to decide what to send down as far as state

        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            //return state(of type array) and filter through it
            //check each alert for its id to check if its the same as payload and returns all that DO NOT MATCH the payload
            return state.filter(alert => alert.id !== payload);
        default://every reducer should have a default case of return state
            return state;
    }
}