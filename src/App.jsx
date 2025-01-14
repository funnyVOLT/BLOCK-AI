import "./App.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ThemeProvider from "./components/ThemeProvider";
import AppProvider from "./contexts/AppContext";
import { WalletContextProvider } from "./components/WalletContextProvider";
import Home from "./pages/hund-staking";

function App() {
  return (
    <>
      <AppProvider>
        <ThemeProvider>
          <WalletContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            <ToastContainer />
          </WalletContextProvider>
        </ThemeProvider>
      </AppProvider>
    </>
  );
}

export default App;
