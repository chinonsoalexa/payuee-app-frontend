document.addEventListener('DOMContentLoaded', function() {
    var element = document.querySelector('.whatsapp_float');
    var isDragging = false;
    var startX, startY, initialX, initialY;

    element.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;
        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            element.style.left = initialX + dx + 'px';
            element.style.top = initialY + dy + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        element.style.cursor = 'pointer';
    });

    // Prevent default dragging behavior
    element.ondragstart = function() {
        return false;
    };
});