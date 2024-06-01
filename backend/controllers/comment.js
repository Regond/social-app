import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';
import moment from "moment";

export const getComms = (rq, rs) => {
    const query = `
    SELECT comment.*, user.id AS userId, name, profile, username
    FROM comments AS comment 
    JOIN users AS user ON (user.id = comment.userId)
    WHERE comment.postId = ?
    ORDER BY comment.dateTime DESC`
    db.query(query, [rq.query.postId], (e, data) => {
        if(e) return  rs.status(500).json(e);
        return rs.status(200).json(data)
    })
}

export const addComment = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO comments (`description`, `userId`, `dateTime`, `postId`, `seen`, `replyTo`) VALUES (?)"          
        const postVals = [
            rq.body.description,
            user.id,
            moment().format("YYYY-MM-DD HH:mm:ss"),
            rq.body.postId,
            0,
            rq.body.replyTo
        ]
        db.query(query, [postVals], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("Added comment")
        })

    })
}

