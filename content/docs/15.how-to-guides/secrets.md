---
title: How to Use Secrets in Kestra
icon: /docs/icons/tutorial.svg
---

How you can use secrets in various Kestra use cases.

## What are Secrets

Secrets are sensitive information that you do not want to reveal to the world. This could be your passwords, access keys, tokens, or even personal information like SSN number. For a detailed overview of sercets, see the [Secrets](../05.concepts/04.secret.md) documentation page. Through this guide, we'll show you how to add secrets to your Kestra server by providing a `.env` file to the server.

If you're looking for a much easier experience for managing secrets directly in the Kestra UI, you should check out the [Enterprise Edition](/enterprise) where you can manage secrets by namespaces seamlessly without needing to touch the server configuration.

## Using Secrets in Kestra

While using secrets with any application, you put together all the secret values in an environment file. Lets have these variables in an environment file named `.env`. This is how the contents of the file would be:

```
POSTGRES_PASSWORD=actual_postgres_password
OPENAI_KEY=actual_openai_key
AWS_ACCESS_KEY=actual_aws_access_key
AWS_SECRET_KEY=actual_aws_secret_key
```

When using the secrets in Kestra, it expects the keys to be prefixed with `SECRET_` and values to be base64 encoded. So, we want to convert the `.env` file contents into something like:

```
SECRET_POSTGRES_PASSWORD=base64_encoded_postgres_password
SECRET_OPENAI_KEY=base64_encoded_openai_key
SECRET_AWS_ACCESS_KEY=base64_encoded_aws_access_key
SECRET_AWS_SECRET_KEY=base64_encoded_aws_secret_key
```

Lets say we save these contents into `.env_encoded` file.

This can be achieved by manually changing the keys to be prefixed with `SECERT_`, and getting the base64 encoded values by using `base64` command in shell as follows:

```sh
echo -n "actual_postgres_password" | base64
```

But there are some easy ways to do this. One way is to use the bash script for converting `.env` file into the desired format. The bash script will perform the following actions:

1. Encode all values using base64-encoding.
2. Add a SECRET_ prefix to all environment variable names.
3. Store the result into `.env_encoded` file.

```bash
while IFS='=' read -r key value; do
    echo "SECRET_$key=$(echo -n "$value" | base64)";
done < .env > .env_encoded
```

The newly generated `.env_encoded` file should look as follows:

```
SECRET_POSTGRES_PASSWORD=base64_encoded_postgres_password
SECRET_OPENAI_KEY=base64_encoded_openai_key
SECRET_AWS_ACCESS_KEY=base64_encoded_aws_access_key
SECRET_AWS_SECRET_KEY=base64_encoded_aws_secret_key
```

Yet another way to achieve this is by manually appending `SECRET_` to keys, but using macros for converting password into base64 encoded format. So, the `.env` file contents can be modified into the following and saved in `.env_encoded` file:

```
SECRET_POSTGRES_PASSWORD={{ "actual_postgres_password" | base64encode }}
SECRET_OPENAI_KEY={{ "actual_openai_key" | base64encode }}
SECRET_AWS_ACCESS_KEY={{ "actual_aws_access_key" | base64encode }}
SECRET_AWS_SECRET_KEY={{ "actual_aws_secret_key" | base64encode }}
```

Now, you can change the contents of the docker-compose.yaml file to point to the correct environment file that has the keys prefixed with `SECRET_`, and values in base64 encoded format. Lets say that file is named `.env_encoded`, then the docker-compose.yaml file will look like:

```yaml
  kestra:
    image: kestra/kestra:latest-full
    env_file:
      - .env_encoded
```

Let us use these secrets in a Kestra flow. In the following Kestra flow, we will first connect with PostgresDB using the `SECRET_POSTGRES_PASSWORD`, and query the data from the database. Then, we will dump the resulting output into AWS S3 using `SECRET_AWS_ACCESS_KEY` and `SECRET_AWS_SECRET_KEY`.

```yaml
id: postgres-to-s3
namespace: dev
tasks:
  - id: fetch
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: jdbc:postgresql://127.0.0.1:56982/
    username: pg_user
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: select id, first_name, last_name, city from users
    store: true
  - id: write-to-s3
    type: "io.kestra.plugin.aws.s3.Upload"
    accessKeyId: "{{ secret('AWS_ACCESS_KEY') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY') }}"
    region: "eu-central-1"
    from: "{{ outputs.fetch.uri }}"
    bucket: "kestra-bucket"
    key: "data/users.csv"
```

As can be seen from the example above, while using secrets in the Kestra flow, we do NOT prefix `SECRET_`. We directly use the key as follows: `{{ secret('POSTGRES_PASSWORD') }}`. This syntax will refer to the corresponding `SECRET_` prefixed variable from the environment file, will base64 decode the value of that variable, and will thus get the correct password for use.
