import { createSlice } from '@reduxjs/toolkit';
// ===================  data(normes de l'analyse) ====================================================================
const initialState = {
   focusedProduct:{},
  };
  
  const focusedProductSlice = createSlice({
    name: 'focusedProduct',
    initialState,
    reducers: {
      setFocusedProduct: (state,action) => {
        state.focusedProduct =action.payload;
      }
    }
  });
  
  export const {setFocusedProduct} = focusedProductSlice.actions;
  export default focusedProductSlice.reducer;