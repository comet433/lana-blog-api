const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;
// 工具函数：加载 JSON 文件内容
const getPosts = () => JSON.parse(fs.readFileSync("./data/posts.json", "utf-8"));
// 中间件：让 Express 能处理 JSON 请求体
app.use(express.json());
/**
GET 所有博客文章
*/
app.get("/posts", (req, res) => {
const posts = getPosts();
res.json(posts);
});
/**
GET 指定 ID 的文章
*/
app.get("/posts/:id", (req, res) => {
const posts = getPosts();
const post = posts.find(p => p.id === parseInt(req.params.id));
if (post) {
res.json(post);
} else {
res.status(404).json({ error: "Post not found" });
}
});
/**
✅ POST 新博客文章（你要添加的部分）
*/
app.post("/posts", (req, res) => {
const posts = getPosts();
const { title, content, author } = req.body;
const newPost = {
id: posts.length ? posts[posts.length - 1].id + 1 : 1,
title,
content,
author,
createdAt: new Date().toISOString().split("T")[0]
};
posts.push(newPost);
fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));
res.status(201).json(newPost);
});
/**
启动服务器
*/
app.put("/posts/:id", (req, res) => {
    const posts = getPosts();
    const id = parseInt(req.params.id);
    const { title, content, author } = req.body;
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
    }
    posts[index] = {
    id,
    title,
    content,
    author,
    createdAt: posts[index].createdAt // 保留原始时间
    };
    fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));
    res.json(posts[index]);
    });

    app.patch("/posts/:id", (req, res) => {
        const posts = getPosts();
        const id = parseInt(req.params.id);
        const post = posts.find(p => p.id === id);
        if (!post) {
        return res.status(404).json({ error: "Post not found" });
        }
        // 只更新传进来的字段
        Object.assign(post, req.body);
        fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));
        res.json(post);
        });

        app.delete("/posts/:id", (req, res) => {
            const posts = getPosts();
            const id = parseInt(req.params.id);
            const index = posts.findIndex(p => p.id === id);
            if (index === -1) {
            return res.status(404).json({ error: "Post not found" });
            }
            const deletedPost = posts.splice(index, 1)[0];
            fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));
            res.json({
            message: "Post deleted successfully.",
            deleted: deletedPost
            });
            });

app.listen(PORT, () => {
console.log(`Lana’s Blog API is running at <http://localhost>:${PORT}`);
});