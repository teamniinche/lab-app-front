import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   javelAnalysed:[],
   javelFiltred:[],
   javelType:[]
  };
  
  const javelAnalysedSlice = createSlice({
    name: 'javelAnalysed',
    initialState,
    reducers: {
      setJavelAnalysed: (state,action) => {
        state.javelAnalysed =action.payload;
      },
      setJavelFiltred: (state,action) => {
        const javelFitres=action.payload===null ? state.javelType : state.javelType.filter(itm=>itm.name.toLowerCase()===action.payload.toLowerCase());
        state.javelFiltred =javelFitres;
      },
      setJavelType: (state,action) => {
        const javelByType=action.payload===null ? state.javelAnalysed : state.javelAnalysed.filter(itm=>itm.name.toLowerCase().includes(action.payload.toLowerCase()) && itm.parfum===undefined && itm.nom===undefined);
        const javelFinished=state.javelAnalysed.filter(itm=>itm.parfum!==undefined && itm.nom!==undefined);
        
        state.javelType =action.payload!=="Finies" ? javelByType : javelFinished;
        state.javelFiltred =action.payload!=="Finies" ? javelByType : javelFinished;
      },

      unSetJavelAnalysed: (state) => {
        state.javelAnalysed =null;
      },
    },
  });
  
  export const {setPowderAnalysed,setPowderFiltred,setPowderType,unSetPowderAnalysed} = javelAnalysedSlice.actions;
  export default javelAnalysedSlice.reducer;