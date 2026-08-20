import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
    targetPeriod: {
  key:'default',
  startedAt: '2025-04-02',
  endedAt: '2025-04-08'
}
  };
  
  const periodSlice = createSlice({
    name: 'targetPeriod',
    initialState,
    reducers: {
      setPeriod: (state,action) => {state.targetPeriod =action.payload},
      initPeriod:(state) => {state.targetPeriod ={
                                                    key:'default',
                                                    startedAt: '2025-04-02',
                                                    endedAt: '2025-04-08'
                                                  }
                            },
    },
  });
  
  export const {setPeriod,initPeriod} = periodSlice.actions;
  export default periodSlice.reducer;