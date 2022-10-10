import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getInitialState } from '../commons/initial-state';
import { LeadDetails, SubOrder } from '../commons/types';
import { API } from '../commons/urls';
import { RootState } from '../reducers';
import AxiosClient from '../services/axios-client';
import { createAsyncSlice } from './create-async-slice';

export const createLeadAsync = createAsyncThunk('lead/create', async (data: any) => {
  const res = await AxiosClient.post(API.POST_LEAD, data);
  return res.data;
});
export const updateLeadAsync = createAsyncThunk('lead/update', async (data: any) => {
  const res = await AxiosClient.put(`${API.PUT_LEAD}/${data.leadId}`, data);
  return res.data;
});
export const getLeadAsync = createAsyncThunk('lead/details', async (data: { leadId: string }) => {
  const res = await AxiosClient.get(`${API.GET_LEAD}/${data.leadId}`);
  return res.data;
});

// Slice

export const leadSlice = createAsyncSlice({
  name: 'lead',
  initialState: getInitialState<LeadDetails>(),
  reducers: {
    resetLeadState: (state) => {
      state.member = {} as LeadDetails;
    },
    updateLeadState: (state, { payload }: PayloadAction<{ lead: LeadDetails }>) => {
      state.member = { ...state.member, ...payload.lead };
    },
    updateLeadSubOrderState: (state, { payload }: PayloadAction<{ subOrder: SubOrder }>) => {
      const _subOrders: SubOrder[] = [...state.member.subOrders];
      const index = _subOrders.findIndex(
        (subOrder2) => subOrder2.serviceId === payload.subOrder.serviceId
      );
      _subOrders[index] = payload.subOrder;
      state.member = { ...state.member, subOrders: _subOrders };
    },
  },
  thunks: [createLeadAsync, updateLeadAsync, getLeadAsync],
});

// Actions
export const { resetLeadState, updateLeadState, updateLeadSubOrderState } = leadSlice.actions;
// Selectors

export const selectLead = (state: RootState) => state.lead;
