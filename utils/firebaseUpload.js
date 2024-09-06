const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.type,
        "auth_uri": process.env.auth_uri,
        "client_id": process.env.client_id,
        "token_uri": process.env.token_uri,
        "project_id": process.env.project_id,
        "private_key": process.env.private_key,
        "client_email": process.env.client_email,
        "private_key_id": process.env.private_key_id,
        "universe_domain": process.env.universe_domain,
        "client_x509_cert_url": process.env.client_x509_cert_url,
        "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    }),
    storageBucket: 'myportfolio-90f7c.appspot.com'
});

const bucket = admin.storage().bucket();

const uploadToFirebase = (filePath, destFileName, mimetype) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            destination: destFileName,
            resumable: true,
            metadata: {
                contentType: mimetype, // Dynamically setting the file type
            },
        };

        bucket.upload(filePath, uploadOptions, (err, file) => {
            if (err) {
                reject(err);
            } else {
                file.getSignedUrl({
                    action: 'read', // Use 'read' for read-only access
                    expires: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000 // 100 years from now
                }).then(signedUrls => {
                    resolve(signedUrls[0]); // Return the signed URL
                }).catch(reject);
            }
        });
    });
};

module.exports = uploadToFirebase;