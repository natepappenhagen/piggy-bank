const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema({
    username: {type: String,
                minlength: 5},
    password: String,
    displayName: String,
    googleId: String,
})

UserSchema.method.validPassword = async function(password){
	console.log("Testing this password" + password)
	const valid = await bcrypt.compare(password, this.password)
	return valid;
}

UserSchema.pre('save', async function(next){

	if(!this.password){
		next();
		return;
	}
    const existingUser = await User.findOne({username: this.username})
    if(!existingUser){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

UserSchema.plugin(findOrCreate);
const User = mongoose.model('User', UserSchema);

module.exports = User
