const User = require('../models/user')
const bcrypt = require('bcrypt')

const login = async(req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})
    if(!user){
        return res.redirect('/login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.redirect('/login')
    }
    req.session.isAuth = true
    res.redirect('/dashboard')
}


const register = async(req,res) => {
    const {username, email, password} = req.body
    const user = await User.findOne({email})

    if(user){
        return res.redirect('/register')
    }

    const hashpass = await bcrypt.hash(password, 10)

    const userm = new User({
        username: username,
        email: email,
        password: hashpass
    })
    await userm.save()
    res.redirect('/login')
}  

const logout = (req,res) => {
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/login')
    })
}

module.exports = {login, register, logout}