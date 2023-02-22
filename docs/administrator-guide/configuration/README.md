---
order: 3
---
# Configuration

Kestra offers a lot of configuration options and customization.

How to pass those configuration options depends on how you deploy Kestra. Check the [deployment](/docs/administrator-guide/deployment/README.md) section related to you deployment mode for more information.

## Kestra internal components configuration 

Kestra has three internal components that must be configured:
- The Internal Storage.
- The Queue.
- The Repository.

### Internal storage configuration

Kestra supports multiple internal storage types, the default being the local storage that will store data inside a local folder on the host filesystem. **Only suitable for local testing** as it doesn't provide resiliency or redundancy.

To choose another storage type, you will need to configure the `kestra.storage.type` option, be sure to download the corresponding plugins first. The following example configures [Google Cloud Storage](./storage/README.md#gcs) for internal storage.
```yaml
kestra:
  storage:
    type: gcs
```

Details about storage configuration can be found [here](./storage).

### Queue configuration 

Kestra supports multiple queue types, the default depends on your [installation](../deployment/) mode.

The queue type must be compatible with the repository type. Not all combinations are possible.

The following queue types are available:
- In-memory that must be used with the in-memory repository. It is **only suitable for local testing** as it doesn't provide any resiliency or scalability and didn't implement all functionalities.
- Database that must be used with the database repository. It currently supports H2, MySQL, and PostgreSQL as a database.
- Kafka that must be used with the Elasticsearch repository. Those are **only available inside the Enterprise Edition**.

To enable the PostgreSQL database queue, you need to add the following to your configuration files:
```yaml
kestra:
  queue:
    type: postgres
```

Details about the database configuration can be found [here](./databases/) and about the Kafka configuration [here](./kafka).

### Repository configuration

Kestra supports multiple repository types, the default depends on your [installation](../deployment/) mode.

The repository type must be compatible with the queue type. Not all combinations are possible.

The following repository types are available:
- In-memory that must be used with the in-memory queue.  It is **only suitable for local testing** as it doesn't provide any resiliency or scalability and didn't implement all functionalities.
- Database that must be used with the database queue. It currently supports H2, MySQL or PostgreSQL as a database.
- Elasticsearch that must be used with the Kafka queue. Those are **only available inside the Enterprise Edition**.

To enable the PostgreSQL database repository, you need to add the following to your configuration files:
```yaml
kestra:
  repository:
    type: postgres
```

Details about the database configuration can be found [here](./databases/) and about the Elasticsearch configuration [here](./elasticsearch).


## Other Kestra configuration

Other Kestra configuration options can be found [here](./others).

## Micronaut configuration

As Kestra is a Java-based application built with Micronaut, you can configure any Micronaut configuration options. More details [here](./micronaut).
