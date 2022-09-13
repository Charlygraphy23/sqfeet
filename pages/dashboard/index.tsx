/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import 'chart.js/auto';
import Footer from 'components/footer';
import { Chart } from 'react-chartjs-2';

const DashboardPage = () => {



    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'First dataset',
                data: [33, 53, 85, 41, 44, 65],
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)'
            },
            {
                label: 'Second dataset',
                data: [33, 25, 35, 51, 54, 76],
                fill: false,
                borderColor: '#742774'
            }
        ]
    };


    return (
        <section className='dashboard'>
            <h1 className='page_title mt-3 mb-2'>Hi Dipta</h1>
            <Chart type='line' data={data} />
            <Footer />
        </section>
    );
};

export default DashboardPage;
