import { NextRouter, Router } from "next/router";
import { MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useRouterQuery<T = Record<string, any>>(router: NextRouter): T {
  const getRouterQuery = (routePath: string): T =>
    [...new URL(`d:dummy?${routePath.split("?")[1]}`).searchParams.entries()]
      .map((entry) => ({ [entry[0]]: entry[1] }))
      .reduce((a, b) => ({ ...a, ...b })) as T;

  const [query, setQuery] = useState<T>(getRouterQuery(router.asPath));

  useEffect(() => {
    setQuery(getRouterQuery(router.asPath));
  }, [router.asPath]);

  return query;
}

export function handleOnMouseDown(
  event: React.MouseEvent<HTMLElement>,
  cb: CallableFunction
): void {
  event.button == 0 && cb();
}

export function formatWalletAddress(address: string): string {
  return address ? `${address.slice(0, 5)}...${address.slice(-3)}` : "";
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
