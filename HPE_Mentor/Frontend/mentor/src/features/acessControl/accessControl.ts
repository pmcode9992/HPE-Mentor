import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  user_id: number;
  role: string;
  enrollments : number[]
  quiz_attempts: number []
}

const initialState: UserState = {
  user_id: 0,
  role: 'guest',
  enrollments:[],
  quiz_attempts: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user_id = action.payload.user_id;
      state.role = action.payload.role;
      state.enrollments = action.payload.enrollments;
      state.quiz_attempts= action.payload.quiz_attempts
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
