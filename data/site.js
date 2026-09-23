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
      description: 'Purpose-built Paper and Spigot plugins shaped around the mechanics, UX and operational needs of your server.',
      icon: 'code'
    },
    {
      id: 'server-development',
      number: '02',
      title: 'Server Development',
      shortTitle: 'Server systems',
      description: 'Connected server systems that make progression, moderation, economy and player experiences feel intentional.',
      icon: 'layers'
    },
    {
      id: 'plugin-configuration',
      number: '03',
      title: 'Plugin Configuration',
      shortTitle: 'Configuration',
      description: 'Clean, maintainable configuration for existing plugins, with sensible defaults and a setup your team can own.',
      icon: 'sliders'
    },
    {
      id: 'discord-bots',
      number: '04',
      title: 'Discord Bots',
      shortTitle: 'Discord bots',
      description: 'Discord.js automation, tools and integrations that keep your community and server operations in sync.',
      icon: 'bot'
    },
    {
      id: 'proxy-development',
      number: '05',
      title: 'Proxy Development',
      shortTitle: 'Proxy development',
      description: 'Velocity proxy systems and integrations for networks that need reliable routing, permissions and control.',
      icon: 'network'
    },
    {
      id: 'bug-fixing',
      number: '06',
      title: 'Bug Fixing',
      shortTitle: 'Bug fixing',
      description: 'Focused debugging and fixes for existing Minecraft plugins, integrations and server systems.',
      icon: 'wrench'
    },
    {
      id: 'server-setup',
      number: '07',
      title: 'Server Setup',
      shortTitle: 'Server setup',
      description: 'A considered technical foundation for launching or refreshing a server without unnecessary complexity.',
      icon: 'terminal'
    },
    {
      id: 'custom-integrations',
      number: '08',
      title: 'Custom Integrations',
      shortTitle: 'Integrations',
      description: 'Useful connections between your Minecraft server, proxy, Discord and the tools your team already uses.',
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
      description: 'We align on the player experience, technical constraints and the outcome your server needs.'
    },
    {
      number: '02',
      title: 'Build the right system',
      description: 'The implementation stays configuration-friendly, readable and focused on the actual use case.'
    },
    {
      number: '03',
      title: 'Refine and hand over',
      description: 'We test the important paths, polish the details and leave you with something your team can operate.'
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
    'Under $250',
    '$250 – $500',
    '$500 – $1,000',
    '$1,000+',
    'Not sure yet'
  ]
};
