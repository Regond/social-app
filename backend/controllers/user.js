import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';

export const getUser = (rq, rs) => {
    const userId = rq.params.userId;
    const q = "SELECT * FROM users WHERE id=?";
  
    db.query(q, [userId], (e, data) => {
      if (e) return rs.status(500).json(e);
      const { password, ...info } = data[0];
      return rs.json({ password, ...info });
    });
}
export const getUsers = (rq, rs) => {
    const q = "SELECT * FROM users";
  
    db.query(q, (e, data) => {
      if (e) console.log(e)
      const { password, ...info } = data;

      return rs.json({ ...info });
    });
}


export const updateUser = (rq, rs) => {
  const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "UPDATE users SET `name`=?, `city`=?, `profile`=?, `cover`=? WHERE id = ?"          
        const postVals = [
            rq.body.name,
            rq.body.city,
            rq.body.profile,
            rq.body.cover,
            user.id
        ]
        db.query(query, postVals, (e, data) => {
            if(e) return  rs.status(500).json(e);
            if(data.affectedRows > 0) return rs.json("Updated")
            return rs.status(403).json("You can update only own info")
        })

    })
}