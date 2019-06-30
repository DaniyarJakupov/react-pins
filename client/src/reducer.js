export default function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_USER":
      return { ...state, currentUser: action.payload };
    case "UPDATE_IS_AUTH":
      return { ...state, isAuth: action.payload };
    default:
      return state;
  }
}
