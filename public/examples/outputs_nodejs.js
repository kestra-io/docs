const requestify = require('requestify');
const Kestra = require('@kestra-io/libs');

function GetDockerImageDownloads(imageName){
  // Queries the Docker Hub API to get the number of downloads for a specific Docker image.
  var url = `https://hub.docker.com/v2/repositories/${imageName}/`
  console.log(url) 
  requestify.get(url)
    .then(function(response) {
      result = JSON.parse(response.body);
      console.log(result['pull_count']);
      Kestra.outputs({"pull_count": result['pull_count']})
      return result['pull_count'];
    })
    .catch(function(error) {
      console.log(error);
    })
}

GetDockerImageDownloads("kestra/kestra")