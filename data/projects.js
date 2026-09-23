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
      download: 'https://ko-fi.com/s/d6ba497b6e'
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
      download: 'https://ko-fi.com/s/d2dfadbcc7' 
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
  }
];
