import { redirect } from '@sveltejs/kit';
import { games } from '$lib/games.js';
 
export function load({ params }) {
  const game = games.find(game => game.slug === params.slug);

  if (!game) redirect(302, '/');
}
