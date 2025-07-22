import { createSlice } from "@reduxjs/toolkit";

const scoreSlice = createSlice({
  name: 'scores',
  initialState: {
    snake: 0,
    memory: 0,
    rps: 0,
  },
  reducers: {
    updateSnakeScore: (state, action) => {
      const currentScore = action.payload; // Get the score passed from the component

      // Only update the high score if the current game's score is greater
      if (currentScore > state.snake) {
        state.snake = currentScore;
      }
    },

    updateMemoryScore: (state, action) => {
      // action.payload is elapsed time in seconds
      if (state.memory === 0 || action.payload < state.memory) {
        state.memory = action.payload;
      }  
    },

    updateRPSScore: (state, action) => {
      if (action.payload > state.rps) {
        state.rps = action.payload; // Only update if new streak is higher
      }
    },

  },
});

export const { updateSnakeScore, updateMemoryScore, updateRPSScore, resetSnakeScore } = scoreSlice.actions;
export default scoreSlice.reducer;
