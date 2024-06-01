import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';
import moment from "moment";

export const getGroups = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("wrong token");

        const query = "SELECT g.*, m.userId FROM `groups` AS g LEFT JOIN `members` AS m ON g.id=m.groupId";
        db.query(query, (err, data) => {
            if (err) {
                console.log(err);
                return rs.status(500).json("Database query error");
            }
            const groups = {};
            data.forEach(row => {
                if (!groups[row.id]) {
                    groups[row.id] = {
                        id: row.id,
                        name: row.name,
                        img: row.img,
                        description: row.description,
                        adminId: row.adminId,
                        members: []
                    };
                }
                if (row.userId) {
                    groups[row.id].members.push(row.userId);
                }
            });

            return rs.status(200).json(Object.values(groups));
        });
    });
};


export const getGroup = (rq, rs) => {
    const id = rq.params.id;
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("wrong token");
        let query;
        query = "SELECT * FROM `groups` WHERE id = ?";
        db.query(query, id, (err, data) => {
            if (err) console.log(err);
            return rs.status(200).json(data);
        });
    });
};
export const getGroupName = (rq, rs) => {
    const id = rq.params.name;
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("wrong token");
        let query;
        query = "SELECT g.*, m.userId FROM `groups` AS g LEFT JOIN `members` AS m ON g.id=m.groupId WHERE g.name = ?";
        db.query(query, id, (err, data) => {
            if (err) {
                console.log(err);
                return rs.status(500).json("Database query error");
            }
            const groups = {};
            data.forEach(row => {
                if (!groups[row.id]) {
                    groups[row.id] = {
                        id: row.id,
                        name: row.name,
                        img: row.img,
                        description: row.description,
                        adminId: row.adminId,
                        members: []
                    };
                }
                if (row.userId) {
                    groups[row.id].members.push(row.userId);
                }
            });

            return rs.status(200).json(Object.values(groups));
        });
    });
};





export const addGroup = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");

        const query = "INSERT INTO `groups` (`id`,`name`,`description`, `img`,`cover`, `adminId`) VALUES (?)"          
        const postVals = [
            rq.body.id,
            rq.body.name,
            rq.body.description,
            rq.body.img,
            rq.body.cover,
            user.id
        ]
        db.query(query, [postVals], (e, data) => {
            if(e) console.log(e);
            return rs.status(200).json("Group has been created")
        })

    })
}

export const deleteGroup = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if(!token) rs.status(401).json("");
    jwt.verify(token, "abcde", (e, user) => {
        if(e) return rs.status(403).json("wrong token");
        const query = "DELETE FROM `groups` WHERE `id`= ? AND `adminId`= ?";    
        db.query(query, [rq.params.id, user.id], (e, data) => {
            if(e) return  console.log(e);
            if(data.affectedRows>0) return rs.status(200).json("Post has been deleted")
            return rs.status(403).json("Thats not your post")
        })

    })
}