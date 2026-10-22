/*
 * Conteúdo geral do site (português e inglês).
 * Textos com { pt, en } trocam sozinhos quando a pessoa muda o idioma.
 * Os produtos ficam em arquivos separados: data/minecraft/nome.js (um por produto).
 */

window.MEDEIROS_SITE = {
  name: 'Medeiros',
  contact: {
    discord: 'smmezp',
    discordServer: 'https://discord.gg/Unbx6TpXwa',
    github: 'https://github.com/smmezp',
    githubHandle: 'smmezp',
    instagram: 'https://www.instagram.com/o.medeiros.dev/',
    instagramHandle: '@o.medeiros.dev',
    tiktok: 'https://www.tiktok.com/@smmezp',
    tiktokHandle: '@smmezp',
    kofi: 'https://ko-fi.com/smmezp'
  },

  /* Serviços de Minecraft (página /minecraft e /services) */
  services: [
    {
      id: 'plugin-configuration',
      icon: 'sliders',
      projectType: 'configuration',
      title: { pt: 'Configuração de plugins', en: 'Plugin configuration' },
      description: {
        pt: 'Menus, itens customizados, encantamentos e outros ajustes nos plugins que você já usa, entregues testados e documentados.',
        en: 'Menus, custom items, enchantments and other setups for the plugins you already use, delivered tested and documented.'
      }
    },
    {
      id: 'custom-plugins',
      icon: 'code',
      projectType: 'custom-plugin',
      title: { pt: 'Plugins personalizados', en: 'Custom plugins' },
      description: {
        pt: 'Plugins feitos do zero para as mecânicas do seu servidor, com configuração que a sua staff consegue usar.',
        en: 'Plugins built from scratch for your server’s mechanics, with configuration your staff can actually use.'
      }
    },
    {
      id: 'server-development',
      icon: 'layers',
      projectType: 'server-system',
      title: { pt: 'Sistemas para servidor', en: 'Server systems' },
      description: {
        pt: 'Sistemas que funcionam juntos no seu servidor: progressão, moderação, economia e a experiência do jogador.',
        en: 'Systems that work together on your server: progression, moderation, economy and the player experience around them.'
      }
    },
    {
      id: 'proxy-development',
      icon: 'network',
      projectType: 'proxy',
      title: { pt: 'Proxy e redes (Velocity)', en: 'Proxy and networks (Velocity)' },
      description: {
        pt: 'Plugins e integrações para Velocity, para redes que precisam de roteamento, permissões e controle confiáveis.',
        en: 'Velocity plugins and integrations for networks that need reliable routing, permissions and control.'
      }
    },
    {
      id: 'bug-fixing',
      icon: 'wrench',
      projectType: 'bug-fixing',
      title: { pt: 'Correção de bugs', en: 'Bug fixing' },
      description: {
        pt: 'Diagnóstico e correção de problemas em plugins, integrações e sistemas do seu servidor.',
        en: 'Debugging and fixes for existing plugins, integrations and server systems.'
      }
    },
    {
      id: 'server-setup',
      icon: 'terminal',
      projectType: 'server-system',
      title: { pt: 'Montagem de servidor', en: 'Server setup' },
      description: {
        pt: 'Uma base técnica sólida para lançar ou renovar um servidor, sem complicação desnecessária.',
        en: 'A solid technical base for launching or refreshing a server, without unnecessary complexity.'
      }
    }
  ],

  /* Serviços de Discord (página /discord) */
  discordServices: [
    {
      id: 'discord-moderation',
      icon: 'shield',
      command: { pt: '/moderacao', en: '/moderation' },
      projectType: 'discord-bot',
      title: { pt: 'Moderação e logs', en: 'Moderation and logs' },
      description: {
        pt: 'Comandos de moderação, registro de ações e filtros que ajudam a staff a manter a comunidade em ordem.',
        en: 'Moderation commands, action logs and filters that help staff keep the community in order.'
      }
    },
    {
      id: 'discord-tickets',
      icon: 'ticket',
      command: { pt: '/ticket', en: '/ticket' },
      projectType: 'discord-bot',
      title: { pt: 'Sistema de tickets', en: 'Ticket system' },
      description: {
        pt: 'Atendimento organizado, com painel, categorias e registro das conversas.',
        en: 'Organized support with a panel, categories and conversation records.'
      }
    },
    {
      id: 'discord-minecraft',
      icon: 'link',
      command: { pt: '/status', en: '/status' },
      projectType: 'integration',
      title: { pt: 'Integração com Minecraft', en: 'Minecraft integration' },
      description: {
        pt: 'Status do servidor, vinculação de contas, avisos e canais conectados ao seu servidor de Minecraft.',
        en: 'Server status, account linking, announcements and channels connected to your Minecraft server.'
      }
    },
    {
      id: 'discord-commands',
      icon: 'terminal',
      command: { pt: '/comandos', en: '/commands' },
      projectType: 'discord-bot',
      title: { pt: 'Comandos personalizados', en: 'Custom commands' },
      description: {
        pt: 'Slash commands, menus e botões feitos para as regras da sua comunidade.',
        en: 'Slash commands, menus and buttons built around your community’s rules.'
      }
    },
    {
      id: 'discord-welcome',
      icon: 'users',
      command: { pt: '/boas-vindas', en: '/welcome' },
      projectType: 'discord-bot',
      title: { pt: 'Boas-vindas e cargos', en: 'Welcome and roles' },
      description: {
        pt: 'Cargos automáticos, mensagens de boas-vindas e verificação de novos membros.',
        en: 'Automatic roles, welcome messages and new member verification.'
      }
    },
    {
      id: 'discord-automation',
      icon: 'spark',
      command: { pt: '/automacao', en: '/automation' },
      projectType: 'integration',
      title: { pt: 'Automação e integrações', en: 'Automation and integrations' },
      description: {
        pt: 'Conexões entre o bot, sites, APIs e as ferramentas que a sua equipe já usa.',
        en: 'Connections between the bot, websites, APIs and the tools your team already uses.'
      }
    }
  ],

  technologies: ['Java', 'Paper', 'Spigot', 'Velocity', 'Maven', 'Discord.js', 'JavaScript', 'PlaceholderAPI', 'ItemsAdder'],
  discordTechnologies: ['Discord.js', 'JavaScript'],

  process: [
    {
      title: { pt: 'Entender o pedido', en: 'Understand the brief' },
      description: {
        pt: 'Combinamos o que os jogadores devem viver e o que o seu servidor precisa disso.',
        en: 'We agree on what players should experience and what your server needs from it.'
      }
    },
    {
      title: { pt: 'Construir', en: 'Build it' },
      description: {
        pt: 'Eu faço de forma configurável e fácil de ler, focado no seu caso de uso real.',
        en: 'I build it to be configurable and easy to read, focused on your actual use case.'
      }
    },
    {
      title: { pt: 'Testar e entregar', en: 'Test and hand over' },
      description: {
        pt: 'Testamos o que importa, corrigimos o que aparecer e você recebe algo que a sua equipe consegue manter.',
        en: 'We test what matters, fix what comes up, and you get something your team can run.'
      }
    }
  ],

  projectTypes: [
    { id: 'configuration', label: { pt: 'Configuração de plugins', en: 'Plugin configuration' } },
    { id: 'custom-plugin', label: { pt: 'Plugin personalizado', en: 'Custom plugin' } },
    { id: 'server-system', label: { pt: 'Sistema para servidor', en: 'Server system' } },
    { id: 'discord-bot', label: { pt: 'Bot de Discord', en: 'Discord bot' } },
    { id: 'proxy', label: { pt: 'Velocity / proxy', en: 'Velocity / proxy' } },
    { id: 'bug-fixing', label: { pt: 'Correção de bugs', en: 'Bug fixing' } },
    { id: 'integration', label: { pt: 'Integração', en: 'Integration' } },
    { id: 'other', label: { pt: 'Outro', en: 'Other' } }
  ],

  budgets: {
    pt: ['Até R$ 50', 'R$ 50 – R$ 150', 'R$ 150 – R$ 500', 'Acima de R$ 500', 'Ainda não sei'],
    en: ['Under $10', '$10 – $30', '$30 – $100', '$100+', 'Not sure yet']
  }
};
