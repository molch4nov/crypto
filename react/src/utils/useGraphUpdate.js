import { useEffect } from 'react';
import { supabase } from './supabase.init.js';
import store from "../store.js";
import {getTimeFromDate} from "./Time.js";

const useRealtimeUpdates = (name, dataset, setNewDataset, labels, setNewLabels) => {
    const handleInserts = (payload) => {
        const price = payload.new.price;
        const time = getTimeFromDate(payload.new.created_at);
        setNewDataset(prev => [...prev, price]);
        setNewLabels(prev => [...prev, time]);
    }

    useEffect(() => {
         supabase
            .channel('money-transactions')
            .on(
                'postgres_changes',
                { event: 'INSERT',
                    schema: 'public',
                    table: 'money-transactions',
                    filter: `name=eq.${store.data.name}`
                },
                handleInserts
            )
            .subscribe()

        // return () => {
        //     subscribe.unsubscribe().then();
        // }
    }, []);
};

export default useRealtimeUpdates;