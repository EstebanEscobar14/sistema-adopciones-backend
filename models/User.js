import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para comparar contrasenas
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
