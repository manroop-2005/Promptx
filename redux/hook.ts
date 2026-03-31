import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useUser = () => {
  return useAppSelector((state) => state.user);
};

export default {
  useAppDispatch,
  useAppSelector,
  useAuth,
  useUser,
};