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
        id: 'clockwork-carnival',
        name: "The Clockwork Carnival",
        hook: 'A whimsical steampunk carnival has gone quiet.',
        description: "Restart the giant clockwork ferris wheel and unlock the ornate gate before “closing time.” A whimsical steampunk carnival has gone quiet, and it's up to your team to bring it back to life.",
        difficulty: 'Medium',
        duration: '60 Min',
        players: '4-8',
        image: '/images/carnival.png',
        theme: 'Steampunk',
        features: ['Mechanical puzzles', 'Whimsical atmosphere', 'Team cooperation'],
        successRate: '45%',
    },
    {
        id: 'secret-library',
        name: "The Secret Library Door",
        hook: 'In a grand old library, a single “wrong” book is the key.',
        description: "Find hidden mechanisms in the shelves to reveal a secret passage and escape. In a grand old library, a single “wrong” book is the key to uncovering the mysteries hidden within.",
        difficulty: 'Hard',
        duration: '60 Min',
        players: '2-6',
        image: '/images/library.png',
        theme: 'Mystery',
        features: ['Hidden passages', 'Logic puzzles', 'Immersive setting'],
        successRate: '32%',
    },
    {
        id: 'submarine-countdown',
        name: "Submarine Countdown",
        hook: 'You’re inside a retro submarine control room with a sealed hatch.',
        description: "Solve dial, lever, and symbol puzzles to stabilize systems and surface safely. You’re inside a retro submarine control room with a sealed hatch, and time is running out.",
        difficulty: 'Expert',
        duration: '60 Min',
        players: '4-8',
        image: '/images/submarine.png',
        theme: 'Thriller',
        features: ['Pressure puzzles', 'Simulated systems', 'High tension'],
        successRate: '15%',
    },
    {
        id: 'space-station',
        name: "Space Station Airlock Run",
        hook: 'A clean sci‑fi corridor ends at a locked airlock.',
        description: "Align modules, reroute power, and crack the access sequence to open the escape bay. A clean sci‑fi corridor ends at a locked airlock, and only your team can open it.",
        difficulty: 'Hard',
        duration: '60 Min',
        players: '4-8',
        image: '/images/space.png',
        theme: 'Sci-Fi',
        features: ['Tech-heavy puzzles', 'Futuristic design', 'Cooperative tasks'],
        successRate: '28%',
    },
    {
        id: 'jungle-temple',
        name: "Jungle Temple Sun Dial",
        hook: 'Deep in the jungle, an ancient temple guards its exit.',
        description: "Use the sun dial and symbols to align the door and break free. Deep in the jungle, an ancient temple guards its exit behind rotating tiles that challenge even the bravest explorers.",
        difficulty: 'Medium',
        duration: '60 Min',
        players: '2-8',
        image: '/images/jungle.png',
        theme: 'Adventure',
        features: ['Physical interaction', 'Ancient symbols', 'Atmospheric sound'],
        successRate: '50%',
    },
    {
        id: 'wizards-workshop',
        name: "The Wizard’s Workshop",
        hook: 'A playful magic workshop is full of potions and clever contraptions.',
        description: "Mix the right harmless “recipe” to reveal the key and unlock the rune door. A playful magic workshop is full of potions and clever contraptions waiting for your magical touch.",
        difficulty: 'Easy',
        duration: '60 Min',
        players: '2-6',
        image: '/images/wizard.png',
        theme: 'Fantasy',
        features: ['Potion mixing', 'Magical effects', 'Family friendly'],
        successRate: '75%',
    },
    {
        id: 'detective-office',
        name: "Detective’s Office",
        hook: 'A vintage detective office holds a wall safe and a trail of clues.',
        description: "Decode ciphers and evidence to retrieve the map and find the way out. A vintage detective office holds a wall safe and a trail of clues left behind by a missing investigator.",
        difficulty: 'Medium',
        duration: '60 Min',
        players: '2-5',
        image: '/images/detective.png',
        theme: 'Noir',
        features: ['Deduction puzzles', 'Evidence finding', 'Narrative driven'],
        successRate: '60%',
    },
];

export function getRoomBySlug(slug: string): Room | undefined {
    return rooms.find(room => room.id === slug);
}
