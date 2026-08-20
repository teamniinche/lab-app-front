import { createSlice } from '@reduxjs/toolkit';

// =================================== USER  ===========================================

const initialState = {
  crntUsers: [],
  postedUsers:null
};

const crntSlice = createSlice({
  name: 'crntUser',
  initialState,
  reducers: {
    setCrntUsers: (state,action) => {
      state.crntUsers =action.payload;
    },
    unSetCrntUsers: (state) => {
      state.crntUsers =[];
    },
    postUsers: (state,action) => {
      state.postedUsers=action.payload;
    },
    unPostUsers: (state) => {
      state.postedUsers=null;
    }
  }
});

export const { setCrntUsers,unSetCrntUsers,postUsers,unPostUsers} = crntSlice.actions;
export default crntSlice.reducer;
