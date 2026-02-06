'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1 as const, label: 'Schedule', shortLabel: 'Schedule' },
  { id: 2 as const, label: 'Your Details', shortLabel: 'Details' },
  { id: 3 as const, label: 'Review & Confirm', shortLabel: 'Review' },
];

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  const getStepState = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <nav aria-label="Booking progress" className="flex items-center justify-center gap-0 text-sm">
      {steps.map((step, index) => {
        const state = getStepState(step.id);

        return (
          <React.Fragment key={step.id}>
            <div
              className={`flex items-center gap-2.5 ${
                state === 'active'
                  ? 'text-white'
                  : state === 'completed'
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
            >
              {/* Step circle */}
              {state === 'completed' ? (
                <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm shadow-green-500/30">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
              ) : (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    state === 'active'
                      ? 'bg-primary text-neutral-950 shadow-sm shadow-primary/30'
                      : 'bg-neutral-800 text-gray-500'
                  }`}
                >
                  {step.id}
                </div>
              )}

              {/* Label -- full text on md+, short on mobile */}
              <span
                className={`font-medium hidden sm:inline ${
                  state === 'inactive' ? 'text-gray-600' : ''
                }`}
              >
                {step.label}
              </span>
              <span
                className={`font-medium sm:hidden ${
                  state === 'inactive' ? 'text-gray-600' : ''
                }`}
              >
                {step.shortLabel}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex items-center mx-3 sm:mx-4">
                <div
                  className={`w-6 sm:w-8 h-px ${
                    getStepState(steps[index + 1].id) !== 'inactive'
                      ? 'bg-green-500'
                      : 'bg-neutral-700'
                  }`}
                />
                <svg
                  className={`w-3 h-3 -ml-0.5 ${
                    getStepState(steps[index + 1].id) !== 'inactive'
                      ? 'text-green-500'
                      : 'text-neutral-700'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
