import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';
import moment from "moment";

export const getLikes = (rq, rs) => {
        const query = `
        SELECT userId 
        FROM likes
        WHERE postId = ?`          

        db.query(query, [rq.query.postId], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json(data.map(l => l.userId))
        })
}

export const like = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO likes (`userId`,`postId`, `seen`, `dateTime`) VALUES (?)"          
        const postVals = [
            user.id,
            rq.body.postId,
            0,
            moment().format("YYYY-MM-DD HH:mm:ss")
        ]
        db.query(query, [postVals], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("liked")
        })

    })
}

export const dislike = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?"          
        db.query(query, [user.id, rq.query.postId], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("disliked")
        })

    })
}
