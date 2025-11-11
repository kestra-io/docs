export async function GET({ params }: { params: { cls: string } }) {

    // FIXME: mock github stats until we have a proper backend to avoid rate limiting issues
    const value = {
        stargazers_count: 1253,
        watchers_count: 1973,
        open_issues_count: 19546,
        forks: 255,
        network_count: 566,
        subscribers_count: 125,
        size: 2048,
    }

    const contributors = 28

  return new Response(JSON.stringify({
            'stargazers': value.stargazers_count,
            'watchers': value.watchers_count,
            'issues': value.open_issues_count,
            'forks': value.forks,
            'network': value.network_count,
            'subscribers': value.subscribers_count,
            'size': value.size,
            contributors,
        }),{
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=86400',
    },
  });
}