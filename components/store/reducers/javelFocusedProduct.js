import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   javelFocusedProduct:{},
  };
  
  const javelFocusedProductSlice = createSlice({
    name: 'javelFocusedProduct',
    initialState,
    reducers: {
      setJavelFocusedProduct: (state,action) => {
        state.javelFocusedProduct =action.payload;
      }
    }
  });
  
  export const {setJavelFocusedProduct} = javelFocusedProductSlice.actions;
  export default javelFocusedProductSlice.reducer;