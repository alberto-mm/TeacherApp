var router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const { getByEmail, getUserByEmail } = require('../models/user.model');
const { createToken } = require('../helpers/utils');


router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {

        // Checks if email exists
        const user = await getByEmail(email);

        if(!user) {
            return res.status(400).json({ error: "Error en email y/o contraseña" });
        }

        // Checks if the passwords are the same
        const same = bcrypt.compareSync(password, user.password)
        // const same = (password === user.password);
        if (!same) {
            return res.status(400).json({ error: "Error en email y/o contraseña" });
        }
        
        // Login success
        let id;
    
        res_student = await Student.getIdByUserId(user.id);
        res_teacher = await Teacher.getIdByUserId(user.id);

        switch (user.role_id) {
            case 1:
                id = user.id;
                break;
            case 2:
                id = res_teacher.id;
                break;
            case 3:
                id = res_student.id;
                break;
        };
    
        res.status(200).json({
            success: true,
            token: createToken(id, user.title)
        });

    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            res.status(503);
        }
        else {
            res.status(400);
        }
        return res.json({ error: err.message });
    }
})

router.get('/:email',async  (req, res) =>{
  try{
      const user = await getUserByEmail(req.params.email);
      res.json(user);
  } catch (error) {
      res.json({ fatal: error.message });
  }
})


router.get('/', async (req, res) => {
    try{
        const users = await allUsers.getAllUsers()
        res.json(users)
    } catch (error) {
        res.json({ error: error.message })
    }
})



module.exports = router;

