import { createSlice } from '@reduxjs/toolkit';
// ===================  id ====================================================================
const initialState = {
    critery: null,
  };
  
  const criterySlice = createSlice({
    name: 'currentCritery',
    initialState,
    reducers: {
      changeCritery: (state,action) => {
        state.currentCritery =action.payload;
      },
    },
  });
  
  export const {changeCritery} = criterySlice.actions;
  export default criterySlice.reducer;