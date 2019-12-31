'use strict';

const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.REGION || 'eu-central-1'
    });
}

const SecretsManager = AWS.SecretsManager;

module.exports = async (endpoint, secretId) => {
    const secretsManager = new SecretsManager({ endpoint });

    try {
        const result = await secretsManager.getSecretValue({ SecretId: secretId }).promise();

        if (result && result.SecretString) {
            return JSON.parse(result.SecretString);
        }
    } catch (error) {
        console.error({ message: 'Error during trying get secrets', endpoint, secretId });
        console.error({ message: error.message, code: error.code });
    }
};
