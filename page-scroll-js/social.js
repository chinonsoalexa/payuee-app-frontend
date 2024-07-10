document.addEventListener('DOMContentLoaded', function() {
    var element = document.querySelector('.whatsapp_float');
    var isDragging = false;
    var startX, startY, initialX, initialY;

    function onMouseDown(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;
        element.style.cursor = 'grabbing';
    }

    function onMouseMove(e) {
        if (isDragging) {
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            element.style.left = initialX + dx + 'px';
            element.style.top = initialY + dy + 'px';
        }
    }

    function onMouseUp() {
        isDragging = false;
        element.style.cursor = 'pointer';
    }

    function onTouchStart(e) {
        isDragging = true;
        var touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        initialX = element.offsetLeft;
        initialY = element.offsetTop;
    }

    function onTouchMove(e) {
        if (isDragging) {
            var touch = e.touches[0];
            var dx = touch.clientX - startX;
            var dy = touch.clientY - startY;
            element.style.left = initialX + dx + 'px';
            element.style.top = initialY + dy + 'px';
        }
    }

    function onTouchEnd() {
        isDragging = false;
    }

    element.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    element.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    // Prevent default dragging behavior
    element.ondragstart = function() {
        return false;
    };
});
