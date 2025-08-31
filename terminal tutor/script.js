// Terminal Quest Game Logic

const gameModes = {
    quiz: 'Command Quiz',
    puzzle: 'Command Puzzles',
    server: 'Server Room',
    file: 'File Management Room'
};

let currentMode = null;
let score = 0;
let level = 1;
let achievements = [];

const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const achievementsDisplay = document.getElementById('achievements');

function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `Score: ${score}`;
    checkLevelUp();
}

function checkLevelUp() {
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel > level) {
        level = newLevel;
        levelDisplay.textContent = `Level: ${level}`;
        unlockAchievement(`Level ${level} reached!`);
    }
}

function unlockAchievement(name) {
    if (!achievements.includes(name)) {
        achievements.push(name);
        achievementsDisplay.textContent = `Achievements: ${achievements.join(', ')}`;
        saveProgress();
    }
}

function saveProgress() {
    localStorage.setItem('terminalQuestProgress', JSON.stringify({ score, level, achievements }));
}

function loadProgress() {
    const data = localStorage.getItem('terminalQuestProgress');
    if (data) {
        const { score: s, level: l, achievements: a } = JSON.parse(data);
        score = s;
        level = l;
        achievements = a;
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
        achievementsDisplay.textContent = `Achievements: ${achievements.join(', ')}`;
    }
}

