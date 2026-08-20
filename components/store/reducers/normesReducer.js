import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
    targetNormes: null,
  };
  
  const normesSlice = createSlice({
    name: 'targetNormes',
    initialState,
    reducers: {
      setNormes: (state,action) => {
        state.targetNormes =action.payload;
      },
      unSetNormes: (state) => {
        state.targetNormes =null;
      },
    },
  });
  
  export const {setNormes,unSetNormes} = normesSlice.actions;
  export default normesSlice.reducer;