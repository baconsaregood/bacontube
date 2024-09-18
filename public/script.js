window.onload = function() {
    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            const videoList = document.getElementById('video-list');
            videos.forEach(video => {
                const videoElement = document.createElement('video');
                videoElement.controls = true;
                videoElement.src = `/uploads/${video.filename}`;
                videoList.appendChild(videoElement);
            });
        });
};
