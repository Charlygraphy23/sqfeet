import Footer from 'components/footer';
import Profile from 'components/profile';
import ViewProject from 'components/viewProject';
import { AUTH_STATUS } from 'config/app.config';
import { ProjectData } from 'interface';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useProject from 'query/useProject';
import { useCallback, useEffect, useState } from 'react';

const PageLoader = dynamic(() => import('components/loader'), {
  ssr: false,
  suspense: true,
});

const ViewPageById = () => {
  const { query, push } = useRouter();
  const [projectData, setProjectData] = useState<ProjectData>(
    {} as ProjectData
  );

  const [readOnly, setReadOnly] = useState(true);
  const { status } = useSession();
  const [readOnlyId, setReadOnlyId] = useState('');

  const projectId = query?.projectid ? String(query?.projectid) : '';

  const { isLoading, data, isFetched } = useProject({ id: projectId, status });

  const handleReadOnly = useCallback((id: string) => {
    setReadOnly((prevState) => !prevState);
    setReadOnlyId(id);
  }, []);

  useEffect(() => {
    if (!projectId) return;

    if (status === AUTH_STATUS.ERROR) {
      push('/');
    }

    if (data?.data?.data) {
      setProjectData(data?.data?.data);
      handleReadOnly('');
    }
  }, [handleReadOnly, data, projectId, status, push]);

  if (status === AUTH_STATUS.LOADING) return <PageLoader bootstrap />;

  return (
    <div className='viewProject'>
      <h1 className='page_title mt-3 mb-2'>View/Edit Project</h1>
      <ViewProject
        readOnly={readOnly}
        id={projectId ?? ''}
        handleReadOnly={handleReadOnly}
        loading={isLoading}
        isDataFetched={isFetched}
        projectData={projectData}
        readOnlyId={readOnlyId}
      />
      <Footer />
      <Profile />
    </div>
  );
};

export default ViewPageById;
