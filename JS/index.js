const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();

exports.createStudentUser = functions.https.onCall(
    async (data, context) => {


        if (!context.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "Only logged in admin can create student."
            );
        }

        const email = data.email;
        const password = data.password;


        if (!email || !password) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "Email and password are required."
            );
        }

        try {

            const userRecord = await admin.auth().createUser({
                email: email,
                password: password
            });

            return {
                success: true,
                uid: userRecord.uid
            };

        } catch (error) {
            throw new functions.https.HttpsError(
                "internal",
                error.message
            );
        }
    }
);