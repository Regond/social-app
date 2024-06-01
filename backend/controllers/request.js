import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';

export const getRequests = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");
        const query = `
            SELECT rels.followerId, users.username, users.profile, users.id
            FROM rels
            JOIN users ON rels.followerId = users.id
            WHERE rels.followedId = ?
            AND rels.followerId NOT IN (SELECT followedId FROM rels WHERE followerId = ?)`          
        db.query(query, [user.id, user.id], (e, data) => {
        if(e) console.log(e);
        return rs.status(200).json(data)
    })
})
}


export const addFriend = (rq, rs) => {
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