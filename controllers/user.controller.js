const model = require("../models")
const Joi = require("joi");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const userSchema = Joi.object({
    name: Joi.string()
        .required(),

    email: Joi.string()
        .email()
        .required(),
  
    password: Joi.string()
        .min(6)
        .required(),
  
    age: Joi.number()
        .integer()
        .positive()
        .required(),

    role: Joi.string()
        .valid('admin','user')
        .required()

});
var io=require("../config/socket")


exports.getAll = async (req, res) => {
    try {
        res.status(200).send(model.users);
    }
    catch (error) {
        res.status(400).send({ "Message": error.message});
    }
};

exports.getOne = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = model.users.find(user => user.id === id);

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    }
    catch (error) {
        console.log("In Catch..");
        res.status(400).send({ "Message": error.message});
    }
};

exports.create = async (req, res) => {
    try {
        const User = await userSchema.validateAsync(req.body);

        const checkUser = model.users.find(user => user.email === User.email);
        if (checkUser){
            res.status(409).send({ error: 'User already exists'})
        }
        else{
            // Hash the password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(User.password, salt);
            if (model.users.length == 0){
                id = 1;
            }
            else{
                id = model.users[model.users.length-1].id + 1;
            }
            
            const user = {
                id : id,
                name : User.name,
                email : User.email,
                password : hashedPassword,
                age : User.age,
                role : User.role
            }
            model.users.push(user);
            io.io.emit('notification', { action: 'create', user });
            res.status(200).send(user);
            
        }
    }
    catch (error) {
        console.log("In Catch..");
        res.status(400).send({ "Message": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Unauthorized' });
        }
        const id = parseInt(req.params.id);
        const index = model.users.findIndex(user => user.id === id);
      
        if (index !== -1) {
          const deletedUser = model.users.splice(index, 1);
          io.io.emit('notification', { action: 'delete', deletedUser });
          res.status(200).send(deletedUser[0]);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.log("In Catch..");
        res.status(400).send({ "Message": error.message});
    }
};

exports.update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updateUser = req.body;
        const index = model.users.findIndex(user => user.id === id);

        if (index !== -1) {
            var user = model.users[index];
            if (updateUser.name){
                user.name = updateUser.name
            }
            if (updateUser.age){
                user.age = updateUser.age
            }
            if (updateUser.password){
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(updateUser.password, salt);
                user.password = hashedPassword;
            }
            res.status(200).send(model.users[index]);
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    }
    catch (error) {
        console.log("In Catch..");
        res.status(400).send({ "Message": error.message});
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = model.users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const secret_token = process.env.SECRET_TOKEN;
        const token = jwt.sign({ email: user.email, role: user.role }, secret_token);

        res.status(200).json({ token });
    }
    catch (error) {
        console.log("In Catch..");
        res.status(400).send({ "Message": error.message});
    }
};




