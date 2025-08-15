import { v4 as uuidv4 } from "uuid";

if (typeof globalThis.crypto?.randomUUID !== "function") {
  // @ts-expect-error - we're polyfilling a missing method
  globalThis.crypto.randomUUID = uuidv4;
}

import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
