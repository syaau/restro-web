
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

export default sessionReducer;
