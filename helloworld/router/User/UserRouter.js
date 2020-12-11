const UserController = require('../../controllers/UserController')
const AuthenticatePolicy = require('../../policies/AuthenticatePolicy')
const router = require('express').Router()

router.post('/login', UserController.login)
router.get('/:id', UserController.getUserById)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)
router.post('/', UserController.register)

module.exports = router