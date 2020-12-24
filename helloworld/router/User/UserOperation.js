const UserController = require('../../controllers/UserController')

const router = require('express').Router()

router.post('/login', UserController.login)
router.get('/:id', UserController.getUserById)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)
router.post('/', UserController.register)
router.post('/setOpenID', UserController.setOpenID)

module.exports = router