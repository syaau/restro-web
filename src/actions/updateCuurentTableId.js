import React from 'react';
import {axios} from 'axios';

export default function updateCurrentTableId(id) {
  return async (dispatch) => {
    return dispatch({
      type: 'UPDATE_CURRENT_TABLE_ID',
      payload: id,
    });
  };
}
