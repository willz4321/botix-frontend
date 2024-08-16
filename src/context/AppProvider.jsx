import  React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    conversacion_Actual: {
      position_scroll: false
    },
    status: false,
  });

  const setConversacionActual = (conversacion_Actual) => {
    console.log('Actualizando conversacion_Actual:', conversacion_Actual); // Para depuración
    setState((prevState) => ({ ...prevState, conversacion_Actual }));
  };
  const setStatus = (status) => setState((prevState) => ({ ...prevState, status }));


  return (
    <AppContext.Provider value={{ state, setConversacionActual, setStatus,  }}>
      {children}
    </AppContext.Provider>
  );
};