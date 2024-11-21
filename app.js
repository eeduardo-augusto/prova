const express = require('express');
const app = express();

app.use(express.json());

let users = [];
let products = [];
let nextUserId = 1;
let nextProductId = 1;

function validateUser(user) {
    const errors = [];
    if (!user.name || user.name.length < 3) errors.push("'Nome' deve conter no mínimo 3 caracteres");
    if (user.name && user.name.length > 150) errors.push("'Nome' deve conter no máximo 150 caracteres");
    if (!user.cpf || user.cpf.length !== 11 || isNaN(user.cpf)) errors.push("'Cpf' deve conter 11 caracteres e apenas números");
    if (!user.email || user.email.length < 3 || !user.email.includes('@') || !user.email.includes('.', user.email.indexOf('@')))
        errors.push("'Email' deve conter no mínimo 3 caracteres, '@' e '.' após o '@'");
    return errors;
}

function validateProduct(product) {
    const errors = [];
    if (!product.name || product.name.length < 3) errors.push("'Nome' deve conter no mínimo 3 caracteres");
    if (product.name && product.name.length > 100) errors.push("'Nome' deve conter no máximo 100 caracteres");
    if (!product.price || product.price <= 0) errors.push("'Preço deve ser maior que 0'");
    return errors;
}

app.get('/users', (req, res) => res.json(users));

app.post('/users', (req, res) => {
    const { name, cpf, email } = req.body;
    const errors = validateUser({ name, cpf, email });
    if (errors.length > 0) return res.status(400).json({ errors });

    const newUser = { id: nextUserId++, name, cpf, email };
    users.push(newUser);
    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
});

app.get('/users/:id', (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json(user);
});

app.put('/users/:id', (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const { name, cpf, email } = req.body;
    const errors = validateUser({ name, cpf, email });
    if (errors.length > 0) return res.status(400).json({ errors });

    Object.assign(user, { name, cpf, email });
    res.json({ message: "Usuário atualizado com sucesso" });
});

app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).json({ message: "Usuário não encontrado" });

    users.splice(userIndex, 1);
    res.json({ message: "Usuário removido com sucesso" });
});

app.get('/products', (req, res) => res.json(products));

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const errors = validateProduct({ name, price });
    if (errors.length > 0) return res.status(400).json({ errors });

    const newProduct = { id: nextProductId++, name, price };
    products.push(newProduct);
    res.status(201).json({ message: "Produto cadastrado com sucesso" });
});

app.get('/products/:id', (req, res) => {
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Produto não encontrado" });
    res.json(product);
});
 
app.put('/products/:id', (req, res) => {
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Produto não encontrado" });

    const { name, price } = req.body;
    const errors = validateProduct({ name, price });
    if (errors.length > 0) return res.status(400).json({ errors });

    Object.assign(product, { name, price });
    res.json({ message: "Produto atualizado com sucesso" });
});

app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex((p) => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: "Produto não encontrado" });

    products.splice(productIndex, 1);
    res.json({ message: "Produto removido com sucesso" });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
