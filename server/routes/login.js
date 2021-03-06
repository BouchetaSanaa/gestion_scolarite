const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const store = require("store");



router.post('/', async (req, res)=> {
  const { error } = validate(req.body);
  if (error) return res.status(422).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(401).json({error:"Invalid username or password "}) 
        const validPassword = await bcrypt.compare(req.body.password, user.password);
         if (validPassword ){
            const token = user.generateAuthToken();
            store.set("token", { token: token });
            res.header("x-auth-token", token).status(200).send({
              token:token
            });
           }
           else{
             return res.status(401).json({error:"Invalid password "});
           }      
        }
    )
      
module.exports=router;