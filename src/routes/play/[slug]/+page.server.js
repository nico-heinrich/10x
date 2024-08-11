import { redirect } from '@sveltejs/kit';
import { games } from '$lib/games.js';
import { fail } from '@sveltejs/kit';
import notionHq from "@notionhq/client";
const { Client } = notionHq;

const databaseId = "1d0918e8044144388c7918193f010f50";
const notion = new Client({ auth: "secret_onl5vkJTICCc1aGmLgGPhdCBwU05gO86fa0IpKIaZbk" });
 
export function load({ params }) {
  const game = games.find(game => game.slug === params.slug);

  if (!game) redirect(302, '/');
}

export const actions = {
  submit: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const score = data.get('score');
    const game = data.get('game');

    if (!name) {
      return fail(400, { error: "What is your name?", name });
    }

    if (name.length < 2) {
      return fail(400, { error: "Your name is too short!", name});
    }

    if (name.length > 20) {
      return fail(400, { error: "Your name is too long!", name});
    }

    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        name: {
          rich_text: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        score: {
          number: parseInt(score),
        },
        game: {
          rich_text: [
            {
              text: {
                content: game,
              },
            },
          ],
        },
      },
    });

    return {
      success: true,
      name,
    };
  }
};
