import { AppWallet } from './components/AppWallet';
import {useIsConnectionRestored, useTonConnectUI} from '@tonconnect/ui-react';
import {observer} from "mobx-react";
import MoneysList from "./components/MoneysList.jsx";
export const MainPage = observer(() => {
   const connectionRestored = useIsConnectionRestored();
   const [tonConnectUI] = useTonConnectUI();

   if (!connectionRestored) {
      return <button className="p-button" onClick={() => tonConnectUI.openModal()}>
         Подключить кошелек
      </button>;
   }

   return (
       <>
          <AppWallet />
          <MoneysList />
       </>
   )


})