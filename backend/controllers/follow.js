import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';

export const getFollows = (rq, rs) => {
        const query = `
        SELECT followerId
        FROM rels
        WHERE followedId = ?`          

        db.query(query, [rq.query.followedId], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json(data.map(r => r.followerId))
        })
}

export const follow = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO rels (`followerId`,`followedId`) VALUES (?)"          
        const postVals = [
            user.id,
            rq.body.userId
        ]
        db.query(query, [postVals], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("Followed")
        })

    })
}

export const unfollow = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "DELETE FROM rels WHERE `followerId` = ? AND `followedId` = ?"          
        db.query(query, [user.id, rq.query.userId], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("Unfollowed")
        })

    })
}