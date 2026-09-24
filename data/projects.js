/*
 * Central project catalog.
 * Add one object here to create a project card and a route at /projects/<slug>.
 * Image files live in assets/projects/<slug>/ and can be replaced without
 * touching the page layout.
 */

window.MEDEIROS_PROJECTS = [
  {
    id: 'heavenjoin',
    name: 'Heaven Join',
    slug: 'heavenjoin',
    shortDescription: 'A lightweight and configurable join and quit message plugin for Minecraft servers.',
    fullDescription: 'HeavenJoin is a highly configurable join and quit message plugin designed to give servers a more personalized player experience while keeping message management simple, lightweight, and easy to customize.',
    category: 'Minecraft Plugins',
    categoryLabel: 'Minecraft Plugin',
    status: 'Released',
    technologies: ['Java', 'Paper', 'Spigot'],
    features: [
      'Join and quit messages',
      'Fully configurable messages',
      'HEX color support',
      'PlaceholderAPI support',
      'Custom player placeholders',
      'Staff join alerts',
      'Permission-based features',
      'Multi-version compatibility'
    ],
    images: {
      hero: 'assets/projects/heavenjoin/hero.png',
      gallery: [
        'assets/projects/heavenjoin/1.png',
        'assets/projects/heavenjoin/2.png',
        'assets/projects/heavenjoin/3.png'
      ]
    },
    videos: [
      'assets/projects/heavenjoin/video.mp4'
    ],
    links: {
      download: 'https://www.spigotmc.org/resources/heavenjoin.138793/'
    },
    github: '',
    discord: 'https://discord.gg/Unbx6TpXwa',
    price: 'Free',
    featured: true,
    date: '2026',
    details: [
      {
        title: 'Build focus',
        body: 'A lightweight join and quit message system focused on clean configuration, customization and a smooth player experience.'
      },
      {
        title: 'Technical direction',
        body: 'Designed for the Bukkit, Spigot and Paper ecosystem with broad Minecraft version compatibility and optional PlaceholderAPI support.'
      }
    ]
  },
  {
    id: 'heavenclearlag',
    name: 'Heaven ClearLag',
    slug: 'heavenclearlag',
    shortDescription: 'A lightweight and configurable cleanup plugin for Minecraft servers.',
    fullDescription: 'HeavenClearLag is a lightweight and highly configurable cleanup plugin designed to keep Minecraft servers clean and optimized through automatic entity cleanup, customizable warnings and a built-in trash system.',
    category: 'Minecraft Plugins',
    categoryLabel: 'Minecraft Plugin',
    status: 'Released',
    technologies: ['Java', 'Paper', 'Spigot'],
    features: [
      'Automatic entity cleanup',
      'Dropped item cleanup',
      'XP orb cleanup',
      'Configurable cleanup timers',
      'Cleanup warnings',
      'Manual cleanup commands',
      'Built-in trash system',
      'HEX color support',
      'Fully configurable system',
      'Multi-version compatibility'

    ],
    images: {
      hero: 'assets/projects/heavenclearlag/hero.png',
      gallery: [
        'assets/projects/heavenclearlag/1.png',
        'assets/projects/heavenclearlag/2.png',
        'assets/projects/heavenclearlag/3.png'
      ]
    },
    videos: [],
    links: {
      download: 'https://www.spigotmc.org/resources/heavenclearlag.138846/' 
    },
    github: '',
    discord: 'https://discord.gg/Unbx6TpXwa',
    price: 'Free',
    featured: true,
    date: '2026',
    details: [
      {
        title: 'Build focus',
        body: 'A calm, structured support flow that helps communities route requests, involve staff and keep ticket history useful.'
      },
      {
        title: 'Technical direction',
        body: 'Discord.js and JavaScript keep the bot flexible for server-specific commands, embeds, categories and operational rules.'
      }
    ]
  },
  {
    id: 'heavenchat',
    name: 'Heaven Chat',
    slug: 'heavenchat',
    shortDescription: 'A lightweight and configurable chat system for Minecraft servers.',
    fullDescription: 'HeavenChat is a highly configurable chat plugin designed to provide flexible communication through local, global, staff, private and custom chat channels while keeping the system lightweight and easy to manage.',
    category: 'Minecraft Plugins',
    categoryLabel: 'Minecraft Plugin',
    status: 'In development',
    technologies: ['Java', 'Paper', 'Spigot'],
    features: [
      'Local and global chat',
      'Custom chat channels',
      'Private messaging',
      'Staff chat',
      'Chat spy system',
      'Chat channel focus',
      'LuckPerms integration',
      'PlaceholderAPI support',
      'HEX color support',
      'Multi-version compatibility'
    ],
    images: {
      hero: 'assets/projects/heavenchat/hero.png',
      gallery: [
        'assets/projects/heavenchat/1.png',
        'assets/projects/heavenchat/2.png',
        'assets/projects/heavenchat/3.png'
      ]
    },
    videos: [],
    links: {
      download: 'https://www.spigotmc.org/resources/heavenchat.139064/'
    },
    github: '',
    discord: 'https://discord.gg/Unbx6TpXwa',
    price: 'Free',
    featured: true,
    date: '2026',
    details: [
      {
        title: 'Build focus',
        body: 'A flexible communication system focused on clean chat channels, configurable formats and an organized player experience.'
      },
      {
        title: 'Technical direction',
        body: 'Built with Java for the Paper and Spigot ecosystem, with configurable channels, permissions and broad Minecraft version compatibility.'
      }
    ]
  },
  {
    id: 'heavenlobby',
    name: 'Heaven Lobby',
    slug: 'heavenlobby',
    shortDescription: 'A configurable lobby and server management experience for Minecraft networks.',
    fullDescription: 'HeavenLobby is a highly configurable lobby management and server selector plugin designed for Minecraft networks, combining server navigation, customizable menus, player features and network management into a unified experience.',
    category: 'Minecraft Plugins',
    categoryLabel: 'Minecraft Plugin',
    status: 'In development',
    technologies: ['Java', 'Paper', 'Spigot', 'Velocity'],
    features: [
      'Server selector',
      'Configurable GUI',
      'Lobby management',
      'Item customization',
      'PlaceholderAPI support',
      'Maintenance system',
      'Multi-version compatibility',
      'Configurable menus',
      'Player features',
      'Proxy integration'
    ],
    images: {
      hero: 'assets/projects/heavenlobby/hero.png',
      gallery: [
        'assets/projects/heavenlobby/1.png',
        'assets/projects/heavenlobby/2.png',
        'assets/projects/heavenlobby/3.png'
      ]
    },
    videos: [],
    links: {
      download: ''
    },
    github: '',
    discord: 'https://discord.gg/Unbx6TpXwa',
    price: 'TBA',
    featured: true,
    date: '2026',
    details: [
      {
        title: 'Build focus',
        body: 'A flexible lobby foundation focused on server navigation, configurable menus and a polished player experience across connected networks.'
      },
      {
        title: 'Technical direction',
        body: 'Built around the Paper, Spigot and Velocity ecosystem to support modern lobby environments, backend servers and proxy-based network setups.'
      }
    ]
  }
];
