document.addEventListener("DOMContentLoaded", function() {
    const page = document.body.getAttribute('data-page');
    if (page === 'admin_add_product') {
        const form = document.getElementById('addProductForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                barcode: formData.get('barcode'),
                price: formData.get('price'),
                stock: formData.get('stock')
            };
            fetch('/admin/api/add_product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                Swal.fire(result.message, '', result.success ? 'success' : 'error');
                if (result.success) {
                    form.reset();
                }
            })
            .catch(error => {
                Swal.fire('发生错误', '', 'error');
            });
        });
    } else if (page === 'admin_products') {
        // 获取商品数据并填充表格
        fetch('/admin/api/products')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector("#productsTable tbody");
                tbody.innerHTML = "";
                data.products.forEach(product => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `<td>${product.id}</td><td>${product.name}</td><td>${product.barcode}</td><td>${product.price}</td><td>${product.stock}</td>`;
                    tbody.appendChild(tr);
                });
            } else {
                Swal.fire(data.message, '', 'error');
            }
        })
        .catch(error => {
            Swal.fire('发生错误', '', 'error');
        });
    } else if (page === 'admin_members') {
        // 获取会员数据并填充表格
        fetch('/admin/api/members')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector("#membersTable tbody");
                tbody.innerHTML = "";
                data.members.forEach(member => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `<td>${member.id}</td><td>${member.name}</td><td>${member.phone}</td><td>${member.points}</td>`;
                    tbody.appendChild(tr);
                });
            } else {
                Swal.fire(data.message, '', 'error');
            }
        })
        .catch(error => {
            Swal.fire('发生错误', '', 'error');
        });
    }
});
