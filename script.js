let move_speed = 3, grativy = 0.5;
let larry = document.querySelector('.larry');
let img = document.getElementById('larry-1');
let sound_point = new Audio('point.mp3');
let sound_die = new Audio('die.mp3');

let larry_props = larry.getBoundingClientRect();
let seabackground = document.querySelector('.seabackground').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

let larry_dy = 0; // jump force

// ✅ Movement controls (ArrowUp / Space)
document.addEventListener('keydown', (e) => {
    if ((e.key == 'ArrowUp' || e.key == ' ') && game_state === 'Play') {
        img.src = 'larry.png';
        larry_dy = -7.6;
    }
});
document.addEventListener('keyup', (e) => {
    if ((e.key == 'ArrowUp' || e.key == ' ') && game_state === 'Play') {
        img.src = 'larry.png';
    }
});

// ✅ Start or Restart game on Enter
document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        // Remove old pipes
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());

        // Reset Larry
        img.style.display = 'block';
        larry.style.top = '40vh';
        larry_dy = 0;

        // Reset score
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';

        // Reset UI
        message.innerHTML = '';
        message.classList.remove('messageStyle');

        // Restart game state
        larry_props = larry.getBoundingClientRect();
        seabackground = document.querySelector('.seabackground').getBoundingClientRect();
        game_state = 'Play';
        play();
    }
});

function play() {
    function move() {
        if (game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            larry_props = larry.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                // Collision detection
                if (
                    larry_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    larry_props.left + larry_props.width > pipe_sprite_props.left &&
                    larry_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    larry_props.top + larry_props.height > pipe_sprite_props.top
                ) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                } else {
                    // Score increase
                    if (
                        pipe_sprite_props.right < larry_props.left &&
                        pipe_sprite_props.right + move_speed >= larry_props.left &&
                        element.increase_score == '1'
                    ) {
                        score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                        sound_point.play();
                        element.increase_score = '0'; // prevent multiple score count
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity() {
        if (game_state != 'Play') return;

        larry_dy = larry_dy + grativy;

        if (larry_props.top <= 0 || larry_props.bottom >= seabackground.bottom) {
            game_state = 'End';
            message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
            message.classList.add('messageStyle');
            img.style.display = 'none';
            sound_die.play();
            return;
        }

        larry.style.top = larry_props.top + larry_dy + 'px';
        larry_props = larry.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            // Top pipe
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = (pipe_posi - 70) + 'vh';
            pipe_sprite_inv.style.left = '100vw';
            document.body.appendChild(pipe_sprite_inv);

            // Bottom pipe
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = (pipe_posi + pipe_gap) + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
            document.body.appendChild(pipe_sprite);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
