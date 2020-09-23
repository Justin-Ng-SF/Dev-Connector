const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const config = require('config');
const { check, validationResult } = require('express-validator/check');//in documentation of express


const User = require('../../models/User')

//@route GET api/ users
//@desc register user
//@access Public
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please use valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({min: 6})
    ],
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });//400 for bad request    
        }
        
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exist' }] });
            }
            //check if user existts


            //get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //encrypt pass, getting promise from gensalt, 
            //takes in rounds, more rounds more secure but slower
            const salt = await bcrypt.genSalt(10); 

            user.password = await bcrypt.hash(password, salt);

            await user.save();


            //payload
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');

        }

    
});

//exporter
module.exports = router;