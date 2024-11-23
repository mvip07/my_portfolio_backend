const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        "type":"service_account",
        "project_id": "myportfolio-90f7c",
        "universe_domain": "googleapis.com",
        "client_id": "105801826933555677578",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_uri":  "https://accounts.google.com/o/oauth2/auth",
        "private_key_id": "86e3632fdd330bbb648b53a178568678b1279b83",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_email": "firebase-adminsdk-fpz3h@myportfolio-90f7c.iam.gserviceaccount.com",
        "client_x509_cert_url":  "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fpz3h%40myportfolio-90f7c.iam.gserviceaccount.com",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDhbXSVrdoyl1/V\nBWuvP34NJ4l2KZq8ysSlbKtLNxiyEhxnmpZLNKavMVG3wC1yKP8MeSVRQkjXd4M5\n3g8FTuFZtfVHgnR4r+aYvrws+50MZMl1Cq4uc+hdrs1RFTKjRcMlTFnHaL9t1eru\n1zWVIZPZcJ3DxbWOPdDR7ptnCp+KEE8x46WesGL7kiwMR8jCWlshYx98Foaab69U\nL2a1G9Fw5q+vweyFenxRhKS2AtBay9JDGKBtGFDP6ylwLZoVLqlXX9+A+Nw4CQyE\neKY73H+gZaYE1Y1B/YlrwWnDO/cLqB10dvBMEhd4IGF3lIJUmJ11Sn4rKyqz7sOe\nP0zJXoW9AgMBAAECggEAHbzoO9Sm67SfbkUcSw6XrNmR3zYm1Q/0uBPpVu9KQTd1\nas9wUzR7ZrIdYx2lgSFaYAVdQGZ7oH0CITCjj6IzxTdlR400mzUtOOo0fcSll5x2\nHQwPJU6iETW9nRwsRXCvCS0UzOMLGcy2BNL8HRPEYtNh5JEg3cZW1VLiSkoS+M3l\nfYeaZHLm04RWB0MmJ31y8WvN/VEG2BmQ6FVtKdG8ngdlEbTqe9B39aY13Gd/mQTD\nSD71UKyneDCKdsZQfWJfupcJ5+90xbdOWuX50T+f/nnAy3s1tAEaUwZ4mlsklUWx\noAoKTkG88zZQmg77gPpybq9wQl7CJQeQHlQP04NziwKBgQD/IUOFg3TAZdy5R1QG\nDWOh5bWY+hgZQswcSJhAd96uf+U+8vFZmn1X9AxuahtIAB9yfA1tl5sy29TbmUkO\n0FyiAxjMk9kL0PkKhi6CuF43MxStI3M1mDBBfTZox9oKBcU4dkoIjvLmK2O6BCjC\nh1tWw+itCL44EkBekLwceHV60wKBgQDiMkK0qYEI3ONnJOpckz+ziXF2bPCrDCYg\ny4hMtg3C2Ll0I8ljPN0y3vPWOI7VXw9TDzaApasRlK5Oc7A6jws7uf9fHZYeJ8gv\nSrC/nXLnuuOkJGhznAnib+OQ3akr1Hj3CKNO+5WhK7aLhE+0unt9tLABfpp5Uo4Z\njGs+bGGDLwKBgCqRq0mAuJ9Nn7mObDeiTkh6IoXG3PSCD7p8ZmMDXTVyg5awRJL1\n0wo030ohDDJESvr4NeleTXf79BU8C1OccohZye6AkMuG77bQ0rve9WFydXW6H4QG\nw655rPVouznG4rRcEFhDOcYr4TTtcruaiCP/Bjiw58RFT1Y4AhsiAkAfAoGBAJVg\nu8yzZBOGTGcBagRY+eiHC/c5WnabP1LJFuoSEGRs24xnVcfDmhDOTBlcoHcon+Yq\nVcP/pEmn9rS4kdkaPkDjRFJ8J3ciroEMwkzInemK8mqj4Jb4pU50tcQlnmLjnj8F\n5VNzsg0N4S+h4UFpJcSOXu2dvkYAzvbwVKKU0JDhAoGBAO6t8Hq/r5sU1/89vUT5\ngAn8FYjjDN0M0ly7W6/X4/NHnSI/RkkpR0g4UoAFKn9GC79s2wt2IZDKN14OPHoi\nLh0iLBnoU9kD+zgkqejYiJYwG5YwPPEtagtY/JrqwQ37/Sj0VL1VyrxP1K3bQPnZ\n2a7TXE2B2p6gXmWvvFdD4pr3\n-----END PRIVATE KEY-----\n",
    }),
    storageBucket: 'myportfolio-90f7c.appspot.com'
});

const bucket = admin.storage().bucket();

const uploadToFirebase = async (fileBuffer, destFileName, mimetype) => {
    try {
        const file = bucket.file(destFileName);

        await file.save(fileBuffer, {
            metadata: { contentType: mimetype },
            resumable: false,
        });

        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '2100-01-01T00:00:00Z',
        });

        return signedUrl; 
    } catch (error) {
        console.error("Firebase'ga yuklashda xatolik:", error);
        throw error;
    }
};

module.exports = uploadToFirebase;