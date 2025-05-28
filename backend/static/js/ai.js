const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');

let lastDetections = {};
let isDetecting = false;

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        await new Promise(resolve => {
            video.onloadedmetadata = () => {
                resolve();
            };
        });

        video.play();
        requestAnimationFrame(detectLoop);
    } catch (err) {
        console.error('摄像头打开失败', err);
        resultDiv.innerHTML = '❌ 摄像头无法访问，请检查权限';
    }
}

async function detectLoop() {
    if (!isDetecting) {
        isDetecting = true;
        await detect();
        isDetecting = false;
    }
    requestAnimationFrame(detectLoop);
}

async function detect() {
    if (video.readyState !== 4) {
        return; // 视频还没准备好
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = video.videoWidth;
    offscreen.height = video.videoHeight;
    const ctx2 = offscreen.getContext('2d');
    ctx2.drawImage(video, 0, 0, offscreen.width, offscreen.height);

    const blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/jpeg'));

    if (!blob) {
        console.error('截图为空');
        return;
    }

    const formData = new FormData();
    formData.append('image', blob);

    try {
        const response = await fetch('/customer/detect', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`服务器返回错误状态: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.detections) {
            drawDetections(data.detections);
        } else {
            resultDiv.innerHTML = '❗未识别到人物';
        }
    } catch (err) {
        console.error('检测请求失败:', err);
        resultDiv.innerHTML = '❌ 检测失败，请检查网络或服务器';
    }
}

function drawDetections(detections) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    let resultsText = '';

    detections.forEach(det => {
        const { x, y, width, height, gender, id } = det;

        if (!(id in lastDetections)) {
            lastDetections[id] = now;
        }
        const stayTime = Math.floor((now - lastDetections[id]) / 1000);

        ctx.strokeStyle = gender === '男' ? 'blue' : (gender === '女' ? 'pink' : 'gray');
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = '16px Arial';
        ctx.fillText(`${gender} (${stayTime}s)`, x, y - 5);

        resultsText += `ID ${id}: ${gender}，已停留 ${stayTime} 秒<br>`;
    });

    resultDiv.innerHTML = resultsText || '等待识别...';
}

// 启动
setupCamera();
