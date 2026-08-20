import { configureStore,getDefaultMiddleware} from '@reduxjs/toolkit';
import { persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './reducers/userReducer'; // Ton user reducer
import idReducer from './reducers/idReducer'; // Ton idToUpdate reducer
import dataReducer from './reducers/dataReducer'; // Ton idToUpdate reducer
import activesReducer from './reducers/activedReducer'; // Ton idToUpdate reducer
import currentProducted from './reducers/currentProducted'; // Ton idToUpdate reducer
import currentJavelProducted from './reducers/currentJavelProducted'; // Ton idToUpdate reducer
import focusedProduct from './reducers/focusedProduct'; // Ton idToUpdate reducer
import javelFocusedProduct from './reducers/javelFocusedProduct'; // Ton idToUpdate reducer
import powderAnalysed from "./reducers/powderAnalysesReducer";
import javelAnalysed from "./reducers/javelAnalysesReducer";

import normesReducer from './reducers/normesReducer'; // Ton idToUpdate reducer
import normesJavelReducer from './reducers/javelNormes'; // Ton idToUpdate reducer
import normesPowderReducer from './reducers/normesPowder'; // Ton idToUpdate reducer
import userToUpdate from './reducers/userToUpdateReducer';

import periodReducer from './reducers/periodReducer'; // Ton idToUpdate reducer
import criteryReducer from './reducers/criteryReducer';
import crntReducer from './reducers/crntReducer';

import { combineReducers } from 'redux';

// Configuration de redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  user: userReducer, // Clé "user" dans le state global
  id:idReducer,
  data:dataReducer,
  period:periodReducer,
  critery:criteryReducer,
  normes:normesReducer,
  powderNormes:normesPowderReducer,
  javelNormes:normesJavelReducer,
  currentProducted:currentProducted,
  currentJavelProducted:currentJavelProducted,
  focusedProduct:focusedProduct,
  javelFocusedProduct:javelFocusedProduct,
  powderAnalysed:powderAnalysed,
  javelAnalysed:javelAnalysed,
  updateUser:userToUpdate,
  actived:activesReducer,
  crnt:crntReducer
});

// Création du reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Création du store Redux
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:{
      ignoredActions:[
        'persist/PERSIST',
        'persist/REHYDRATE',
        'persist/PAUSE',
        'persist/FLUSH',
        'persist/REGISTER',
      ],
      ignoredPaths:['_persist'],
    },
  }),
});

export const persistor = persistStore(store);
