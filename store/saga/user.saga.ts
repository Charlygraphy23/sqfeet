/* eslint-disable prettier/prettier */
import { put, takeLatest } from 'redux-saga/effects';
import { USER_ACTIONS } from 'store/actions';
import { axiosInstance } from '_http';

function fetchApi(googleId: string) {
    return axiosInstance.post('/profile', { googleId });
}

function* get(action: any) {
    try {

        const { payload } = action;

        const { data = {} } = yield fetchApi(payload);

        yield put({
            type: USER_ACTIONS.fetchSuccess.type, payload: {
                firstName: data?.data?.firstName,
                lastName: data?.data?.lastName,
                profileImage: data?.data?.profileImage
            }
        });

    }
    catch (err: any) {

        yield put({
            type: USER_ACTIONS.fetchError.type, payload: err?.message
        });
    }


}

export function userSaga() {
    return takeLatest(USER_ACTIONS.fetch, get);
}
