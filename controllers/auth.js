const userModel = require('./models/user')
const bcrypt = require('bcrypt')

const register = async(req,res) => {
    const {username, email, password} = req.body
    let user = await userModel.findOne({email})

    if(user){
        return res.redirect('/register')
    }

    const hashpass = await bcrypt.hash(password, 10)

    user = new userModel({
        username: username,
        email: email,
        password: hashpass
    })
    await user.save()
}  