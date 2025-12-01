function modifyCommitLink(body: string, repo = 'kestra-io/kestra') {
    const marker = 'Kestra Enterprise Edition Changes';
    const splitIndex = body.indexOf(marker);

    if (splitIndex === -1) {
        return body.replace(/^-\s([a-f0-9]{7})/gm, (match, commitId) => {
            const url = `https://github.com/${repo}/commit/${commitId}`;
            return `- [\`${commitId}\`](${url})`;
        });
    }
    const before = body.slice(0, splitIndex);
    const after = body.slice(splitIndex);

    const transformedBefore = before.replace(/^-\s([a-f0-9]{7})/gm, (match, commitId) => {
        const url = `https://github.com/${repo}/commit/${commitId}`;
        return `- [\`${commitId}\`](${url})`;
    });
    const transformedAfter = after.replace(/^-\s([a-f0-9]{7})/gm, '- ');

    return transformedBefore + transformedAfter;
}

export function fetchLastReleaseTag() {
    return fetch('https://api.github.com/repos/kestra-io/kestra/releases/latest')
        .then(res => {
            if (!res.ok) return null;
            return res.json();
        })
        .then(data => data ? data.tag_name : null);
}

export async function fetchLast3ReleaseGroups() {
    const res = await fetch('https://api.github.com/repos/kestra-io/kestra/releases?per_page=150');
    if (!res.ok) return [];

    let data = await res.json();
    data = data.filter((r: any) => !r.draft && !r.prerelease);

    const groups: Record<string, any[]> = {};
    for (const release of data) {
        const match = release.tag_name.match(/(\d+\.\d+)/);
        if (match) {
            const key: string = match[1];
            if (!groups[key]) groups[key] = [];
            release.body = modifyCommitLink(release.body);
            groups[key].push(release);
        }
    }

    const sortedKeys = Object.keys(groups)
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    return sortedKeys.slice(0, 4).map(key => ({
        version: key,
        releases: groups[key]
    }));
}