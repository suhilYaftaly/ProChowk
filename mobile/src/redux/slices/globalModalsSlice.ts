import { createSlice } from "@reduxjs/toolkit";

interface IState {}

const initialState: IState = {};

const slice = createSlice({
  name: "globalModals",
  initialState,
  reducers: {},
});

export const {} = slice.actions;
export default slice.reducer;
