import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { AUTH_STATUS } from 'config/app.config';
import { useCallback } from 'react';
import { axiosInstance } from '_http';

type GetProjectType = {
  status: string;
  id: string;
};

const useProject = ({
  status,
  id,
}: GetProjectType): UseQueryResult<
  AxiosResponse<any, any> | undefined,
  unknown
> => {
  const fetch = useCallback(
    async () => axiosInstance.post('/project/get', { projectId: id }),
    [id]
  );

  const query = useQuery(['data', id], fetch, {
    enabled: status === AUTH_STATUS.SUCCESS && !!id,
    staleTime: Infinity,
  });

  return {
    ...query,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  } as UseQueryResult<AxiosResponse<any, any>, unknown>;
};

export default useProject;
