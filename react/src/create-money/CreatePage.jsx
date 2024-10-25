import {observer} from "mobx-react-lite";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import {createClient} from "@supabase/supabase-js";
import {useTonAddress, useTonWallet} from "@tonconnect/ui-react";
import store from "../store.js";
import {useNavigate} from "react-router-dom";

const CreatePage = observer(() => {
    const [inputValue, setInputValue] = useState("");
    const [ticker, setTicker] = useState("");
    const [description, setDescription] = useState("");
    const [cap, setCap] = useState(0);
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState(true);

    const navigate = useNavigate();
    const userFriendlyAddress = useTonAddress();
    const goNext = () => {navigate('/main')};

    const handleBlur = () => {
        setIsTouched(true);
    };
    const supabase = createClient(
        "https://ecjfhriteprihjhzhvyd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjamZocml0ZXByaWhqaHpodnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1OTA0MDEsImV4cCI6MjA0NTE2NjQwMX0.OWm1YDxTJzVj2y-vcPssn0ISH_jJXVTN0LlMrcMyDtk"
    )
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [inputValue]);


    useEffect(() => {
        checkName();
    }, [debouncedInputValue]);
    
    function checkName() {
        supabase
            .from("moneys")
            .select()
            .eq('name', debouncedInputValue)
            .then(data => {
                setIsValid(data.data.length === 0)
            })
    }

    const wallet = useTonWallet();

    async function updateBalance(amount) {
        const newBalance = amount;
        supabase
            .from("users")
            .update({balance: newBalance})
            .eq('ton-address', userFriendlyAddress)
            .then(r => {
                store.setBalance(newBalance);
                goNext();
            })
    }

    const handleCreate = () => {
        if (cap > 0 && inputValue ) {
            const currentBalance = store.balance;
            if (currentBalance - cap >= 0) {
                supabase
                    .from("moneys")
                    .insert([
                        { name: inputValue, ticker: `$${ticker}`, description: description, balance: cap, creator: userFriendlyAddress }
                    ])
                    .then(async data => {
                        if (data.status === 201) {
                            await updateBalance(currentBalance - cap);

                        }
                    })
            }
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', padding: '25px'}}>
            <h1>Создание своей монеты</h1>
            <div className="p-inputgroup flex-1" style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-id-card" style={{fontSize: '1rem'}}></i>
                    </span>

                    <InputText
                        id="name"
                        placeholder="Название"
                        value={inputValue}
                        onBlur={handleBlur}
                        invalid={isTouched && !isValid}
                        onChange={handleInputChange}
                        aria-describedby="username-help"
                    />

                </div>
                {!isValid && <small id="name">
                    Название уже существует, но создать можно
                </small>}
            </div>

            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-globe" style={{fontSize: '1rem'}}></i>
                </span>
                <InputText placeholder="Тикер" value={ticker} onChange={(e) => setTicker(e.target.value)} />
            </div>

            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-align-left" style={{fontSize: '1rem'}}></i>
                </span>
                <InputText placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>

            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-dollar" style={{fontSize: '1rem'}}></i>
                </span>
                <InputNumber placeholder="Капитал" onValueChange={(e) => setCap(e.value)}/>
            </div>

            <Button label="Создать" severity="success" outlined  onClick={handleCreate}/>
            <Button label="Назад" severity="danger" outlined  onClick={() => navigate('/main')}/>
        </div>
    );
});

export default CreatePage;