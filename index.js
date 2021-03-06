'use strict';

const knex = require('knex');
const smConnector = require('./smConnector');

function setup(dbName, userName, password, host) {
    if (!dbName || !userName || !password) {
        throw new Error('Configuration for DB is missing');
    }

    return knex({
        client: 'pg',
        directory: '/migrations',
        connection: {
            host: host || 'localhost',
            database: dbName,
            port: process.env.DB_PORT || '5432',
            user: userName,
            password
        }
    });
}

async function run() {
    let settings = {};

    if (shouldUseAWSSecretsManager()) {
        settings = await smConnector(process.env.SECRETS_MANAGER_ENDPOINT, process.env.SECRETS_MANAGER_SECRET_ID);
    }

    const runner = await setup(
        settings.DB_NAME || process.env.DB_NAME,
        settings.DB_USER || process.env.DB_USER,
        settings.DB_PASS || process.env.DB_PASS,
        settings.DB_HOST || process.env.DB_HOST
    );

    switch (process.argv[2]) {
        case 'migrate':
            console.log('Starting migration process...');
            return runner.migrate.latest();
        case 'rollback':
            console.log('Starting rollback process...');
            return runner.migrate.rollback();
        case 'seed':
            console.log('Seeding db...');
            return runner.seed.run();
        default:
            throw new Error('Unknown action for migrations');
    }
}

function shouldUseAWSSecretsManager() {
    return process.env.USE_SECRETS_MANAGER === 'true'
}

run()
    .then(res => console.log('Finished with success', res))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .then(process.exit);
