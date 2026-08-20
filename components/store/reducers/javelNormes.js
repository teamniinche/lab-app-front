import { createSlice } from '@reduxjs/toolkit';
import { typesJavel } from '../../../iterables';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   javelNormes:typesJavel,
   theJavelOne:{},
   formulesJavelNormes:[],
  };
  
  const normesJavelSlice = createSlice({
    name: 'javelNormes',
    initialState,
    reducers: {
      setJavelNormes: (state,action) => {
        state.javelNormes =action.payload;
      },
      setFormulesJavelNormes: (state,action) => {
        state.formulesJavelNormes =action.payload;
      },
      setJavelOne: (state,action) => {
        const theOne=Object.values(state.javelNormes).filter(value=>value.name===action.payload)[0];
        state.theJavelOne =theOne;
      },
      unSetJavelNormes: (state) => {
        state.javelNormes =null;
        state.theJavelOne={};
      },
    },
  });
  
  export const {setJavelNormes,unSetJavelNormes,setFormulesJavelNormes,setJavelOne} = normesJavelSlice.actions;
  export default normesJavelSlice.reducer;