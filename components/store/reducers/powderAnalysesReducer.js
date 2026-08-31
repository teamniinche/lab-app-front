import { createSlice } from '@reduxjs/toolkit';
import { isFormule } from '../../../assets/functions';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   powderAnalysed:[],
   powderFiltred:[],
   powderType:[],
   type:null
  };
  
  const powderAnalysedSlice = createSlice({
    name: 'powderAnalysed',
    initialState,
    reducers: {
      setPowderAnalysed: (state,action) => {
        state.powderAnalysed =action.payload;
      },
      setPowderFiltred: (state,action) => {
        const powderFitres=action.payload===null ? state.powderType : state.powderType.filter(itm=>itm.name.toLowerCase()===action.payload.toLowerCase());
        state.powderFiltred =powderFitres;
      },
      setPowderType: (state,action) => {
        const powderByType=action.payload===null ? state.powderAnalysed : state.powderAnalysed.filter(itm=>itm.name.toLowerCase().includes(action.payload.toLowerCase()) && !isFormule(itm).estFormule);
        const powderFinished=state.powderAnalysed.filter(itm=>isFormule(itm).estFormule);
        // alert(JSON.stringify(powderByType))
        state.type=action.payload;
        state.powderType =action.payload!=="Finies" ? powderByType : powderFinished;
        state.powderFiltred =action.payload!=="Finies" ? powderByType : powderFinished;
      },

      unSetPowderAnalysed: (state) => {
        state.powderAnalysed =null;
      },
    },
  });
  
  export const {setPowderAnalysed,setPowderFiltred,setPowderType,unSetPowderAnalysed} = powderAnalysedSlice.actions;
  export default powderAnalysedSlice.reducer;