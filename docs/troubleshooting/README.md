---
order: 9
---

# Troubleshooting

## Memory error

The default amount of memory available for Docker on macOS is often not enough to get Kestra up and running with all the dependencies. If enough memory is not allocated, it might lead to the Kestra instance continuously restarting. You should allocate at least 4 GB memory for the Docker Engine (ideally 8 GB). You can check and change the amount of memory in [Resources](https://docs.docker.com/docker-for-mac/#resources).

You can also check if you have enough memory by running this command:

```bash
docker run --rm "debian:buster-slim" bash -c 'numfmt --to iec $(echo $(($(getconf _PHYS_PAGES) * $(getconf PAGE_SIZE))))'
```
