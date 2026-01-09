const cacheObject: Record<string, any> = {};

export async function $fetch<T = any>(url: string, init: RequestInit = {}): Promise<T> {
    let response: Response;
    if (cacheObject[url]) {
        return cacheObject[url];
    }
    try{
        response = await fetch(url, init);
    }catch(error){
        console.error(`Fetch error on url ${url}: ${error}`);
        throw error;
    }

    if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText} on url ${url}`);
    }

    const data = await response.json();

    cacheObject[url] = data;
    return data;
}