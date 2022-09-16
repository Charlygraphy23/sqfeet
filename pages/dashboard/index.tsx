/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import 'chart.js/auto';
import GraphBody from 'components/dashboard';
import Footer from 'components/footer';
import PageLoader from 'components/loader';
import { AUTH_STATUS } from 'config/app.config';
import { Dayjs } from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

const DashboardPage = () => {
    const { status } = useSession();
    const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);

    const handleDateChange = useCallback((_value: DateRange<Dayjs>) => {
        console.log({ _value });

        setValue(_value);

    }, []);

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'First dataset',
                data: [33, 53, 85, 41, 44, 65],
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },

        ],

    };



    if (status === AUTH_STATUS.LOADING) return <PageLoader />;

    return (
        <section className='dashboard'>
            <h1 className='page_title mt-3 mb-2'>Hi Dipta</h1>
            <div className='row m-0 col-12 graph__container'>
                <div className='col-12'>
                    <GraphBody data={data} handleDateChange={handleDateChange} date={value} />
                </div>
            </div>
            <Footer />
        </section>
    );
};


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

    const { req } = context;

    const session = await getSession({ req });

    if (!session) {
        return {
            props: {},
            redirect: {
                destination: '/',
                statusCode: 301
            }
        };
    }

    return {
        props: {}
    };
};

export default DashboardPage;
