const Kestra = require('@kestra-io/libs');
const requestify = require('requestify');
  
function GetDockerImageDownloads(imageName){
  // Queries the Docker Hub API to get the number of downloads for a specific Docker image.
  var url = `https://hub.docker.com/v2/repositories/${imageName}/`
  console.log(url) 
  requestify.get(url)
    .then(function(response) {
      result = JSON.parse(response.body);
      Kestra.outputs({"pull_count": result['pull_count']})
      return result['pull_count'];
    })
    .catch(function(error) {
      console.log(error);
    })
}

start = Date.now();
GetDockerImageDownloads("kestra/kestra")
end = Date.now();
Kestra.timer('duration', end - start);