import store from "../../store.js";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import {useEffect, useState} from "react";
import {createClient} from "@supabase/supabase-js";
import useGraphUpdate from "../../utils/useGraphUpdate.js";
import {supabase} from "../../utils/supabase.init.js";
import {getTimeFromDate} from "../../utils/Time.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, zoomPlugin);


const Graph = () => {
    const TokenName = store.data.name;
    const [labels, setLabels] = useState([])
    const [dataset, setDataset] = useState([]);


    useEffect(() => {
        supabase
            .from('money-transactions')
            .select()
            .eq('name', store.data.name)
            .then(r => {
                const resData = r.data;
                const time = resData.map(item => getTimeFromDate(item.created_at));
                const price = resData.map(item => item.price);
                setDataset(price);
                setLabels(time)
            })
    }, [])

    useGraphUpdate(store.data.name, dataset, setDataset, labels, setLabels);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Цена',
                data: dataset,
                fill: true,
                borderColor: 'aquamarine',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: store.data.name
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy'
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                }
            }
        },
        scales: {
            y: {
                position: 'right', // Перемещаем ось Y на правую сторону
            }
        }
    };

    return <Line data={data} options={options} />;


};

export default Graph;