function showMode(mode) {
    currentMode = mode;
    let html = `<h2>${gameModes[mode]}</h2><div id="mode-content"></div>`;
    gameContainer.innerHTML = html;
    const modeContent = document.getElementById('mode-content');

    if (mode === 'quiz') {
        // Command Quiz: 15 unique, professional multiple-choice questions
        const allQuestions = [
            {q:'Which command lists files in a directory?',options:['ls','cd','rm','cat'],answer:0},
            {q:'Which command displays the contents of a file?',options:['mv','cat','touch','pwd'],answer:1},
            {q:'Which command removes a file?',options:['rm','cp','mkdir','echo'],answer:0},
            {q:'Which command prints the current working directory?',options:['pwd','ls','cd','echo'],answer:0},
            {q:'Which command creates a new directory?',options:['mkdir','rmdir','touch','ls'],answer:0},
            {q:'Which command moves files?',options:['mv','cp','rm','cat'],answer:0},
            {q:'Which command copies files?',options:['cp','mv','rm','cat'],answer:0},
            {q:'Which command shows running processes?',options:['ps','ls','top','cat'],answer:0},
            {q:'Which command changes file permissions?',options:['chmod','chown','ls','cat'],answer:0},
            {q:'Which command displays disk usage?',options:['df','du','ls','cat'],answer:0},
            {q:'Which command searches for text in files?',options:['grep','find','cat','ls'],answer:0},
            {q:'Which command downloads files from the internet?',options:['wget','curl','ls','cat'],answer:0},
            {q:'Which command shows system memory usage?',options:['free','top','ps','ls'],answer:0},
            {q:'Which command displays the manual page for a command?',options:['man','help','info','cat'],answer:0},
            {q:'Which command displays the first lines of a file?',options:['head','tail','cat','ls'],answer:0},
            {q:'Which command displays the last lines of a file?',options:['tail','head','cat','ls'],answer:0},
            {q:'Which command finds files by name?',options:['find','grep','ls','cat'],answer:0},
            {q:'Which command shows network interfaces?',options:['ifconfig','ip','ls','cat'],answer:0},
            {q:'Which command compresses files?',options:['tar','zip','ls','cat'],answer:0},
            {q:'Which command extracts .tar.gz files?',options:['tar','gzip','ls','cat'],answer:0}
        ];
        // Track used questions for session
        let usedQuizIndexes = JSON.parse(localStorage.getItem('usedQuizIndexes')||'[]');
        let availableIndexes = allQuestions.map((_,i)=>i).filter(i=>!usedQuizIndexes.includes(i));
        if(availableIndexes.length<15){usedQuizIndexes=[];availableIndexes=allQuestions.map((_,i)=>i);}
        // Shuffle and pick 15
        availableIndexes = availableIndexes.sort(()=>Math.random()-0.5).slice(0,15);
        localStorage.setItem('usedQuizIndexes',JSON.stringify(usedQuizIndexes.concat(availableIndexes)));
        let questions = availableIndexes.map(i=>allQuestions[i]);
        let currentQ = 0;
        let correctCount = 0;
        function renderQuiz() {
            if (currentQ >= questions.length) {
                let appreciation = correctCount>=13?'Linux Legend!':correctCount>=10?'Command Pro!':'Keep Practicing!';
                modeContent.innerHTML = `<div class='score-board'><h3>Quiz Complete!</h3><p>Score: ${score}</p><p>Correct: ${correctCount}/15</p><p class='appreciate'>${appreciation}</p></div>`;
                unlockAchievement('Quiz Master');
                modeContent.classList.add('animate-score');
                setTimeout(()=>modeContent.classList.remove('animate-score'),1200);
                return;
            }
            const q = questions[currentQ];
            modeContent.innerHTML = `<div class='question-format'><div class='q-num'>Q${currentQ+1}/15</div><p class='q-text'>${q.q}</p><div class='q-options'>`+
                q.options.map((opt,i)=>`<button class='quiz-opt' data-i='${i}'>${opt}</button>`).join('')+`</div></div><div id='feedback'></div>`;
            Array.from(document.getElementsByClassName('quiz-opt')).forEach(btn=>{
                btn.onclick=function(){
                    let feedback = document.getElementById('feedback');
                    if(parseInt(btn.dataset.i)===q.answer){
                        updateScore(20);
                        correctCount++;
                        feedback.innerHTML = '<span class="right-ans">Correct!</span>';
                        feedback.classList.add('animate-correct');
                    }else{
                        feedback.innerHTML = `<span class='wrong-ans'>Wrong! Correct: <b>${q.options[q.answer]}</b></span>`;
                        feedback.classList.add('animate-wrong');
                    }
                    setTimeout(()=>{
                        feedback.classList.remove('animate-correct','animate-wrong');
                        currentQ++;renderQuiz();
                    },1200);
                };
            });
        }
        renderQuiz();
    }
    else if (mode === 'puzzle') {
        // Command Hacker: Simulated terminal output, fix the command
        const allHackerPuzzles = [
            {broken:'$ _s documents',fragments:['c','d'],answer:'cd documents',hint:'Change directory to documents'},
            {broken:'$ m_ir new_folder',fragments:['k','d'],answer:'mkdir new_folder',hint:'Create a new folder'},
            {broken:'$ r_ file.txt',fragments:['m'],answer:'rm file.txt',hint:'Remove a file'},
            {broken:'$ _p file1.txt file2.txt',fragments:['c'],answer:'cp file1.txt file2.txt',hint:'Copy files'},
            {broken:'$ _v file.txt docs/',fragments:['m'],answer:'mv file.txt docs/',hint:'Move file to folder'},
            {broken:'$ c_t notes.txt',fragments:['a'],answer:'cat notes.txt',hint:'Show file contents'},
            {broken:'$ p_d',fragments:['w'],answer:'pwd',hint:'Print working directory'},
            {broken:'$ p_ aux',fragments:['s'],answer:'ps aux',hint:'Show running processes'},
            {broken:'$ d_ -h',fragments:['f'],answer:'df -h',hint:'Show disk usage'},
            {broken:'$ g_ep pattern file.txt',fragments:['r'],answer:'grep pattern file.txt',hint:'Search text in file'},
            {broken:'$ m_n command',fragments:['a'],answer:'man command',hint:'Show manual page'},
            {broken:'$ t_r -czvf backup.tar.gz folder/',fragments:['a'],answer:'tar -czvf backup.tar.gz folder/',hint:'Compress folder'},
            {broken:'$ i_config',fragments:['f'],answer:'ifconfig',hint:'Show network interfaces'},
            {broken:'$ c_mod 755 script.sh',fragments:['h'],answer:'chmod 755 script.sh',hint:'Change file permissions'},
            {broken:'$ fr_e -m',fragments:['e'],answer:'free -m',hint:'Show system memory usage'}
        ];
        let usedHackerIndexes = JSON.parse(localStorage.getItem('usedHackerIndexes')||'[]');
        let availableIndexes = allHackerPuzzles.map((_,i)=>i).filter(i=>!usedHackerIndexes.includes(i));
        if(availableIndexes.length<15){usedHackerIndexes=[];availableIndexes=allHackerPuzzles.map((_,i)=>i);}
        availableIndexes = availableIndexes.sort(()=>Math.random()-0.5).slice(0,15);
        localStorage.setItem('usedHackerIndexes',JSON.stringify(usedHackerIndexes.concat(availableIndexes)));
        let puzzles = availableIndexes.map(i=>allHackerPuzzles[i]);
        let currentP = 0;
        let correctCount = 0;
        function renderHackerPuzzle() {
            if (currentP >= puzzles.length) {
                let appreciation = correctCount>=13?'Command Hacker Legend!':correctCount>=10?'Command Hacker Pro!':'Keep Practicing!';
                modeContent.innerHTML = `<div class='score-board'><h3>Command Hacker Complete!</h3><p>Score: ${score}</p><p>Correct: ${correctCount}/15</p><p class='appreciate'>${appreciation}</p></div>`;
                unlockAchievement('Command Hacker Pro');
                modeContent.classList.add('animate-score');
                setTimeout(()=>modeContent.classList.remove('animate-score'),1200);
                return;
            }
            const p = puzzles[currentP];
            modeContent.innerHTML = `<div class='question-format'><div class='q-num'>Hack ${currentP+1}/15</div><div class='terminal-output'><pre>${p.broken}</pre></div><div class='fragments'>${p.fragments.map((frag,i)=>`<button class='frag-btn' data-i='${i}'>${frag}</button>`).join('')}</div><input id='hackerInput' placeholder='Fix the command...' size='30'><button id='submitHacker'>Submit</button><div class='hint'>Hint: ${p.hint}</div></div><div id='feedback'></div>`;
            document.getElementById('submitHacker').onclick = function() {
                const val = document.getElementById('hackerInput').value.trim();
                let feedback = document.getElementById('feedback');
                if(val.toLowerCase()===p.answer){
                    updateScore(25);
                    correctCount++;
                    feedback.innerHTML = '<span class="right-ans">Hack Successful!</span>';
                    feedback.classList.add('animate-correct');
                    modeContent.classList.add('hack-anim');
                }else{
                    feedback.innerHTML = `<span class='wrong-ans'>Hack Failed! Correct: <b>${p.answer}</b></span>`;
                    feedback.classList.add('animate-wrong');
                }
                setTimeout(()=>{
                    feedback.classList.remove('animate-correct','animate-wrong');
                    modeContent.classList.remove('hack-anim');
                    currentP++;renderHackerPuzzle();
                },1200);
            };
            Array.from(document.getElementsByClassName('frag-btn')).forEach(btn=>{
                btn.onclick=function(){
                    let input = document.getElementById('hackerInput');
                    input.value += btn.textContent;
                    btn.disabled = true;
                };
            });
        }
        renderHackerPuzzle();
    }
    else if (mode === 'server') {
        // Server Room: 15 unique troubleshooting scenarios
        const allScenarios = [
            {desc:'The web server is down. Which command would you use to check if nginx is running?',options:['ps aux | grep nginx','ls /var/www','cat /etc/nginx/nginx.conf','touch index.html'],answer:0},
            {desc:'Disk space is low. Which command shows disk usage?',options:['df -h','du -a','lsblk','free -m'],answer:0},
            {desc:'You need to restart the network service. Which command?',options:['systemctl restart networking','ifconfig','ping 8.8.8.8','ls /etc/network'],answer:0},
            {desc:'Check memory usage on the server.',options:['free -m','df -h','top','ls /proc'],answer:0},
            {desc:'Find which process is using port 80.',options:['lsof -i :80','ps aux','netstat','ls /var/www'],answer:0},
            {desc:'View the last 10 lines of syslog.',options:['tail /var/log/syslog','head /var/log/syslog','cat /var/log/syslog','ls /var/log'],answer:0},
            {desc:'Change ownership of /var/www to user www-data.',options:['chown www-data /var/www','chmod 755 /var/www','ls -l /var/www','cat /etc/passwd'],answer:0},
            {desc:'Check active network connections.',options:['netstat -tuln','ifconfig','ping google.com','ls /etc/network'],answer:0},
            {desc:'Archive /home/user to backup.tar.gz.',options:['tar -czvf backup.tar.gz /home/user','zip backup.zip /home/user','cp /home/user backup/','mv /home/user backup/'],answer:0},
            {desc:'Find all .conf files in /etc.',options:['find /etc -name "*.conf"','ls /etc/*.conf','cat /etc/conf','grep conf /etc'],answer:0},
            {desc:'Show running services.',options:['systemctl list-units --type=service','ps aux','ls /etc/init.d','cat /etc/services'],answer:0},
            {desc:'Check CPU info.',options:['cat /proc/cpuinfo','top','free -m','ls /proc'],answer:0},
            {desc:'Show disk partitions.',options:['lsblk','df -h','du -a','ls /dev'],answer:0},
            {desc:'Show all users on the system.',options:['cat /etc/passwd','whoami','ls /home','id'],answer:0},
            {desc:'Show system uptime.',options:['uptime','top','free -m','ls /proc'],answer:0}
        ];
        let usedServerIndexes = JSON.parse(localStorage.getItem('usedServerIndexes')||'[]');
        let availableIndexes = allScenarios.map((_,i)=>i).filter(i=>!usedServerIndexes.includes(i));
        if(availableIndexes.length<15){usedServerIndexes=[];availableIndexes=allScenarios.map((_,i)=>i);}
        availableIndexes = availableIndexes.sort(()=>Math.random()-0.5).slice(0,15);
        localStorage.setItem('usedServerIndexes',JSON.stringify(usedServerIndexes.concat(availableIndexes)));
        let scenarios = availableIndexes.map(i=>allScenarios[i]);
        let currentS = 0;
        let correctCount = 0;
        function renderServer() {
            if (currentS >= scenarios.length) {
                let appreciation = correctCount>=13?'Server Legend!':correctCount>=10?'Server Pro!':'Keep Practicing!';
                modeContent.innerHTML = `<div class='score-board'><h3>Server Room Complete!</h3><p>Score: ${score}</p><p>Correct: ${correctCount}/15</p><p class='appreciate'>${appreciation}</p></div>`;
                unlockAchievement('Server Specialist');
                modeContent.classList.add('animate-score');
                setTimeout(()=>modeContent.classList.remove('animate-score'),1200);
                return;
            }
            const s = scenarios[currentS];
            modeContent.innerHTML = `<div class='question-format'><div class='q-num'>Q${currentS+1}/15</div><p class='q-text'>${s.desc}</p><div class='q-options'>`+
                s.options.map((opt,i)=>`<button class='server-opt' data-i='${i}'>${opt}</button>`).join('')+`</div></div><div id='feedback'></div>`;
            Array.from(document.getElementsByClassName('server-opt')).forEach(btn=>{
                btn.onclick=function(){
                    let feedback = document.getElementById('feedback');
                    if(parseInt(btn.dataset.i)===s.answer){
                        updateScore(30);
                        correctCount++;
                        feedback.innerHTML = '<span class="right-ans">Correct!</span>';
                        feedback.classList.add('animate-correct');
                    }else{
                        feedback.innerHTML = `<span class='wrong-ans'>Wrong! Correct: <b>${s.options[s.answer]}</b></span>`;
                        feedback.classList.add('animate-wrong');
                    }
                    setTimeout(()=>{
                        feedback.classList.remove('animate-correct','animate-wrong');
                        currentS++;renderServer();
                    },1200);
                };
            });
        }
        renderServer();
    }
    else if (mode === 'file') {
        // File Management Room: 15 unique file organization challenges
        const allFileSets = [
            {files:['report.txt','data.csv','notes.md'],folders:['docs','backup']},
            {files:['image.png','resume.pdf','slides.ppt'],folders:['images','docs']},
            {files:['project.zip','code.py','readme.md'],folders:['archive','src']},
            {files:['log.txt','error.log','output.txt'],folders:['logs','output']},
            {files:['music.mp3','video.mp4','photo.jpg'],folders:['media','backup']},
            {files:['config.json','settings.ini','env.sh'],folders:['config','scripts']},
            {files:['draft.docx','final.docx','notes.txt'],folders:['drafts','finals']},
            {files:['app.js','index.html','style.css'],folders:['js','html','css']},
            {files:['backup.tar.gz','database.db','dump.sql'],folders:['backup','db']},
            {files:['main.c','main.h','Makefile'],folders:['src','build']},
            {files:['invoice.pdf','receipt.pdf','statement.pdf'],folders:['invoices','receipts']},
            {files:['photo1.jpg','photo2.jpg','photo3.jpg'],folders:['photos','backup']},
            {files:['test.py','test.log','test.out'],folders:['tests','logs']},
            {files:['book.pdf','notes.txt','summary.docx'],folders:['books','notes']},
            {files:['presentation.ppt','handout.pdf','agenda.docx'],folders:['presentations','handouts']}
        ];
        let usedFileIndexes = JSON.parse(localStorage.getItem('usedFileIndexes')||'[]');
        let availableIndexes = allFileSets.map((_,i)=>i).filter(i=>!usedFileIndexes.includes(i));
        if(availableIndexes.length<1){usedFileIndexes=[];availableIndexes=allFileSets.map((_,i)=>i);}
        availableIndexes = availableIndexes.sort(()=>Math.random()-0.5).slice(0,1);
        localStorage.setItem('usedFileIndexes',JSON.stringify(usedFileIndexes.concat(availableIndexes)));
        let set = allFileSets[availableIndexes[0]];
        let files = [...set.files];
        let folders = [...set.folders];
        let correctCount = 0;
        modeContent.innerHTML = `<div class='question-format'><div class='q-num'>File Room</div><p class='q-text'>Organize files into folders using Linux commands.<br>Use <b>mv filename folder/</b></p>
        <div id="file-list">${files.map(f=>`<span class='file'>${f}</span>`).join(' ')}</div>
        <div id="folder-list">${folders.map(f=>`<span class='folder'>${f}</span>`).join(' ')}</div>
        <input id="fileCmd" placeholder="e.g. mv report.txt docs/" size="25">
        <button id="runFileCmd">Run</button>
        <div id="fileMsg"></div></div>`;
        document.getElementById('runFileCmd').onclick = function() {
            const cmd = document.getElementById('fileCmd').value.trim();
            const mvMatch = cmd.match(/^mv\s+(\S+)\s+(\S+\/?)$/);
            let msg = document.getElementById('fileMsg');
            if (mvMatch) {
                const file = mvMatch[1];
                const folder = mvMatch[2].replace('/', '');
                if (files.includes(file) && folders.includes(folder)) {
                    files = files.filter(f => f !== file);
                    document.getElementById('file-list').innerHTML = files.map(f => `<span class='file'>${f}</span>`).join(' ');
                    msg.innerHTML = `<span class='right-ans'>Moved ${file} to ${folder}/</span>`;
                    msg.classList.add('animate-correct');
                    updateScore(15);
                    correctCount++;
                    if (files.length === 0) {
                        unlockAchievement('File Organizer');
                        msg.innerHTML += `<br>All files organized!`;
                        modeContent.classList.add('animate-score');
                        setTimeout(()=>modeContent.classList.remove('animate-score'),1200);
                        modeContent.innerHTML += `<div class='score-board'><h3>File Room Complete!</h3><p>Score: ${score}</p><p>Correct: ${correctCount}/${set.files.length}</p><p class='appreciate'>${correctCount===set.files.length?'File Legend!':correctCount>=2?'File Pro!':'Keep Practicing!'}</p></div>`;
                    }
                } else {
                    msg.innerHTML = `<span class='wrong-ans'>Wrong! Correct format: mv [file] [folder]/</span>`;
                    msg.classList.add('animate-wrong');
                }
            } else {
                msg.innerHTML = `<span class='wrong-ans'>Invalid command format. Example: mv report.txt docs/</span>`;
                msg.classList.add('animate-wrong');
            }
            setTimeout(()=>msg.classList.remove('animate-correct','animate-wrong'),1200);
        };
    }
}

document.getElementById('mode-quiz').onclick = () => showMode('quiz');
document.getElementById('mode-puzzle').onclick = () => showMode('puzzle');
document.getElementById('mode-server').onclick = () => showMode('server');
document.getElementById('mode-file').onclick = () => showMode('file');

window.onload = loadProgress;
