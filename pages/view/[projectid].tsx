import { toast } from 'components/alert';
import PageLoader from 'components/loader';
import ViewProject from 'components/viewProject';
import { AUTH_STATUS } from 'config/app.config';
import { ProjectData } from 'interface';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '_http';

const ViewPageById = () => {
  const { query } = useRouter();
  const [projectData, setProjectData] = useState<ProjectData>(
    {} as ProjectData
  );
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const { status } = useSession();

  const projectId = useMemo(
    () => (query?.projectid ? String(query?.projectid) : null),
    [query?.projectid]
  );

  console.log({ query });

  const handleReadOnly = useCallback(() => {
    setReadOnly((prevState) => !prevState);
  }, []);

  useEffect(() => {
    if (!projectId && status !== AUTH_STATUS.SUCCESS) return;

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    axiosInstance
      .post('/project/get', { projectId }, { signal })
      .then((res) => {
        setProjectData(res?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.message);
        setLoading(false);
        console.error(error);
      });

    return () => {
      setLoading(false);
      controller.abort();
    };
  }, [projectId, status]);

  if (status === AUTH_STATUS.LOADING) return <PageLoader />;

  return (
    <div className='viewProject'>
      <h1 className='page_title mt-3 mb-2'>View/Edit Project</h1>

      <ViewProject
        readOnly={readOnly}
        id={projectId ?? ''}
        handleReadOnly={handleReadOnly}
        loading={loading}
        projectData={projectData}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req, params = {} } = context;

  if (!params?.projectid) {
    console.log('Invalid!!!');
  }

  const session = await getSession({ req });

  // ? if not authorized
  if (!session)
    return {
      props: {
        data: [],
      },
      redirect: {
        destination: '/',
        statusCode: '301',
      },
    };

  return {
    props: {},
  };
};

export default ViewPageById;
