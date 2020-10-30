# KNEX migrations
Docker image with simple runner for migrations based on [knex](http://knexjs.org/#Migrations). It is useful for local
development or as a part of CI.

*tested with PostgreSQL*

## Example of usage
Example of usage migrations in docker-compose.yml

```yaml
services:
  db:
    image: postgres:10
    volumes:
      - db:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    environment:
      - 'POSTGRES_HOST=localhost'
      - 'POSTGRES_DB=db_name'
      - 'POSTGRES_USER=db_user'
      - 'POSTGRES_PASSWORD=db_pass'
    networks:
      - application

  migrations:
    depends_on:
      - db
    image: mejt/knex-migrations:release-1.2.0
    environment:
      - "DB_HOST=db"
      - "DB_NAME=db_name"
      - "DB_USER=db_user"
      - "DB_PASS=db_pass"
    volumes:
      - "./migrations:/app/migrations"
    networks:
      - application
    entrypoint: ["sh", "-c", "/usr/local/bin/npm run migrate"]
```

In 26 line you need to pass place where you files for migrations are. 