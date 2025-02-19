import { configureStore } from "@reduxjs/toolkit";

// Import your slices and reducers here
import CounterReducer from "./slices/counterSlice";
import { counterApiSlice } from "@/lib/api/counterApi";

export const store = configureStore({
  reducer: {
    // Combine your reducers here
    counter: CounterReducer,
    [counterApiSlice.reducerPath]: counterApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(counterApiSlice.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
