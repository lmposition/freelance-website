export interface Tool {
  slug: string;
  name: string;
  description: string;
  url: string;
  color: string;
}

export const tools: Tool[] = [
  {
    slug: 'notion',
    name: 'Notion',
    description: 'Gestion de projet tout-en-un pour entrepreneurs.',
    url: 'https://www.notion.so',
    color: '#f4d9b5',
  },
  {
    slug: 'slack',
    name: 'Slack',
    description: 'Communication d\'équipe efficace.',
    url: 'https://slack.com',
    color: '#b5d9f4',
  },
];
