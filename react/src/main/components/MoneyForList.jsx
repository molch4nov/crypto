import { Card } from 'primereact/card';
import {useState} from "react";
import store from "../../store.js";
import {createClient} from "@supabase/supabase-js";
import {useTonAddress, useTonWallet} from "@tonconnect/ui-react";
import Store from "../../store.js";
import {useNavigate} from "react-router-dom";
// eslint-disable-next-line react/prop-types
const MoneyForList = ({data, liked}) => {
    const supabase = createClient(
        "https://ecjfhriteprihjhzhvyd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjamZocml0ZXByaWhqaHpodnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1OTA0MDEsImV4cCI6MjA0NTE2NjQwMX0.OWm1YDxTJzVj2y-vcPssn0ISH_jJXVTN0LlMrcMyDtk"
    )
    const wallet = useTonWallet();
    const [updateLike, setUpdatelike] = useState(liked)
    const userFriendlyAddress = useTonAddress();
    const handleLike = () => {
        if (updateLike) {
            supabase
                .from("liked")
                .delete()
                .eq('ton-address', userFriendlyAddress)
                .eq('money-liked', data.name)
                .then(data => {
                    if (data.status) setUpdatelike(false);
                    console.log(data)
                })
        } else {
            supabase
                .from("liked")
                .insert([
                    { 'money-liked': data.name, 'ton-address': userFriendlyAddress }
                ]).then(data => {
                if (data.status === 201) setUpdatelike(true);
            });
        }
    };
    const navigator = useNavigate();

    const handleOpen = () => {
        Store.setData(data);
        Store.setLiked(updateLike);
        navigator(`/${data.name}`)

    }

    return (
        <div style={{display: "flex", flexDirection: 'row', paddingLeft: '35px', paddingRight: '35px', justifyContent: 'space-between'}}>
            <div style={{display: "flex", flexDirection: 'column'}}>
                <h3>
                    {data.name}
                </h3>
                <div style={{display: 'flex', gap: '8px'}}>
                    {data.ticker}.
                    <i className="pi pi-user-plus" style={{fontSize: '1rem'}}></i>
                    {Object.keys(data.holders).length}
                </div>
                <div style={{display: "flex", flexDirection: 'row', gap: '15px'}}>
                    <div style={{color: 'aquamarine'}}>
                        КАП {data.balance.toFixed(2)} ton
                    </div>
                    <div style={{color: 'aquamarine'}}>
                        <i className="pi  pi-bolt" style={{fontSize: '1rem'}}></i>
                        {data.dynamic}
                    </div>
                </div>

            </div>

            <div style={{display: 'flex', flexDirection: 'row', gap: '15px', marginTop: 'auto', marginBottom: 'auto'}}>
                <i className={updateLike ? 'pi pi-heart-fill' : 'pi pi-heart'} style={{fontSize: '2rem'}} onClick={handleLike}></i>
                <i className="pi pi-play" style={{fontSize: '2rem'}} onClick={handleOpen} ></i>
            </div>

        </div>
    )
        ;
};

export default MoneyForList;