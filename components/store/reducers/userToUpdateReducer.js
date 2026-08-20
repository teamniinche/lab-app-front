import { createSlice } from '@reduxjs/toolkit';

// =================================== USER  ===========================================

const initialState = {
  updateUser: null,
};

const userToUpdateSlice = createSlice({
  name: 'updateUser',
  initialState,
  reducers: {
    save: (state,action) => {
      state.updateUser =action.payload;
    },
    clear: (state) => {
      state.updateUser = null;
    },
  },
});

export const { save, clear } = userToUpdateSlice.actions;
export default userToUpdateSlice.reducer;