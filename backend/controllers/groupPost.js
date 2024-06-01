import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';
import moment from "moment";

export const getGroupPosts = (rq, rs) => {
    const groupId = rq.query.groupId;
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("wrong token");
        let query;
        query = "SELECT gp.*, `group`.id AS `groupId`, `group`.name AS `groupName`, `group`.img AS `groupImg`, `group`.adminId AS `admin` FROM `groupposts` AS `gp` JOIN `groups` AS `group` ON (`group`.id = `gp`.groupId) WHERE `gp`.groupId = ?";
        db.query(query, groupId, (err, data) => {
            if (err) console.log(err);
            return rs.status(200).json(data);
        });
    });
};






export const addGroupPost = (rq, rs) => {
    const groupId = rq.query.groupId;
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO `groupposts` (`description`, `img`,`groupId`, `dateTime`) VALUES (?)"          
        const postVals = [
            rq.body.description,
            rq.body.img,
            rq.body.id,
            moment().format("YYYY-MM-DD HH:mm:ss"),
        ]
        db.query(query, [postVals], (e, data) => {
            if(e) return  rs.status(500).json(e);
            return rs.status(200).json("Post has been created")
        })

    })
}

export const deleteGroupPost = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");
        const query = "DELETE FROM `groupposts` WHERE `id`= ?";    
        db.query(query, [rq.params.id], (e, data) => {
            if(e) return  rs.status(500).json(e);
            if(data.affectedRows>0) return rs.status(200).json("Post has been deleted")
            return rs.status(403).json("Thats not your post")
        })

    })
}