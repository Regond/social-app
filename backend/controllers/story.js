import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';
import moment from "moment";

export const getStories = (rq, rs) => {
    const id = rq.query.userId;
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("wrong token");
        let query;
        query = `SELECT story.*, user.id AS userId, name, profile, username
                FROM stories AS story
                JOIN users AS user ON (user.id = story.userId)
                LEFT JOIN rels AS r ON (story.userId = r.followedId)
                WHERE (r.followerId = ? OR story.userId = ?)
                ORDER BY story.dateTime DESC
                LIMIT 4`;


        db.query(query, [user.id, user.id], (err, data) => {
            if (err) console.log(err);
            return rs.status(200).json(data);
        });
    });
};





export const addStory = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if (!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO stories(`img`, `dateTime`, `userId`) VALUES (?)";
        const postVals = [
            rq.body.img,
            moment().format("YYYY-MM-DD HH:mm:ss"),
            user.id
        ];
        db.query(query, [postVals], (err, data) => {
            if (err) {
                console.log(err);
                return rs.status(500).json(err);
            }
            return rs.status(200).json("Story has been created");
        });
    });
};


export const deleteStory = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");
        const query = "DELETE FROM stories WHERE `id`= ? AND `userId`= ?";    
        db.query(query, [rq.params.id, user.id], (e, data) => {
            if(e) return  rs.status(500).json(e);
            if(data.affectedRows>0) return rs.status(200).json("Post has been deleted")
            return rs.status(403).json("Thats not your post")
        })

    })
}