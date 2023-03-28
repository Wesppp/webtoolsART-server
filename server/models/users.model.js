const { Schema, model } = require('mongoose')
require('dotenv').config({path: __dirname + '../.env'});
const { JWT_SECRET } = process.env
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    profileImage: {
        required: false,
        type: String,
    },
    residence: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    socialNetworks: [
        {
            name: String,
            url: String
        }
    ],
    articles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article',
            required: false
        }
    ],
    favoritesArticles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article',
            required: false
        }
    ]
}, {timestamps: true})

user.methods.addArticle = function(id) {
    this.articles.push(id)
    return this.save()
}

user.methods.removeArticle = function(id) {
    const idx = this.articles.findIndex(articleId => articleId.toString() === id.toString())

    if (this.articles[idx]) {
        this.articles = this.articles.filter(articleId => articleId.toString() !== id.toString())
    }

    return this.save()
}

user.methods.addArticleToFavorites = function(id) {
    this.favoritesArticles.push(id)
    return this.save()
}

user.methods.removeArticleFromFavorites = function(id) {
    const idx = this.favoritesArticles.findIndex(articleId => articleId.toString() === id.toString())

    if (this.favoritesArticles[idx]) {
        this.favoritesArticles = this.favoritesArticles.filter(articleId => articleId.toString() !== id.toString())
    }

    return this.save()
}

user.pre('save', function(next) {
    const user = this

    if (!user.isModified('password')) { return next() }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err) }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) { return next(err) }

            user.password = hash
            next()
        })
    })
})

user.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

user.methods.generateJWT = function() {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 30)

    let payload = {
        id: this._id,
        email: this.email,
        username: this.username
    }

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    })
}

module.exports = model('User', user)