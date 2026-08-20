import { createSlice } from '@reduxjs/toolkit';

// =================================== USER  ===========================================

const initialState = {
  targetUser: null,
  currentUser: null
};

const userSlice = createSlice({
  name: 'targetUser',
  initialState,
  reducers: {
    connect: (state,action) => {
      state.targetUser =action.payload;
    },
    setCurrent: (state,action) => {
      state.currentUser =action.payload;
    },
    disconnect: (state) => {
      state.targetUser = null;
    },
    resetCurrent: (state) => {
      state.currentUser = null;
    }
  },
});

export const { connect, disconnect,setCurrent,resetCurrent } = userSlice.actions;
export default userSlice.reducer;
