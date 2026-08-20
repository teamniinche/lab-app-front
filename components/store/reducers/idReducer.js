import { createSlice } from '@reduxjs/toolkit';
// ===================  id ====================================================================
const initialState = {
    targetId:{targetId: null,product:null,}
  };
  
  const idSlice = createSlice({
    name: 'targetId',
    initialState,
    reducers: {
      idToUpdate: (state,action) => {
        state.targetId =action.payload;
        // state.toUpdate =action.payload;
      },
    },
  });
  
  export const {idToUpdate} = idSlice.actions;
  export default idSlice.reducer;