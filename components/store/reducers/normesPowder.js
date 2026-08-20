import { createSlice } from '@reduxjs/toolkit';
import { Lansas } from '../../../iterables';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   powderNormes:{},
   theOne:{},
   formulesNormes:[],
  };
  
  const normesPowderSlice = createSlice({
    name: 'powderNormes',
    initialState,
    reducers: {
      setNormes: (state,action) => {
        state.powderNormes =action.payload;
      },
      setFormulesNormes: (state,action) => {
        state.formulesNormes =action.payload;
      },
      setOne: (state,action) => {
        const theOne=Object.values(state.powderNormes.data).filter(value=>value.name===action.payload)[0];
        state.theOne =theOne;
      },
      unSetNormes: (state) => {
        state.powderNormes =null;
        state.theOne={};
      },
    },
  });
  
  export const {setNormes,unSetNormes,setFormulesNormes,setOne} = normesPowderSlice.actions;
  export default normesPowderSlice.reducer;