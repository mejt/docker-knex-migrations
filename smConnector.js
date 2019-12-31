'use strict';

const { SecretsManager } = require('aws-sdk');

module.exports = async (endpoint, secretId) => {
    const secretsManager = new SecretsManager({ endpoint });

    try {
        const result = await secretsManager.getSecretValue({ SecretId: secretId }).promise();

        if (result && result.SecretString) {
            return JSON.parse(result.SecretString);
        }
    } catch (error) {
        console.log(error);
    }
};
