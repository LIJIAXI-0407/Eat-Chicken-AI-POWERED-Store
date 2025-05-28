document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.getAttribute('data-page');

    // ✅ 注册页面逻辑
    if (page === 'customer_register') {
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = form.name.value.trim();
            const phone = form.phone.value.trim();

            if (!name || !phone) {
                Swal.fire('请填写完整信息', '', 'warning');
                return;
            }

            fetch('/customer/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, phone })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('注册成功', '', 'success').then(() => {
                        window.location.href = '/customer/login';
                    });
                } else {
                    Swal.fire(data.message, '', 'error');
                }
            })
            .catch(() => {
                Swal.fire('请求失败', '', 'error');
            });
        });
    }

    // ✅ 扫码购物结账逻辑
    if (page === 'customer_cart') {
        document.getElementById("checkoutBtn").addEventListener("click", function () {
            const phone = document.getElementById("customerPhone").value.trim();
            if (!phone || cart.length === 0) {
                Swal.fire('请输入手机号并添加商品', '', 'warning');
                return;
            }

            console.log("结账按钮点击，手机号：", phone, "购物车：", cart);

            fetch('/customer/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, cart })
            })
            .then(res => res.json())
            .then(data => {
                console.log("后端返回：", data);
                if (data.success) {
                    Swal.fire(data.message, '', 'success').then(() => {
                        window.location.href = '/';
                    });
                } else {
                    Swal.fire(data.message || '结账失败', '', 'error');
                }
            })
            .catch(() => {
                Swal.fire('请求失败', '', 'error');
            });
        });
    }
});

let cart = [];
const cartTableBody = document.querySelector("#cartTable tbody");
const totalPriceElem = document.getElementById("totalPrice");
let lastScannedCode = null;
let scanCooldown = false;

function updateCartTable() {
    cartTableBody.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.name}</td><td>${item.price}</td><td>${item.quantity}</td><td>${subtotal.toFixed(2)}</td>`;
        cartTableBody.appendChild(tr);
    });
    totalPriceElem.textContent = total.toFixed(2);
}

document.getElementById("startScan").addEventListener('click', function () {
    Quagga.offDetected();

    Swal.fire('请将条形码放在摄像框中部，保持稳定并对准中线', '', 'info');

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner'),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            }
        },
        locator: {
            patchSize: "large",
            halfSample: false
        },
        numOfWorkers: 4,
        frequency: 10,
        decoder: {
            readers: [
                "ean_reader",
                "ean_8_reader",
                "code_128_reader",
                "upc_reader",
                "upc_e_reader"
            ],
            debug: {
                drawBoundingBox: true,
                showFrequency: true,
                drawScanline: true,
                showPattern: true
            }
        },
        locate: true
    }, function (err) {
        if (err) {
            console.error(err);
            Swal.fire("摄像头初始化失败", '', 'error');
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (result) {
        let code = result.codeResult.code;
        if (!code) return;

        code = String(code).replace(/\s+/g, '').replace(/[^\d]/g, '');

        if (scanCooldown || code === lastScannedCode) return;
        scanCooldown = true;
        lastScannedCode = code;

        Quagga.stop();
        document.querySelector('#scanner').innerHTML = "";

        fetch('/customer/api/add_to_cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ barcode: code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let prod = data.product;
                let existingItem = cart.find(item => item.barcode === prod.barcode);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ name: prod.name, price: prod.price, barcode: prod.barcode, quantity: 1 });
                }
                updateCartTable();
                Swal.fire(`${prod.name} 已加入购物车`, '', 'success');
            } else {
                Swal.fire(data.message || '未找到该商品', '', 'error');
            }
        })
        .catch(error => {
            console.error('请求错误：', error);
            Swal.fire('发生错误', '', 'error');
        });

        setTimeout(() => {
            scanCooldown = false;
        }, 2000);
    });
});