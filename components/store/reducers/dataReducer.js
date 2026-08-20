import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
    targetData: null,
    postedAnalyses:[],
  };
  
  const dataSlice = createSlice({
    name: 'targetData',
    initialState,
    reducers: {
      data: (state,action) => {
        state.targetData =action.payload;
      },
      postAnalyses: (state,action) => {
        state.postedAnalyses =action.payload;
      },
      unPostAnalyses: (state) => {
        state.postedAnalyses =[];
      },
    
    
    },
  });
  
  export const {data,postAnalyses,unPostAnalyses} = dataSlice.actions;
  export default dataSlice.reducer;