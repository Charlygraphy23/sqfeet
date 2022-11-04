/* eslint-disable prettier/prettier */
import { createReducer } from '@reduxjs/toolkit';
import { USER_ACTIONS } from 'store/actions';

const initialState = {
    loading: false,
    firstName: '',
    lastName: '',
    profileImage: '',
    error: '',
};


export const userReducer = createReducer(initialState, (builder) => {
    builder.addCase(USER_ACTIONS.fetch, (state) => ({
        ...state,
        loading: true,
        error: '',
    }))
        .addCase(USER_ACTIONS.fetchSuccess, (state, action: any) => ({
            ...state,
            loading: false,
            firstName: action?.payload?.firstName,
            lastName: action?.payload?.lastName,
            profileImage: action?.payload?.profileImage,

        })).addCase(USER_ACTIONS.fetchError, (state, action: any) => ({
            ...state,
            loading: false,
            error: action?.payload
        }));
});

export type UserReducerType = typeof initialState
