import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';
import moment from "moment";

export const getPosts = (rq, rs) => {
    const id = rq.query.userId;
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("wrong token");
        let query;
        const queryParams = [];

        if (id !== "undefined") {
            query = `SELECT post.*, user.id AS userId, name, profile, username
                     FROM posts AS post 
                     JOIN users AS user ON (user.id = post.userId)
                     WHERE post.userId = ?`;
            queryParams.push(id);
        } else {
            query = `SELECT post.*, user.id AS userId, name, profile, username
                     FROM posts AS post 
                     JOIN users AS user ON (user.id = post.userId)
                     LEFT JOIN rels AS r ON (post.userId = r.followedId)
                     WHERE (r.followerId = ? OR post.userId = ?) 
                     ORDER BY post.dateTime DESC`;
            queryParams.push(user.id, user.id);
        }
        db.query(query, queryParams, (err, data) => {
            if (err) return rs.status(500).json(err);
            return rs.status(200).json(data);
        });
    });
};





export const addPost = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO posts (`description`, `img`,`userId`, `dateTime`) VALUES (?)"          
        const postVals = [
            rq.body.description,
            rq.body.img,
            user.id,
            moment().format("YYYY-MM-DD HH:mm:ss")
        ]
        db.query(query, [postVals], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("Post has been created")
        })

    })
}

export const deletePost = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");
        const query = "DELETE FROM posts WHERE `id`= ? AND `userId`= ?";    
        db.query(query, [rq.params.id, user.id], (e, data) => {
            if(e) return  rs.status(500).json(e);
            if(data.affectedRows>0) return rs.status(200).json("Post has been deleted")
            return rs.status(403).json("Thats not your post")
        })

    })
}