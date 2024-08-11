import { redirect } from '@sveltejs/kit';
import { games } from '$lib/games.js';
import { fail } from '@sveltejs/kit';
 
export function load({ params }) {
  const game = games.find(game => game.slug === params.slug);

  if (!game) redirect(302, '/');
}

export const actions = {
  submit: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const score = data.get('score');

    console.log("___________________________")
    console.log(name, score);

    if (!name) {
      return fail(400, { error: "What is your name?"});
    }

    if (name.length < 2) {
      return fail(400, { error: "Your name is too short!"});
    }

    if (name.length > 20) {
      return fail(400, { error: "Your name is too long!"});
    }
  }
};
