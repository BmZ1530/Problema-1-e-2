// Dados do cardápio (carregados do backend ou hardcoded para simplicidade; em produção, fetch do backend)
let cardapio = [];
let carrinho = [];

// Elementos DOM
const buscaInput = document.getElementById('busca');
const filtroSelect = document.getElementById('filtro-categoria');
const limparBtn = document.getElementById('limpar-filtros');
const cardapioSection = document.getElementById('cardapio');
const carrinhoSection = document.getElementById('carrinho');
const itensCarrinho = document.getElementById('itens-carrinho');
const totalDiv = document.getElementById('total');
const enviarBtn = document.getElementById('enviar-pedido');
const formularioSection = document.getElementById('formulario-pedido');
const formPedido = document.getElementById('form-pedido');
const mensagemDiv = document.getElementById('mensagem');
const mensagemSucesso = document.getElementById('mensagem-sucesso');

// Carregar cardápio do backend (ou usar dados locais se offline)
async function carregarCardapio() {
    try {
        const response = await fetch('http://localhost:3000/cardapio');
        cardapio = await response.json();
    } catch (error) {
        // Fallback para dados locais se backend não estiver rodando
        cardapio = [
            { id: 1, nome: 'X-Burger', categoria: 'lanches', preco: 15.00 },
            { id: 2, nome: 'X-Tudo', categoria: 'lanches', preco: 20.00 },
            { id: 3, nome: 'Coca-Cola', categoria: 'bebidas', preco: 5.00 },
            { id: 4, nome: 'Água', categoria: 'bebidas', preco: 3.00 },
            { id: 5, nome 'Bolo de Chocolate', categoria: 'doces', preco: 8.00 },
            { id: 6, nome: 'Sorvete', categoria: 'doces', preco: 6.00 }
        ];
        console.warn('Usando dados locais (backend não disponível)');
    }
    exibirCardapio();
}

// Exibir cardápio filtrado
function exibirCardapio(filtro = {}) {
    cardapioSection.innerHTML = '';
    let itensFiltrados = cardapio.filter(item => {
        const matchesBusca = !filtro.busca || item.nome.toLowerCase().includes(filtro.busca.toLowerCase());
        const matchesCategoria = !filtro.categoria || item.categoria === filtro.categoria;
        return matchesBusca && matchesCategoria;
    });

    // Agrupar por categoria se não houver filtro específico
    if (!filtro.categoria && !filtro.busca) {
        const categorias = ['lanches', 'bebidas', 'doces'];
        categorias.forEach(cat => {
            const itensCat = itensFiltrados.filter(item => item.categoria === cat);
            if (itensCat.length > 0) {
                const catHeader = document.createElement('h2');
                catHeader.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                cardapioSection.appendChild(catHeader);
                itensCat.forEach(item => criarItemElement(item));
            }
        });
    } else {
        itensFiltrados.forEach(item => criarItemElement(item));
    }
}

// Criar elemento de item
function criarItemElement(item) {
    const div = document.createElement('article');
    div.className = 'item';
    div.innerHTML = `
        <h3>${item.nome}</h3>
        <p>Categoria: ${item.categoria}</p>
        <p class="preco">Preço: R$ ${item.preco.toFixed(2)}</p>
        <button onclick="adicionarAoCarrinho(${item.id})">Adicionar</button>
    `;
    cardapioSection.appendChild(div);
}

// Adicionar ao carrinho
function adicionarAoCarrinho(id) {
    const item = cardapio.find(i => i.id === id);
    if (item) {
        const noCarrinho = carrinho.find(c => c.id === id);
        if (noCarrinho) {
            noCarrinho.quantidade += 1;
        } else {
            carrinho.push({ ...item, quantidade: 1 });
        }
        atualizarCarrinho();
        mostrarMensagem('Item adicionado ao carrinho!', 'sucesso');
    }
}

// Atualizar exibição do carrinho
function atualizarCarrinho() {
    itensCarrinho.innerHTML = '';
    let total = 0;
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.nome} (x${item.quantidade}) - Subtotal: R$ ${subtotal.toFixed(2)}
            <button onclick="removerDoCarrinho(${item.id})">Remover</button>
        `;
        itensCarrinho.appendChild(li);
    });
    totalDiv.textContent = `Total: R$ ${total.toFixed(2)}`;
    if (carrinho.length > 0) {
        carrinhoSection.style.display = 'block';
    }
}

// Remover do carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(c => c.id !== id);
    atualizarCarrinho();
    if (carrinho.length === 0) {
        carrinhoSection.style.display = 'none';
    }
}

// Mostrar mensagem
function mostrarMensagem(texto, tipo) {
    const msg = tipo === 'sucesso' ? mensagemSucesso : mensagemDiv;
    msg.textContent = texto;
    msg.className = `mensagem ${tipo}`;
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

// Event listeners
buscaInput.addEventListener('input', () => {
    exibirCardapio({ busca: buscaInput.value, categoria: filtroSelect.value });
});
filtroSelect.addEventListener('change', () => {
    exibirCardapio({ busca: buscaInput.value, categoria: filtroSelect.value });
});
limparBtn.addEventListener('click', () => {
    buscaInput.value = '';
    filtroSelect.value = '';
    exibirCardapio();
});
enviarBtn.addEventListener('click', () => {
    if (carrinho.length > 0) {
        formularioSection.style.display = 'block';
    } else {
        mostrarMensagem('Carrinho vazio!', 'erro');
    }
});
formPedido.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nomeCliente = document.getElementById('nome-cliente').value;
    const observacoes = document.getElementById('observacoes').value;
    const pedido = {
        id: Date.now(), // ID simples
        nomeCliente,
        observacoes,
        itens: carrinho,
        total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
        data: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:3000/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        if (response.ok) {
            mostrarMensagem('Pedido enviado com sucesso!', 'sucesso');
            carrinho = [];
            atualizarCarrinho();
            formularioSection.style.display = 'none';
            formPedido.reset();
        } else {
            throw new Error('Erro no envio');
        }
    } catch (error) {
        mostrarMensagem('Erro ao enviar pedido. Verifique se o backend está rodando.', 'erro');
    }
});

// Inicializar
carregarCardapio();