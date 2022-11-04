/* eslint-disable prettier/prettier */
import { all } from 'redux-saga/effects';
import { userSaga } from './user.saga';

export default function* rootSaga() {

    yield all([
        userSaga()
    ]);

};
