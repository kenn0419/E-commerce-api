'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const accessController = require('../../controllers/access.controller');
const { authentication } = require('../../auth/authUtils');

const router = require('express').Router();


//Sign up
router.post('/shop/sign-up', asyncHandler(accessController.signUp));

//Login
router.post('/shop/log-in', asyncHandler(accessController.logIn));

//Authentication
router.use(authentication);


router.post('/shop/log-out', asyncHandler(accessController.logOut));


module.exports = router;