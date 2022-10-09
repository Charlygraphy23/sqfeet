import { toast } from 'components/alert';
import Footer from 'components/footer';
import PageLoader from 'components/loader';
import ViewProject from 'components/viewProject';
import { AUTH_STATUS } from 'config/app.config';
import { ProjectData } from 'interface';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '_http';

const ViewPageById = () => {
  const { query, push } = useRouter();
  const [projectData, setProjectData] = useState<ProjectData>(
    {} as ProjectData
  );
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const { status } = useSession();
  const [readOnlyId, setReadOnlyId] = useState('');

  const projectId = query?.projectid ? String(query?.projectid) : null;

  const handleReadOnly = useCallback((id: string) => {
    setReadOnly((prevState) => !prevState);
    setReadOnlyId(id);
  }, []);

  useEffect(() => {
    if (!projectId) return;

    if (status === AUTH_STATUS.ERROR) {
      push('/');
      return;
    }

    if (status !== AUTH_STATUS.SUCCESS) return;

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    axiosInstance
      .post('/project/get', { projectId }, { signal })
      .then((res) => {
        setProjectData(res?.data?.data);
        setLoading(false);
        handleReadOnly('');
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error?.message);
          setLoading(false);
        }
      });

    return () => {
      setLoading(false);
      controller.abort();
    };
  }, [projectId, push, status]);

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
        readOnlyId={readOnlyId}
      />

      <Footer />
    </div>
  );
};

export default ViewPageById;
