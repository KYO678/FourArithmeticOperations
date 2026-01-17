// ゲームの状態を管理
let firstNumber = null;
let secondNumber = null;
let currentStep = 1; // 1: 最初の数選択, 2: 2番目の数選択

// 絵文字の種類（ランダムに選ばれる）
const emojis = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑', '🥝', '🍒'];
let selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];

// ステップを切り替える関数
function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// 数字を選択
function selectNumber(num) {
    playSound('select');

    if (currentStep === 1) {
        // 1つ目の数を選択
        firstNumber = num;
        document.getElementById('num1').textContent = num;

        // 質問テキストを変更
        document.getElementById('questionText').textContent = '2つめの かずを えらんでね！';

        currentStep = 2;
    } else if (currentStep === 2) {
        // 2つ目の数を選択
        secondNumber = num;
        document.getElementById('num2').textContent = num;

        // 視覚的に表示
        setTimeout(() => {
            displayVisual();
            showStep(2);
        }, 300);
    }
}

// 視覚的に数を表示（10のフレームで）
function displayVisual() {
    // ラベルを設定
    document.getElementById('label1').textContent = firstNumber;
    document.getElementById('label2').textContent = secondNumber;

    // 1つ目の数を表示
    createTenFrames('frames1', firstNumber);

    // 2つ目の数を表示
    createTenFrames('frames2', secondNumber);
}

// 10のフレームを作成する関数
function createTenFrames(containerId, number) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // 10のかたまりの数と余り
    const tens = Math.floor(number / 10);
    const ones = number % 10;

    let itemIndex = 0;

    // 10のかたまりを作成
    for (let i = 0; i < tens; i++) {
        const frame = document.createElement('div');
        frame.className = 'ten-frame';

        for (let j = 0; j < 10; j++) {
            const item = document.createElement('div');
            item.className = 'frame-item';
            item.textContent = selectedEmoji;
            item.style.animationDelay = `${itemIndex * 0.05}s`;
            frame.appendChild(item);
            itemIndex++;
        }

        container.appendChild(frame);
    }

    // 余りの数（10未満）を作成
    if (ones > 0) {
        const frame = document.createElement('div');
        frame.className = 'ten-frame partial';

        // 絵文字を配置
        for (let j = 0; j < ones; j++) {
            const item = document.createElement('div');
            item.className = 'frame-item';
            item.textContent = selectedEmoji;
            item.style.animationDelay = `${itemIndex * 0.05}s`;
            frame.appendChild(item);
            itemIndex++;
        }

        // 空のマスを追加（10個になるまで）
        for (let j = ones; j < 10; j++) {
            const item = document.createElement('div');
            item.className = 'frame-item empty';
            frame.appendChild(item);
        }

        container.appendChild(frame);
    }
}

// 計算結果を表示
function calculateResult() {
    const result = firstNumber + secondNumber;

    // 式の結果部分を更新
    document.getElementById('result').textContent = result;
    document.getElementById('result').classList.add('revealed');

    // 大きな答えを表示
    document.getElementById('bigAnswer').textContent = result;

    // 結果を10のフレームで表示
    createTenFrames('resultFrames', result);

    // 成功のサウンド
    playSound('success');

    // 結果画面へ
    setTimeout(() => {
        showStep(3);
    }, 500);
}

// ゲームをリセット
function resetGame() {
    firstNumber = null;
    secondNumber = null;
    currentStep = 1;

    // 式をリセット
    document.getElementById('num1').textContent = '?';
    document.getElementById('num2').textContent = '?';
    document.getElementById('result').textContent = '?';
    document.getElementById('result').classList.remove('revealed');

    // 質問テキストをリセット
    document.getElementById('questionText').textContent = '1つめの かずを えらんでね！';

    // 新しい絵文字を選択
    selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // 最初のステップに戻る
    showStep(1);
}

// サウンド効果（簡易版）
function playSound(type) {
    // Web Audio APIを使った簡単な音
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'select') {
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (type === 'success') {
            // 成功の音（ド→ミ→ソ）
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, index) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();

                osc.connect(gain);
                gain.connect(audioContext.destination);

                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);

                osc.start(audioContext.currentTime + index * 0.15);
                osc.stop(audioContext.currentTime + index * 0.15 + 0.3);
            });
        }
    } catch (e) {
        // サウンドが再生できない場合は無視
        console.log('Audio not supported');
    }
}

// ページ読み込み時の初期化
window.addEventListener('load', () => {
    console.log('たのしい たしざん アプリが起動しました！');
    showStep(1);
});
