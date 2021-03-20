'use strict';

const { Router } = require('express');
const express = require('express');
const router = express.Router();
const database = require('./database');
const { User, Course } = database.models;
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
      } catch (error) {
        // Forward error to the global error handler
        next(error);
      }
  }
}
let user;

// Middleware to authenticate the request using Basic Authentication
exports.authenticateUser = async (req, res, next) => {
  let message; 
  
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
      
    // Attempt to retrieve the user from the data store by their username (i.e. the user's "key" from the Authorization header).
    user = await User.findOne({ where: { emailAddress: credentials.name } });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcrypt to compare the user's password (from the Authorization header) to the user's password that was retrieved from the data store.
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {

        // Store the retrieved user object on the request object so any middleware that follows this one will have access to the user's information.
        req.currentUser = user;
      
      } else { // for `if (authenticated)`
        message = `Authentication not successful for username: ${user.emailAddress}`;
      }

    } else { // for `if (user)`
      message = `User not found for username: ${credentials.name}`;
    }

  } else { // for `if (credentials)`
    message = `Auth header not found`;
  }

  // If user authentication failed...
  if (message) {

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });

    // Or if user authentication succeeded...
  } else {
    next();
  }
}


// User routes

// An /api/users GET route that will return the currently authenticated user along with a 200 HTTP status code.
router.get('/users', this.authenticateUser, asyncHandler(async (req, res, next) => {
    let user = await req.currentUser;
    res.json({
        id: user.dataValues.id,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        emailAddress: user.dataValues.emailAddress
    });
    return res.status(200).end();
}));

// An /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
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
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));


// Course Routes

// an /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
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

// an /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.
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

// an /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', this.authenticateUser, asyncHandler(async (req, res, next) => {
    try {
        let course = await Course.create(req.body);
        res.location(`/courses/${course.dataValues.id}`); //sets location header to 
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// an /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', this.authenticateUser, asyncHandler(async (req, res, next) => {
        try {
            let course = await Course.findByPk(req.params.id);
            if (user.id == course.userId) {
                await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(403).end();            
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
}));

// an /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', this.authenticateUser, asyncHandler(async (req, res, next) => {
        try {
            let course = await Course.findByPk(req.params.id);
            if (user.id == course.userId) {
                await course.destroy();
                res.status(204).end();
            } 
            else {
                res.status(403).end();
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
}))

module.exports = router;