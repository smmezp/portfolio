/*
 * Heaven Join — produto de Minecraft.
 * Cada produto tem o seu próprio arquivo (data/minecraft/<nome>.js). Para editar textos, imagens ou links
 * deste plugin, mexa só aqui. As imagens (hero.jpg, 1.png, 2.png, 3.png) ficam em assets/projects/heavenjoin/.
 */
(window.MEDEIROS_PRODUCTS = window.MEDEIROS_PRODUCTS || []).push({
  id: 'heavenjoin',
  slug: 'heavenjoin',
  brand: 'minecraft',
  name: 'Heaven Join',
  category: 'minecraft-plugins',
  categoryLabel: { pt: 'Plugin de Minecraft', en: 'Minecraft Plugin' },
  status: 'released',
  price: { pt: 'Grátis', en: 'Free' },
  date: '2026',
  technologies: ['Java', 'Paper', 'Spigot'],
  shortDescription: {
    pt: 'Plugin leve e configurável de mensagens de entrada e saída para servidores de Minecraft.',
    en: 'A lightweight and configurable join and quit message plugin for Minecraft servers.'
  },
  fullDescription: {
    pt: 'O HeavenJoin é um plugin de mensagens de entrada e saída altamente configurável, feito para dar uma experiência mais personalizada aos jogadores, mantendo o gerenciamento das mensagens simples, leve e fácil de ajustar.',
    en: 'HeavenJoin is a highly configurable join and quit message plugin designed to give servers a more personalized player experience while keeping message management simple, lightweight, and easy to customize.'
  },
  features: {
    pt: ['Mensagens de entrada e saída', 'Mensagens totalmente configuráveis', 'Suporte a cores HEX', 'Suporte a PlaceholderAPI', 'Placeholders personalizados de jogador', 'Avisos de entrada da staff', 'Recursos por permissão', 'Compatível com várias versões'],
    en: ['Join and quit messages', 'Fully configurable messages', 'HEX color support', 'PlaceholderAPI support', 'Custom player placeholders', 'Staff join alerts', 'Permission-based features', 'Multi-version compatibility']
  },
  details: [
    {
      title: { pt: 'Foco do projeto', en: 'Build focus' },
      body: {
        pt: 'Um sistema leve de mensagens de entrada e saída, focado em configuração limpa, personalização e uma experiência fluida para o jogador.',
        en: 'A lightweight join and quit message system focused on clean configuration, customization and a smooth player experience.'
      }
    },
    {
      title: { pt: 'Direção técnica', en: 'Technical direction' },
      body: {
        pt: 'Feito para o ecossistema Bukkit, Spigot e Paper, com ampla compatibilidade de versões do Minecraft e suporte opcional ao PlaceholderAPI.',
        en: 'Designed for the Bukkit, Spigot and Paper ecosystem with broad Minecraft version compatibility and optional PlaceholderAPI support.'
      }
    }
  ],
  images: {
    hero: 'assets/projects/heavenjoin/hero.png',
    gallery: ['assets/projects/heavenjoin/1.png', 'assets/projects/heavenjoin/2.png', 'assets/projects/heavenjoin/3.png']
  },
  videos: ['assets/projects/heavenjoin/video.mp4'],
  links: { download: 'https://www.spigotmc.org/resources/heavenjoin.138793/' },
  github: ''
});
