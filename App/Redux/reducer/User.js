import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    login_status: false,
    darkMode:false,
    appSetting:{darkMode:false,notification:true}
  },
  reducers: {
    setuser(state, action) {
      state.userData = action.payload
      state.login_status = true
    },
    setAppSetting(state, action) {
      state.appSetting = action.payload
    },
    logout(state, action) {
      state.userData = {}
      state.login_status = false;
    }
  }
})
export const { setuser, logout,setAppSetting } = UserSlice.actions;

export default UserSlice.reducer;