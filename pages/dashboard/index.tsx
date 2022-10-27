/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import 'chart.js/auto';
import { toast } from 'components/alert';
import Footer from 'components/footer';
import { AUTH_STATUS } from 'config/app.config';
import dayjs, { Dayjs } from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { DotLoader } from 'react-spinners';
import { axiosInstance } from '_http';

type Props = {
    name: string
}

const PageLoader = dynamic(() => import('components/loader'), { ssr: false, suspense: true });
const GraphBody = dynamic(() => import('components/dashboard'), { ssr: false, suspense: true });



const DashboardPage = ({ name }: Props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        labels: [''],
        datasets: [
            {
                label: 'Loading....',
                data: [],
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },

        ],

    });
    const { status } = useSession();
    const [value, setValue] = useState<DateRange<Dayjs>>([dayjs().subtract(30, 'day'), dayjs()]);
    const { push } = useRouter();

    const handleDateChange = useCallback((_value: DateRange<Dayjs>) => {
        setValue(_value);

    }, []);


    useEffect(() => {

        if (status === AUTH_STATUS.ERROR) {
            push('/');
            return;
        }

        if (status !== AUTH_STATUS.SUCCESS) return;

        const controller = new AbortController();
        const { signal } = controller;

        if (!value[0] || !value[1]) return toast.error('Please choose date!!');

        const payload = {
            startTime: value[0]?.unix(),
            endTime: value[1]?.unix()
        };


        let tempStart = value[0].clone();
        let dates: string[] = [];

        while (tempStart.isBefore(value[1].add(1, 'day'))) {
            dates = [...dates, tempStart.format('YYYY-MM-DD')];

            tempStart = tempStart.add(1, 'day').clone();
        }

        setLoading(true);
        axiosInstance
            .post('/dashboard/get', payload, { signal })
            .then(({ data: _data }: { data: any }) => {
                const tasks = _data?.data ?? {};
                const taskDates = Object.keys(tasks);
                const totalLength = Object.values(tasks).reduce(
                    (prevState: number, currentState: any) =>
                        // @ts-ignore
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        prevState + currentState?.count ?? 0,
                    0
                );


                const dataList: never[] = [];

                dates.forEach((date) => {

                    const dateMatched = taskDates.includes(date);

                    if (dateMatched) {
                        // @ts-ignore
                        dataList.push(tasks[date]?.count ?? 0);
                    }

                    else {
                        // @ts-ignore
                        dataList.push(0);
                    }


                });

                setData(prevState => ({
                    ...prevState,
                    labels: dates,
                    datasets: [
                        {
                            ...prevState.datasets[0],
                            label: `Task Count - ${totalLength}`,
                            data: dataList,
                        },

                    ],

                }));

                setLoading(false);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error?.message);
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
        };

    }, [push, status, value]);



    if (status === AUTH_STATUS.LOADING)
        return <Suspense fallback={<PageLoader bootstrap />}>
            <PageLoader />
        </Suspense>;

    return (
        <section className='dashboard'>
            <h1 className='page_title mt-3 mb-2'>Hi {name.split(' ')?.[0] ?? ''}</h1>
            <div className='row m-0 col-12 graph__container'>
                {loading && <div className='dashboard__loading'><DotLoader color='white' size={25} /> </div>}
                <div className='col-12'>
                    <Suspense fallback={<PageLoader bootstrap />}>
                        <GraphBody data={data} handleDateChange={handleDateChange} date={value} />
                    </Suspense>
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
        props: {
            name: session.user?.name
        }
    };
};

export default DashboardPage;
