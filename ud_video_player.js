document.addEventListener('DOMContentLoaded', function() {
    const playIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/></svg>';
    const pauseIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/></svg>';
    const speedIcons = {
        "0.2": '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M120-277v-60h60v60h-60Zm120 0v-175q0-24 18-42t42-18h110v-111H240v-60h170q24 0 42 18t18 42v111q0 24-18 42t-42 18H300v115h170v60H240Zm299-3 114-206-109-194h65l80 143 79-143h65L725-486l115 206h-64l-87-154-85 154h-65Z"/></svg>',
        "0.5": '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M120-277v-60h60v60h-60Zm419-3 114-206-109-194h65l80 143 79-143h65L725-486l115 206h-64l-87-154-85 154h-65Zm-299 3v-60h170v-115H240v-231h230v60H300v111h110q24 0 42 18t18 42v115q0 24-18 42t-42 18H240Z"/></svg>',
        "0.75": '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M200-277v-60h60v60h-60Zm370 0v-60h170v-115H570v-231h230v60H630v111h110q24 0 42 18t18 42v115q0 24-18 42t-42 18H570Zm-227-1 92-345H265v-60h170q24 0 42 16t18 40q0 3-2 13l-90 336h-60Z"/></svg>',
        "1": '<svg  xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M242-280v-340h-82v-60h142v400h-60Zm195 0 127-213-113-187h70l79 130 75-130h69L636-493l124 213h-69l-91-156-93 156h-70Z"/></svg>',
        "1.25": '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M262-277v-60h60v60h-60Zm408 0v-60h170v-115H670v-231h230v60H730v111h110q24 0 42 18t18 42v115q0 24-18 42t-42 18H670Zm-289 0v-175q0-24 18-42t42-18h110v-111H381v-60h170q24 0 42 18t18 42v111q0 24-18 42t-42 18H441v115h170v60H381Zm-238 0v-346H60v-60h143v406h-60Z"/></svg>',
        "1.5": '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M245-277v-60h60v60h-60Zm-122 0v-346H40v-60h143v406h-60Zm516-3 114-206-109-194h65l80 143 79-143h65L825-486l115 206h-64l-87-154-85 154h-65Zm-272 3v-60h150v-115H367v-231h210v60H427v111h90q24 0 42 18t18 42v115q0 24-18 42t-42 18H367Z"/></svg>',
        "1.75": '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M280-277v-60h60v60h-60Zm370 0v-60h170v-115H650v-231h230v60H710v111h110q24 0 42 18t18 42v115q0 24-18 42t-42 18H650Zm-490 0v-346H80v-60h140v406h-60Zm263-1 92-345H345v-60h170q24 0 42 16t18 40q0 3-2 13l-90 336h-60Z"/></svg>',
        "2": '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M205-277v-175q0-24 18-42t42-18h110v-111H205v-60h170q24 0 42 18t18 42v111q0 24-18 42t-42 18H265v115h170v60H205Zm285-3 114-206-109-194h65l80 143 79-143h65L676-486l115 206h-64l-87-154-85 154h-65Z"/></svg>'
    };
    let currentSpeeds = new WeakMap();

    const videoContainers = document.querySelectorAll('.ud_video_player_container');

    videoContainers.forEach(container => {
        const video = container.querySelector('.ud_video_player');
        const playPauseButton = container.querySelector('.play_pause_b');
        const skipPrevButton = container.querySelector('.skip_prev_b');
        const skipNextButton = container.querySelector('.skip_next_b');
        const timeDisplay = container.querySelector('.video_timee');
        const progressBar = container.querySelector('.video_value');
        const progressBarTime = container.querySelector('.video_value_time');
        const speedSetButton = container.querySelector('.speed_set_b');
        const speedIconSpan = speedSetButton.querySelector('.speed_icon');

        currentSpeeds.set(video, 1.0); // Initialize speed for each video

        video.addEventListener('loadedmetadata', function() {
            const duration = video.duration;
            updateTimeDisplay(video, timeDisplay, duration, 0);

            setInterval(function() {
                const currentTime = video.currentTime;
                updateTimeDisplay(video, timeDisplay, duration, currentTime);
                updateProgressBar(progressBarTime, currentTime, duration);
            }, 500);
        });

        progressBar.addEventListener('click', function(event) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const barWidth = rect.width;
            const clickedPercentage = (clickX / barWidth) * 100;
            setCurrentTimeByPercentage(video, clickedPercentage);
        });

        playPauseButton.addEventListener('click', function() {
            togglePlayPause(video, playPauseButton);
        });

        skipPrevButton.addEventListener('click', function() {
            skipBackward(video, 10);
        });

        skipNextButton.addEventListener('click', function() {
            skipForward(video, 10);
        });

        speedSetButton.addEventListener('click', function() {
            cycleSpeed(video, speedIconSpan, speedIcons, currentSpeeds);
        });

        video.addEventListener('dblclick', function() {
            toggleFullScreen(video);
        });
    });

    function updateTimeDisplay(video, displayElement, duration, currentTime) {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        };
        displayElement.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }

    function updateProgressBar(progressBarTime, currentTime, duration) {
        if (isNaN(duration) || duration === 0) {
            progressBarTime.style.width = '0%';
            return;
        }
        const percentage = (currentTime / duration) * 100;
        progressBarTime.style.width = `${percentage}%`;
        progressBarTime.style.transition = "width 0.05s linear";
    }

    function setCurrentTimeByPercentage(video, percentage) {
        const duration = video.duration;
        if (isNaN(duration) || duration === 0) {
            console.error("Video duration not yet loaded.");
            return;
        }
        const newCurrentTime = duration * (percentage / 100);
        video.currentTime = newCurrentTime;
    }

    function togglePlayPause(video, button) {
        if (video.paused) {
            video.play();
            button.innerHTML = pauseIconSVG;
        } else {
            video.pause();
            button.innerHTML = playIconSVG;
        }
    }

    function skipBackward(video, seconds) {
        video.currentTime -= seconds;
    }

    function skipForward(video, seconds) {
        video.currentTime += seconds;
    }

    function toggleFullScreen(videoElement) {
        const container = videoElement.closest('.ud_video_player_container');
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) { /* Firefox */
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) { /* IE/Edge */
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    }

    function cycleSpeed(video, iconElement, speedIcons, currentSpeeds) {
        let currentSpeed = currentSpeeds.get(video) || 1.0;
        const speeds = [0.2, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
        const currentIndex = speeds.indexOf(currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const nextSpeed = speeds[nextIndex];

        video.playbackRate = nextSpeed;
        iconElement.innerHTML = speedIcons[nextSpeed.toString()];
        currentSpeeds.set(video, nextSpeed);
    }
});