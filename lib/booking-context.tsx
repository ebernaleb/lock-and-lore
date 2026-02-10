'use client';

/**
 * @deprecated This booking context is superseded by the OTC iframe embed (OTCBookingEmbed.tsx).
 * The iframe manages its own booking state internally. This React Context was used by
 * the old 3-step booking flow (BookingPage, ScheduleStep, DetailsStep, ReviewStep).
 * The BookingProvider has been removed from layout.tsx.
 * Safe to remove once iframe integration is confirmed stable in production.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface TimeSlot {
  /** OTC booking slot ID -- needed to create transactions against this slot */
  booking_slot_id?: number;
  start_time: string;
  end_time: string;
  price?: number;
  available: boolean;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BookingState {
  currentStep: 1 | 2 | 3;
  gameId: number | null;
  gameName: string;
  gameSlug: string;
  gameImage: string;
  gameDuration: number;
  gameMinPlayers: number;
  gameMaxPlayers: number;
  gameDifficulty: number;
  gamePricingType: string;
  selectedDate: string | null;
  selectedSlot: TimeSlot | null;
  groupSize: number;
  customerInfo: CustomerInfo;
  errors: Record<string, string>;
  isLoading: boolean;
  isSuccess: boolean;
  confirmationNumber: string | null;
}

interface BookingContextType extends BookingState {
  initializeBooking: (params: {
    gameId: number;
    gameName: string;
    gameSlug: string;
    gameImage: string;
    gameDuration: number;
    gameMinPlayers: number;
    gameMaxPlayers: number;
    gameDifficulty: number;
    gamePricingType: string;
  }) => void;
  goToStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  previousStep: () => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setGroupSize: (size: number) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  setErrors: (errors: Record<string, string>) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSuccess: (success: boolean, confirmationNumber?: string) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialCustomerInfo: CustomerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const initialState: BookingState = {
  currentStep: 1,
  gameId: null,
  gameName: '',
  gameSlug: '',
  gameImage: '',
  gameDuration: 60,
  gameMinPlayers: 2,
  gameMaxPlayers: 8,
  gameDifficulty: 3,
  gamePricingType: '',
  selectedDate: null,
  selectedSlot: null,
  groupSize: 2,
  customerInfo: initialCustomerInfo,
  errors: {},
  isLoading: false,
  isSuccess: false,
  confirmationNumber: null,
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const initializeBooking = useCallback(
    (params: {
      gameId: number;
      gameName: string;
      gameSlug: string;
      gameImage: string;
      gameDuration: number;
      gameMinPlayers: number;
      gameMaxPlayers: number;
      gameDifficulty: number;
      gamePricingType: string;
    }) => {
      setState({
        ...initialState,
        gameId: params.gameId,
        gameName: params.gameName,
        gameSlug: params.gameSlug,
        gameImage: params.gameImage,
        gameDuration: params.gameDuration,
        gameMinPlayers: params.gameMinPlayers,
        gameMaxPlayers: params.gameMaxPlayers,
        gameDifficulty: params.gameDifficulty,
        gamePricingType: params.gamePricingType,
        groupSize: params.gameMinPlayers,
      });
    },
    []
  );

  const goToStep = useCallback((step: 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, currentStep: step, errors: {} }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(3, prev.currentStep + 1) as 1 | 2 | 3,
      errors: {},
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as 1 | 2 | 3,
      errors: {},
    }));
  }, []);

  const setSelectedDate = useCallback((date: string) => {
    setState((prev) => ({ ...prev, selectedDate: date, selectedSlot: null }));
  }, []);

  const setSelectedSlot = useCallback((slot: TimeSlot | null) => {
    setState((prev) => ({ ...prev, selectedSlot: slot }));
  }, []);

  const setGroupSize = useCallback((size: number) => {
    setState((prev) => ({ ...prev, groupSize: size }));
  }, []);

  const setCustomerInfo = useCallback((info: Partial<CustomerInfo>) => {
    setState((prev) => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, ...info },
    }));
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    setState((prev) => ({ ...prev, errors }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setIsSuccess = useCallback(
    (success: boolean, confirmationNumber?: string) => {
      setState((prev) => ({
        ...prev,
        isSuccess: success,
        confirmationNumber: confirmationNumber || null,
      }));
    },
    []
  );

  const resetBooking = useCallback(() => {
    setState(initialState);
  }, []);

  const value: BookingContextType = {
    ...state,
    initializeBooking,
    goToStep,
    nextStep,
    previousStep,
    setSelectedDate,
    setSelectedSlot,
    setGroupSize,
    setCustomerInfo,
    setErrors,
    setIsLoading,
    setIsSuccess,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
