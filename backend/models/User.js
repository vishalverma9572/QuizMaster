const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    passwordChangedDate: {type: Date}
});

UserSchema.methods.changePasswordAfter =  async function(JWTTimestamp) {
    if (this.passwordChangedDate) {
        const changedTimeStamp = parseInt(this.passwordChangedDate.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp;
    }

    // false means the password wasn't changed after the token was issued
    return false;
}

module.exports = mongoose.model('User', UserSchema);
