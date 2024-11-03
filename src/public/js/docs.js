function toggleSection(parentElement) {
    const children = parentElement.querySelectorAll('.content');
    const changingArrow = parentElement.querySelector('h4 i');

    if (!changingArrow) return; // Guard clause if arrow doesn't exist

    // Close all other sections and reset their arrows
    const allContent = document.querySelectorAll('.content');
    const allArrows = document.querySelectorAll('h4 i');

    for (const content of allContent) {
        if (content && content.parentElement !== parentElement) {
            content.classList.remove('expanded');
        }
    }

    for (const arrow of allArrows) {
        if (arrow && arrow !== changingArrow) {
            arrow.classList.remove('fa-arrow-down');
            arrow.classList.add('fa-arrow-right');
        }
    }

    // Toggle current section
    for (const child of children) {
        if (child) {
            child.classList.toggle('expanded');
        }
    }

    // Toggle current arrow
    changingArrow.classList.toggle('fa-arrow-right');
    changingArrow.classList.toggle('fa-arrow-down');
}