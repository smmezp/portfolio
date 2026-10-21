/*
 * Heaven Lobby — produto de Minecraft (em desenvolvimento).
 * Arquivo próprio do produto. Quando tiver imagens, envie a capa como
 * img-heavenlobby-hero.jpg (raiz) e as outras em assets/projects/heavenlobby/.
 */
(window.MEDEIROS_PRODUCTS = window.MEDEIROS_PRODUCTS || []).push({
  id: 'heavenlobby',
  slug: 'heavenlobby',
  brand: 'minecraft',
  name: 'Heaven Lobby',
  category: 'minecraft-plugins',
  categoryLabel: { pt: 'Plugin de Minecraft', en: 'Minecraft Plugin' },
  status: 'development',
  price: { pt: 'Em breve', en: 'TBA' },
  date: '2026',
  technologies: ['Java', 'Paper', 'Spigot', 'Velocity'],
  shortDescription: {
    pt: 'Experiência de lobby e gerenciamento configurável para redes de Minecraft.',
    en: 'A configurable lobby and server management experience for Minecraft networks.'
  },
  fullDescription: {
    pt: 'O HeavenLobby é um plugin de lobby e seletor de servidores altamente configurável, feito para redes de Minecraft, reunindo navegação entre servidores, menus personalizáveis, recursos para jogadores e gerenciamento da rede em uma única experiência.',
    en: 'HeavenLobby is a highly configurable lobby management and server selector plugin designed for Minecraft networks, combining server navigation, customizable menus, player features and network management into a unified experience.'
  },
  features: {
    pt: ['Seletor de servidores', 'Interface (GUI) configurável', 'Gerenciamento de lobby', 'Personalização de itens', 'Suporte a PlaceholderAPI', 'Sistema de manutenção', 'Compatível com várias versões', 'Menus configuráveis', 'Recursos para jogadores', 'Integração com proxy'],
    en: ['Server selector', 'Configurable GUI', 'Lobby management', 'Item customization', 'PlaceholderAPI support', 'Maintenance system', 'Multi-version compatibility', 'Configurable menus', 'Player features', 'Proxy integration']
  },
  details: [
    {
      title: { pt: 'Foco do projeto', en: 'Build focus' },
      body: {
        pt: 'Uma base de lobby flexível, focada em navegação entre servidores, menus configuráveis e uma experiência polida em redes conectadas.',
        en: 'A flexible lobby foundation focused on server navigation, configurable menus and a polished player experience across connected networks.'
      }
    },
    {
      title: { pt: 'Direção técnica', en: 'Technical direction' },
      body: {
        pt: 'Feito em torno do ecossistema Paper, Spigot e Velocity para ambientes de lobby modernos, servidores de backend e redes baseadas em proxy.',
        en: 'Built around the Paper, Spigot and Velocity ecosystem to support modern lobby environments, backend servers and proxy-based network setups.'
      }
    }
  ],
  images: {
    hero: 'img-heavenlobby-hero.jpg',
    gallery: []
  },
  videos: [],
  links: { download: '' },
  github: ''
});
