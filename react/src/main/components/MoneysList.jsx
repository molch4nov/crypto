import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {useTonAddress, useTonWallet} from "@tonconnect/ui-react";
import {createClient} from "@supabase/supabase-js";
import MoneyForList from "./MoneyForList.jsx";
import { Card } from 'primereact/card';
import {ButtonGroup} from "primereact/buttongroup";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";


const MoneysList = observer(() => {
    const [moneys, setMoneys] = useState([]);
    const [myMoneys, setMyMoneys] = useState([]);
    const [liked, setLiked] = useState([]);
    const [currentType, setCurrentType] = useState('all');
    const [value1, setValue1] = useState('');

    const userFriendlyAddress = useTonAddress();
    const [loading, setLoading] = useState(true);
    const wallet = useTonWallet();
    const supabase = createClient(
        "https://ecjfhriteprihjhzhvyd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjamZocml0ZXByaWhqaHpodnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1OTA0MDEsImV4cCI6MjA0NTE2NjQwMX0.OWm1YDxTJzVj2y-vcPssn0ISH_jJXVTN0LlMrcMyDtk"
    )

    useEffect(() => {
        getLiked();
        getAllMoneys();
        getMyMoneys();
    }, [])

    function getAllMoneys() {
        supabase
            .from("moneys")
            .select()
            .then(data => {
                setMoneys(data.data);
            })
    }



    function getLiked() {
        supabase
            .from("liked")
            .select()
            .eq('ton-address',userFriendlyAddress)
            .then(data => {
                setLiked(data.data);
                setLoading(false);
            })
    }

    function getMyMoneys() {
        supabase
            .from("moneys")
            .select()
            .eq('creator',userFriendlyAddress)
            .then(data => {
                setMyMoneys(data.data);
            })
    }

    const [isTouched, setIsTouched] = useState(false);

    const handleBlur = () => {
        setIsTouched(true);
    };


    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <div style={{padding: '10px', display: 'flex', justifyContent: 'space-between'}}>
                <InputText
                    placeholder={'Поиск...'}
                    min={0.01}
                    value={value1}
                    invalid={isTouched && value1 < 0.01}
                    onValueChange={(e) => setValue1(e.value)}
                    onBlur={handleBlur}
                />
                <ButtonGroup>
                    <Button label="Мои" icon="pi pi-check" onClick={() => setCurrentType('my')} />
                    <Button label="Все" icon="pi pi-trash" onClick={() => setCurrentType('all')} />
                </ButtonGroup>
            </div>


            {currentType === 'my' && myMoneys.length > 0 &&

                <Card title="Мои монеты:" style={{margin: '10px'}}>
                    <div>
                        {
                        myMoneys.map(
                            item => {
                                console.log(item)
                                if (liked.find(value => value['money-liked'] === item.name)) {
                                    return (<MoneyForList data={item} liked={true}/>)
                                }
                                return (<MoneyForList data={item} liked={false}/>)
                        })}

                    </div>
                </Card>
            }

            {currentType === 'all' && moneys.map(item => {
                if (liked.find(value => value['money-liked'] === item.name)) {
                    return (<MoneyForList data={item} liked={true}/>)
                }
                return (<MoneyForList data={item} liked={false}/>)
            })}

        </>
    );
});

export default MoneysList;