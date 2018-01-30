import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MainApp from './screens/App';
import './App.css';
import selectTableData from './actions/selectTabledata';

const sessionReducer = (state = ' ', action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return action.payload;
    case 'LOGIN_FAILED':
      return action.payload;
    default:
      return state;
  }
};
const currentTableId = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_TABLE_ID':
      return action.payload;
    default:
      return state;
  }
};

const schemaReducer = tableName => (state = [], action) => {
  if (tableName === action.tableName) {
    switch (action.type) {
      case 'ADD_MULTIPLE':
        console.log('ADD-MULTIPLE', action.payload);
        return state.concat(action.payload);
      case 'DELETE_MULTIPLE':
        return state.filter(s => !action.payload.contains(s.id));
      case 'POP_TABLE_DATA':
        return action.payload;
      case 'DATA_INSERTED':
        return [...state, action.payload];
      case 'DATA_UPDATED':
        return state.map(item => (item.id === action.payload.id ? { ...item, ...action.payload } : item));
      case 'DATA_DELETED':
        return state.filter(obj => obj.id !== action.payload);
      case 'MOVE_TABLE':
        console.log('crrent state at movetable reducer', JSON.stringify(action.payload));
        return state.map((table) => {
          if (table.id === action.payload.id) {
            return {
              ...table,
              left: action.payload.left,
              top: action.payload.top,
            };
          }
          return table;
        });

      case 'ROTATE_TABLE':
        return state.map((table) => {
          if (table.id === action.payload.id) {
            return {
              ...table,
              rotationAngle: action.payload.rotationAngle,
            };
          }
          return table;
        });


      default:
        return state;
    }
  }
  return state;
};

const store = createStore(combineReducers({
  session: sessionReducer,
  currentTableId,
  orderItems: schemaReducer('orderItems'),
  tables: schemaReducer('tables'),
  orders: schemaReducer('orders'),
  items: schemaReducer('items'),
}), applyMiddleware(thunk));


store.dispatch(selectTableData('items'));
store.dispatch(selectTableData('orders'));
store.dispatch(selectTableData('orderItems'));

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <MainApp />
      </Provider>
    </div>
  );
};
export default App;
