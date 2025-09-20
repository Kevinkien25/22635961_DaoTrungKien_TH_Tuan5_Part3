const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
// Hash password trước khi lưu (nếu cần thêm logic ở đây)
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
// So sánh password (nếu cần thêm logic ở đây)
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", userSchema);