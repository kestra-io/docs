from kestra import Kestra
import requests
import time

start = time.perf_counter()

def get_docker_image_downloads(image_name: str = "kestra/kestra"):
    """Queries the Docker Hub API to get the number of downloads for a specific Docker image."""
    url = f"https://hub.docker.com/v2/repositories/{image_name}/"
    response = requests.get(url)
    data = response.json()

    downloads = data.get('pull_count', 'Not available')
    return downloads

downloads = get_docker_image_downloads()
end = time.perf_counter()
outputs = {
    'downloads': downloads
}

Kestra.outputs(outputs)
Kestra.timer('duration', end - start)