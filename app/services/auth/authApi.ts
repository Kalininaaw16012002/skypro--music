import axios from 'axios';
import { BASE_URL } from '../constants';

type authUserProps = {
  email: string;
  password: string;
};

type authUserReturn = {
  email: string;
  username: string;
  _id: number;
};

type registerUserProps = {
  email: string;
  password: string;
  username: string;
};

type registerUserResponse = {
  message: string;
  result: {
    email: string;
    username: string;
    _id: number;
  };
  success: boolean;
};

type GetTokenProps = {
  email: string;
  password: string;
};

type GetTokenResponse = {
  refresh: string;
  access: string;
};

type RefreshTokenProps = {
  refresh: string;
};

type RefreshTokenResponse = {
  access: string;
};

export const authUser = async (
  data: authUserProps,
): Promise<authUserReturn> => {
  const response = await axios.post<authUserReturn>(
    BASE_URL + '/user/login/',
    data,
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );

  return response.data;
};

export const registerUser = async (
  data: registerUserProps,
): Promise<registerUserResponse> => {
  const response = await axios.post<registerUserResponse>(
    BASE_URL + '/user/signup/',
    data,
    {
      headers: { 'content-type': 'application/json' },
    },
  );
  return response.data;
};

export const getToken = async (
  data: GetTokenProps,
): Promise<GetTokenResponse> => {
  const response = await axios.post<GetTokenResponse>(
    BASE_URL + '/user/token/',
    data,
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );
  return response.data;
};

export const refreshToken = async (
  data: RefreshTokenProps,
): Promise<RefreshTokenResponse> => {
  const response = await axios.post<RefreshTokenResponse>(
    BASE_URL + '/user/token/refresh/',
    data,
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );
  return response.data;
};
