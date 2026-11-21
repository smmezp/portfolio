/*
 * Yumi — site e painel do bot de Discord.
 * Quando o site estiver no ar, preencha `url` (e `repo`, se o código for público)
 * e mude `status` para 'released'. Sem `url`, o card aparece sem o botão "Visitar".
 */
(window.MEDEIROS_WEBSITES = window.MEDEIROS_WEBSITES || []).push({
  id: 'yumi',
  slug: 'yumi',
  name: 'Yumi',
  status: 'released',
  date: '2026',

  url: 'https://yumibot.online/',
  repo: '',

  technologies: ['Next.js', 'TypeScript', 'Cloudflare Workers', 'D1'],

  shortDescription: {
    pt: 'Site e painel do bot Yumi: página inicial, lista de comandos com busca, status ao vivo e um painel com login do Discord para configurar cada servidor.',
    en: 'Site and dashboard for the Yumi bot: landing page, searchable command list, live status and a dashboard with Discord login to configure each server.'
  },

  highlights: {
    pt: ['Painel com login do Discord', 'Configurações com versões', 'Tema claro e escuro', 'Inglês e português'],
    en: ['Dashboard with Discord login', 'Versioned settings', 'Light and dark theme', 'English and Portuguese']
  },

  images: {
    hero: 'assets/projects/yumi/site.png'
  }
});
