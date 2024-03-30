'use strict'

const { asyncHandler } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');

const router = require('express').Router();


//Sign up
router.post('/shop/sign-up', asyncHandler(accessController.signUp));
//Login
router.post('/shop/login', asyncHandler(accessController.logIn));

module.exports = router;