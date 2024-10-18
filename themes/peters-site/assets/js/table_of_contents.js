// An ID activates when the heading is on-screen.
// An ID deactivates when it is off-screen and another heading is on-screen.
var active_on_screen = [];
var active_off_screen = [];
var active_queue = [];
let headingObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        let last_id = active_queue.length > 0 ? active_queue[active_queue.length - 1] : null;
        if (entry.isIntersecting) {
            active_queue.push(entry.target.id);
        } else {
            var index = active_queue.indexOf(entry.target.id);
            if (index !== -1) {
                active_queue.splice(index, 1);
            }
        }
    });

    if (active_queue.length == 0) active_queue.push(last_id);

    // clear all active headings
    document.querySelectorAll('.table-of-contents li').forEach((element) => {
        element.className = '';
    });

    active_queue.forEach((id) => {
        var link = document.querySelector('.table-of-contents a[href="#' + id + '"]');
        var element = link.parentElement;
        if (element) {
            element.className = 'active';
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.99,
});

// Observe only h2 headings
document.querySelectorAll("h2").forEach((element) => {
    headingObserver.observe(element);
});
