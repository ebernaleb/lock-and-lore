'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { BOOKING_URL } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
    roomId: string;
    roomName: string;
}

const timeSlots = [
    '10:00 AM',
    '12:00 PM',
    '2:00 PM',
    '4:00 PM',
    '6:00 PM',
    '8:00 PM',
];

export default function BookingCalendar({ roomId, roomName }: BookingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const isPast = (day: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(year, month, day);
        return checkDate < today;
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );
    };

    const handleDateClick = (day: number) => {
        if (isPast(day)) return;
        setSelectedDate(new Date(year, month, day));
        setSelectedTime(null);
    };

    const handleTimeClick = (time: string) => {
        setSelectedTime(time);
    };

    const buildBookingUrl = () => {
        if (!selectedDate || !selectedTime) return BOOKING_URL;
        const dateStr = selectedDate.toISOString().split('T')[0];
        return `${BOOKING_URL}?room=${roomId}&date=${dateStr}&time=${encodeURIComponent(selectedTime)}`;
    };

    // Build calendar grid
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <div className="bg-zinc-900/80 backdrop-blur-sm border-2 sm:border-4 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:sticky lg:top-32">
            {/* Header */}
            <h3
                className="text-xl sm:text-2xl font-bold text-white uppercase tracking-widest mb-2 text-center"
                style={{ fontFamily: 'var(--font-cinzel)' }}
            >
                Book Your Escape
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm text-center mb-4 sm:mb-6">
                Select a date and time for {roomName}
            </p>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                    onClick={prevMonth}
                    className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <span className="text-white font-bold tracking-wider uppercase text-sm sm:text-base">
                    {monthNames[month]} {year}
                </span>
                <button
                    onClick={nextMonth}
                    className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    aria-label="Next month"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider py-1.5 sm:py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-4 sm:mb-6">
                {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square">
                        {day !== null && (
                            <button
                                onClick={() => handleDateClick(day)}
                                disabled={isPast(day)}
                                className={`w-full h-full min-w-[40px] min-h-[40px] rounded-md sm:rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 ${isPast(day)
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : isSelected(day)
                                        ? 'bg-primary text-white'
                                        : isToday(day)
                                            ? 'bg-white/10 text-white'
                                            : 'text-white hover:bg-white/10 active:bg-white/20'
                                    }`}
                            >
                                {day}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div className="mb-4 sm:mb-6 animate-in fade-in duration-300">
                    <h4 className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 sm:mb-3">
                        Available Times
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => handleTimeClick(time)}
                                className={`py-3 sm:py-3.5 min-h-[44px] rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${selectedTime === time
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-white hover:bg-white/10 active:bg-white/15'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Book Button */}
            <Button
                href={buildBookingUrl()}
                className={`w-full py-4 sm:py-6 min-h-[48px] rounded-full font-bold tracking-widest uppercase transition-all duration-300 text-sm sm:text-base ${selectedDate && selectedTime
                    ? 'bg-white text-black hover:bg-primary hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                    : 'bg-white/20 text-white/60 cursor-default pointer-events-none'
                    }`}
            >
                {selectedDate && selectedTime ? 'Book Now' : 'Select Date & Time'}
            </Button>

            {/* Selected Summary */}
            {selectedDate && selectedTime && (
                <p className="text-center text-gray-400 text-[10px] sm:text-xs mt-3 sm:mt-4 tracking-wider">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                </p>
            )}
        </div>
    );
}
