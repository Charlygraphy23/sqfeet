import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { AUTH_STATUS } from 'config/app.config';
import { useCallback } from 'react';
import { axiosInstance } from '_http';

type UseProjectsType = {
  status: string;
};

const useProjects = ({
  status,
}: UseProjectsType): UseQueryResult<
  AxiosResponse<any, any> | undefined,
  unknown
> => {
  const fetchAllProject = useCallback(
    async () => axiosInstance.get('/project/list'),
    []
  );

  const query = useQuery(['data'], fetchAllProject, {
    enabled: status === AUTH_STATUS.SUCCESS,
  });

  return query;
};

export default useProjects;
