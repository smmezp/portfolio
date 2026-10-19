/*
 * Medeiros portfolio content.
 * Keep editable, non-project content here so the layout stays reusable.
 */

window.MEDEIROS_SITE = {
  name: 'Medeiros',
  role: 'Minecraft Developer',
  contact: {
    discord: 'smmezp',
    discordServer: 'https://discord.gg/Unbx6TpXwa'
  },
  services: [
    {
      id: 'custom-plugins',
      number: '01',
      title: 'Custom Minecraft Plugins',
      shortTitle: 'Custom plugins',
      description: 'Paper and Spigot plugins made for your server’s mechanics, with configuration your staff can actually use.',
      icon: 'code'
    },
    {
      id: 'server-development',
      number: '02',
      title: 'Server Development',
      shortTitle: 'Server systems',
      description: 'Systems that work together on your server: progression, moderation, economy and the player experience around them.',
      icon: 'layers'
    },
    {
      id: 'plugin-configuration',
      number: '03',
      title: 'Plugin Configuration',
      shortTitle: 'Configuration',
      description: 'Menus, custom items, enchantments and other setups for the plugins you already use, delivered tested and documented.',
      icon: 'sliders'
    },
    {
      id: 'discord-bots',
      number: '04',
      title: 'Discord Bots',
      shortTitle: 'Discord bots',
      description: 'Discord.js bots and integrations that keep your community and your server in sync.',
      icon: 'bot'
    },
    {
      id: 'proxy-development',
      number: '05',
      title: 'Proxy Development',
      shortTitle: 'Proxy development',
      description: 'Velocity proxy plugins and integrations for networks that need reliable routing, permissions and control.',
      icon: 'network'
    },
    {
      id: 'bug-fixing',
      number: '06',
      title: 'Bug Fixing',
      shortTitle: 'Bug fixing',
      description: 'Debugging and fixes for existing plugins, integrations and server systems.',
      icon: 'wrench'
    },
    {
      id: 'server-setup',
      number: '07',
      title: 'Server Setup',
      shortTitle: 'Server setup',
      description: 'A solid technical base for launching or refreshing a server, without unnecessary complexity.',
      icon: 'terminal'
    },
    {
      id: 'custom-integrations',
      number: '08',
      title: 'Custom Integrations',
      shortTitle: 'Integrations',
      description: 'Connections between your Minecraft server, proxy, Discord and the tools your team already uses.',
      icon: 'spark'
    }
  ],
  technologies: [
    { name: 'Java', mark: 'J' },
    { name: 'Paper', mark: 'P' },
    { name: 'Spigot', mark: 'S' },
    { name: 'Velocity', mark: 'V' },
    { name: 'Maven', mark: 'M' },
    { name: 'Discord.js', mark: 'D' },
    { name: 'JavaScript', mark: 'JS' },
    { name: 'Minecraft APIs', mark: 'API' }
  ],
  process: [
    {
      number: '01',
      title: 'Understand the brief',
      description: 'We agree on what players should experience and what your server needs from it.'
    },
    {
      number: '02',
      title: 'Build it',
      description: 'I build it to be configurable and easy to read, focused on your actual use case.'
    },
    {
      number: '03',
      title: 'Test and hand over',
      description: 'We test what matters, fix what comes up, and you get something your team can run.'
    }
  ],
  projectTypes: [
    'Custom Minecraft Plugin',
    'Server System',
    'Plugin Configuration',
    'Discord Bot',
    'Velocity / Proxy Development',
    'Bug Fixing',
    'Custom Integration',
    'Other'
  ],
  budgets: [
    'Under $50',
    '$50 – $150',
    '$150 – $500',
    '$500+',
    'Not sure yet'
  ]
};
