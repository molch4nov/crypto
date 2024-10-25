import {useIsConnectionRestored, useTonAddress, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {useEffect, useRef, useState} from "react";
import './styles.css'

import { InputNumber } from 'primereact/inputnumber';
import store from "../../store.js";
import {createClient} from "@supabase/supabase-js";
import {observer} from "mobx-react-lite";
import { Button } from 'primereact/button';
import {useNavigate} from "react-router-dom";

export const AppWallet = observer(() => {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [showWalletInfo, setShowWalletInfo] = useState(false);
    const wallet = useTonWallet();
    const userFriendlyAddress = useTonAddress();
    const supabase = createClient(
        "https://ecjfhriteprihjhzhvyd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjamZocml0ZXByaWhqaHpodnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1OTA0MDEsImV4cCI6MjA0NTE2NjQwMX0.OWm1YDxTJzVj2y-vcPssn0ISH_jJXVTN0LlMrcMyDtk"
    )

    const [value1, setValue1] = useState(0);

    const navigate = useNavigate();

    const goNext = () => {navigate('/create-token')};

    useEffect(() => {
        getBalance();
    }, [])

    useEffect(() => {
        if (wallet) {
            supabase
                .from("users")
                .select()
                .eq('ton-address', userFriendlyAddress)
                .then(data => {
                    if (data.data.length < 1) {
                        supabase.from('users').insert([
                            { 'ton-address': userFriendlyAddress, 'balance': 10 }
                        ]).then(r => {
                            console.log(data)
                        })
                    }
                })
        }
    }, [wallet])

    const sendMoney = async () => {
        if(value1 > 0) {
            try {
                tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 360,
                    messages: [
                        {
                            amount: value1 * 1000000000,
                            address: 'UQBigu_SAao3PQ-uAN32mV6vJxK71ZIEHU-5h8Sl56Qcb1I9'
                        }
                    ]
                }).then(res => {
                    if (res.boc) updateBalance(value1);
                }).catch(er => console.log(er));


            } catch (e) {
                console.log(e);
            }

            setShowWalletInfo(false);
        }

    }
    
    async function getBalance() {
        supabase
            .from("users")
            .select()
            .eq('ton-address', userFriendlyAddress)
            .then(data => {
                if (data.data.length !== 1) return;
                store.setBalance(data.data[0].balance);
            })
    }

    async function updateBalance(amount) {
        const newBalance = store.getBalance() + amount;
        supabase
            .from("users")
            .update({balance: newBalance})
            .eq('ton-address', userFriendlyAddress)
            .then(r => {
                store.setBalance(newBalance);
            })
    }

    const [isTouched, setIsTouched] = useState(false);

    const handleBlur = () => {
        setIsTouched(true);
    };

   return (
       <>
           {wallet &&
               <div className="app-wallet">
                   <div style={{display: 'flex', gap: "30px"}}>
                       <i className="pi pi-wallet" onClick={() => setShowWalletInfo(!showWalletInfo)}
                          style={{fontSize: '2rem'}}></i>
                       <i className="pi pi-plus" onClick={() => goNext()}
                          style={{fontSize: '2rem'}}></i>
                   </div>

                   {showWalletInfo && <>
                       <div style={{display: 'flex', gap: '10px'}}>
                           <h2>Ваш кошелек</h2>
                           <h2>{userFriendlyAddress.slice(0, 10)}...</h2>
                       </div>

                       <div style={{display: 'flex', gap: '10px'}}>
                           <h2>Текущий баланс</h2>
                           <h2> {store.getBalance()} ton</h2>
                       </div>


                       <InputNumber
                           placeholder={'Минимум 0.01 ton'}
                           min={0.01}
                           value={value1}
                           invalid={isTouched && value1 < 0.01}
                           onValueChange={(e) => setValue1(e.value)}
                           onBlur={handleBlur}
                       />
                       <div style={{marginTop: '8px', display: "flex", gap: "5px", justifyContent: 'space-between'}}>
                           <Button label="1 ton" severity="secondary" outlined text onClick={() => setValue1(1)}/>
                           <Button label="5 ton" severity="secondary" outlined text onClick={() => setValue1(5)}/>
                           <Button label="25 ton" severity="secondary" outlined text onClick={() => setValue1(25)}/>
                           <button className="p-button" onClick={() => sendMoney()}>
                               Пополнить
                           </button>
                       </div>

                   </>}

               </div>
           }
       </>

   )
})