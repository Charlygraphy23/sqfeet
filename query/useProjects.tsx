/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { AUTH_STATUS } from 'config/app.config';
import { useCallback } from 'react';
import { axiosInstance } from '_http';

type UseProjectsType = {
  status: string;
};

type GetProjectType = {
  id: string;
} & UseProjectsType;

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

export const getProject = ({
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
  });

  return query;
};

export default useProjects;
