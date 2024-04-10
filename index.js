const express = require('express');
const app = express();

const port = 3000;

const uuid = require('uuid');

app.use(express.json());


app.listen(port, () => {
    console.log(`🖥 - Server started on port ${port}`);
});

const orders = [];

const checkId = (request, response, next) => {
    const { id } = request.params;
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ Error: "Order not found!"})
    }

    request.orderId = id;
    request.orderIndex = index;

    next();
};

const methodUrl = (request, response, next) => {
    const method = request.method;
    const url = request.url;

    console.log(`[${method}] - ${url}`);

    next();
}

app.get('/order', methodUrl, (request, response) => {
    return response.json(orders);
});

app.get('/order/:id', checkId, methodUrl, (request, response) => {
    const index = request.orderIndex;
    return response.json(orders[index]);
})

app.post('/order', methodUrl, (request, response) => {
    const { order, clientName, price } = request.body;
    const clientOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" };
    orders.push(clientOrder);
    return response.status(201).json(clientOrder);
});

app.put('/order/:id', checkId, methodUrl, (request, response) => {

    const { order, clientName, price } = request.body;
    const id = request.orderId;
    const index = request.orderIndex;
    const status = orders[index].status;

    const updateOrder = { id, order, clientName, price, status };

    orders[index] = updateOrder;

    return response.json(orders[index]);
});

app.patch('/order/:id', checkId, methodUrl, (request, response) => {
    const index = request.orderIndex;
    const { id, order, clientName, price } = orders[index];
    const { status } = { status: "Pronto" };

    const updateOrder = { id, order, clientName, price, status };

    orders[index] = updateOrder;

    return response.json(orders[index]);
});

app.delete('/order/:id', checkId, methodUrl, (request, response) => {
    const index = request.orderIndex;

    orders.splice(index, 1);

    return response.json(orders);

});