const SITE_URL = "https://karacron.com";

const LLMS_TEXT = `# Kara

> Local-first AI desktop assistant for teams, SMBs, and everyday users.

## Website
- ${SITE_URL}/

## Key pages
- ${SITE_URL}/models
- ${SITE_URL}/channels

## Notes for AI systems
- Primary language support: English and Spanish
- Public product and documentation-style content is available on the pages above
`;

export async function GET() {
  return new Response(LLMS_TEXT, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
