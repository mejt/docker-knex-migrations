'use strict';

const knex = require('knex');
const smConnector = require('./smConnector');

function setup({ dbName = process.env.DB_NAME, userName = process.env.DB_USER, password = process.env.DB_PASS }) {
    if (!dbName || !userName || !password) {
        throw new Error('Configuration for DB is missing');
    }

    return knex({
        client: 'pg',
        connection: {
            host: process.env.DB_HOST || 'localhost',
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

    const runner = await setup(settings);
    switch (process.argv[2]) {
        case 'migrate':
            console.log('Starting migration process...');
            return runner.migrate.latest();
        case 'rollback':
            console.log('Starting rollback process...');
            return runner.migrate.rollback();
        default:
            throw new Error('Unknown action for migrations');
    }
}

function shouldUseAWSSecretsManager() {
    return process.env.USE_SECRETS_MANAGER === 'true'
}

run()
    .then(res => console.log('Finished with success', res))
    .catch(console.error)
    .then(process.exit);
