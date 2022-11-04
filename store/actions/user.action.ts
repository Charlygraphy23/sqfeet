/* eslint-disable prettier/prettier */
import { createAction } from '@reduxjs/toolkit';

export const USER_ACTIONS = {
    fetch: createAction('USER_FETCH'),
    fetchSuccess: createAction('USER_FETCH_SUCCESS'),
    fetchError: createAction('USER_FETCH_ERROR'),
};


export const fetchUser = (googleId: string) => ({
    type: USER_ACTIONS.fetch.type,
    payload: googleId
});