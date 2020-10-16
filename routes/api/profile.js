const express = require('express');
const axios = require('axios');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');


//@route GET api/profile/me
//@desc Test route
//@access Public
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile
            .findOne({ user: req.user.id })
            .populate('User', ['name', 'avatar']);
        
        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route Post api/profile
//@desc Create/update user profile
//@access private
router.post('/',
    [
    auth,
    [
        check('status', 'Status is required')
            .not()
            .isEmpty(),
        check('skills', 'Skills is required')
            .not()
            .isEmpty()    
        ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {
            company,
            location,
            website,
            bio,
            skills,
            status,
            githubusername,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook
        } = req.body;
        
        //build profile object

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());

        }

        //build social objcet
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        //whenever using monogoose method, use await b/c it returns promise
        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields},
                    { new: true }
                );
                return res.json(profile);
            }
            //create
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route get api/profile
//@desc get all prof
//@access pub

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route get api/profile/user/user_id
//@desc get profile by user id1
//@access pub

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile
            .findOne({ user: req.params.user_id })
            .populate('user', ['name', 'avatar']);
        if (!profile)
            return res.status(400).json({ msg: 'There is no profile for this user' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            if (!profile)
                return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.status(500).send('Server Error');
    }
})


//@route delete api/profile
//@desc delete prof/user and posts
//@access priv

router.delete('/', auth,  async (req, res) => {
    try {
        //remove user posts
        await Post.deleteMany({ user: req.user.id });
        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({msg: 'User deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route put api/profile/exp
//@desc add prof exp
//@access priv

router.put('/experience',
    [
        auth,
        [
            check('title', 'Title is required')
                .not().
                isEmpty(),
            check('company', 'Company is required')
                .not().
                isEmpty(),
            check('from', 'From date is required')
                .not().
                isEmpty(),
        ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        // no using variables from above
        const newExp = { // creates an object w/ the data the user submits
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        //to deal with mongo db
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);//push to front, so most recent is first

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
            
        }
        


});

//@route delete api/profile/experience/:exp_id
//@desc delete exp from prof
//@access priv
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        
        console.log(req.params.exp_id, removeIndex)

        if (removeIndex !== -1) {
            profile.experience.splice(removeIndex, 1);
            await profile.save();
            res.json(profile);
        } else res.status(500).send('Invalid Experience ID');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//@route put api/profile/educaiton
//@desc add prof educaiton
//@access priv

router.put('/education',
    [
        auth,
        [
            check('school', 'School is required')
                .not().
                isEmpty(),
            check('degree', 'Degree is required')
                .not().
                isEmpty(),
            check('fieldofstudy', 'Field of Study date is required')
                .not().
                isEmpty(),
            check('from', 'From date is required')
                .not().
                isEmpty(),
        ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        // no using variables from above
        const newEdu = { // creates an object w/ the data the user submits
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        //to deal with mongo db
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);//push to front, so most recent is first

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
            
        }
        


});

//@route delete api/profile/education/:edu_id
//@desc delete education from prof
//@access priv
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        
        console.log(req.params.exp_id, removeIndex)

        if (removeIndex !== -1) {
            profile.education.splice(removeIndex, 1);
            await profile.save();
            res.json(profile);
        } else res.status(500).send('Invalid education ID');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// //@route get api/profile/github/:username
// //@desc get user repos from git
// //@access public
// router.get('/github/:username', async (req, res) => {
//     try {
//       const uri = encodeURI(
//         `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
//       );
//       const headers = {
//         'user-agent': 'node.js',
//         Authorization: `token ${config.get('githubToken')}`
//       };
  
//       const gitHubResponse = await axios.get(uri, { headers });
//       return res.json(gitHubResponse.data);
//     } catch (err) {
//       console.error(err.message);
//       return res.status(404).json({ msg: 'No Github profile found' });
//     }
//   });
// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
    //   const headers = {
    //     'user-agent': 'node.js',
    //     Authorization: `token ${config.get('githubToken')}`
    //   };
    //const gitHubResponse = await axios.get(uri);
    //const gitHubResponse = await axios.get(uri, { headers });
        
        //runs repeatedly, DO NOT USE UNTIL FIXED
      const gitHubResponse = await axios.get(uri);
      return res.json(gitHubResponse.data);

    //   return res.json('github repo here');
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });
//exporter
module.exports = router;