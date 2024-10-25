import { useNavigate } from "react-router-dom";

import { Button } from 'primereact/button';
import {useEffect} from "react";
import {useTonWallet} from "@tonconnect/ui-react";
        
export function WelcomePage() {
   const navigate = useNavigate();
    const goNext = () => {navigate('/main')};
    const wallet = useTonWallet();
    useEffect(() => {
        if (wallet) goNext()

    }, )


   return (
        <div className="welcome-page">
            <h1>Это велком страниц dasdasdasdasdasdaа</h1>
            <h2>Тут нужен дизайн скипа</h2>
            <h2>Прикольное крутое приложение</h2>
            <h2>Кайфуйте</h2>
            <Button label="Далее" onClick={goNext} />
        </div>
   )
}