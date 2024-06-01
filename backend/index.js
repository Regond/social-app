import Express from 'express';
const app = Express();
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import likeRoutes from './routes/likes.js';
import commentsRoutes from './routes/commentaries.js';
import authRoutes from './routes/auth.js';
import followingRoutes from './routes/following.js';
import storiesRoutes from './routes/stories.js';
import groupsRoutes from './routes/groups.js';
import cookieParser from 'cookie-parser';
import membersRoutes from './routes/joinGroup.js';
import postsRoutes from './routes/groupPosts.js';
import notificationsRoutes from './routes/notifications.js';
import requestsRoutes from './routes/requests.js';
import multer from 'multer'
import cors from 'cors';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
})
app.use(Express.json())
app.use(
    cors({origin: 'http://localhost:3000'})
    );
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../frontend/public/files')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname )
    }
  })
  
const load = multer({ storage: storage })

app.post('/api/load', load.single('file'), (rq, rs) => {
    const file = rq.file;
    rs.status(200).json(file.filename);
})

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/following', followingRoutes)
app.use('/api/stories', storiesRoutes)
app.use('/api/groups', groupsRoutes)
app.use('/api/members', membersRoutes)
app.use('/api/groupsPost', postsRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/requests', requestsRoutes)

app.listen(8800, () => {
    console.log("working")
})