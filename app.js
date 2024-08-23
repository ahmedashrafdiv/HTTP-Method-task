
// ! Create a simple Express.js App with todos endpoints for GET, POST,PUT,PATCH and DELETE

let fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json())

app.listen(3000,()=>{
    console.log("hello the app listen in 3000");
});

// get => home page
app.get("/",(req,res)=>{
    res.send(`<h1>Welcom to Home Page</h1>`)
})

// get => get all todos
app.get("/todos",(req,res)=>{ 
    let todos = JSON.parse(fs.readFileSync("./todos.json", "utf8")); 

    if(todos.length == 0){
        res.status(404).send("No Todos Found!");
        return
    }
    res.status(200).send(todos)
})

// get => get specific todos with ID params
app.get("/todos/:id",(req,res)=>{
    const { id } = req.params;
    let todos = JSON.parse(fs.readFileSync("./todos.json", "utf8")); 
    const findTodos = todos.find((t)=> t.id === id)

    if(todos.length == 0 || findTodos==undefined){
        res.status(404).send("No Todos Found!");
        return
    }

    res.send(findTodos)
})

// post => add One todos 
app.post("/todos",(req,res)=>{
    const newTodo = req.body; 
    let todos = JSON.parse(fs.readFileSync("./todos.json", "utf8")); 
    const findTodo = todos.find((t)=> t.id == newTodo.id)
    
    if(findTodo){
        res.status(400).send(`Todo already exists`)
        return
    }
    
    todos.push(newTodo)
    fs.writeFileSync("./todos.json", JSON.stringify(todos))
    res.status(201).send("created!!")
})

// put => update todos
app.put("/todos/:id",(req, res)=>{
    const { id } = req.params;
    const newTodo  = req.body;
    let todos = JSON.parse(fs.readFileSync("./todos.json", "utf8")); 
    const findTodo = todos.find((t)=> t.id == newTodo.id)

    if(todos.length == 0 || findTodo==undefined){
        res.status(400).send(" Todo Not Found!");
        return
    }

    todos[(todos.indexOf(findTodo))] = {id,...newTodo}
    fs.writeFileSync("./todos.json", JSON.stringify(todos))
    res.send("updated!!")
})

// patch => partially update todos
app.patch("/todos/:id", (req, res) => {
    const { id } = req.params;
    const {title} = req.body;
    let todos = JSON.parse(fs.readFileSync("./todos.json", "utf8")); 
    const findTodo = todos.find((t)=> t.id == id)

    if (findTodo === undefined) {
        res.status(404).send("Todo Not Found!");
        return;
    }

    todos[(todos.indexOf(findTodo))].title = title;
    fs.writeFileSync("./todos.json", JSON.stringify(todos))
    res.status(200).send("Todos partially updated!");
});

// delete => delete specific todos 
app.delete("/todos/:id",(req, res)=>{
    const { id } = req.params;
    let todos = JSON.parse(fs.readFileSync("./todos.json", "utf8")); 
    const findTodo = todos.find((t)=> t.id == id)

    if(todos.length == 0 || findTodo==undefined){
        res.status(400).send(" Todo Not Found!");
        return
    }

    todos.splice(todos.indexOf(findTodo),1)
    fs.writeFileSync("./todos.json", JSON.stringify(todos))
    res.status(200).send(" Todo is Deleted!!")
})

// delete => delete All todos 
app.delete("/todos/",(req, res)=>{
    let todos = JSON.parse(fs.readFileSync("./todos.json", "utf8")); 

    if(todos.length == 0){
        res.status(400).send(" Todos Not Found!");
        return
    }
    todos = []
    fs.writeFileSync("./todos.json", JSON.stringify(todos))
    res.send("Deleted!!")
})
