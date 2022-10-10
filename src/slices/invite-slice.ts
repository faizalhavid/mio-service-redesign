import { createAsyncThunk } from '@reduxjs/toolkit';
import { getInitialState } from '../commons/initial-state';
import { InvitedUser, InviteUserRequest, InviteUserResponse } from '../commons/types';
import { API } from '../commons/urls';
import { RootState } from '../reducers';
import AxiosClient from '../services/axios-client';
import { createAsyncSlice } from './create-async-slice';

export const getInvitedUsersAsync = createAsyncThunk(
  'invited-users/all',
  async (data: { serviceAccountId: string }) => {
    const res = await AxiosClient.get(`${API.GET_INVITED_USERS}/${data.serviceAccountId}`);
    return res.data;
  }
);

export const inviteUserAsync = createAsyncThunk(
  'invite-user/new-user',
  async (data: InviteUserRequest, { rejectWithValue }) => {
    const res = await AxiosClient.post(`${API.INVITE_USER}`, data);
    if (res.data.status !== 'success') {
      return rejectWithValue({ error: res.data.message });
    }
    return res.data;
  }
);

export const invitedUsersSlice = createAsyncSlice({
  name: 'invited-users',
  initialState: getInitialState<InvitedUser>(),
  reducers: {},
  thunks: [getInvitedUsersAsync],
});

export const inviteNewUserSlice = createAsyncSlice({
  name: 'invite-user',
  initialState: getInitialState<InviteUserResponse>(),
  reducers: {},
  thunks: [inviteUserAsync],
});

export const selectInvitedUsers = (state: RootState) => state.invitedUsers;
export const selectInviteNewUser = (state: RootState) => state.inviteNewUser;
