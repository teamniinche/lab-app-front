import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
    actives: null,
    clooned:true
  };
  
  const activesSlice = createSlice({
    name: 'actives',
    initialState,
    reducers: {
      actived: (state,action) => {
        state.actives =action.payload;
      },
      cloone: (state,action) => {
        state.clooned =action.payload;
      },
    },
  });
  
  export const {actived,cloone} = activesSlice.actions;
  export default activesSlice.reducer;