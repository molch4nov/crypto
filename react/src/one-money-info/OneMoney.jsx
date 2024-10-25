import {observer} from "mobx-react-lite";
import {createClient} from "@supabase/supabase-js";
import {useTonAddress, useTonWallet} from "@tonconnect/ui-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import store from "../store.js";
import {Button} from "primereact/button";
import {InputNumber} from "primereact/inputnumber";
import {set} from "mobx";
import Graph from "../main/components/Graph.jsx";

const OneMoney = observer(({data, liked}) => {
    let { name } = useParams();
    const supabase = createClient(
        "https://ecjfhriteprihjhzhvyd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjamZocml0ZXByaWhqaHpodnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1OTA0MDEsImV4cCI6MjA0NTE2NjQwMX0.OWm1YDxTJzVj2y-vcPssn0ISH_jJXVTN0LlMrcMyDtk"
    )

    const userFriendlyAddress = useTonAddress();
    const navigator = useNavigate();
    const [typeHanlder, setTypeHandler] = useState('none');

    const [disabled, setDisabled] = useState(false);
    const [forcePrice, setForcePrice] = useState(0);
    const [getMoney, setGetMoney] = useState(0);

    useEffect(() => {
        supabase
            .from('moneys').select().eq('name', name).then(data1 => {
            store.setData(data1.data[0])
            setForcePrice(data1.data.price);
        })
    }, [disabled]);


    const [isTouched, setIsTouched] = useState(false);

    const handleBlur = () => {
        setIsTouched(true);
    };
    const [value1, setValue1] = useState(0);

    useEffect(() => {
        if (store.data) valueChangesPrice(value1)
    }, [value1])

    // const adjustTokenPrice = (amount, isBuying) => {
    //     const priceChangeFactor = 0.01; // Изменение цены на 1% за каждую 100 токенов
    //     const change = (amount / 100) * priceChangeFactor;
    //
    //     if (isBuying) {
    //         setTokenPrice(prevPrice => Math.max(prevPrice + change, 0)); // Увеличиваем цену при покупке
    //     } else {
    //         setTokenPrice(prevPrice => Math.max(prevPrice - change, 0)); // Уменьшаем цену при продаже
    //     }
    // };

    function updateTokenPrice(oldPrice, newPrice, availAmount, needAmount, plusBalance) {
        supabase
            .from('moneys')
            .update([{
                price: newPrice,
                'available-count': availAmount,
                'all-counts': store.data['all-count']  - needAmount,
                'balance': plusBalance
            }])
            .eq('name', store.data.name).then(r => console.log(r))

    }

    function updateHimHoldingBalance(amountToAdd) {
        supabase
            .from('users')
            .select()
            .eq('ton-address', userFriendlyAddress)
            .then(async data => {
                const user = data.data[0];
                if (!user) {
                    console.error('Пользователь не найден');
                    return;
                }

                // Получаем объект holding
                const holdings = user.holding || {};
                const coinName = store.data.name;

                // Проверяем, существует ли поле с названием монеты
                if (holdings[coinName]) {
                    // Если существует, обновляем количество
                    holdings[coinName] += amountToAdd;
                } else {
                    // Если не существует, создаем поле и добавляем количество
                    holdings[coinName] = amountToAdd;
                }

                // Обновляем запись в базе данных
                const {error} = await supabase
                    .from('users')
                    .update({holding: holdings})
                    .eq('ton-address', userFriendlyAddress);

                if (error) {
                    console.error('Ошибка при обновлении данных:', error);
                } else {
                    console.log('Данные успешно обновлены');
                }
            })


    }

    function updateHimBalance(balance) {
        supabase
            .from('users')
            .update([{balance: balance}])
            .eq('ton-address', userFriendlyAddress)
            .then(() => {
                store.setBalance(balance);
            })
    }

    function updateMoneyBalance(balance, availCount, price, liq) {
        supabase
            .from('moneys')
            .update([
                {
                    balance: balance,
                    'available-count': availCount,
                    price: price,
                    liq: liq
                }
            ])
            .eq('name', store.data.name)
            .then(r => console.log(r))
    }

    function createTransactionOnBuy(price) {
        supabase
            .from('money-transactions')
            .insert([{
                price: price,
                name: store.data.name
            }]).then((r) => {
            setDisabled(false);
        })
    };

    function buyHandler() {
        setDisabled(true);
        const himPrice = value1;
        if (himPrice <= store.balance) {
            const currentLiqud = store.data.liq;
            const allCountMoney = store.data['available-count'];

            const newLiq = currentLiqud + himPrice;
            const newPrice = newLiq / allCountMoney;

            const moneyAmount =  himPrice / newPrice;
            const removedMoney = allCountMoney - moneyAmount;

            updateHimHoldingBalance(moneyAmount);
            updateHimBalance(store.balance - value1);

            let balance, availCount, price, liq = 0;
            balance = store.data.balance + himPrice;
            availCount = removedMoney;
            price = newLiq / removedMoney;
            liq = newLiq;
            updateMoneyBalance(balance, availCount, price, liq);
            createTransactionOnBuy(price);
        }

    }

    function sellHandler() {

    }

    function valueChangesPrice(price) {
        const currentLiqud = store.data.liq;
        const allCountMoney = store.data['available-count'];
        const newLiq = currentLiqud + price;
        const newPrice = newLiq / allCountMoney;
        const moneyAmount =  price / newPrice;
        setGetMoney(moneyAmount)
    }


    if (!store.data) {
        return (
            <div>Загрузка...</div>
        )
    }


    return (
        <>
            <div style={{display: "flex", flexDirection: 'row', paddingLeft: '35px', paddingRight: '35px', justifyContent: 'space-between'}}>
                <div style={{display: "flex", flexDirection: 'column'}}>
                    <h3>
                        {store.data.name ?? ''}
                    </h3>
                    <div style={{display: 'flex', gap: '10px'}}>
                        {store.data?.ticker ?? '1'}.
                        <i className="pi pi-user-plus" style={{fontSize: '1rem'}}></i>
                        {Object.keys(store.data.holders).length}
                    </div>
                    <div style={{display: "flex", flexDirection: 'column', gap: '3px'}}>
                        <div style={{color: 'aquamarine'}}>
                            КАП {store.data.balance.toFixed(2) ?? 0} ton
                        </div>
                        <div style={{color: 'aquamarine'}}>
                            <i className="pi  pi-bolt" style={{fontSize: '1rem'}}></i>
                            {store.data.dynamic ?? '11'}
                        </div>
                    </div>
                    <div style={{marginTop: '15px', marginBottom: '15px'}}>
                        {store.data.description ?? 'ТОПОВОЕ ОПИСАНИЕ МОНЕТКИ МОЩНЕЙШЕЙ'}
                    </div>

                </div>

                <div style={{display: 'flex', flexDirection: 'row', gap: '15px', marginTop: 'auto', marginBottom: 'auto'}}>
                    <i className="pi pi-arrow-left" style={{fontSize: '2rem'}} onClick={() => navigator('/main')}></i>
                </div>
            </div>

            <div style={{padding: '35px'}}>
                <Graph />
            </div>


            {typeHanlder === 'none' &&
                <>
                    <InputNumber
                        placeholder={`Минимум ${store.data.price} ton`}
                        min={forcePrice}
                        value={value1}
                        invalid={isTouched && value1 < 0}
                        onChange={(e) => setValue1(e.value)}
                        onBlur={handleBlur}
                        style={{paddingLeft: '35px', paddingRight: '35px', paddingTop: '35px', width: '100%'}}
                    />
                    <small style={{paddingLeft: '35px', paddingRight: '35px', paddingBottom: '35px', display: 'flex'}}>
                        Вы получите {getMoney.toFixed(2)} {store.data.ticker}
                    </small>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: '35px',
                        paddingRight: '35px'
                    }}>
                        <Button
                            outlined
                            severity="success"
                            ///TODO SET DISABLED BEFORE UPDATE AFTER BUY
                            disabled={disabled}
                            style={{width: '150px', justifyContent: "center", display: 'flex'}}
                            onClick={buyHandler}
                        >Купить</Button>
                        <Button
                            outlined
                            ///TODO SET DISABLED BEFORE UPDATE AFTER SELL
                            severity="danger"
                            disabled={disabled}
                            style={{width: '150px', justifyContent: "center", display: 'flex'}}
                            onClick={sellHandler}
                        >Продать</Button>
                    </div>
                </>
            }
        </>
    );
});

export default OneMoney;