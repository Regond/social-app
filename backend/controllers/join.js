import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';

export const getJoins = (rq, rs) => {
        const query = `
        SELECT *
        FROM members
        WHERE groupId = ?`          
        db.query(query, [rq.query.groupId], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json(data.map(r => r.userId))
        })
}

export const Join = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO members (`groupId`,`userId`) VALUES (?)"          
        const postVals = [
            rq.body.id,
            user.id
        ]
        db.query(query, [postVals], (e, data) => {
            if(e) console.log(e);
            return rs.status(200).json("Followed")
        })

    })
}

export const Separate = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "DELETE FROM members WHERE `groupId` = ? AND `userId` = ?"          
        db.query(query, [ rq.query.groupId, user.id], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("Unfollowed")
        })

    })
}