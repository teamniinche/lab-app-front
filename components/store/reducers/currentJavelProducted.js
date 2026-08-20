import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   currentJavelProducted:{},
   javelFocusedListe:[],
  };
  
  const currentJavelProductedSlice = createSlice({
    name: 'currentJavelProducted',
    initialState,
    reducers: {
      setCurrentJavelProducted: (state,action) => {
        state.currentJavelProducted =action.payload;
      },
      storeJavelFocusedListe: (state,action) => {
        state.javelFocusedListe=action.payload;
      },
      unSetCurrentJavelProducted: (state) => {
        state.currentJavelProducted =null;
      },
    },
  });
  
  export const {setCurrentJavelProducted,storeJavelFocusedListe,unSetCurrentJavelProducted} = currentJavelProductedSlice.actions;
  export default currentJavelProductedSlice.reducer;