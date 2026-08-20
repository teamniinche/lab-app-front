import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   currentProducted:{},
   focusedListe:[],
  };
  
  const currentProductedSlice = createSlice({
    name: 'currentProducted',
    initialState,
    reducers: {
      setCurrentProducted: (state,action) => {
        state.currentProducted =action.payload;
      },
      storeFocusedListe: (state,action) => {
        state.focusedListe=action.payload;
      },
      unSetCurrentProducted: (state) => {
        state.currentProducted =null;
      },
    },
  });
  
  export const {setCurrentProducted,storeFocusedListe,unSetCurrentProducted} = currentProductedSlice.actions;
  export default currentProductedSlice.reducer;