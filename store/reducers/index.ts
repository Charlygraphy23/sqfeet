/* eslint-disable prettier/prettier */
import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user.reducer';

const reducers = combineReducers({
    user: userReducer,
});

export default reducers;
