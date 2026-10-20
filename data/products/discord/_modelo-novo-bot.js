/*
 * MODELO — como adicionar um bot de Discord ao portfólio.
 *
 * 1. Copie este arquivo e renomeie (ex.: meu-bot.js) dentro desta pasta.
 * 2. Preencha os campos abaixo. Textos têm versão em português (pt) e inglês (en).
 * 3. No index.html, adicione uma linha logo abaixo dos outros produtos:
 *      <script src="data/products/discord/meu-bot.js" defer></script>
 * 4. O bot aparece sozinho no canal #projetos da página /discord, e ganha
 *    uma página própria em /discord/meu-bot.
 *
 * Este arquivo NÃO é carregado pelo site (o nome começa com "_").
 */
(window.MEDEIROS_PRODUCTS = window.MEDEIROS_PRODUCTS || []).push({
  id: 'meu-bot',
  slug: 'meu-bot',
  brand: 'discord',
  name: 'Nome do Bot',
  category: 'discord-bots',
  categoryLabel: { pt: 'Bot de Discord', en: 'Discord Bot' },
  status: 'development', // 'released' ou 'development'
  price: { pt: 'Sob consulta', en: 'On request' },
  date: '2026',
  technologies: ['Discord.js', 'JavaScript'],
  shortDescription: { pt: 'Uma frase sobre o bot.', en: 'One sentence about the bot.' },
  fullDescription: { pt: 'Descrição completa do bot.', en: 'Full description of the bot.' },
  features: { pt: ['Recurso 1', 'Recurso 2'], en: ['Feature 1', 'Feature 2'] },
  details: [],
  images: { hero: '', gallery: [] },
  videos: [],
  links: { download: '', invite: '' },
  github: ''
});
