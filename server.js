const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

const getPosts = () => JSON.parse(fs.readFileSync("./data/posts.json", "utf-8"));

app.use(express.json());

app.get("/posts", (req, res) => {
const posts = getPosts();
res.json(posts);
});

app.get("/posts/:id", (req, res) => {
const posts = getPosts();
const post = posts.find(p => p.id === parseInt(req.params.id));
if (post) {
res.json(post);
} else {
res.status(404).json({ error: "Post not found" });
}
});

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
    createdAt: posts[index].createdAt 
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
