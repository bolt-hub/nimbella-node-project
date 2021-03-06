const nim = require('nim');

async function main(args) {
    if (!args.filename) {
        return {
            statusCode: 400,
            body: "Missing filename"
        };
    }
    try {
        const bucket = await nim.storage(true);
        const file = await bucket.file("images/" + args.filename);
        const expiration = 15 * 60 * 1000; // 15 minutes

        const putOptions = {
            version: 'v4',
            action: 'write',
            expires: Date.now() + expiration
        };

        const signedPutUrl = await file.getSignedUrl(putOptions);
        return {
            statusCode: 200,
            body: { signedPutUrl, bucketName: bucket.id }
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: e.message
        };
    }
}

exports.main = main;
