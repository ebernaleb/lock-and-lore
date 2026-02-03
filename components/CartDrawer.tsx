"use client";

import { X, Trash2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    // Mock cart data - ideally this would come from a context or global state
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            title: "Mad Hatter's Tea Party",
            date: "Oct 31, 2026",
            time: "7:00 PM",
            players: 4,
            price: 120,
        }
    ]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
                    <h2 className="text-xl font-heading font-black tracking-wide flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Your Cart
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                            <ShoppingBag className="w-16 h-16 text-gray-200" />
                            <p className="text-lg font-medium">Your cart is empty</p>
                            <button
                                onClick={onClose}
                                className="text-primary hover:text-primary-dark font-bold hover:underline"
                            >
                                Browse Rooms
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-4 group hover:border-primary/20 transition-colors">
                                {/* Image Placeholder */}
                                <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                                    {/* In detailed implementation, could show room image here */}
                                    {/* <img src="..." className="w-full h-full object-cover" /> */}
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">IMG</div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                                    <div className="text-sm text-gray-500 space-y-1 mt-1">
                                        <p>{item.date} at {item.time}</p>
                                        <p>{item.players} Players</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="font-bold text-primary">${item.price}</span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                        <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-full transition-all uppercase tracking-wide">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
