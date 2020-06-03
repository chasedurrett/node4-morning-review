module.exports = {
    register: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        let user = await db.check_user(username)

        if(user[0]){
            return res.status(400).send(`user already exists`)
        }
        let salt = bcrypt.getSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        let newUSer = await db.register_user(username, hash)
        req.session.user = newUser[0]
        delete req.session.user.password
        res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        let user = await db.check_user(username)

        if(!user[0]){
            return res.status(400).send('you dont exist')
        }

        let authenticated = bcrypt.compareSync(password, user[0].password)

        if(!authenticated){
            return res.status(401).send("Password Incocrrect")
        }

        delete user[0].password
        req.session.user = user[0]
        res.status(200).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },
    getUser: (req, res) => {
        if(req.session.user){
            res.status(200).send(req.session.user)
        } else {
            res.status(204).send(`no one logged in`)
        }
    }
}