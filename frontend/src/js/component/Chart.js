import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({dataList,labelKey,value}) =>{
    const data = {
        labels: dataList.map(item=>item[labelKey]),
        datasets: [
            {
                label: 'Votes', 
                data: dataList.map(item=>item[value]), 
                backgroundColor: [ 
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [ 
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // 범례 위치
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.raw}`, // 
                },
            },
        },
    };

    return <Pie data={data} options={options} />;
}

export{
    PieChart
}