import {db} from '../db.js';
import  jwt  from 'jsonwebtoken';
import moment from "moment";




export const getUnseenData = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("Нет авторизации");

    jwt.verify(token, "abcde", (e, user) => {
        if (e) return rs.status(403).json("Неверный токен");

        let combinedData = [];

        const getLikesQuery = `
            SELECT l.*, liker.username AS username, liker.profile AS pic
            FROM likes AS l
            JOIN posts AS post ON (l.postId = post.id)
            JOIN users AS liker ON (l.userId = liker.id)
            WHERE post.userId = ? AND l.seen = 0
        `;
      
        const getCommentsQuery = `
            SELECT c.*, commenter.profile AS pic, commenter.username AS username
            FROM comments AS c
            JOIN posts AS post ON (c.postId = post.id)
            JOIN users AS commenter ON (c.userId = commenter.id)
            WHERE post.userId = ? AND c.seen = 0
        `;

        db.query(getLikesQuery, [user.id], (e, likesData) => {
            if (e) console.log(e);
            combinedData.push(...likesData);

            db.query(getCommentsQuery, [user.id], (e, commentsData) => {
                if (e) console.log(e);
                combinedData.push(...commentsData);

                combinedData.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

                return rs.status(200).json(combinedData);
            });
        });
    });
};

export const updateSeen = (rq, rs) => {
    const token = rq.cookies.accessToken;
    if (!token) return rs.status(401).json("Нет авторизации");
  
    jwt.verify(token, "abcde", (err, user) => {
        if (err) {
            return rs.status(403).json("Неверный токен"); 
        }

        let completedRequests = 0;
        const totalRequests = 2; // Общее количество запросов

        const handleResponse = () => {
            completedRequests++;
            if (completedRequests === totalRequests) {
                return rs.status(200).json("Статус уведомлений обновлен");
            }
        };

        const query = `
            UPDATE likes AS l
            JOIN posts AS post ON l.postId = post.id
            JOIN users AS user ON (post.userId = user.id)
            SET l.seen = 1
            WHERE user.id = ?
        `;
      
        const commentQuery = `
            UPDATE comments AS c
            JOIN posts AS post ON c.postId = post.id
            JOIN users AS user ON (post.userId = user.id)
            SET c.seen = 1
            WHERE user.id = ?
        `;

        db.query(query, [user.id], (err, data) => {
            if (err) console.error(err);
            handleResponse();
        });

        db.query(commentQuery, [user.id], (err, data) => {
            if (err) console.error(err);
            handleResponse();
        });
    });
};
