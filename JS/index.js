
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createStudentUser = functions.https.onCall(async (data, context) => {
    const email = data.email;
    const password = data.password;

    if (!email || !password) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Email and password required."
        );
    }

    try {
        const user = await admin.auth().createUser({
            email: email,
            password: password
        });

        return { success: true, uid: user.uid };
    } catch (error) {
        throw new functions.https.HttpsError(
            "internal",
            error.message
        );
    }
});