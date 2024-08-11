import notionHq from "@notionhq/client";
const { Client } = notionHq;

const databaseId = "1d0918e8044144388c7918193f010f50";
const notion = new Client({ auth: "secret_onl5vkJTICCc1aGmLgGPhdCBwU05gO86fa0IpKIaZbk" });

export async function GET({ params }) {
  const gameSlug = params.slug;

  if (!gameSlug) {
    return new Response("Please provide a slug for the game name!", { status: 400 });
  }

  try {
    // should get a max of 10 results
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "game",
        rich_text: {
          equals: gameSlug,
        },
      },
      sorts: [
        {
          property: "score",
          direction: "descending",
        },
      ],
      page_size: 10,
    });

    const result = JSON.stringify(response.results.map(result => {
      return {
        name: result.properties.name.rich_text[0].text.content,
        score: result.properties.score.number,
      };
    }));

    return new Response(result, { status: 200 });
  } catch(error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}
