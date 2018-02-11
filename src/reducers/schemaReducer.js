
const schemaReducer = tableName => (state = [], action) => {
  if (tableName === action.tableName) {
    switch (action.type) {
      case 'ADD_MULTIPLE':
        console.log('ADD-MULTIPLE', action.payload);
        return state.concat(action.payload);
      case 'DELETE_MULTIPLE':
      console.log('delte Multiple reducer called', JSON.stringify(action.payload), JSON.stringify(state));
        return state.filter(s => !action.payload.includes(s.id));
      case 'POP_TABLE_DATA':
        return action.payload;
      case 'DATA_INSERTED':
        return [...state, action.payload];
      case 'DATA_UPDATED':
      console.log('updated method called', action.payload);
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

export default schemaReducer;
