// ゲームの状態を管理
let firstNumber = 0;
let secondNumber = 0;

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

// 最初の数を選択
function selectFirstNumber(num) {
    firstNumber = num;
    console.log('1つめの数:', firstNumber);

    // ボタンをクリックしたときのフィードバック
    playSound('select');

    // 次のステップへ
    setTimeout(() => {
        showStep(2);
    }, 300);
}

// 2番目の数を選択
function selectSecondNumber(num) {
    secondNumber = num;
    console.log('2つめの数:', secondNumber);

    // ボタンをクリックしたときのフィードバック
    playSound('select');

    // 視覚的に表示
    setTimeout(() => {
        displayVisual();
        showStep(3);
    }, 300);
}

// 視覚的に数を表示
function displayVisual() {
    // ラベルを設定
    document.getElementById('label1').textContent = firstNumber;
    document.getElementById('label2').textContent = secondNumber;

    // オブジェクトを表示
    const objects1 = document.getElementById('objects1');
    const objects2 = document.getElementById('objects2');

    objects1.innerHTML = '';
    objects2.innerHTML = '';

    // 1つ目のグループ
    for (let i = 0; i < firstNumber; i++) {
        const obj = document.createElement('div');
        obj.className = 'object';
        obj.textContent = selectedEmoji;
        obj.style.animationDelay = `${i * 0.1}s`;
        objects1.appendChild(obj);
    }

    // 2つ目のグループ
    for (let i = 0; i < secondNumber; i++) {
        const obj = document.createElement('div');
        obj.className = 'object';
        obj.textContent = selectedEmoji;
        obj.style.animationDelay = `${i * 0.1}s`;
        objects2.appendChild(obj);
    }
}

// 計算結果を表示
function calculateResult() {
    const result = firstNumber + secondNumber;

    // 式を表示
    document.getElementById('equation').textContent =
        `${firstNumber} + ${secondNumber} =`;

    // 答えを表示
    document.getElementById('bigAnswer').textContent = result;

    // 全てのオブジェクトを表示
    const allObjects = document.getElementById('allObjects');
    allObjects.innerHTML = '';

    for (let i = 0; i < result; i++) {
        const obj = document.createElement('div');
        obj.className = 'object';
        obj.textContent = selectedEmoji;
        obj.style.animationDelay = `${i * 0.05}s`;
        allObjects.appendChild(obj);
    }

    // 成功のサウンド
    playSound('success');

    // 結果画面へ
    setTimeout(() => {
        showStep(4);
    }, 500);
}

// ゲームをリセット
function resetGame() {
    firstNumber = 0;
    secondNumber = 0;

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
