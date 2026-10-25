/*
 * MODELO — como adicionar um bot de Discord ao portfólio.
 *
 * 1. Copie este arquivo e renomeie para data-discord-meu-bot.js (na raiz, junto dos outros).
 * 2. Preencha os campos abaixo. Textos têm versão em português (pt) e inglês (en).
 * 3. No index.html, adicione uma linha logo abaixo dos outros produtos:
 *      <script src="data-discord-meu-bot.js?v=3" defer></script>
 * 4. O bot aparece sozinho no canal #projetos da página /discord, e ganha
 *    uma página própria em /discord/meu-bot.
 *
 * Este arquivo NÃO é carregado pelo site (o nome começa com "_").
 */
(window.MEDEIROS_PRODUCTS = window.MEDEIROS_PRODUCTS || []).push({
  id: 'mochi',
  slug: 'mochi',
  brand: 'discord',
  name: 'Mochi',
  category: 'discord-bots',
  categoryLabel: { pt: 'Bot de Discord', en: 'Discord Bot' },
  status: 'development', // 'released' ou 'development'
  price: { pt: 'Incomprável', en: 'Unbuyable' },
  date: '2026',
  technologies: ['Discord.js', 'JavaScript'],
  shortDescription: { pt: 'Um bot completo para o meu portfólio.', en: 'A complete bot for my portfolio.' },
  fullDescription: { pt: 'Um bot com mudança de linguagem por cargo, logs, tickets, e muito mais para a melhor experiência do cliente na hora de comprar.', en: 'A bot with role-based language switching, logs, tickets, and much more to provide the best customer experience when making a purchase.' },
  features: { pt: ['Ticket', 'Registro', 'Mudança de Linguagem'], en: ['Ticket', 'Logs', 'Language change'] },
  details: [],
  images: { hero: 'assets/projects/mochi/hero.png' , gallery: [] },
  videos: [],
  links: { download: '', invite: '' },
  github: ''
});
