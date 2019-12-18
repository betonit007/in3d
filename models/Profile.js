const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // connecting to user id
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    printers: {
        type: [String]
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    experience: [
        {
            title: {
                type: String,
            },
            company: {
                type: String
            },
            location: {
                type: String
            },
            from: {
                type: Date
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    certifications: [
       {
           school: {
               type: String,
           },
           degree: {
               type: String,
           },
           fieldofstudy: {
               type: String
           },
           from: {
               type: Date
           },
           to: {
               type: Date
           },
           current: {
               type: Boolean
           },
           description: {
               type: String
           }
       }
    ],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedIn: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);