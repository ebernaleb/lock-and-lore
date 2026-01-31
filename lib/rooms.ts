export interface Room {
    id: string;
    name: string;
    hook: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    duration: string;
    players: string;
    image: string;
    theme: string;
    isNew?: boolean;
    features: string[];
    successRate: string;
}

export const rooms: Room[] = [
    {
        id: 'skybound-dynasty',
        name: "Skybound Dynasty",
        hook: 'High above the world, a city floats amongst the clouds. Valkeria. A kingdom of marble towers and starlight. Seven constellations shine above it, steady and bright.',
        description: "A coronation approaches, and you have been invited to witness history. Golden halls open. Ancient observatories stir. At first, everything feels exactly as it should, then small details begin to stand out. Charts don't quite agree. Old records start to whisper. Murmurs of ancient forces sleeping beneath the sky penned from those no longer welcome in the upper halls. Skybound Dynasty is a story-driven escape room where wonder and mystery intertwine. Your choices will determine the future Valkeria will face. The city is watching. The sky is waiting. Will you protect what exists, or decide what comes next?",
        difficulty: 'Medium',
        duration: '75 Min',
        players: '2-6',
        image: '/images/floatingcity_room.png',
        theme: 'Fantasy',
        isNew: true,
        features: ['Story-driven narrative', 'Multiple endings', 'Celestial puzzles', 'Branching choices'],
        successRate: '42%',
    },
    {
        id: 'escape-the-simulation',
        name: "Escape the Simulation",
        hook: 'You sit at your desk. Same chair. Same screen. Same office. Another typical Tuesday. Emails arrive. Boxes are checked. Time moves forward. Everything feels real, until it doesn\'t.',
        description: "A coworker repeats the same sentence. Your computer refreshes on its own. The clock skips backward. Just for a moment. You tell yourself it's nothing. Stress. Fatigue. A glitch in your mind, but the glitches multiply. Patterns emerge. Hidden messages appear in ordinary files. Code hides beneath everyday objects. You weren't hired here. You were planted here. This office isn't a workplace, it's a simulation, and you've become self-aware. You can try to escape. You can try to take control. Will you break free, or change reality forever?",
        difficulty: 'Hard',
        duration: '60 Min',
        players: '2-8',
        image: '/images/simulation_room.png',
        theme: 'Sci-Fi',
        isNew: true,
        features: ['Reality-bending puzzles', 'Hidden code mechanics', 'Glitch effects', 'Two escape paths'],
        successRate: '28%',
    },
    {
        id: 'echo-chamber',
        name: "Echo Chamber",
        hook: 'Mara Cantrell, a reclusive artist, vanished after claiming her memories were being rewritten. Her study remains frozen in time, filled with shifting artwork, contradictory journals, and secrets she tried to bury.',
        description: "As you explore the room she left behind, you uncover two versions of her story, and the truth hidden behind the illusions she created. Only by separating reality from the lies she told herself can you discover what really happened to Mara. But be warned, the truth you uncover depends on the choices you make and the version of Mara you choose to believe. Some paths lead to the story she wanted the world to see. Others reveal the one she tried desperately to hide. In the end, you won't just learn what happened to Mara; you'll decide which version of her story survives.",
        difficulty: 'Expert',
        duration: '90 Min',
        players: '2-4',
        image: '/images/art_room.png',
        theme: 'Psychological',
        isNew: true,
        features: ['Dual narratives', 'Art-based puzzles', 'Memory fragments', 'Player-determined truth'],
        successRate: '18%',
    },
];

export function getRoomBySlug(slug: string): Room | undefined {
    return rooms.find(room => room.id === slug);
}
