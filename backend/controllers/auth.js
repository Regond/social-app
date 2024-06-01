import {db} from '../db.js';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import  jwt  from 'jsonwebtoken';

export const login = (rq, rs) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [rq.body.username], (e, data) => {
        if(e) return  rs.status(500).json(e);
        if(data.length === 0) return rs.status(404).json("User not found");

        // const checkPass = bcrypt.compareSync(rq.body.password, data[0].password);
        const checkPass = rq.body.password === data[0].password;
        if (!checkPass) return rs.status(400).json('Wrong pass');

        const token = jwt.sign({id:data[0].id}, "abcde");
        const { password, ...others } = data[0];
        rs.cookie('accessToken', token, {
            httpOnly: true
        }).status(200).json({ password, ...others });
    })
}
export const register = (rq, rs) => {
    const query = "SELECT * FROM users WHERE username = ?"
    db.query(query, [rq.body.username], (e, data) => {
        if(e) return  rs.status(500).json(e);
        if(data.length) return rs.status(409).json("User already exists");

        const s = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(rq.body.password, s);

        const q = "INSERT INTO users (`username`,`email`,`password`) VALUE (?)"

        const values = [rq.body.username, rq.body.email, rq.body.password]
        db.query(q, [values], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("User has been created");
        })
    })
}
export const logout = (rq, rs) => {
    rs.clearCookie('accessToken', {
        secure:true,
        sameSite: "none"
    });
    
    rs.status(200).json("User logout");
}