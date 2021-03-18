'use strict';

const { Router } = require('express');
const express = require('express');
const router = express.Router();
const database = require('./database');
const { User, Course } = database.models;
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

//async handler
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            console.log(error)
            next(error); //fwd error to global error handler
        }
    }
}
let user;
//middleware that authenticates user before granting access to some routes
exports.authenticateUser = async (req, res, next) => {
    let message; //stores the error message to display
    const credentials = auth(req);
    if (credentials) { //checks if credentials are entered
        console.log(credentials)
        user = await User.findOne({ where: { emailAddress: credentials.name } });
        console.log(user)
        if (user) { //checks if user exists
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) { //checks if user/password passed authentication
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                req.currentUser = user; //store the user on the request object
            } else {
                message = `Authentication not successful for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = `Auth header not found`;
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
}

//--------USER routes--------//
//gets a list of all users
router.get('/users', this.authenticateUser, asyncHandler(async (req, res, next) => {
    let user = await req.currentUser;
    res.json({
        id: user.dataValues.id,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        emailAddress: user.dataValues.emailAddress
    });
    console.log(user)
    return res.status(200).end();
}));

//creates a new user
router.post('/users', asyncHandler(async (req, res, next) => {
    if (req.body.password) {
        //hashes password
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
    }
    try {
        await User.create(req.body);
        //sets location header
        res.location('/');
        console.log(`User ${req.body.firstName} ${req.body.lastName} created successfully!`);
        res.status(201).end();
    } catch (error) {
        console.log('Error: ', error.name);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

//--------COURSE routes--------//
//gets a list of all courses
router.get('/courses', asyncHandler(async (req, res, next) => {
    // throw new Error(500);
    let courses = await Course.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                },
            }
        ]
    });
    res.json(courses);
    return res.status(200).end();
}));

//get the listing for one individual course
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
    let courses = await Course.findByPk(req.params.id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                },
            }
        ]
    });
    res.json(courses);
    return res.status(200).end();
}));

//creates a new course
router.post('/courses', this.authenticateUser, asyncHandler(async (req, res, next) => {
    try {
        let course = await Course.create(req.body);
        console.log(`Course "${req.body.title}" created successfully!`);
        res.location(`/courses/${course.dataValues.id}`); //sets location header to 
        res.status(201).end();
    } catch (error) {
        console.log('Error: ', error.name)
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

//updates a currently existing course
router.put('/courses/:id', this.authenticateUser, asyncHandler(async (req, res, next) => {
        try {
            let course = await Course.findByPk(req.params.id);
            if (user.id == course.userId) {
                console.log(user.id)
                console.log(course.userId)
                await course.update(req.body);
                console.log(`Course "${req.body.title}" updated successfully!`);
                res.status(204).end();
            } else {
                console.log('User not authorized to delete this course')
                res.status(403).end();            
            }
        } catch (error) {
            console.log('Error: ', error.name)
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
}));

//deletes a currently existing course
router.delete('/courses/:id', this.authenticateUser, asyncHandler(async (req, res, next) => {
        try {
            let course = await Course.findByPk(req.params.id);
            if (user.id == course.userId) {
                console.log(user.id)
                console.log(course.userId)
                await course.destroy();
                console.log(`Course ${req.body.title} has been updated!`);
                res.status(204).end();
            } 
            else {
                console.log('User not authorized to delete this course')
                res.status(403).end();
            }
        } catch (error) {
            console.log('Error: ', error.name)
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
}))

module.exports = router;







// 'use strict';

// const { Router } = require('express');
// const express = require('express');
// const router = express.Router();
// const database = require('./database');
// const { User, Course } = database.models;
// const bcrypt = require('bcryptjs');
// const { asyncHandler } = require('./middleware/async-handler');
// const { authenticateUser } = require('./middleware/auth-user');

// //--------USER routes--------//
// //gets a list of all users
// router.get('/users', authenticateUser, asyncHandler(async (req, res, next) => {
//     let user = await req.currentUser;
//     res.json({
//         id: user.dataValues.id,
//         firstName: user.dataValues.firstName,
//         lastName: user.dataValues.lastName,
//         emailAddress: user.dataValues.emailAddress
//     });
//     console.log(user)
//     return res.status(200).end();
// }));

// //creates a new user
// router.post('/users', asyncHandler(async (req, res, next) => {
//     if (req.body.password) {
//         //hashes password
//         let salt = bcrypt.genSaltSync(10);
//         let hash = bcrypt.hashSync(req.body.password, salt);
//         req.body.password = hash;
//     }
//     try {
//         await User.create(req.body);
//         //sets location header
//         res.location('/');
//         console.log(`User ${req.body.firstName} ${req.body.lastName} created successfully!`);
//         res.status(201).end();
//     } catch (error) {
//         console.log('Error: ', error.name);
//         if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
//             const errors = error.errors.map(err => err.message);
//             res.status(400).json({ errors });
//         } else {
//             throw error;
//         }
//     }
// }));

// //--------COURSE routes--------//
// //gets a list of all courses
// router.get('/courses', asyncHandler(async (req, res, next) => {
//     // throw new Error(500);
//     let courses = await Course.findAll({
//         attributes: {
//             exclude: ['createdAt', 'updatedAt']
//         },
//         include: [
//             {
//                 model: User,
//                 attributes: {
//                     exclude: ['password', 'createdAt', 'updatedAt']
//                 },
//             }
//         ]
//     });
//     res.json(courses);
//     return res.status(200).end();
// }));

// //get the listing for one individual course
// router.get('/courses/:id', asyncHandler(async (req, res, next) => {
//     let courses = await Course.findByPk(req.params.id, {
//         attributes: {
//             exclude: ['createdAt', 'updatedAt']
//         },
//         include: [
//             {
//                 model: User,
//                 attributes: {
//                     exclude: ['password', 'createdAt', 'updatedAt']
//                 },
//             }
//         ]
//     });
//     res.json(courses);
//     return res.status(200).end();
// }));

// //creates a new course
// router.post('/courses', authenticateUser, asyncHandler(async (req, res, next) => {
//     try {
//         let course = await Course.create(req.body);
//         res.location(`/courses/${course.dataValues.id}`); //sets location header to 
//         res.status(201).end();
//     } catch (error) {
//         console.log('Error: ', error.name)
//         if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
//             const errors = error.errors.map(err => err.message);
//             res.status(400).json({ errors });
//         } else {
//             throw error;
//         }
//     }
// }));

// //updates a currently existing course
// router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
//       const user = req.currentUser;
//       try {
//             let course = await Course.findByPk(req.params.id);
//             if (user.id == course.userId) {
//                 await course.update(req.body);
//                 res.status(204).end();
//             } else {
//                 console.log('User not authorized to delete this course')
//                 res.status(403).end();            
//             }
//         } catch (error) {
//             console.log('Error: ', error.name)
//             if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
//                 const errors = error.errors.map(err => err.message);
//                 res.status(400).json({ errors });
//             } else {
//                 throw error;
//             }
//         }
// }));

// //deletes a currently existing course
// router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
//         try {
//             let course = await Course.findByPk(req.params.id);
//             if (user.id == course.userId) {
//                 await course.destroy();
//                 res.status(204).end();
//             } 
//             else {
//                 console.log('User not authorized to delete this course')
//                 res.status(403).end();
//             }
//         } catch (error) {
//             console.log('Error: ', error.name)
//             if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
//                 const errors = error.errors.map(err => err.message);
//                 res.status(400).json({ errors });
//             } else {
//                 throw error;
//             }
//         }
// }))

// module.exports = router;