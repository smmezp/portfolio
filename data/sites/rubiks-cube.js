/*
 * Rubik's Cube — site.
 * Cada site tem o seu próprio arquivo (data/sites/<nome>.js). Para adicionar outro site:
 *   1. copie este arquivo e troque os textos/links;
 *   2. coloque a imagem em assets/projects/<nome>/hero.png (1200×630 fica ótimo);
 *   3. adicione <script src="data/sites/<nome>.js" defer></script> no index.html.
 * A ordem dos <script> no index.html é a ordem dos cards na página /sites.
 */
(window.MEDEIROS_WEBSITES = window.MEDEIROS_WEBSITES || []).push({
  id: 'rubiks-cube',
  slug: 'rubiks-cube',
  name: "Rubik's Cube",
  status: 'released',
  date: '2026',

  url: 'https://smmezp.github.io/rubiks-cube/',
  repo: 'https://github.com/smmezp/rubiks-cube',

  technologies: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],

  shortDescription: {
    pt: 'Guia para aprender a resolver o cubo mágico: método de camadas para iniciantes e o CFOP completo, com cubo 3D animado e timer de speedcubing.',
    en: 'A guide to solving the Rubik’s Cube: the beginner layer method and full CFOP, with an animated 3D cube and a speedcubing timer.'
  },

  highlights: {
    pt: ['119 algoritmos (F2L, OLL, PLL)', 'Cubo 3D animado', 'Timer com sessões e recordes', 'Inglês e português'],
    en: ['119 algorithms (F2L, OLL, PLL)', 'Animated 3D cube', 'Timer with sessions and PBs', 'English and Portuguese']
  },

  images: {
    hero: 'assets/projects/rubiks-cube/hero.png'
  }
});
