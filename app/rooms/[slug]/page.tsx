import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getRoomBySlug, rooms } from '@/lib/rooms';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import RoomDetail from '@/components/room-detail';
import BookingCalendar from '@/components/booking-calendar';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return rooms.map((room) => ({
        slug: room.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const room = getRoomBySlug(slug);

    if (!room) {
        return {
            title: 'Room Not Found | Lock & Lore',
        };
    }

    return {
        title: `${room.name} | Lock & Lore Escape Room`,
        description: room.description,
        openGraph: {
            title: `${room.name} | Lock & Lore`,
            description: room.hook,
            images: [room.image],
        },
    };
}

export default async function RoomPage({ params }: PageProps) {
    const { slug } = await params;
    const room = getRoomBySlug(slug);

    if (!room) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Room Content */}
            <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32">
                <div className="container px-4 md:px-8 mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/#rooms"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 sm:mb-8 group min-h-[44px] px-2 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs sm:text-sm uppercase tracking-widest">Go Back</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
                        {/* Left: Room Details */}
                        <div className="lg:col-span-3">
                            <RoomDetail room={room} />
                        </div>

                        {/* Right: Booking Calendar */}
                        <div className="lg:col-span-2">
                            <BookingCalendar roomId={room.id} roomName={room.name} />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
