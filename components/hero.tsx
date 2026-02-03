import { MapPin, Ticket } from "lucide-react";

export function Hero() {
    return (
        <div className="relative min-h-[600px] h-[75vh] flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/hero_img.png')",
                    backgroundSize: "110%",
                    backgroundPosition: "20% 45%", // 20% x-pos to show left side (shifting image right)
                }}
            >
            </div>
            {/* Left side gradient for text readability with matching blur */}
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/90 via-black/50 to-transparent z-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_right,black,transparent)]"></div>


            <div className="relative z-10 w-full pl-6 sm:pl-12 lg:pl-20 h-full flex items-start pt-32 md:pt-52">
                <div className="w-full max-w-4xl">
                    {/* Left Column: Text Content */}
                    <div className="flex flex-col items-start space-y-4">
                        <h1 className="text-[2.75rem] md:text-[4rem] font-black leading-tight text-white drop-shadow-xl font-heading tracking-normal [text-shadow:0_4px_12px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.1)]">
                            The Door Is Locked.<br />
                            <span className="text-primary whitespace-nowrap">Your Mind Is the Key.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed">
                            Immersive, private escape rooms in Virginia Beach, Virginia. Work together, solve puzzles, and have the adventure of a lifetime!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-all uppercase tracking-wide text-base">
                                <Ticket className="w-4 h-4" />
                                Book Your Escape
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 border-2 border-white/30 text-white font-bold py-3 px-6 rounded-full transition-all uppercase tracking-wide text-base backdrop-blur-sm">
                                <MapPin className="w-4 h-4" />
                                Our Location
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Placeholder for future content */}
                    <div className="hidden md:block">
                        {/* Future image or content goes here */}
                    </div>
                </div>
            </div>
        </div>
    );
}
