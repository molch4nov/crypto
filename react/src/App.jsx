import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { WelcomePage } from "./welcome-page/WelcomePage";
import {TonConnectUIProvider, useTonAddress, useTonWallet} from '@tonconnect/ui-react';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { MainPage } from './main/MainPage';
import CreatePage from "./create-money/CreatePage.jsx";
import OneMoney from "./one-money-info/OneMoney.jsx";
import store from "./store.js";

function App() {


  return (
    <TonConnectUIProvider
        actionsConfiguration={{
            twaReturnUrl: 'https://t.me/'
        }}
        manifestUrl="http://78.155.197.91:3000/tonconnect-manifest.json">
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<MainPage/>} />
          <Route path="/create-token" element={<CreatePage />} />
          <Route path="/:name" element={<OneMoney data={store.data} liked={store.liked} />} />
            <Route path="/" element={<WelcomePage/>} />
        </Routes>
      </BrowserRouter>

    </TonConnectUIProvider>

  )
}

export default App
