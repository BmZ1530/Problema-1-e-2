const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const CARDAPIO_FILE = path.join(__dirname, 'cardapio.json');
const PEDIDOS_FILE = path.join(__dirname, 'pedidos.json');

// Middleware
app.use(express.json());
app.use(express.static('../frontend')); // Serve arquivos do frontend

// Rota para cardápio (GET)
app.get('/cardapio', (req, res) => {
    try {
        const cardapio = JSON.parse(fs.readFileSync(CARDAPIO_FILE, 'utf8'));
        res.json(cardapio);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar cardápio' });
    }
});

// Rota para pedidos (POST)
app.post('/pedidos', (req, res) => {
    try {
        const pedidos = JSON.parse(fs.readFileSync(PEDIDOS_FILE, 'utf8') || '[]');
        pedidos.push(req.body);
        fs.writeFileSync(PEDIDOS_FILE, JSON.stringify(pedidos, null, 2));
        res.status(201).json({ message: 'Pedido salvo com sucesso